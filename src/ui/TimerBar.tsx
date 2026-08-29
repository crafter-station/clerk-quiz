"use client";

interface Props {
	/** Server timestamps; the client only needs the remaining span once. */
	endsAt: number;
	serverNow: number;
	durationMs: number;
}

/**
 * The question countdown. The fill drains via a CSS animation, so it stays
 * smooth without a JS interval. The animation always runs the full question
 * duration, started with a negative delay equal to the time already elapsed —
 * which is what lets a reconnecting client pick up mid-drain in the right
 * place instead of restarting from full.
 */
export function TimerBar({ endsAt, serverNow, durationMs }: Props) {
	const remaining = Math.max(0, Math.min(durationMs, endsAt - serverNow));
	const elapsed = durationMs - remaining;

	return (
		<div className="timer-rail">
			<div
				// Keyed by endsAt so a new question restarts the animation.
				key={endsAt}
				className="timer-fill"
				style={{
					animationDuration: `${durationMs}ms`,
					animationDelay: `-${elapsed}ms`,
				}}
			/>
		</div>
	);
}
