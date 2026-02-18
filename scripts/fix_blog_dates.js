const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

const postsDir = path.join(process.cwd(), 'content', 'blog');
const files = fs.readdirSync(postsDir);

const months = {
	Jan: '01',
	Feb: '02',
	Mar: '03',
	Apr: '04',
	May: '05',
	Jun: '06',
	Jul: '07',
	Aug: '08',
	Sep: '09',
	Oct: '10',
	Nov: '11',
	Dec: '12',
	January: '01',
	February: '02',
	March: '03',
	April: '04',
	June: '06',
	July: '07',
	August: '08',
	September: '09',
	October: '10',
	November: '11',
	December: '12',
};

for (const file of files) {
	if (!file.endsWith('.md')) {
		continue;
	}

	const filePath = path.join(postsDir, file);
	const fileContent = fs.readFileSync(filePath, 'utf8');
	const { data, content } = matter(fileContent);

	// Regex to find dates like "Nov 21, 2024" or "February 19, 2025" in key lines
	const dateMatch = content.match(/([A-Z][a-z]+)\s+(\d{1,2}),\s+(\d{4})/);

	let stats = 'No date found in body';

	if (dateMatch) {
		const [_, monthStr, day, year] = dateMatch;
		const month = months[monthStr.substring(0, 3)];

		if (month) {
			// Format YYYY-MM-DD
			const newDate = `${year}-${month}-${day.padStart(2, '0')}`;

			if (data.date !== newDate) {
				data.date = newDate;
				const newFileContent = matter.stringify(content, data);
				fs.writeFileSync(filePath, newFileContent);
				stats = `Updated date to ${newDate}`;
			} else {
				stats = `Date already ${newDate}`;
			}
		}
	}

	console.log(`${file}: ${stats}`);
}
