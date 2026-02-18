const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

const postsDir = path.join(process.cwd(), 'content', 'blog');
const files = fs.readdirSync(postsDir);

const posts = files
	.filter((f) => f.endsWith('.md'))
	.map((file) => {
		const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
		const { data } = matter(content);
		return { file, date: data.date };
	});

console.log(JSON.stringify(posts, null, 2));
