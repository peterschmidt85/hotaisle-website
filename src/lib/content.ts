import { BLOG_POSTS } from '@/generated/blog-data';
import { POLICIES } from '@/generated/static-content-data';

export interface PageData {
	author?: string;
	contentHtml: string;
	coverImage?: string;
	date?: string;
	description?: string;
	metaDescription?: string;
	metaKeywords?: string;
	metaTitle?: string;
	slug: string;
	tags?: string[];
	title: string;
}

export type BlogPost = PageData & {
	date: string;
	tags?: string[];
	coverImage?: string;
};

const BLOG_POSTS_BY_SLUG = new Map(BLOG_POSTS.map((post) => [post.slug, post]));
const POLICIES_BY_SLUG = new Map(POLICIES.map((policy) => [policy.slug, policy]));

export function getPageContent(
	category: 'policies' | 'blog',
	slug: string
): Promise<PageData | null> {
	if (category === 'blog') {
		return Promise.resolve(BLOG_POSTS_BY_SLUG.get(slug) ?? null);
	}

	return Promise.resolve(POLICIES_BY_SLUG.get(slug) ?? null);
}

export function getAllSlugs(category: 'policies' | 'blog'): string[] {
	if (category === 'blog') {
		return BLOG_POSTS.map((post) => post.slug);
	}

	return POLICIES.map((policy) => policy.slug);
}

export function getAllBlogPosts(): Promise<BlogPost[]> {
	const sortedPosts = [...BLOG_POSTS].sort(
		(left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()
	);
	return Promise.resolve(sortedPosts);
}
