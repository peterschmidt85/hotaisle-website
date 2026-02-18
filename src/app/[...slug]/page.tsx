import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllSlugs, getPageContent } from '@/lib/content';

interface Props {
	params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
	const slugs = getAllSlugs('pages');
	// Filter out index as it is handled by app/page.tsx
	return slugs.filter((slug) => slug !== 'index').map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params;
	const slug = params.slug.join('/');
	const page = await getPageContent('pages', slug);

	if (!page) {
		return { title: 'Not Found' };
	}

	return {
		title: page.title,
		description: page.description,
	};
}

export default async function Page(props: Props) {
	const params = await props.params;
	const slug = params.slug.join('/');

	// Try finding in pages first
	const page = await getPageContent('pages', slug);

	if (!page) {
		return notFound();
	}

	return (
		<div className="animation-fade-in flex min-h-screen w-full flex-col">
			{/* Page Header */}
			<div className="relative w-full overflow-hidden border-border border-b bg-background px-6 py-20">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950 opacity-50" />
				<div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-arctic-blue/5 blur-3xl" />

				<div className="container relative z-10 mx-auto max-w-4xl">
					<h1 className="mb-6 font-black text-4xl text-foreground tracking-tighter md:text-6xl">
						{page.title}
					</h1>
					{page.description && (
						<p className="max-w-2xl font-light text-muted-foreground text-xl md:text-2xl">
							{page.description.replace('Hot Aisle - ', '')}
						</p>
					)}
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto max-w-4xl px-6 py-16">
				<article className="prose prose-neutral dark:prose-invert lg:prose-lg max-w-none">
					{/** biome-ignore lint/security/noDangerouslySetInnerHtml: safety third */}
					<div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
				</article>
			</div>

			{/* Common CTA */}
			<div className="mt-auto bg-neutral-100 px-6 py-16 text-center dark:bg-neutral-900">
				<div className="container mx-auto max-w-2xl">
					<h2 className="mb-4 font-bold text-3xl">Ready to Accelerate?</h2>
					<p className="mb-8 text-muted-foreground">
						Get instant access to AMD MI300x GPUs today. No contracts, just raw power.
					</p>
					<a
						className="inline-flex rounded-full bg-arctic-blue px-8 py-3 font-bold text-neutral-900 shadow-arctic-blue/20 shadow-lg transition-all hover:scale-105 hover:bg-arctic-blue/90"
						href="/quick-start"
					>
						Get Started Now
					</a>

					<div className="mt-12 border-neutral-200 border-t pt-8 text-muted-foreground text-sm dark:border-neutral-800">
						<p>
							Copyright © {new Date().getFullYear()} Hot Aisle Inc. All rights
							reserved.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
