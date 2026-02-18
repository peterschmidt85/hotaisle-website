export default function JsonLd() {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Hot Aisle',
		url: 'https://hotaisle.xyz',
		logo: 'https://hotaisle.xyz/logo.png', // Ensure absolute path for validity
		description:
			'AMD Exclusive AI Cloud. Get direct access to AMD MI300x GPUs and spin up high-performance 192GB HBM3 instances in seconds.',
		sameAs: ['https://twitter.com/hotaisle', 'https://github.com/hotaisle'],
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'customer support',
			email: 'hello@hotaisle.ai',
		},
	};

	return (
		<script
			// biome-ignore lint/security/noDangerouslySetInnerHtml: we all live dangerously
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
			type="application/ld+json"
		/>
	);
}
