"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

/**
 * The lobby QR: encodes the join URL with the room code already in it, so a
 * phone camera lands a player one name-field away from the game.
 *
 * Rendered as dark modules on the bone keycap colour — the classic polarity,
 * because inverted (light-on-dark) QR codes fail on plenty of camera apps.
 * On this palette the result happens to read as one more keycap, which is why
 * it gets the keycap frame instead of a plain white box.
 */
export function JoinQr({ url, className = "" }: { url: string; className?: string }) {
	const [dataUrl, setDataUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!url) return;
		QRCode.toDataURL(url, {
			errorCorrectionLevel: "M",
			margin: 2,
			width: 480,
			color: { dark: "#1a1a17", light: "#e6e3d8" },
		})
			.then(setDataUrl)
			.catch(() => setDataUrl(null));
	}, [url]);

	if (!dataUrl) return null;

	return (
		<div className={`keycap inline-block p-2 ${className}`}>
			{/* biome-ignore lint/performance/noImgElement: generated data URL; next/image cannot optimize it. */}
			<img
				src={dataUrl}
				alt={`QR — ${url}`}
				className="block h-40 w-40 rounded-sm sm:h-48 sm:w-48"
			/>
		</div>
	);
}
