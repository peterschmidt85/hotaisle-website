import type { Metadata } from 'next';
import { BlogIndex } from '@/components/blog/BlogIndex';
import { getAllBlogPosts } from '@/lib/content';

export const metadata: Metadata = {
	title: 'Blog | Hot Aisle',
	description: 'Insights, announcements, and thoughts from the Hot Aisle team.',
};

export default async function BlogPage() {
	const posts = await getAllBlogPosts();

	return (
		<div className="container mx-auto min-h-screen px-6 py-8 md:py-12">
			<div className="mb-12">
				<h1 className="mb-4 font-extrabold text-4xl tracking-tight md:text-5xl">Blog</h1>
				<p className="text-muted-foreground text-xl">
					Latest news and updates from Hot Aisle
				</p>
			</div>

			<BlogIndex posts={posts} />
		</div>
	);
}
