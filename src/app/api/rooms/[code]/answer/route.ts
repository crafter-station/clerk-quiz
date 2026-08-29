import { NextResponse } from "next/server";
import { getRoom, submitAnswer } from "@/server/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
	const { code } = await params;
	const room = getRoom(code);
	if (!room) return NextResponse.json({ error: "not-found" }, { status: 404 });

	let body: { playerId?: string; choice?: number };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "bad-json" }, { status: 400 });
	}

	if (!submitAnswer(room, body.playerId ?? "", body.choice ?? -1)) {
		return NextResponse.json({ error: "rejected" }, { status: 409 });
	}

	return NextResponse.json({ ok: true });
}
