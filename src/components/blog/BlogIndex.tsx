'use client';

import { useMemo, useState } from 'react';
import { BlogList } from '@/components/blog/BlogList';
import type { BlogPost } from '@/lib/content';
import { cn } from '@/lib/utils';

const ALL_CATEGORY = 'All';

interface BlogIndexProps {
	posts: BlogPost[];
}

function getCategories(posts: BlogPost[]): string[] {
	const tagSet = new Set<string>();
	for (const post of posts) {
		for (const tag of post.tags ?? []) {
			tagSet.add(tag);
		}
	}

	const sortedTags = Array.from(tagSet).sort((left, right) => left.localeCompare(right));
	return [ALL_CATEGORY, ...sortedTags];
}

export function BlogIndex({ posts }: BlogIndexProps) {
	const sortedPosts = useMemo(() => {
		return [...posts].sort((left, right) => {
			const rightTime = new Date(right.date).getTime();
			const leftTime = new Date(left.date).getTime();
			if (rightTime === leftTime) {
				return left.slug.localeCompare(right.slug);
			}
			return rightTime - leftTime;
		});
	}, [posts]);

	const categories = useMemo(() => getCategories(sortedPosts), [sortedPosts]);
	const [category, setCategory] = useState(ALL_CATEGORY);

	const filteredPosts = useMemo(() => {
		if (category === ALL_CATEGORY) {
			return sortedPosts;
		}
		return sortedPosts.filter((post) => post.tags?.some((tag) => tag === category));
	}, [category, sortedPosts]);

	return (
		<div className="space-y-12">
			<div className="flex flex-wrap justify-center gap-2 md:justify-start">
				{categories.map((currentCategory) => (
					<button
						className={cn(
							'rounded-full border px-4 py-2 font-bold text-sm transition-all',
							category === currentCategory
								? 'border-foreground bg-foreground text-background'
								: 'border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground'
						)}
						key={currentCategory}
						onClick={() => setCategory(currentCategory)}
						type="button"
					>
						{currentCategory}
					</button>
				))}
			</div>

			{filteredPosts.length === 0 && (
				<div className="rounded-xl border border-border border-dashed py-20 text-center text-muted-foreground">
					No articles found for "{category}".
				</div>
			)}

			{filteredPosts.length > 0 && (
				<div>
					<BlogList posts={filteredPosts} />
				</div>
			)}
		</div>
	);
}
