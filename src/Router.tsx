import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '@/app/page';
import { Sidebar } from '@/components/layout/Sidebar';
import { HeadMetadata } from '@/components/seo/HeadMetadata';
import JsonLd from '@/components/seo/JsonLd';
import { ThemeProvider } from '@/components/theme-provider';

const About = lazy(() => import('@/app/about/page'));
const Benchmarks = lazy(() => import('@/app/benchmarks-and-analysis/page'));
const BlogPost = lazy(() => import('@/app/blog/[slug]/page'));
const Blog = lazy(() => import('@/app/blog/page'));
const Cluster = lazy(() => import('@/app/cluster/page'));
const Compute = lazy(() => import('@/app/compute/page'));
const Contact = lazy(() => import('@/app/contact/page'));
const Datacenter = lazy(() => import('@/app/datacenter/page'));
const MI300X = lazy(() => import('@/app/mi300x/page'));
const MI355X = lazy(() => import('@/app/mi355x/page'));
const Networking = lazy(() => import('@/app/networking/page'));
const NotFound = lazy(() => import('@/app/not-found'));
const Partners = lazy(() => import('@/app/partners/page'));
const PolicyDetail = lazy(() => import('@/app/policies/[slug]/page'));
const Policies = lazy(() => import('@/app/policies/page'));
const Pricing = lazy(() => import('@/app/pricing/page'));
const QuickStart = lazy(() => import('@/app/quick-start/page'));

export function Router() {
	return (
		<BrowserRouter>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				disableTransitionOnChange
				enableSystem
			>
				<div className="flex h-screen overflow-hidden bg-background text-foreground antialiased">
					<Sidebar />
					<main className="relative w-full flex-1 overflow-y-auto pl-16 md:pl-0">
						<HeadMetadata />
						<JsonLd />
						<Suspense fallback={<div />}>
							<Routes>
								<Route element={<Home />} path="/" />
								<Route element={<About />} path="/about" />
								<Route element={<Benchmarks />} path="/benchmarks-and-analysis" />
								<Route element={<Blog />} path="/blog" />
								<Route element={<BlogPost />} path="/blog/:slug" />
								<Route element={<Cluster />} path="/cluster" />
								<Route element={<Compute />} path="/compute" />
								<Route element={<Contact />} path="/contact" />
								<Route element={<Datacenter />} path="/datacenter" />
								<Route element={<MI300X />} path="/mi300x" />
								<Route element={<MI355X />} path="/mi355x" />
								<Route element={<Networking />} path="/networking" />
								<Route element={<Partners />} path="/partners" />
								<Route element={<Policies />} path="/policies" />
								<Route element={<PolicyDetail />} path="/policies/:slug" />
								<Route element={<Pricing />} path="/pricing" />
								<Route element={<QuickStart />} path="/quick-start" />
								<Route element={<NotFound />} path="*" />
							</Routes>
						</Suspense>
					</main>
				</div>
			</ThemeProvider>
		</BrowserRouter>
	);
}
