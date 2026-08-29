import Link from "next/link";
import { LanguageToggle } from "./LanguageToggle";

/**
 * Crafter Station's mark and the language switch, above everything else so the
 * quiz reads as part of the event rather than something detached from it.
 */
export function BrandBar({ className = "" }: { className?: string }) {
	return (
		<div className={`relative z-30 flex items-center justify-between gap-4 ${className}`}>
			<Link
				href="https://crafterstation.com"
				target="_blank"
				rel="noreferrer"
				className="flex items-center gap-3"
				aria-label="Crafter Station"
			>
				<img
					src="/brand/crafter-station-icon.svg"
					alt=""
					width={28}
					height={28}
					className="h-7 w-7"
				/>
				<span className="section-label hidden text-[color:var(--text-dim)] sm:inline">
					Crafter Station
				</span>
			</Link>

			<LanguageToggle />
		</div>
	);
}
