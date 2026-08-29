import { NextResponse } from "next/server";
import { getRoom, startGame } from "@/server/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
	const { code } = await params;
	const room = getRoom(code);
	if (!room) return NextResponse.json({ error: "not-found" }, { status: 404 });

	let body: { hostKey?: string };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "bad-json" }, { status: 400 });
	}

	if (!startGame(room, body.hostKey ?? "")) {
		return NextResponse.json({ error: "rejected" }, { status: 403 });
	}

	return NextResponse.json({ ok: true });
}
