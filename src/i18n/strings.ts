"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LOCALE, type Locale, locale, subscribeLocale } from "./locale";

/**
 * Interface copy, one flat dictionary per language.
 *
 * No i18n library, same reasoning as catch-the-craft: a handful of screens,
 * no pluralisation worth the machinery, and the typed record makes a missing
 * Spanish string a build error rather than a blank.
 */
export interface Strings {
	tagline: string;
	joinARoom: string;
	roomCode: string;
	yourName: string;
	join: string;
	joining: string;
	hostARoom: string;
	hostIntro: string;
	questionsPerRoom: string;
	secondsPerQuestion: string;
	createRoom: string;
	creating: string;
	roomNotFound: string;
	backHome: string;
	lobby: string;
	joinAt: string;
	withCode: string;
	scanToJoin: string;
	players: string;
	noPlayersYet: string;
	start: string;
	needOnePlayer: string;
	youAreIn: string;
	waitForHost: string;
	question: string;
	of: string;
	answered: string;
	pickAnswer: string;
	lockedIn: string;
	waitingReveal: string;
	timeUp: string;
	correct: string;
	incorrect: string;
	noAnswer: string;
	correctAnswer: string;
	points: string;
	pts: string;
	totalScore: string;
	yourRank: string;
	leaderboard: string;
	next: string;
	showPodium: string;
	finalResults: string;
	podium: string;
	winner: string;
	playAgain: string;
	newRoom: string;
	hostLeftNote: string;
	connectionLost: string;
	reconnecting: string;
	streak: string;
	nameTaken: string;
	gameStarted: string;
	roomFull: string;
	language: string;
	questionsLabel: string;
	secondsLabel: string;
	scoringNote: string;
	hostView: string;
	answersInCount: string;
}

const EN: Strings = {
	tagline: "Clerk trivia for The Next Craft",
	joinARoom: "Join a room",
	roomCode: "Room code",
	yourName: "Your name",
	join: "Join",
	joining: "Joining…",
	hostARoom: "Host a room",
	hostIntro: "Pick how many questions, get a code, put it on the big screen.",
	questionsPerRoom: "Questions",
	secondsPerQuestion: "Seconds per question",
	createRoom: "Create room",
	creating: "Creating…",
	roomNotFound: "Room not found. It may have expired.",
	backHome: "Back to start",
	lobby: "Lobby",
	joinAt: "Join at",
	withCode: "with code",
	scanToJoin: "Scan to join",
	players: "Players",
	noPlayersYet: "No players yet — waiting for the crowd.",
	start: "Start",
	needOnePlayer: "Waiting for at least one player…",
	youAreIn: "You're in!",
	waitForHost: "Watch the big screen. The host starts the game.",
	question: "Question",
	of: "of",
	answered: "answered",
	pickAnswer: "Pick your answer",
	lockedIn: "Locked in!",
	waitingReveal: "Waiting for everyone else…",
	timeUp: "Time's up!",
	correct: "Correct!",
	incorrect: "Wrong!",
	noAnswer: "No answer",
	correctAnswer: "Correct answer",
	points: "points",
	pts: "pts",
	totalScore: "Total score",
	yourRank: "Your rank",
	leaderboard: "Leaderboard",
	next: "Next",
	showPodium: "Show podium",
	finalResults: "Final results",
	podium: "Podium",
	winner: "Winner",
	playAgain: "Play again",
	newRoom: "New room",
	hostLeftNote: "Room closed by the host.",
	connectionLost: "Connection lost.",
	reconnecting: "Reconnecting…",
	streak: "streak",
	nameTaken: "That name is taken in this room.",
	gameStarted: "This game already started.",
	roomFull: "This room is full.",
	language: "Language",
	questionsLabel: "questions",
	secondsLabel: "s",
	scoringNote: "Faster correct answers score more, Kahoot-style.",
	hostView: "Host view",
	answersInCount: "answers in",
};

const ES: Strings = {
	tagline: "Trivia de Clerk para The Next Craft",
	joinARoom: "Únete a una sala",
	roomCode: "Código de sala",
	yourName: "Tu nombre",
	join: "Entrar",
	joining: "Entrando…",
	hostARoom: "Crea una sala",
	hostIntro: "Elige cuántas preguntas, recibe un código y ponlo en la pantalla grande.",
	questionsPerRoom: "Preguntas",
	secondsPerQuestion: "Segundos por pregunta",
	createRoom: "Crear sala",
	creating: "Creando…",
	roomNotFound: "Sala no encontrada. Puede haber expirado.",
	backHome: "Volver al inicio",
	lobby: "Sala de espera",
	joinAt: "Entra en",
	withCode: "con el código",
	scanToJoin: "Escanea para entrar",
	players: "Jugadores",
	noPlayersYet: "Aún no hay jugadores — esperando al público.",
	start: "Empezar",
	needOnePlayer: "Esperando al menos un jugador…",
	youAreIn: "¡Ya estás dentro!",
	waitForHost: "Mira la pantalla grande. El host inicia el juego.",
	question: "Pregunta",
	of: "de",
	answered: "respondieron",
	pickAnswer: "Elige tu respuesta",
	lockedIn: "¡Respuesta enviada!",
	waitingReveal: "Esperando al resto…",
	timeUp: "¡Se acabó el tiempo!",
	correct: "¡Correcto!",
	incorrect: "¡Incorrecto!",
	noAnswer: "Sin respuesta",
	correctAnswer: "Respuesta correcta",
	points: "puntos",
	pts: "pts",
	totalScore: "Puntaje total",
	yourRank: "Tu puesto",
	leaderboard: "Tabla de posiciones",
	next: "Siguiente",
	showPodium: "Mostrar podio",
	finalResults: "Resultados finales",
	podium: "Podio",
	winner: "Ganador",
	playAgain: "Jugar de nuevo",
	newRoom: "Nueva sala",
	hostLeftNote: "El host cerró la sala.",
	connectionLost: "Conexión perdida.",
	reconnecting: "Reconectando…",
	streak: "racha",
	nameTaken: "Ese nombre ya está en uso en esta sala.",
	gameStarted: "Este juego ya comenzó.",
	roomFull: "La sala está llena.",
	language: "Idioma",
	questionsLabel: "preguntas",
	secondsLabel: "s",
	scoringNote: "Responder bien y rápido da más puntos, estilo Kahoot.",
	hostView: "Vista del host",
	answersInCount: "respuestas",
};

const DICTIONARIES: Record<Locale, Strings> = { en: EN, es: ES };

export function useStrings(): { t: Strings; current: Locale } {
	const [which, setWhich] = useState<Locale>(DEFAULT_LOCALE);

	useEffect(() => {
		setWhich(locale());
		return subscribeLocale(setWhich);
	}, []);

	return { t: DICTIONARIES[which], current: which };
}
