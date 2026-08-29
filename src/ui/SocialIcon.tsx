/** One monochrome social icon link, dimmed until pointed at. */
export function SocialIcon({
	label,
	href,
	d,
	size = 18,
}: {
	label: string;
	href: string;
	d: string;
	size?: number;
}) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			title={label}
			className="text-[color:var(--text-dim)] transition-colors hover:text-[color:var(--bright)]"
		>
			<span className="sr-only">{label}</span>
			<svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
				<path d={d} />
			</svg>
		</a>
	);
}
