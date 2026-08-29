import { getRoom, snapshot, subscribe } from "@/server/store";

export const dynamic = "force-dynamic";

/**
 * The realtime channel: one SSE stream per screen in the room.
 *
 * Every state change re-sends a full snapshot rather than a delta. Rooms are
 * small (a question, forty-odd players) and a full snapshot makes reconnection
 * trivial — a client that dropped for ten seconds is current again on the
 * first message.
 */
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
	const { code } = await params;
	const room = getRoom(code);
	if (!room) {
		return new Response(JSON.stringify({ error: "not-found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		start(controller) {
			let open = true;

			const send = () => {
				if (!open) return;
				try {
					controller.enqueue(encoder.encode(`data: ${JSON.stringify(snapshot(room))}\n\n`));
				} catch {
					open = false;
				}
			};

			send();
			const unsubscribe = subscribe(room, send);

			// Keeps proxies from reaping an idle lobby connection.
			const ping = setInterval(() => {
				if (!open) return;
				try {
					controller.enqueue(encoder.encode(": ping\n\n"));
				} catch {
					open = false;
				}
			}, 15000);

			request.signal.addEventListener("abort", () => {
				open = false;
				unsubscribe();
				clearInterval(ping);
				try {
					controller.close();
				} catch {
					// Already closed by the runtime.
				}
			});
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
			"X-Accel-Buffering": "no",
		},
	});
}
