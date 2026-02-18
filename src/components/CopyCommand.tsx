'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export default function CopyCommand({ command }: { command: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-neutral-800 bg-black p-6 font-mono text-neutral-300 text-sm md:flex-row md:text-base">
			<code>{command}</code>
			<button
				className="flex items-center gap-2 rounded bg-neutral-800 px-4 py-2 font-bold text-white text-xs uppercase tracking-wider transition-colors hover:bg-neutral-700"
				onClick={handleCopy}
				type="button"
			>
				{copied ? <Check className="text-green-400" size={14} /> : <Copy size={14} />}
				{copied ? 'Copied' : 'Copy Command'}
			</button>
		</div>
	);
}
