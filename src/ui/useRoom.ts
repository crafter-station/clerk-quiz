"use client";

import { useEffect, useRef, useState } from "react";
import type { RoomSnapshot } from "@/server/store";

export type RoomStatus = "connecting" | "open" | "lost" | "gone";

/**
 * One SSE subscription per screen. Snapshots arrive whole, so reconnection is
 * free; the only extra work is a clock-skew estimate taken on each message so
 * countdowns render against the server's clock, not the phone's.
 */
export function useRoom(code: string): {
	room: RoomSnapshot | null;
	status: RoomStatus;
	skew: number;
} {
	const [room, setRoom] = useState<RoomSnapshot | null>(null);
	const [status, setStatus] = useState<RoomStatus>("connecting");
	const skewRef = useRef(0);

	useEffect(() => {
		let source: EventSource | null = null;
		let cancelled = false;

		// EventSource retries a 404 forever, so probe first to tell "the room
		// is gone" apart from "the network hiccuped".
		fetch(`/api/rooms/${code}`)
			.then((response) => {
				if (cancelled) return;
				if (!response.ok) {
					setStatus("gone");
					return;
				}

				source = new EventSource(`/api/rooms/${code}/events`);

				source.onmessage = (event) => {
					const snapshot = JSON.parse(event.data) as RoomSnapshot;
					skewRef.current = snapshot.now - Date.now();
					setRoom(snapshot);
					setStatus("open");
				};

				source.onerror = () => {
					if (!cancelled) setStatus("lost");
				};
			})
			.catch(() => {
				if (!cancelled) setStatus("lost");
			});

		return () => {
			cancelled = true;
			source?.close();
		};
	}, [code]);

	return { room, status, skew: skewRef.current };
}

/** The server's idea of "now", reconstructed on the client. */
export function serverNow(skew: number): number {
	return Date.now() + skew;
}
