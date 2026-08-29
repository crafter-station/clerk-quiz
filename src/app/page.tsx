"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStrings } from "@/i18n/strings";
import { MAX_QUESTIONS } from "@/questions/bank";
import { BrandBar } from "@/ui/BrandBar";
import { ShakyText } from "@/ui/ShakyText";

const QUESTION_CHOICES = [5, 10, 15, 20, 25, MAX_QUESTIONS];
const SECOND_CHOICES = [10, 15, 20, 30];

export default function HomePage() {
	const { t } = useStrings();
	const router = useRouter();

	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [joining, setJoining] = useState(false);
	const [joinError, setJoinError] = useState<string | null>(null);

	const [questionCount, setQuestionCount] = useState(10);
	const [seconds, setSeconds] = useState(20);
	const [creating, setCreating] = useState(false);

	async function join(event: React.FormEvent) {
		event.preventDefault();
		if (joining) return;
		setJoining(true);
		setJoinError(null);

		try {
			const response = await fetch(`/api/rooms/${code.trim()}/join`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
			const payload = await response.json();

			if (!response.ok) {
				const reason =
					payload.error === "name-taken"
						? t.nameTaken
						: payload.error === "started"
							? t.gameStarted
							: payload.error === "full"
								? t.roomFull
								: t.roomNotFound;
				setJoinError(reason);
				return;
			}

			sessionStorage.setItem(`clerkquiz.player.${payload.code}`, payload.playerId);
			router.push(`/play/${payload.code}`);
		} catch {
			setJoinError(t.connectionLost);
		} finally {
			setJoining(false);
		}
	}

	async function create() {
		if (creating) return;
		setCreating(true);

		try {
			const response = await fetch("/api/rooms", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ questionCount, secondsPerQuestion: seconds }),
			});
			const payload = await response.json();
			sessionStorage.setItem(`clerkquiz.host.${payload.code}`, payload.hostKey);
			router.push(`/host/${payload.code}`);
		} catch {
			setCreating(false);
		}
	}

	return (
		<main className="relative min-h-dvh overflow-hidden">
			<div className="grid-bg" aria-hidden="true" />

			<div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-6 py-6">
				<BrandBar className="rise" />

				<div className="flex flex-1 flex-col items-center justify-center py-10">
					<p className="rise rise-1 font-[family-name:var(--font-script)] text-[color:var(--text-dim)] text-lg">
						the next craft
					</p>

					<h1 className="rise rise-1 mt-2 text-center">
						<ShakyText className="pixel-heading text-5xl sm:text-7xl">CLERK QUIZ</ShakyText>
					</h1>

					<p className="rise rise-2 mt-4 text-center text-[color:var(--text-dim)] text-sm">
						{t.tagline}
					</p>

					<div className="mt-12 grid w-full gap-6 md:grid-cols-2">
						{/* ── Join ─────────────────────────────────────────── */}
						<form onSubmit={join} className="panel rise rise-3 flex flex-col gap-4 p-6">
							<h2 className="section-label">{t.joinARoom}</h2>

							<label className="flex flex-col gap-2">
								<span className="text-[color:var(--text-dim)] text-xs">{t.roomCode}</span>
								<input
									value={code}
									onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
									placeholder="000000"
									inputMode="numeric"
									autoComplete="off"
									className="keycap w-full px-4 py-3 text-center font-[family-name:var(--font-pixel)] text-2xl tracking-[0.3em] placeholder:text-[color:var(--key-shadow)] focus:outline-none"
								/>
							</label>

							<label className="flex flex-col gap-2">
								<span className="text-[color:var(--text-dim)] text-xs">{t.yourName}</span>
								<input
									value={name}
									onChange={(event) =>
										setName(
											event.target.value
												.toUpperCase()
												.replace(/[^A-ZÁÉÍÓÚÑÜ0-9 _-]/g, "")
												.slice(0, 14),
										)
									}
									placeholder="PLAYER"
									autoComplete="off"
									spellCheck={false}
									className="keycap w-full px-4 py-3 text-center font-[family-name:var(--font-pixel)] text-xl tracking-widest placeholder:text-[color:var(--key-shadow)] focus:outline-none"
								/>
							</label>

							{joinError && <p className="text-[color:var(--destructive)] text-xs">{joinError}</p>}

							<button
								type="submit"
								disabled={code.length !== 6 || name.trim().length < 2 || joining}
								className="keycap mt-2 px-5 py-3 font-semibold"
							>
								{joining ? t.joining : t.join}
							</button>
						</form>

						{/* ── Host ─────────────────────────────────────────── */}
						<div className="panel rise rise-4 flex flex-col gap-4 p-6">
							<h2 className="section-label">{t.hostARoom}</h2>
							<p className="text-[color:var(--text-dim)] text-xs">{t.hostIntro}</p>

							<div className="flex flex-col gap-2">
								<span className="text-[color:var(--text-dim)] text-xs">
									{t.questionsPerRoom} — {questionCount} {t.questionsLabel}
								</span>
								<div className="flex flex-wrap gap-2">
									{QUESTION_CHOICES.map((choice) => (
										<button
											key={choice}
											type="button"
											onClick={() => setQuestionCount(choice)}
											aria-pressed={choice === questionCount}
											className={`${choice === questionCount ? "keycap" : "keycap-ghost"} px-3 py-1.5 text-sm tabular-nums`}
										>
											{choice}
										</button>
									))}
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<span className="text-[color:var(--text-dim)] text-xs">{t.secondsPerQuestion}</span>
								<div className="flex flex-wrap gap-2">
									{SECOND_CHOICES.map((choice) => (
										<button
											key={choice}
											type="button"
											onClick={() => setSeconds(choice)}
											aria-pressed={choice === seconds}
											className={`${choice === seconds ? "keycap" : "keycap-ghost"} px-3 py-1.5 text-sm tabular-nums`}
										>
											{choice}
											{t.secondsLabel}
										</button>
									))}
								</div>
							</div>

							<p className="text-[color:var(--text-dim)] text-xs">{t.scoringNote}</p>

							<button
								type="button"
								onClick={create}
								disabled={creating}
								className="keycap mt-auto px-5 py-3 font-semibold"
							>
								{creating ? t.creating : t.createRoom}
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
