import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'content', 'blog');
const files = fs.readdirSync(postsDir);

const validTags = ['Announcements', 'Features', 'GPU', 'Interviews', 'Speaking', 'Thoughts'];

for (const file of files) {
	if (!file.endsWith('.md')) {
		continue;
	}

	const filePath = path.join(postsDir, file);
	const fileContent = fs.readFileSync(filePath, 'utf8');
	const { data, content } = matter(fileContent);

	// Look for [Tag](/blog/tags/tag/) pattern
	// The previous file showed: [Interviews](/blog/tags/interviews/)
	const tagMatch = content.match(/\[([A-Za-z0-9\s]+)]\(\/blog\/tags\/[a-z0-9-]+\/?\)/);

	let stats = 'Skipped';
	let newTags: string[] = [];

	if (tagMatch) {
		const foundTag = tagMatch[1];
		// Map found tag to valid tags if possible (case insensitive)
		const matchedTag = validTags.find((t) => t.toLowerCase() === foundTag.toLowerCase());

		if (matchedTag) {
			newTags = [matchedTag];
		} else {
			// If it's a tag we didn't expect, maybe map it or just use it capitalize
			newTags = [foundTag.charAt(0).toUpperCase() + foundTag.slice(1)];
		}
	} else {
		// Fallback logic based on title keywords if no tag found
		const title = (data.title || '').toLowerCase();
		if (title.includes('announc') || title.includes('launch')) {
			newTags = ['Announcements'];
		} else if (title.includes('gpu') || title.includes('amd') || title.includes('mi300')) {
			newTags = ['GPU'];
		} else if (
			title.includes('interview') ||
			title.includes('podcast') ||
			title.includes('speaking')
		) {
			newTags = ['Interviews'];
		} else if (title.includes('feature')) {
			newTags = ['Features'];
		} else {
			newTags = ['Thoughts']; // Default
		}
	}

	// Update frontmatter
	if (newTags.length > 0) {
		data.tags = newTags;
		const newFileContent = matter.stringify(content, data);
		fs.writeFileSync(filePath, newFileContent);
		stats = `Updated with tags: ${newTags.join(', ')}`;
	}

	console.log(`${file}: ${stats}`);
}
