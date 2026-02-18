import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import JsonLd from '@/components/seo/JsonLd';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	metadataBase: new URL('https://hotaisle.xyz'),
	title: {
		default: 'Hot Aisle | AMD Exclusive AI Cloud',
		template: '%s | Hot Aisle',
	},
	description:
		'AMD Exclusive AI Cloud. Get direct access to AMD MI300x GPUs and spin up high-performance HBM3 instances in seconds.',
	keywords: [
		'AMD MI300x',
		'AI Cloud',
		'GPU Cloud',
		'HBM3',
		'Deep Learning',
		'LLM Training',
		'Dell XE9680',
		'Hot Aisle',
		'Supercomputing',
	],
	authors: [{ name: 'Hot Aisle Team' }],
	creator: 'Hot Aisle Inc.',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://hotaisle.xyz',
		title: 'Hot Aisle | AMD Exclusive AI Cloud',
		description:
			'AMD Exclusive AI Cloud. Get direct access to AMD MI300x GPUs and spin up high-performance HBM3 instances in seconds.',
		siteName: 'Hot Aisle',
		images: [
			{
				url: '/og-image.png', // Ensure this exists or fallback to logo
				width: 1200,
				height: 630,
				alt: 'Hot Aisle AI Cloud',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Hot Aisle | AMD Exclusive AI Cloud',
		description:
			'AMD Exclusive AI Cloud. Get direct access to AMD MI300x GPUs and spin up high-performance HBM3 instances in seconds.',
		creator: '@hotaisle',
		images: ['/og-image.png'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	alternates: {
		canonical: './',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} flex h-screen overflow-hidden bg-background text-foreground antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					disableTransitionOnChange
					enableSystem
				>
					<Sidebar />
					<main className="relative w-full flex-1 overflow-y-auto pl-16 md:pl-0">
						<JsonLd />
						{children}
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
