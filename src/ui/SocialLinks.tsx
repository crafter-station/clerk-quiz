import Link from "next/link";
import {
	CODECHEF_PATH,
	GITHUB_PATH,
	GLOBE_PATH,
	INSTAGRAM_PATH,
	LINKEDIN_PATH,
	STACKOVERFLOW_PATH,
	X_PATH,
	YOUTUBE_PATH,
} from "./icon-paths";
import { SocialIcon } from "./SocialIcon";

/**
 * The author's corner: jibaru.dev, its socials (mirroring the icon row on the
 * site itself), and the product the quiz is about. Same dimmed-mark treatment
 * as the logo above — quiet until pointed at.
 */
const SOCIALS: { label: string; href: string; d: string }[] = [
	{ label: "Website", href: "https://jibaru.dev", d: GLOBE_PATH },
	{ label: "GitHub", href: "https://github.com/jibaru", d: GITHUB_PATH },
	{ label: "X", href: "https://x.com/IgnacioRuedaB", d: X_PATH },
	{ label: "LinkedIn", href: "https://linkedin.com/in/ignacior97", d: LINKEDIN_PATH },
	{ label: "YouTube", href: "https://youtube.com/@ignacio-rueda", d: YOUTUBE_PATH },
	{ label: "Instagram", href: "https://instagram.com/jibaru.dev", d: INSTAGRAM_PATH },
	{
		label: "Stack Overflow",
		href: "https://stackoverflow.com/users/14657675/ignacior",
		d: STACKOVERFLOW_PATH,
	},
	{ label: "CodeChef", href: "https://www.codechef.com/users/jibaru97", d: CODECHEF_PATH },
];

export function SocialLinks({ className = "" }: { className?: string }) {
	return (
		<div className={`flex flex-col items-center gap-3 ${className}`}>
			<Link
				href="https://jibaru.dev"
				target="_blank"
				rel="noreferrer"
				className="section-label text-[color:var(--text-dim)] transition-colors hover:text-[color:var(--bright)]"
			>
				Made by Jibaru.dev
			</Link>

			<div className="flex flex-wrap items-center justify-center gap-4">
				{SOCIALS.map((social) => (
					<SocialIcon key={social.label} label={social.label} href={social.href} d={social.d} />
				))}

				<a
					href="https://clerk.com"
					target="_blank"
					rel="noreferrer"
					title="clerk.com"
					className="opacity-60 transition-opacity hover:opacity-100"
				>
					<span className="sr-only">Clerk</span>
					{/* biome-ignore lint/performance/noImgElement: local static SVG; next/image adds nothing. */}
					<img src="/sponsors/clerk.svg" alt="" className="h-4 w-auto" />
				</a>
			</div>
		</div>
	);
}
