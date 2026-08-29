"use client";

import { useStrings } from "@/i18n/strings";
import { GLOBE_PATH, INSTAGRAM_PATH, LINKEDIN_PATH, X_PATH, YOUTUBE_PATH } from "./icon-paths";
import { SocialIcon } from "./SocialIcon";

interface Channel {
	label: string;
	href: string;
	d: string;
}

/**
 * The follow prompt on the end screens. Two rows, one per account, so a
 * player deciding who to follow doesn't have to guess whose icon is whose.
 * TikTok slots in here as one more Channel entry once the handles exist.
 */
const ROWS: { name: string; channels: Channel[] }[] = [
	{
		name: "Crafter Station",
		channels: [
			{ label: "Website", href: "https://crafterstation.com", d: GLOBE_PATH },
			{
				label: "LinkedIn",
				href: "https://linkedin.com/company/crafter-station",
				d: LINKEDIN_PATH,
			},
			{ label: "Instagram", href: "https://instagram.com/crafter.station", d: INSTAGRAM_PATH },
			{ label: "YouTube", href: "https://www.youtube.com/@crafterstation", d: YOUTUBE_PATH },
			{ label: "X", href: "https://x.com/CrafterStation", d: X_PATH },
		],
	},
	{
		name: "Jibaru",
		channels: [
			{ label: "Website", href: "https://jibaru.dev", d: GLOBE_PATH },
			{ label: "LinkedIn", href: "https://linkedin.com/in/ignacior97", d: LINKEDIN_PATH },
			{ label: "Instagram", href: "https://instagram.com/jibaru.dev", d: INSTAGRAM_PATH },
			{ label: "YouTube", href: "https://youtube.com/@ignacio-rueda", d: YOUTUBE_PATH },
			{ label: "X", href: "https://x.com/IgnacioRuedaB", d: X_PATH },
		],
	},
];

export function FollowUs({ className = "" }: { className?: string }) {
	const { t } = useStrings();

	return (
		<section className={`flex flex-col items-center gap-4 ${className}`}>
			<h3 className="section-label text-[color:var(--text-dim)]">{t.followUs}</h3>

			<div className="flex flex-col gap-3">
				{ROWS.map((row) => (
					<div key={row.name} className="panel flex items-center gap-5 px-5 py-3">
						<span className="w-32 font-[family-name:var(--font-pixel)] text-sm">{row.name}</span>
						<div className="flex items-center gap-4">
							{row.channels.map((channel) => (
								<SocialIcon
									key={`${row.name}-${channel.label}`}
									label={`${row.name} — ${channel.label}`}
									href={channel.href}
									d={channel.d}
									size={20}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
