import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const HA_REGEX = /^Hot Aisle - /;

async function cleanFiles(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			await cleanFiles(fullPath);
		} else if (entry.name.endsWith('.md')) {
			const content = await fs.readFile(fullPath, 'utf8');
			const parsed = matter(content);

			let body = parsed.content;

			// 1. Remove the [](#...) link artifacts commonly found in headers and start of lines
			// Pattern: `[](#hex "Title")`
			// We replace it with nothing.
			body = body.replace(/\[]\(#[a-f0-9]+\s+"[^"]+"\)/g, '');

			// 2. Also remove any lingering ** around titles if they were left by the artifact removal
			// (sometimes it was `[](#...)**Title**`)
			// actually, we might leave bolding in body, but definitely remove it from frontmatter title.

			// 3. Clean Frontmatter Title
			let title = parsed.data.title || '';
			// Remove the artifact from title
			title = title.replace(/\[]\(#[a-f0-9]+\s+"[^"]+"\)/g, '');
			// Remove Markdown bolding/formatting from Title
			title = title.replace(/\*\*/g, '').replace(/__/g, '');
			title = title.trim();

			// 4. Clean Description same way
			let description = parsed.data.description || '';
			description = description.replace(/\[]\(#[a-f0-9]+\s+"[^"]+"\)/g, '');
			description = description.replace(/\*\*/g, '').replace(/__/g, '');
			description = description.replace(HA_REGEX, ''); // Clean prefix if redundant

			// 5. Additional Body Cleanup
			// Remove the "Visual divider" lines that look like `-----` or `* * *`
			body = body.replace(/^\s*[-*_]{3,}\s*$/gm, '');

			// Remove "notion image" alt text if generic
			body = body.replace(/!\[notion image]/g, '![]');

			// Update
			parsed.data.title = title;
			parsed.data.description = description;
			parsed.content = body;

			const newContent = matter.stringify(body, parsed.data);
			await fs.writeFile(fullPath, newContent);
			console.log(`Cleaned ${entry.name}`);
		}
	}
}

async function run() {
	await cleanFiles(CONTENT_DIR);
	console.log('Cleanup complete.');
}

run().catch(console.error);
