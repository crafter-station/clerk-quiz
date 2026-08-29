import { QUESTION_BANK, type QuizQuestion } from "@/questions/bank";

/**
 * The whole game lives in this module: an in-memory map of rooms, a timer per
 * room driving the question countdown, and a listener set per room feeding the
 * SSE connections. No database — a quiz room at an event is ephemeral by
 * nature, and a restart losing the lobby is acceptable where a second service
 * to deploy is not.
 */

export type Phase = "lobby" | "question" | "reveal" | "podium";

export interface Player {
	id: string;
	name: string;
	score: number;
	streak: number;
	/** Choice for the question currently on screen; reset on every advance. */
	choice: number | null;
	answeredAt: number | null;
	lastCorrect: boolean | null;
	lastGained: number;
}

export interface Room {
	code: string;
	hostKey: string;
	createdAt: number;
	secondsPerQuestion: number;
	questions: QuizQuestion[];
	phase: Phase;
	index: number;
	questionStartedAt: number;
	questionEndsAt: number;
	timer: ReturnType<typeof setTimeout> | null;
	players: Map<string, Player>;
	listeners: Set<() => void>;
}

const MAX_PLAYERS = 200;
const ROOM_TTL_MS = 6 * 60 * 60 * 1000;

// Survives Turbopack HMR in dev, where this module reloads but rooms must not.
const globalStore = globalThis as unknown as { __clerkQuizRooms?: Map<string, Room> };
const rooms: Map<string, Room> = globalStore.__clerkQuizRooms ?? new Map();
globalStore.__clerkQuizRooms = rooms;

function randomId(length: number): string {
	const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
	let out = "";
	for (let i = 0; i < length; i++) {
		out += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return out;
}

/** Numeric like Kahoot's, so it can be read aloud across a room. */
function newRoomCode(): string {
	for (let attempt = 0; attempt < 50; attempt++) {
		const code = String(Math.floor(100000 + Math.random() * 900000));
		if (!rooms.has(code)) return code;
	}
	throw new Error("no free room codes");
}

function sampleQuestions(count: number): QuizQuestion[] {
	const pool = [...QUESTION_BANK];
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, count);
}

function sweepExpired(): void {
	const now = Date.now();
	for (const [code, room] of rooms) {
		if (now - room.createdAt > ROOM_TTL_MS) {
			if (room.timer) clearTimeout(room.timer);
			rooms.delete(code);
		}
	}
}

export function createRoom(questionCount: number, secondsPerQuestion: number): Room {
	sweepExpired();

	const count = Math.max(1, Math.min(QUESTION_BANK.length, Math.floor(questionCount)));
	const seconds = Math.max(5, Math.min(120, Math.floor(secondsPerQuestion)));

	const room: Room = {
		code: newRoomCode(),
		hostKey: randomId(24),
		createdAt: Date.now(),
		secondsPerQuestion: seconds,
		questions: sampleQuestions(count),
		phase: "lobby",
		index: -1,
		questionStartedAt: 0,
		questionEndsAt: 0,
		timer: null,
		players: new Map(),
		listeners: new Set(),
	};

	rooms.set(room.code, room);
	return room;
}

export function getRoom(code: string): Room | undefined {
	return rooms.get(code);
}

function broadcast(room: Room): void {
	for (const listener of room.listeners) listener();
}

export function subscribe(room: Room, listener: () => void): () => void {
	room.listeners.add(listener);
	return () => room.listeners.delete(listener);
}

export type JoinResult =
	| { ok: true; playerId: string }
	| { ok: false; error: "started" | "full" | "name-taken" | "bad-name" };

export function joinRoom(room: Room, rawName: string): JoinResult {
	if (room.phase !== "lobby") return { ok: false, error: "started" };
	if (room.players.size >= MAX_PLAYERS) return { ok: false, error: "full" };

	const name = rawName
		.toUpperCase()
		.replace(/[^A-ZÁÉÍÓÚÑÜ0-9 _-]/g, "")
		.trim()
		.slice(0, 14);
	if (name.length < 2) return { ok: false, error: "bad-name" };

	for (const player of room.players.values()) {
		if (player.name === name) return { ok: false, error: "name-taken" };
	}

	const player: Player = {
		id: randomId(16),
		name,
		score: 0,
		streak: 0,
		choice: null,
		answeredAt: null,
		lastCorrect: null,
		lastGained: 0,
	};
	room.players.set(player.id, player);
	broadcast(room);
	return { ok: true, playerId: player.id };
}

function beginQuestion(room: Room, index: number): void {
	room.phase = "question";
	room.index = index;
	room.questionStartedAt = Date.now();
	room.questionEndsAt = room.questionStartedAt + room.secondsPerQuestion * 1000;

	for (const player of room.players.values()) {
		player.choice = null;
		player.answeredAt = null;
		player.lastCorrect = null;
		player.lastGained = 0;
	}

	if (room.timer) clearTimeout(room.timer);
	room.timer = setTimeout(() => reveal(room), room.secondsPerQuestion * 1000);
	broadcast(room);
}

