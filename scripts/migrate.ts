import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const PROJECT_ROOT = process.cwd();
const SCRAPE_ROOT = path.resolve(PROJECT_ROOT, '../hotaisle-scrape/hotaisle_export');
const CONTENT_ROOT = path.join(PROJECT_ROOT, 'content');
const PUBLIC_ASSETS_ROOT = path.join(PROJECT_ROOT, 'public/assets');

// Mapping URL segments to content folders
function getTargetFolder(url: string) {
	const u = new URL(url);
	const p = u.pathname;

	if (p.startsWith('/blog/')) {
		return 'blog';
	}
	if (
		p.includes('policy') ||
		p.includes('terms') ||
		p.includes('security') ||
		p.includes('compliance') ||
		p.includes('model')
	) {
		return 'policies';
	}
	return 'pages';
}

const HA_REGEX = /^!\[Hot Aisle]\(.*\)\n*/;
const SOURCE_REGEX = /^<!-- Source: .* -->\s*/;
const CLEANED1_REGEX = /^#+\s*(.*)$/m;
const CLEANED2_REGEX = /^(.*)\n[=-]+$/m;
const INDEX_REGEX = /_index$/;
const UNDER_REGEX = /_/;

function cleanMarkdown(md: string) {
	const lines = md.split('\n');

	// Remove Source comment
	if (lines[0]?.startsWith('<!-- Source:')) {
		lines.shift();
	}

	let content = lines.join('\n');

	// Remove duplicate Main Title if it appears as H1 at the very start
	// content = content.replace(/^#\s+.*\n/, "");

	// 1. Remove the specific weird anchor/image artifacts: [](#ID "Text")Text
	// Pattern: [](#hex "Text")Text -> Text
	// Or just remove the [](#...) part and keep the text if it follows?
	// In the file: `[](#... "Title")Title` -> We want `Title`.
	// Regex: \[\]\(#[a-z0-9]+ "[^"]+"\)(.*)
	content = content.replace(/\[]\(#[a-z0-9]+ "[^"]+"\)(.*)/g, '## $1');

	// 2. Remove the first logo image if it appears at the top (The "Hot Aisle" logo)
	// Pattern: ![Hot Aisle](...logo...)
	// We'll strip the very first image if it occurs in the first 500 chars
	// OR just specifically strip the Hot Aisle logo by alt text
	content = content.replace(HA_REGEX, '');

	// 3. Remove the navigation block artifacts
	// Look for the "Pages List" or "Sidebar" clutter.
	// The user says "weird lettering and numbers on nearly every page".
	// The `[](#...)` pattern is the main culprit.

	// 4. Clean up excessive horizontal rules
	content = content.replace(/^-{3,}$/gm, ''); // Remove ---- lines
	content = content.replace(/^\*\*\*+$/gm, ''); // Remove *** lines

	// 5. Remove empty headers like "### "
	content = content.replace(/^#{1,6}\s*$/gm, '');

	// 6. Fix "Text instead of logo" - we are fixing this in Sidebar, but stripping it from content helps.

	// 7. General cleanup of multiple newlines
	content = content.replace(/\n{3,}/g, '\n\n');

	return content;
}

async function migrate() {
	console.log('Starting migration...');

	const manifestPath = path.join(SCRAPE_ROOT, 'manifest.json');
	const manifestFileData = await fs.readFile(manifestPath, 'utf8');
	const manifest = JSON.parse(manifestFileData);

	await fs.mkdir(PUBLIC_ASSETS_ROOT, { recursive: true });

	for (const entry of manifest) {
		const { url, pageKey, markdown, images } = entry;

		// Determine category
		const category = getTargetFolder(url);
		const targetDir = path.join(CONTENT_ROOT, category);
		await fs.mkdir(targetDir, { recursive: true });

		// Read Markdown
		const mdPath = path.join(SCRAPE_ROOT, markdown);
		let rawMd = '';
		try {
			rawMd = await fs.readFile(mdPath, 'utf8');
		} catch (e: unknown) {
			console.error({ error: `Missing markdown for ${url}`, e });
			continue;
		}

		// Extract title (first line usually, or first header)
		let title = pageKey.replace(/_/g, ' ');

		// Simple cleaning: Remove source line
		let cleanedMd = cleanMarkdown(rawMd.replace(SOURCE_REGEX, ''));

		// Remove the known nav block.
		// It seems to start with "Welcome\n=======" or similar, and ends with the policy links.
		// A robust way might be to look for the "≡" (hamburger icon?) or just finding the *second* H1 if the first is "Welcome"?
		// In index.md, it starts "Welcome\n=======".
		// In about.md, it starts "About Us\n=======".
		// Then there is a "Pages List" block.
		// Then a "≡" (hamburger)
		// Then the real content starts?

		// Let's look for the "≡" line (line 96 in index.md view).
		// If we find "≡", we strip everything before it?

		if (cleanedMd.includes('\n≡\n')) {
			const parts = cleanedMd.split('\n≡\n');
			if (parts.length > 1) {
				cleanedMd = parts.slice(1).join('\n≡\n'); // Take everything after the first ≡
			}
		} else {
			// Fallback: looking for "Shared Responsibility Model" link end
			const endMarker = '](/shared-responsibility-model/)';
			const idx = cleanedMd.indexOf(endMarker);
			if (idx !== -1) {
				cleanedMd = cleanedMd.substring(idx + endMarker.length).trim();
			}
		}

		// Try to extract a title from the remaining content (first H1 or H2)
		const titleMatch = cleanedMd.match(CLEANED1_REGEX) || cleanedMd.match(CLEANED2_REGEX);
		if (titleMatch) {
			title = titleMatch[1];
			// Optional: remove the title from body if we want it controlled by the template?
			// Usually keep it in body is fine for now.
		}

		// Rewrite Image Paths & Copy Images
		// Images in manifest are: `assets/pageKey/filename`
		// We copy `SCRAPE_ROOT/assets/pageKey/filename` to `PUBLIC_ASSETS_ROOT/pageKey/filename`
		// And replace path in MD to `/assets/pageKey/filename`

		for (const img of images) {
			const srcPathRelative = img.local; // assets/pageKey/foo.png
			const srcPathFull = path.join(SCRAPE_ROOT, srcPathRelative);
			const destPathFull = path.join(
				PUBLIC_ASSETS_ROOT,
				path.relative('assets', srcPathRelative)
			); // public/assets/pageKey/foo.png

			await fs.mkdir(path.dirname(destPathFull), { recursive: true });

			try {
				await fs.copyFile(srcPathFull, destPathFull);
			} catch (e: unknown) {
				console.warn({ error: `Failed to copy image ${srcPathRelative}`, e });
			}

			// Rewrite in markdown
			// The markdown currently links to the *original* URL or specialized links?
			// Wait, turndown might have kept original URLs or local?
			// Let's check scrape.mjs. It downloads images but only *manifest* knows the mapping?
			// No, `turndown` processes HTML. The scraper downloaded images but did it *rewrite* the HTML before turndown?
			// In `scrape.mjs`: `// Convert content HTML -> Markdown`
			// It does NOT seem to replace image sources in the HTML before turndown!
			// So the markdown likely contains remote URLs (e.g. firebase/imagedelivery.net).

			// We need to replace `img.original` with `/assets/...` in the markdown.
			// Be careful with simple string replace, but should be okay.

			const localWebPath = `/assets/${path.relative('assets', srcPathRelative).replace(/\\/g, '/')}`;
			// Escape for regex?
			cleanedMd = cleanedMd.split(img.original).join(localWebPath);
		}

		// Create Frontmatter
		const slug = pageKey.replace(INDEX_REGEX, '').replace(UNDER_REGEX, '-'); // e.g. quick-start_index -> quick-start
		// handle index page
		const filename = slug === 'index' ? 'index.md' : `${slug}.md`;

		const fileContent = matter.stringify(cleanedMd, {
			title: title || 'Hot Aisle',
			description: `Hot Aisle - ${title}`,
			date: new Date().toISOString().split('T')[0], // Default date
		});

		await fs.writeFile(path.join(targetDir, filename), fileContent);
		console.log(`Migrated: ${category}/${filename}`);
	}

	console.log('Migration complete!');
}

migrate().catch(console.error);
