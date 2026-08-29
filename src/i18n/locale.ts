/**
 * Interface language, stored per browser.
 *
 * Local only: it is a property of the device someone is holding, not of the
 * room. Two players in the same room can read the same question in different
 * languages, which is the whole reason the bank stores both.
 */
export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];

export const DEFAULT_LOCALE: Locale = "en";

const STORAGE_KEY = "clerkquiz.locale";

const listeners = new Set<(locale: Locale) => void>();
let current: Locale | null = null;

export function locale(): Locale {
	if (current) return current;

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		current = stored === "es" || stored === "en" ? stored : DEFAULT_LOCALE;
	} catch {
		current = DEFAULT_LOCALE;
	}

	return current;
}

export function setLocale(next: Locale): void {
	current = next;

	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch {
		// Preference lost on reload is acceptable; crashing the switch is not.
	}

	for (const listener of listeners) listener(next);
}

/** Live updates, so switching language re-labels the screen mid-game. */
export function subscribeLocale(listener: (locale: Locale) => void): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
