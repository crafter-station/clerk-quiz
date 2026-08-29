"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStrings } from "@/i18n/strings";
import { LanguageToggle } from "@/ui/LanguageToggle";
import { ShakyText } from "@/ui/ShakyText";
import { TimerBar } from "@/ui/TimerBar";
import { serverNow, useRoom } from "@/ui/useRoom";

const LETTERS = ["A", "B", "C", "D"] as const;

/**
 * The phone in a player's hand. It answers questions and otherwise defers to
 * the big screen: lobby and reveal moments here are deliberately sparse so the
 * shared display stays the centre of the room.
 */
export function PlayView({ code }: { code: string }) {
	const { t, current } = useStrings();
	const { room, status, skew } = useRoom(code);
	// undefined = not read yet; null = read, and this browser never joined.
	const [playerId, setPlayerId] = useState<string | null | undefined>(undefined);
	const [picked, setPicked] = useState<number | null>(null);

	useEffect(() => {
		setPlayerId(sessionStorage.getItem(`clerkquiz.player.${code}`));
	}, [code]);

	const questionIndex = room?.index ?? -1;

	// A new question resets the local pick; the server resets the real one.
	// biome-ignore lint/correctness/useExhaustiveDependencies: questionIndex is the reset trigger.
	useEffect(() => {
		setPicked(null);
	}, [questionIndex]);

	async function answer(choice: number) {
		if (picked !== null || !playerId) return;
		setPicked(choice);

		const response = await fetch(`/api/rooms/${code}/answer`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ playerId, choice }),
		});

		// The server said no — most likely the countdown beat the tap.
		if (!response.ok) setPicked(null);
	}

	if (status === "gone" || playerId === null) {
		return (
			<CenteredNote
				note={status === "gone" ? t.roomNotFound : t.joinARoom}
				backLabel={t.backHome}
			/>
		);
	}

	if (!room) {
		return <CenteredNote note={t.reconnecting} backLabel={t.backHome} />;
	}

	const me = room.players.find((player) => player.id === playerId);
	const question = room.question?.[current] ?? null;
	const answered = picked !== null || (me?.answered ?? false);

	return (
		<main className="relative min-h-dvh overflow-hidden">
			<div className="grid-bg" aria-hidden="true" />

			<div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-5">
				<div className="flex items-center justify-between gap-3">
					<span className="section-label text-[color:var(--text-dim)]">
						{room.code}
						{me ? ` — ${me.name}` : ""}
					</span>
					<LanguageToggle />
				</div>

				{status === "lost" && (
					<p className="mt-3 text-center text-[color:var(--destructive)] text-xs">
						{t.connectionLost} {t.reconnecting}
					</p>
				)}

				{/* ── Lobby ──────────────────────────────────────────────── */}
				{room.phase === "lobby" && (
					<div className="flex flex-1 flex-col items-center justify-center text-center">
						<ShakyText className="pixel-heading rise text-3xl">{t.youAreIn}</ShakyText>
						<p className="rise rise-2 cursor mt-6 text-[color:var(--text-dim)] text-sm">
							{t.waitForHost}{" "}
						</p>
					</div>
				)}

				{/* ── Question ───────────────────────────────────────────── */}
				{room.phase === "question" && question && (
					<div className="flex flex-1 flex-col justify-center py-6">
						<div className="flex items-baseline justify-between">
							<h2 className="section-label">
								{t.question} {room.index + 1} {t.of} {room.total}
							</h2>
							{me && me.streak > 1 && (
								<span className="text-[color:var(--text-dim)] text-xs">
									{me.streak}× {t.streak}
								</span>
							)}
						</div>

						<div className="mt-3">
							<TimerBar
								endsAt={room.questionEndsAt}
								serverNow={serverNow(skew)}
								durationMs={room.secondsPerQuestion * 1000}
							/>
						</div>

						<p key={room.index} className="rise mt-6 font-semibold text-lg">
							{question.prompt}
						</p>

						{answered ? (
							<div className="mt-10 flex flex-col items-center gap-3 text-center">
								<ShakyText className="pixel-heading text-2xl">{t.lockedIn}</ShakyText>
								<p className="cursor text-[color:var(--text-dim)] text-sm">{t.waitingReveal} </p>
							</div>
						) : (
							<div className="mt-6 grid gap-3">
								<p className="section-label text-[color:var(--text-dim)]">{t.pickAnswer}</p>
								{question.options.map((option, index) => (
									<button
										key={option}
										type="button"
										onClick={() => answer(index)}
										className="keycap-ghost flex items-center gap-3 px-4 py-3.5 text-left text-sm"
									>
										<span className="keycap px-2.5 py-1 font-[family-name:var(--font-pixel)]">
											{LETTERS[index]}
										</span>
										<span className="flex-1">{option}</span>
									</button>
								))}
							</div>
						)}
					</div>
				)}

				{/* ── Reveal ─────────────────────────────────────────────── */}
				{room.phase === "reveal" && me && (
					<div className="flex flex-1 flex-col items-center justify-center text-center">
						<ShakyText className="pixel-heading rise text-3xl">
							{me.lastCorrect === null ? t.noAnswer : me.lastCorrect ? t.correct : t.incorrect}
						</ShakyText>

						{me.lastGained > 0 && (
							<p className="rise rise-1 mt-4 font-[family-name:var(--font-pixel)] text-xl">
								+{me.lastGained} {t.points}
							</p>
						)}

						<div className="panel rise rise-2 mt-8 grid w-full max-w-xs grid-cols-2 gap-4 p-5 text-sm">
							<div>
								<p className="text-[color:var(--text-dim)] text-xs">{t.totalScore}</p>
								<p className="mt-1 font-[family-name:var(--font-pixel)] text-lg tabular-nums">
									{me.score}
								</p>
							</div>
							<div>
								<p className="text-[color:var(--text-dim)] text-xs">{t.yourRank}</p>
								<p className="mt-1 font-[family-name:var(--font-pixel)] text-lg tabular-nums">
									#{me.rank}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* ── Podium ─────────────────────────────────────────────── */}
				{room.phase === "podium" && me && (
					<div className="flex flex-1 flex-col items-center justify-center text-center">
						<p className="rise font-[family-name:var(--font-script)] text-[color:var(--text-dim)] text-lg">
							{t.finalResults}
						</p>

						<ShakyText className="pixel-heading rise rise-1 mt-2 text-5xl">{`#${me.rank}`}</ShakyText>

						<p className="rise rise-2 mt-4 font-[family-name:var(--font-pixel)] text-xl tabular-nums">
							{me.score} {t.pts}
						</p>

						<Link href="/" className="keycap rise rise-3 mt-10 px-6 py-3 font-semibold text-sm">
							{t.playAgain}
						</Link>
					</div>
				)}
			</div>
		</main>
	);
}

function CenteredNote({ note, backLabel }: { note: string; backLabel: string }) {
	return (
		<main className="relative flex min-h-dvh items-center justify-center overflow-hidden">
			<div className="grid-bg" aria-hidden="true" />
			<div className="relative z-10 flex flex-col items-center gap-6">
				<p className="pixel-heading text-xl">{note}</p>
				<Link href="/" className="keycap-ghost px-5 py-2 text-sm">
					{backLabel}
				</Link>
			</div>
		</main>
	);
}
