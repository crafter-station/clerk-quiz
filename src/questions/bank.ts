/**
 * The Clerk question bank, stored in both languages.
 *
 * Every question carries its Spanish and English text side by side, and the
 * server sends both down the wire: each player's device picks the one matching
 * its own locale toggle, so a mixed crowd plays the same room comfortably.
 *
 * `correct` is an index into `options`; both languages keep their options in
 * the same order so the index is shared.
 */
export interface LocalizedQuestion {
	prompt: string;
	options: [string, string, string, string];
}

export interface QuizQuestion {
	id: number;
	correct: number;
	en: LocalizedQuestion;
	es: LocalizedQuestion;
}

export const QUESTION_BANK: QuizQuestion[] = [
	{
		id: 1,
		correct: 2,
		en: {
			prompt: "What is Clerk?",
			options: [
				"A CSS framework",
				"A database ORM",
				"An authentication and user management platform",
				"A hosting provider",
			],
		},
		es: {
			prompt: "¿Qué es Clerk?",
			options: [
				"Un framework de CSS",
				"Un ORM de bases de datos",
				"Una plataforma de autenticación y gestión de usuarios",
				"Un proveedor de hosting",
			],
		},
	},
	{
		id: 2,
		correct: 0,
		en: {
			prompt: "Which component renders a complete sign-in form in React?",
			options: ["<SignIn />", "<LoginBox />", "<AuthForm />", "<ClerkLogin />"],
		},
		es: {
			prompt: "¿Qué componente renderiza un formulario de inicio de sesión completo en React?",
			options: ["<SignIn />", "<LoginBox />", "<AuthForm />", "<ClerkLogin />"],
		},
	},
	{
		id: 3,
		correct: 1,
		en: {
			prompt: "How many monthly active users (MAUs) does Clerk's free plan include?",
			options: ["1,000", "10,000", "50,000", "100"],
		},
		es: {
			prompt: "¿Cuántos usuarios activos mensuales (MAUs) incluye el plan gratuito de Clerk?",
			options: ["1,000", "10,000", "50,000", "100"],
		},
	},
	{
		id: 4,
		correct: 3,
		en: {
			prompt: "Which React hook gives you the currently signed-in user's data?",
			options: ["useAccount()", "useSession()", "useClerkUser()", "useUser()"],
		},
		es: {
			prompt: "¿Qué hook de React te da los datos del usuario que tiene la sesión iniciada?",
			options: ["useAccount()", "useSession()", "useClerkUser()", "useUser()"],
		},
	},
	{
		id: 5,
		correct: 1,
		en: {
			prompt: "What prefix does a production publishable key have?",
			options: ["pub_prod_", "pk_live_", "pk_prod_", "live_pk_"],
		},
		es: {
			prompt: "¿Qué prefijo tiene una publishable key de producción?",
			options: ["pub_prod_", "pk_live_", "pk_prod_", "live_pk_"],
		},
	},
	{
		id: 6,
		correct: 0,
		en: {
			prompt: "Which function protects routes in a Next.js app with Clerk?",
			options: ["clerkMiddleware()", "authGuard()", "protectRoutes()", "withClerk()"],
		},
		es: {
			prompt: "¿Qué función protege rutas en una app de Next.js con Clerk?",
			options: ["clerkMiddleware()", "authGuard()", "protectRoutes()", "withClerk()"],
		},
	},
	{
		id: 7,
		correct: 2,
		en: {
			prompt: "What format do Clerk session tokens use?",
			options: ["Opaque random strings", "SAML assertions", "Short-lived JWTs", "API keys"],
		},
		es: {
			prompt: "¿Qué formato usan los session tokens de Clerk?",
			options: [
				"Cadenas aleatorias opacas",
				"Aserciones SAML",
				"JWTs de corta duración",
				"API keys",
			],
		},
	},
	{
		id: 8,
		correct: 1,
		en: {
			prompt: "What is the default lifetime of a Clerk session token?",
			options: ["10 minutes", "60 seconds", "24 hours", "5 seconds"],
		},
		es: {
			prompt: "¿Cuál es la duración por defecto de un session token de Clerk?",
			options: ["10 minutos", "60 segundos", "24 horas", "5 segundos"],
		},
	},
	{
		id: 9,
		correct: 3,
		en: {
			prompt: "Clerk webhooks are delivered and signed through which service?",
			options: ["SendGrid", "Zapier", "Kafka", "Svix"],
		},
		es: {
			prompt: "¿A través de qué servicio se entregan y firman los webhooks de Clerk?",
			options: ["SendGrid", "Zapier", "Kafka", "Svix"],
		},
	},
	{
		id: 10,
		correct: 0,
		en: {
			prompt: "Which component shows the signed-in user's avatar with a dropdown menu?",
			options: ["<UserButton />", "<AvatarMenu />", "<ProfileChip />", "<AccountButton />"],
		},
		es: {
			prompt: "¿Qué componente muestra el avatar del usuario con un menú desplegable?",
			options: ["<UserButton />", "<AvatarMenu />", "<ProfileChip />", "<AccountButton />"],
		},
	},
	{
		id: 11,
		correct: 2,
		en: {
			prompt: "Where should your Clerk secret key live?",
			options: [
				"In the browser bundle",
				"In a public GitHub repo",
				"Only on the server, in environment variables",
				"In localStorage",
			],
		},
		es: {
			prompt: "¿Dónde debe vivir tu secret key de Clerk?",
			options: [
				"En el bundle del navegador",
				"En un repo público de GitHub",
				"Solo en el servidor, en variables de entorno",
				"En localStorage",
			],
		},
	},
	{
		id: 12,
		correct: 1,
		en: {
			prompt: "In the Next.js App Router, which package exports the auth() helper?",
			options: ["@clerk/react", "@clerk/nextjs/server", "@clerk/auth", "next/auth"],
		},
		es: {
			prompt: "En el App Router de Next.js, ¿qué paquete exporta el helper auth()?",
			options: ["@clerk/react", "@clerk/nextjs/server", "@clerk/auth", "next/auth"],
		},
	},
	{
		id: 13,
		correct: 0,
		en: {
			prompt: "What are the two default roles in a Clerk organization?",
			options: [
				"org:admin and org:member",
				"owner and guest",
				"root and user",
				"org:boss and org:staff",
			],
		},
		es: {
			prompt: "¿Cuáles son los dos roles por defecto en una organización de Clerk?",
			options: ["org:admin y org:member", "owner y guest", "root y user", "org:boss y org:staff"],
		},
	},
	{
		id: 14,
		correct: 3,
		en: {
			prompt: "Which component lets a user switch their active organization?",
			options: ["<OrgPicker />", "<TeamSelect />", "<WorkspaceMenu />", "<OrganizationSwitcher />"],
		},
		es: {
			prompt: "¿Qué componente permite al usuario cambiar su organización activa?",
			options: ["<OrgPicker />", "<TeamSelect />", "<WorkspaceMenu />", "<OrganizationSwitcher />"],
		},
	},
	{
		id: 15,
		correct: 1,
		en: {
			prompt: "In Clerk's architecture, what does FAPI stand for?",
			options: ["Fast API", "Frontend API", "Federated API", "Fallback API"],
		},
		es: {
			prompt: "En la arquitectura de Clerk, ¿qué significa FAPI?",
			options: ["Fast API", "Frontend API", "Federated API", "Fallback API"],
		},
	},
	{
		id: 16,
		correct: 2,
		en: {
			prompt: "What is the base URL of Clerk's Backend API?",
			options: [
				"https://backend.clerk.io",
				"https://clerk.dev/api",
				"https://api.clerk.com/v1",
				"https://bapi.clerk.app",
			],
		},
		es: {
			prompt: "¿Cuál es la URL base del Backend API de Clerk?",
			options: [
				"https://backend.clerk.io",
				"https://clerk.dev/api",
				"https://api.clerk.com/v1",
				"https://bapi.clerk.app",
			],
		},
	},
	{
		id: 17,
		correct: 0,
		en: {
			prompt: "How do you customize the look of Clerk's prebuilt components?",
			options: [
				"The appearance prop",
				"Editing their source",
				"A theme.json file",
				"Only with !important CSS",
			],
		},
		es: {
			prompt: "¿Cómo personalizas el estilo de los componentes prediseñados de Clerk?",
			options: [
				"Con la prop appearance",
				"Editando su código fuente",
				"Con un archivo theme.json",
				"Solo con CSS !important",
			],
		},
	},
	{
		id: 18,
		correct: 1,
		en: {
			prompt: "Where does <ClerkProvider> belong in a Next.js app?",
			options: [
				"Inside every page component",
				"Wrapping the app in the root layout",
				"In middleware.ts",
				"In next.config.ts",
			],
		},
		es: {
			prompt: "¿Dónde va <ClerkProvider> en una app de Next.js?",
			options: [
				"Dentro de cada página",
				"Envolviendo la app en el layout raíz",
				"En middleware.ts",
				"En next.config.ts",
			],
		},
	},
	{
		id: 19,
		correct: 3,
		en: {
			prompt: "What are JWT templates for?",
			options: [
				"Styling emails",
				"Writing unit tests",
				"Compressing tokens",
				"Minting tokens with custom claims for third-party services",
			],
		},
		es: {
			prompt: "¿Para qué sirven los JWT templates?",
			options: [
				"Dar estilo a los correos",
				"Escribir pruebas unitarias",
				"Comprimir tokens",
				"Generar tokens con claims personalizados para servicios de terceros",
			],
		},
	},
	{
		id: 20,
		correct: 0,
		en: {
			prompt: "Which hook exposes getToken() to fetch the session token?",
			options: ["useAuth()", "useToken()", "useJwt()", "useCredentials()"],
		},
		es: {
			prompt: "¿Qué hook expone getToken() para obtener el session token?",
			options: ["useAuth()", "useToken()", "useJwt()", "useCredentials()"],
		},
	},
	{
		id: 21,
		correct: 3,
		en: {
			prompt: "Which sign-in methods does Clerk support?",
			options: [
				"Only email and password",
				"Only social OAuth",
				"Only magic links",
				"All of these: passwords, email codes, OAuth, and passkeys",
			],
		},
		es: {
			prompt: "¿Qué métodos de inicio de sesión soporta Clerk?",
			options: [
				"Solo email y contraseña",
				"Solo OAuth con redes sociales",
				"Solo magic links",
				"Todos: contraseñas, códigos por email, OAuth y passkeys",
			],
		},
	},
	{
		id: 22,
		correct: 2,
		en: {
			prompt: "In clerkMiddleware(), what is the default protection for routes?",
			options: [
				"All routes require sign-in",
				"Only /api routes are protected",
				"All routes are public until you opt in to protection",
				"It blocks everything until configured",
			],
		},
		es: {
			prompt: "En clerkMiddleware(), ¿cuál es la protección por defecto de las rutas?",
			options: [
				"Todas las rutas requieren sesión",
				"Solo las rutas /api están protegidas",
				"Todas las rutas son públicas hasta que actives la protección",
				"Bloquea todo hasta configurarlo",
			],
		},
	},
	{
		id: 23,
		correct: 1,
		en: {
			prompt: "Passkey authentication in Clerk is built on which standard?",
			options: ["OAuth 1.0", "WebAuthn", "SAML 2.0", "Kerberos"],
		},
		es: {
			prompt: "La autenticación con passkeys en Clerk se basa en ¿qué estándar?",
			options: ["OAuth 1.0", "WebAuthn", "SAML 2.0", "Kerberos"],
		},
	},
	{
		id: 24,
		correct: 0,
		en: {
			prompt: "Where do you find your instance's API keys?",
			options: [
				"The Clerk Dashboard",
				"An email sent at signup",
				"The browser console",
				"The npm registry",
			],
		},
		es: {
			prompt: "¿Dónde encuentras las API keys de tu instancia?",
			options: [
				"En el Dashboard de Clerk",
				"En un correo al registrarte",
				"En la consola del navegador",
				"En el registro de npm",
			],
		},
	},
	{
		id: 25,
		correct: 2,
		en: {
			prompt: "What powers Clerk's bot protection on sign-up?",
			options: [
				"reCAPTCHA v2 checkboxes",
				"SMS verification only",
				"Cloudflare Turnstile",
				"IP bans",
			],
		},
		es: {
			prompt: "¿Qué tecnología usa la protección contra bots de Clerk en el registro?",
			options: [
				"Casillas de reCAPTCHA v2",
				"Solo verificación por SMS",
				"Cloudflare Turnstile",
				"Bloqueos de IP",
			],
		},
	},
	{
		id: 26,
		correct: 1,
		en: {
			prompt: "What are the useSignIn() and useSignUp() hooks for?",
			options: [
				"Analytics tracking",
				"Building fully custom auth flows",
				"Prefetching avatars",
				"Rotating API keys",
			],
		},
		es: {
			prompt: "¿Para qué sirven los hooks useSignIn() y useSignUp()?",
			options: [
				"Rastrear analíticas",
				"Construir flujos de autenticación totalmente personalizados",
				"Precargar avatares",
				"Rotar API keys",
			],
		},
	},
	{
		id: 27,
		correct: 3,
		en: {
			prompt: "Clerk's user impersonation feature lets you…",
			options: [
				"Clone user accounts",
				"Send emails as any user",
				"Change a user's password silently",
				"Sign in as one of your users to debug their experience",
			],
		},
		es: {
			prompt: "La función de impersonación de usuarios de Clerk te permite…",
			options: [
				"Clonar cuentas de usuario",
				"Enviar correos como cualquier usuario",
				"Cambiar contraseñas en silencio",
				"Iniciar sesión como uno de tus usuarios para depurar su experiencia",
			],
		},
	},
	{
		id: 28,
		correct: 0,
		en: {
			prompt: "SAML single sign-on in Clerk is configured through what?",
			options: ["Enterprise connections", "JWT templates", "The appearance prop", "Webhooks"],
		},
		es: {
			prompt: "El single sign-on con SAML en Clerk se configura mediante…",
			options: ["Enterprise connections", "JWT templates", "La prop appearance", "Webhooks"],
		},
	},
	{
		id: 29,
		correct: 2,
		en: {
			prompt: "Which two environment variables configure Clerk in Next.js?",
			options: [
				"CLERK_ID and CLERK_TOKEN",
				"AUTH_KEY and AUTH_SECRET",
				"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY",
				"CLERK_URL and CLERK_PASSWORD",
			],
		},
		es: {
			prompt: "¿Qué dos variables de entorno configuran Clerk en Next.js?",
			options: [
				"CLERK_ID y CLERK_TOKEN",
				"AUTH_KEY y AUTH_SECRET",
				"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY y CLERK_SECRET_KEY",
				"CLERK_URL y CLERK_PASSWORD",
			],
		},
	},
	{
		id: 30,
		correct: 1,
		en: {
			prompt: "What does Clerk's multi-session support mean?",
			options: [
				"One account on many tabs",
				"Several accounts signed in at once, with instant switching",
				"Sessions that never expire",
				"Sharing a session between users",
			],
		},
		es: {
			prompt: "¿Qué significa el soporte multi-sesión de Clerk?",
			options: [
				"Una cuenta en muchas pestañas",
				"Varias cuentas con sesión a la vez, con cambio instantáneo",
				"Sesiones que nunca expiran",
				"Compartir una sesión entre usuarios",
			],
		},
	},
	{
		id: 31,
		correct: 0,
		en: {
			prompt: "What does the <Protect> component do?",
			options: [
				"Renders children only if the user has a given role or permission",
				"Encrypts form fields",
				"Blocks bots from a page",
				"Hides the page from search engines",
			],
		},
		es: {
			prompt: "¿Qué hace el componente <Protect>?",
			options: [
				"Renderiza su contenido solo si el usuario tiene cierto rol o permiso",
				"Encripta campos de formularios",
				"Bloquea bots en una página",
				"Oculta la página de los buscadores",
			],
		},
	},
	{
		id: 32,
		correct: 3,
		en: {
			prompt: "What is Clerk Elements?",
			options: [
				"A chemistry-themed UI kit",
				"Clerk's design tokens",
				"A charting library",
				"Unstyled primitives for building custom auth UIs",
			],
		},
		es: {
			prompt: "¿Qué es Clerk Elements?",
			options: [
				"Un kit de UI con tema de química",
				"Los design tokens de Clerk",
				"Una librería de gráficas",
				"Primitivas sin estilos para construir UIs de autenticación personalizadas",
			],
		},
	},
	{
		id: 33,
		correct: 1,
		en: {
			prompt: "What does the <Waitlist /> component do?",
			options: [
				"Queues API requests",
				"Collects signups while access to your app is restricted",
				"Shows server status",
				"Delays page rendering",
			],
		},
		es: {
			prompt: "¿Qué hace el componente <Waitlist />?",
			options: [
				"Encola solicitudes al API",
				"Recolecta registros mientras el acceso a tu app está restringido",
				"Muestra el estado del servidor",
				"Retrasa el renderizado de la página",
			],
		},
	},
	{
		id: 34,
		correct: 2,
		en: {
			prompt: "Inside clerkMiddleware(), which helper defines which routes to match?",
			options: ["defineRoutes()", "matchPath()", "createRouteMatcher()", "routeFilter()"],
		},
		es: {
			prompt: "Dentro de clerkMiddleware(), ¿qué helper define qué rutas coinciden?",
			options: ["defineRoutes()", "matchPath()", "createRouteMatcher()", "routeFilter()"],
		},
	},
	{
		id: 35,
		correct: 0,
		en: {
			prompt: "What does MFA stand for?",
			options: [
				"Multi-factor authentication",
				"Managed frontend access",
				"Middleware for APIs",
				"Multiple failed attempts",
			],
		},
		es: {
			prompt: "¿Qué significa MFA?",
			options: [
				"Autenticación multifactor",
				"Acceso frontend gestionado",
				"Middleware para APIs",
				"Múltiples intentos fallidos",
			],
		},
	},
	{
		id: 36,
		correct: 1,
		en: {
			prompt: "A development instance key starts with which prefix?",
			options: ["pk_dev_", "pk_test_", "dev_pk_", "pk_sandbox_"],
		},
		es: {
			prompt: "¿Con qué prefijo empieza una key de una instancia de desarrollo?",
			options: ["pk_dev_", "pk_test_", "dev_pk_", "pk_sandbox_"],
		},
	},
];

export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = QUESTION_BANK.length;
