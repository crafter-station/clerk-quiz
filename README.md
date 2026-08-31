<!-- ⚠️ NO BORRAR ESTE AVISO / DO NOT REMOVE THIS NOTICE ⚠️ -->

> ## ⚠️ Aviso / Notice
>
> **🇪🇸 Español** — Este repositorio **no es open source**. Si su trabajo toma
> elementos notoriamente derivados de este proyecto, se requiere atribución
> expresa y visible a Crafter Station. El incumplimiento podrá dar lugar a la
> suspensión del acceso y a un señalamiento público por parte de la
> organización. Consulte la [LICENCIA](./LICENSE) antes de copiar, forkear o
> desplegar cualquier parte de este código.
>
> **🇬🇧 English** — This repository is **not open source**. If your work takes
> elements notoriously derived from this project, express and visible
> attribution to Crafter Station is required. Failure to comply may result in
> revoked access and a public statement from the organization. Review the
> [LICENSE](./LICENSE) before copying, forking or deploying any part of this
> code.
>
> **Crafter Station** — [@crafter-station](https://github.com/crafter-station) · [crafterstation.com](https://crafterstation.com)

---

# CLERK QUIZ

Kahoot-style Clerk trivia for **The Next Craft**, in the same warm
black-and-white arcade register as
[catch-the-craft](https://github.com/crafter-station/catch-the-craft).

## How it plays

1. The host opens the site, picks **how many questions** (5–36) and **seconds
   per question**, and creates a room. A 6-digit code goes up on the big screen.
2. Players open the site on their phones, type the code and a name, and appear
   in the lobby as they join.
3. The host presses **START**. Each question runs on a countdown; answering
   correctly scores 500–1000 points scaled by speed, plus a small streak bonus.
   The round reveals early if everyone answers.
4. After each reveal the host presses **NEXT**; after the last question, the
   podium.

Questions are stored in **Spanish and English side by side** and both travel to
every device — each player reads them in whatever language their own EN/ES
toggle is set to, so a mixed crowd shares one room.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + Tailwind CSS 4
- Bun, Biome
- No database: rooms live in server memory with a 6-hour TTL. Realtime is one
  SSE stream per screen (`/api/rooms/[code]/events`) sending full snapshots.
  Note this means a **single server instance** — it will not fan out across
  serverless replicas.

## Develop

```sh
bun install
bun dev        # http://localhost:3000
bun run lint
bun run typecheck
bun run build
```

## Layout

- `src/questions/bank.ts` — the bilingual Clerk question bank (36 questions).
- `src/server/store.ts` — rooms, the lobby → question → reveal → podium state
  machine, timers, scoring, snapshots.
- `src/app/api/rooms/**` — create / join / start / answer / next / SSE events.
- `src/app/page.tsx` — join or host.
- `src/app/host/[code]` — the projector screen, which is also the remote.
- `src/app/play/[code]` — the phone in a player's hand.
- `src/i18n` — EN/ES interface copy, locale stored per browser.

## License

**Proprietary — All Rights Reserved.** See [LICENSE](./LICENSE).

This repo is **not** open source. Copying, forking, modifying, redistributing,
deploying, or using it for commercial **or** non-commercial purposes is not
allowed without prior written permission from Crafter Station
(hello@crafterstation.com). Third-party material keeps its own license.

Este repo **no** es open source. Copiar, forkear, modificar, redistribuir,
desplegar o usarlo con fines comerciales **o** no comerciales no está permitido
sin permiso previo y por escrito de Crafter Station
(hello@crafterstation.com). El material de terceros conserva su propia licencia.
