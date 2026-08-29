import { NextResponse } from "next/server";
import { getRoom } from "@/server/store";

export const dynamic = "force-dynamic";

/** Existence probe, so clients can tell "room gone" from "network flaky". */
export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
	const { code } = await params;
	const room = getRoom(code);
	if (!room) return NextResponse.json({ error: "not-found" }, { status: 404 });
	return NextResponse.json({ code: room.code, phase: room.phase });
}
