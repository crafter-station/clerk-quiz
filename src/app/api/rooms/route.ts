import { NextResponse } from "next/server";
import { MAX_QUESTIONS } from "@/questions/bank";
import { createRoom } from "@/server/store";

export const dynamic = "force-dynamic";

/** Host creates a room; the response carries the key that authorises host actions. */
export async function POST(request: Request) {
	let body: { questionCount?: number; secondsPerQuestion?: number };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "bad-json" }, { status: 400 });
	}

	const room = createRoom(body.questionCount ?? 10, body.secondsPerQuestion ?? 20);

	return NextResponse.json({
		code: room.code,
		hostKey: room.hostKey,
		questionCount: room.questions.length,
		maxQuestions: MAX_QUESTIONS,
	});
}
