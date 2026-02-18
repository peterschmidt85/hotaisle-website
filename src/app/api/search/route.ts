import { NextResponse } from 'next/server';
import { getAllSlugs, getPageContent } from '@/lib/content';

export interface SearchResult {
	category: 'Page' | 'Blog' | 'Policy';
	description: string;
	title: string;
	type: string;
	url: string;
}

export async function GET() {
	const results: SearchResult[] = [];

	// 1. Static Pages
	const staticPages = [
		{
			title: 'Home',
			description: 'AMD Exclusive AI Cloud. Direct access to AMD MI300x GPUs.',
			url: '/',
			type: 'Page',
		},
		{
			title: 'Supercomputer (Compute)',
			description: 'Dell PowerEdge XE9680 with 8x AMD MI300x GPUs.',
			url: '/compute',
			type: 'Product',
		},
		{
			title: 'Datacenter',
			description: 'Tier 5 Platinum Secure Facilities in Grand Rapids, MI.',
			url: '/datacenter',
			type: 'Infrastructure',
		},
		{
			title: 'Networking',
			description: '400Gbps InfiniBand Fabric & Custom Topology.',
			url: '/networking',
			type: 'Infrastructure',
		},
		{
			title: 'Pricing',
			description: 'Transparent GPU pricing starting at $1.99/hr.',
			url: '/pricing',
			type: 'Page',
		},
		{
			title: 'Cluster Design',
			description: 'Custom high-performance compute clusters.',
			url: '/cluster',
			type: 'Service',
		},
		{
			title: 'Partners',
			description: 'Our ecosystem of technology partners.',
			url: '/partners',
			type: 'Page',
		},
		{
			title: 'Quick Start Guide',
			description: 'Get up and running with Hot Aisle in 60 seconds.',
			url: '/quick-start',
			type: 'Guide',
		},
		{
			title: 'Benchmarks',
			description: 'Performance analysis of AMD MI300x.',
			url: '/benchmarks-and-analysis',
			type: 'Research',
		},
		{
			title: 'MI300x Details',
			description: 'Technical specifications of the AMD MI300x Accelerator.',
			url: '/mi300x',
			type: 'Hardware',
		},
		{
			title: 'About Us',
			description: 'Our mission and company background.',
			url: '/about',
			type: 'Page',
		},
		{
			title: 'Contact',
			description: 'Get in touch with our team.',
			url: '/contact',
			type: 'Page',
		},
	];

	for (const page of staticPages) {
		results.push({
			title: page.title,
			description: page.description,
			url: page.url,
			category: 'Page',
			type: page.type,
		});
	}

	// 2. Blog Posts
	const blogSlugs = getAllSlugs('blog');
	for (const slug of blogSlugs) {
		const post = await getPageContent('blog', slug);
		if (post) {
			results.push({
				title: post.title,
				description: post.description || 'Read our latest blog post.',
				url: `/blog/${slug}`,
				category: 'Blog',
				type: 'Article',
			});
		}
	}

	// 3. Policies
	const policySlugs = getAllSlugs('policies');
	for (const slug of policySlugs) {
		const policy = await getPageContent('policies', slug);
		if (policy) {
			results.push({
				title: policy.title,
				description: policy.description || 'Legal document.',
				url: `/policies/${slug}`,
				category: 'Policy',
				type: 'Legal',
			});
		}
	}

	return NextResponse.json(results);
}
