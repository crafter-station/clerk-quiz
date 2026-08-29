import { NextResponse } from "next/server";
import { getRoom, joinRoom } from "@/server/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
	const { code } = await params;
	const room = getRoom(code);
	if (!room) return NextResponse.json({ error: "not-found" }, { status: 404 });

	let body: { name?: string };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "bad-json" }, { status: 400 });
	}

	const result = joinRoom(room, body.name ?? "");
	if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });

	return NextResponse.json({ playerId: result.playerId, code: room.code });
}
