import type { Metadata, Viewport } from "next";
import { Borel, IBM_Plex_Mono, Silkscreen } from "next/font/google";
import "./globals.css";

// Same three faces, same roles and weights as catch-the-craft: Silkscreen for
// pixel headings, IBM Plex Mono for everything else, Borel for script accents.
const silkscreen = Silkscreen({
	variable: "--font-silkscreen",
	subsets: ["latin"],
	weight: ["400", "700"],
	display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
	variable: "--font-plex-mono",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

const borel = Borel({
	variable: "--font-borel",
	subsets: ["latin"],
	weight: "400",
	display: "swap",
});

const SITE_URL = "https://clerk.thenextcraft.crafter.run";
const TITLE = "CLERK QUIZ";
const DESCRIPTION =
	"Kahoot-style Clerk trivia for The Next Craft — join with a code, race the clock.";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: TITLE,
	description: DESCRIPTION,
	openGraph: {
		type: "website",
		url: SITE_URL,
		siteName: TITLE,
		title: TITLE,
		description: DESCRIPTION,
	},
	twitter: {
		card: "summary",
		title: TITLE,
		description: DESCRIPTION,
	},
};

export const viewport: Viewport = {
	themeColor: "#1a1a17",
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={`${silkscreen.variable} ${ibmPlexMono.variable} ${borel.variable} h-full antialiased`}
		>
			<body>{children}</body>
		</html>
	);
}