/**
 * Kahoot-style scoring: a correct answer is worth 500–1000 points scaled by
 * how much of the countdown was left, plus a small streak bonus so a run of
 * correct answers is worth defending.
 */
function scoreFor(room: Room, player: Player): number {
	const question = room.questions[room.index];
	if (player.choice === null || player.answeredAt === null) return 0;
	if (player.choice !== question.correct) return 0;

	const elapsed = Math.max(0, player.answeredAt - room.questionStartedAt);
	const duration = room.secondsPerQuestion * 1000;
	const remaining = Math.max(0, Math.min(1, 1 - elapsed / duration));
	const base = Math.round(500 + 500 * remaining);
	const streakBonus = Math.min(200, player.streak * 50);
	return base + streakBonus;
}

function reveal(room: Room): void {
	if (room.phase !== "question") return;
	room.phase = "reveal";
	if (room.timer) clearTimeout(room.timer);
	room.timer = null;

	const question = room.questions[room.index];
	for (const player of room.players.values()) {
		const correct = player.choice !== null && player.choice === question.correct;
		const gained = scoreFor(room, player);
		player.lastCorrect = player.choice === null ? null : correct;
		player.lastGained = gained;
		player.score += gained;
		player.streak = correct ? player.streak + 1 : 0;
	}

	broadcast(room);
}

export function startGame(room: Room, hostKey: string): boolean {
	if (hostKey !== room.hostKey) return false;
	if (room.phase !== "lobby") return false;
	if (room.players.size === 0) return false;
	beginQuestion(room, 0);
	return true;
}

/** Host advances from a reveal: next question, or the podium after the last. */
export function advance(room: Room, hostKey: string): boolean {
	if (hostKey !== room.hostKey) return false;
	if (room.phase !== "reveal") return false;

	if (room.index + 1 < room.questions.length) {
		beginQuestion(room, room.index + 1);
	} else {
		room.phase = "podium";
		broadcast(room);
	}
	return true;
}

export function submitAnswer(room: Room, playerId: string, choice: number): boolean {
	if (room.phase !== "question") return false;
	const player = room.players.get(playerId);
	if (!player) return false;
	if (player.choice !== null) return false;
	if (!Number.isInteger(choice) || choice < 0 || choice > 3) return false;

	player.choice = choice;
	player.answeredAt = Date.now();

	// Everyone in — no reason to sit out the rest of the countdown.
	const allAnswered = [...room.players.values()].every((p) => p.choice !== null);
	if (allAnswered) {
		reveal(room);
	} else {
		broadcast(room);
	}
	return true;
}

/* ─── Snapshots ─────────────────────────────────────────────────── */

export interface PlayerSnapshot {
	id: string;
	name: string;
	score: number;
	streak: number;
	answered: boolean;
	rank: number;
	/** Only populated during reveal/podium so the client can't peek early. */
	choice: number | null;
	lastCorrect: boolean | null;
	lastGained: number;
}

export interface RoomSnapshot {
	code: string;
	phase: Phase;
	index: number;
	total: number;
	secondsPerQuestion: number;
	now: number;
	questionEndsAt: number;
	answeredCount: number;
	players: PlayerSnapshot[];
	/** Both languages travel together; the device picks its own. */
	question: Pick<QuizQuestion, "en" | "es"> | null;
	correct: number | null;
	counts: [number, number, number, number] | null;
}

export function snapshot(room: Room): RoomSnapshot {
	const showResults = room.phase === "reveal" || room.phase === "podium";
	const question = room.index >= 0 ? room.questions[room.index] : null;

	const sorted = [...room.players.values()].sort(
		(a, b) => b.score - a.score || a.name.localeCompare(b.name),
	);

	const players: PlayerSnapshot[] = sorted.map((player, position) => ({
		id: player.id,
		name: player.name,
		score: player.score,
		streak: player.streak,
		answered: player.choice !== null,
		rank: position + 1,
		choice: showResults ? player.choice : null,
		lastCorrect: showResults ? player.lastCorrect : null,
		lastGained: showResults ? player.lastGained : 0,
	}));

	let counts: [number, number, number, number] | null = null;
	if (showResults) {
		counts = [0, 0, 0, 0];
		for (const player of room.players.values()) {
			if (player.choice !== null) counts[player.choice]++;
		}
	}

	return {
		code: room.code,
		phase: room.phase,
		index: room.index,
		total: room.questions.length,
		secondsPerQuestion: room.secondsPerQuestion,
		now: Date.now(),
		questionEndsAt: room.questionEndsAt,
		answeredCount: [...room.players.values()].filter((p) => p.choice !== null).length,
		players,
		question: question ? { en: question.en, es: question.es } : null,
		correct: showResults && question ? question.correct : null,
		counts,
	};
}
