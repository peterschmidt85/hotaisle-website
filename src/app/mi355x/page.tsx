import type { Metadata } from 'next';
import MI355XContent from './MI355XContent';

export const metadata: Metadata = {
	title: 'Reserve AMD Instinct MI355X | Hot Aisle',
	description:
		'Secure your access to the next generation of AMD Instinct accelerators. Built on 4th Gen AMD CDNA architecture.',
};

export default function MI355XPage() {
	return <MI355XContent />;
}
