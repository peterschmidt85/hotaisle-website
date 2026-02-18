import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const BLOG_ROOT = path.join(process.cwd(), 'content', 'blog');
const CACHE_CONTROL_HEADER = 'public, max-age=31536000, immutable';

const MIME_TYPES: Record<string, string> = {
	'.jpeg': 'image/jpeg',
	'.jpg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
};

function safeDecodePathSegment(segment: string): string {
	try {
		return decodeURIComponent(segment);
	} catch {
		return segment;
	}
}

function getMimeType(filePath: string): string {
	const extension = path.extname(filePath).toLowerCase();
	return MIME_TYPES[extension] ?? 'application/octet-stream';
}

export async function GET(
	_request: Request,
	context: { params: Promise<{ assetPath: string[] }> }
): Promise<NextResponse> {
	const { assetPath } = await context.params;
	const decodedPath = assetPath.map((segment) => safeDecodePathSegment(segment));
	const fullPath = path.resolve(BLOG_ROOT, ...decodedPath);

	if (!fullPath.startsWith(BLOG_ROOT)) {
		return new NextResponse('Not found', { status: 404 });
	}

	try {
		const stats = await fs.stat(fullPath);
		if (!stats.isFile()) {
			return new NextResponse('Not found', { status: 404 });
		}

		const fileBuffer = await fs.readFile(fullPath);
		return new NextResponse(fileBuffer, {
			status: 200,
			headers: {
				'Cache-Control': CACHE_CONTROL_HEADER,
				'Content-Type': getMimeType(fullPath),
			},
		});
	} catch {
		return new NextResponse('Not found', { status: 404 });
	}
}
