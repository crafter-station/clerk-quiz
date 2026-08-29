"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStrings } from "@/i18n/strings";
import type { RoomSnapshot } from "@/server/store";
import { BrandBar } from "@/ui/BrandBar";
import { ShakyText } from "@/ui/ShakyText";
import { TimerBar } from "@/ui/TimerBar";
import { serverNow, useRoom } from "@/ui/useRoom";

const LETTERS = ["A", "B", "C", "D"] as const;

/**
 * The projector screen. The host's device is the only one holding the hostKey,
 * so it is also the remote control: START in the lobby, NEXT after each reveal.
 */
export function HostView({ code }: { code: string }) {
	const { t, current } = useStrings();
	const { room, status, skew } = useRoom(code);
	const [hostKey, setHostKey] = useState<string | null>(null);
	const [origin, setOrigin] = useState("");

	useEffect(() => {
		setHostKey(sessionStorage.getItem(`clerkquiz.host.${code}`));
		setOrigin(window.location.host);
	}, [code]);

	async function post(action: "start" | "next") {
		await fetch(`/api/rooms/${code}/${action}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ hostKey }),
		});
	}

	if (status === "gone") {
		return <CenteredNote note={t.roomNotFound} backLabel={t.backHome} />;
	}

	if (!room) {
		return <CenteredNote note={t.reconnecting} backLabel={t.backHome} />;
	}

	const question = room.question?.[current] ?? null;
	const isLastQuestion = room.index + 1 >= room.total;

	return (
		<main className="relative min-h-dvh overflow-hidden">
			<div className="grid-bg" aria-hidden="true" />

			<div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-6 py-6">
				<BrandBar />

				{status === "lost" && (
					<p className="mt-4 text-center text-[color:var(--destructive)] text-xs">
						{t.connectionLost} {t.reconnecting}
					</p>
				)}

				{/* ── Lobby ──────────────────────────────────────────────── */}
				{room.phase === "lobby" && (
					<div className="flex flex-1 flex-col items-center justify-center py-10">
						<p className="rise font-[family-name:var(--font-script)] text-[color:var(--text-dim)] text-lg">
							{t.lobby}
						</p>

						<p className="rise rise-1 mt-6 text-[color:var(--text-dim)] text-sm">
							{t.joinAt} <span className="text-[color:var(--bright)]">{origin}</span> {t.withCode}
						</p>

						<div className="rise rise-2 mt-4">
							<ShakyText className="pixel-heading text-6xl tracking-[0.2em] sm:text-8xl">
								{room.code}
							</ShakyText>
						</div>

						<section className="rise rise-3 mt-12 w-full max-w-3xl">
							<h2 className="section-label text-center">
								{t.players} — {room.players.length}
							</h2>

							{room.players.length === 0 ? (
								<p className="cursor mt-6 text-center text-[color:var(--text-dim)] text-sm">
									{t.noPlayersYet}{" "}
								</p>
							) : (
								<ul className="mt-6 flex flex-wrap justify-center gap-3">
									{room.players.map((player) => (
										<li
											key={player.id}
											className="keycap-ghost shaky-box px-4 py-2 font-[family-name:var(--font-pixel)] text-sm"
										>
											{player.name}
										</li>
									))}
								</ul>
							)}
						</section>

						{hostKey ? (
							<button
								type="button"
								onClick={() => post("start")}
								disabled={room.players.length === 0}
								className="keycap rise rise-4 mt-12 px-10 py-4 font-[family-name:var(--font-pixel)] text-xl"
							>
								{t.start}
							</button>
						) : (
							<p className="mt-12 text-[color:var(--text-dim)] text-xs">{t.needOnePlayer}</p>
						)}

						{hostKey && room.players.length === 0 && (
							<p className="mt-4 text-[color:var(--text-dim)] text-xs">{t.needOnePlayer}</p>
						)}
					</div>
				)}

				{/* ── Question + Reveal ──────────────────────────────────── */}
				{(room.phase === "question" || room.phase === "reveal") && question && (
					<div className="flex flex-1 flex-col justify-center py-10">
						<div className="flex items-baseline justify-between gap-4">
							<h2 className="section-label">
								{t.question} {room.index + 1} {t.of} {room.total}
							</h2>
							<p className="text-[color:var(--text-dim)] text-sm tabular-nums">
								{room.answeredCount}/{room.players.length} {t.answered}
							</p>
						</div>

						<div className="mt-4">
							{room.phase === "question" ? (
								<TimerBar
									endsAt={room.questionEndsAt}
									serverNow={serverNow(skew)}
									durationMs={room.secondsPerQuestion * 1000}
								/>
							) : (
								<p className="section-label text-[color:var(--text-dim)]">{t.correctAnswer}</p>
							)}
						</div>

						<p key={room.index} className="pixel-heading rise mt-8 text-2xl sm:text-4xl">
							{question.prompt}
						</p>

						<div className="mt-10 grid gap-4 sm:grid-cols-2">
							{question.options.map((option, index) => {
								const isCorrect = room.correct === index;
								const count = room.counts?.[index] ?? 0;
								const maxCount = Math.max(1, ...(room.counts ?? [1]));

								return (
									<div
										key={option}
										className={`panel relative overflow-hidden p-4 ${
											room.phase === "reveal" ? (isCorrect ? "answer-correct" : "answer-wrong") : ""
										}`}
									>
										{room.phase === "reveal" && (
											<div
												className="result-bar absolute inset-y-0 left-0 bg-[color:var(--line)]/25"
												style={{ width: `${(count / maxCount) * 100}%` }}
												aria-hidden="true"
											/>
										)}

										<div className="relative flex items-center gap-4">
											<span className="keycap px-3 py-1.5 font-[family-name:var(--font-pixel)] text-lg">
												{LETTERS[index]}
											</span>
											<span className="flex-1 text-sm sm:text-base">{option}</span>
											{room.phase === "reveal" && (
												<span className="text-[color:var(--text-dim)] text-sm tabular-nums">
													{count}
												</span>
											)}
										</div>
									</div>
								);
							})}
						</div>

						{room.phase === "reveal" && (
							<div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
								<Leaderboard room={room} title={t.leaderboard} limit={5} />

								{hostKey && (
									<button
										type="button"
										onClick={() => post("next")}
										className="keycap shrink-0 px-8 py-3 font-[family-name:var(--font-pixel)] text-lg"
									>
										{isLastQuestion ? t.showPodium : t.next}
									</button>
								)}
							</div>
						)}
					</div>
				)}

				{/* ── Podium ─────────────────────────────────────────────── */}
				{room.phase === "podium" && (
					<div className="flex flex-1 flex-col items-center justify-center py-10">
						<p className="rise font-[family-name:var(--font-script)] text-[color:var(--text-dim)] text-lg">
							{t.finalResults}
						</p>

						<h2 className="rise rise-1 mt-2">
							<ShakyText className="pixel-heading text-4xl sm:text-6xl">{t.podium}</ShakyText>
						</h2>

						<Podium room={room} winnerLabel={t.winner} />

						<div className="rise rise-4 mt-12 w-full max-w-xl">
							<Leaderboard room={room} title={t.leaderboard} limit={room.players.length} />
						</div>

						<Link href="/" className="keycap-ghost rise rise-5 mt-10 px-6 py-2.5 text-sm">
							{t.newRoom}
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

function Leaderboard({ room, title, limit }: { room: RoomSnapshot; title: string; limit: number }) {
	return (
		<section className="w-full max-w-xl">
			<h3 className="section-label">{title}</h3>
			<ol className="board-scroll mt-3 flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
				{room.players.slice(0, limit).map((player) => (
					<li key={player.id} className="panel flex items-center gap-3 px-4 py-2 text-sm">
						<span className="w-6 text-[color:var(--text-dim)] tabular-nums">{player.rank}</span>
						<span className="flex-1 font-[family-name:var(--font-pixel)]">{player.name}</span>
						{player.lastGained > 0 && (
							<span className="text-[color:var(--text-dim)] text-xs tabular-nums">
								+{player.lastGained}
							</span>
						)}
						<span className="tabular-nums">{player.score}</span>
					</li>
				))}
			</ol>
		</section>
	);
}

/** Top three, tallest in the middle, in the same keycap register as the buttons. */
function Podium({ room, winnerLabel }: { room: RoomSnapshot; winnerLabel: string }) {
	const [first, second, third] = room.players;
	const spots = [
		{ player: second, height: "h-24", label: "2" },
		{ player: first, height: "h-36", label: "1" },
		{ player: third, height: "h-16", label: "3" },
	];

	return (
		<div className="rise rise-2 mt-10 flex items-end gap-4">
			{spots.map(
				(spot) =>
					spot.player && (
						<div key={spot.player.id} className="flex w-28 flex-col items-center gap-3 sm:w-36">
							{spot.label === "1" && (
								<span className="font-[family-name:var(--font-script)] text-[color:var(--text-dim)] text-sm">
									{winnerLabel}
								</span>
							)}
							<span className="pixel-heading shaky-box text-center text-sm sm:text-base">
								{spot.player.name}
							</span>
							<span className="text-[color:var(--text-dim)] text-xs tabular-nums">
								{spot.player.score}
							</span>
							<div
								className={`keycap flex w-full items-start justify-center ${spot.height} pt-2 font-[family-name:var(--font-pixel)] text-2xl`}
							>
								{spot.label}
							</div>
						</div>
					),
			)}
		</div>
	);
}
