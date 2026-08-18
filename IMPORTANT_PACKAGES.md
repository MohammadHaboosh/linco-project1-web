# Important Packages Used in Linco

This document summarizes the main npm packages that power the Linco web app. Versions shown here are the version ranges currently declared in [`package.json`](./package.json).

## Package map

| Area | Main packages | Purpose in this app |
| --- | --- | --- |
| Application shell | `react`, `react-dom` | Builds and renders the component-based UI, including client rendering and hydration. |
| Navigation | `react-router-dom` | Defines pages, nested layouts, route parameters, redirects, and navigation. |
| Global state | `@reduxjs/toolkit`, `react-redux` | Stores and exposes the authenticated user's global session state. |
| Localization | `i18next`, `react-i18next`, `i18next-browser-languagedetector` | Provides English/Arabic translations, browser language detection, and RTL/LTR switching. |
| Course video | `plyr-react`, `plyr`, `hls.js` | Renders the lesson player and supports adaptive HLS video streams and quality selection. |
| Live classes | `@jitsi/react-sdk` | Embeds authenticated Jitsi-as-a-Service meetings for live learning sessions. |
| Real-time chat | `socket.io-client` | Connects department chat to the backend with automatic reconnection. |
| Chat emojis | `emoji-mart`, `@emoji-mart/data` | Supplies the emoji picker UI, emoji data, and Arabic picker translations. |
| Certificates | `html2canvas`, `jspdf` | Captures certificate markup and exports it as PNG or PDF. |
| UI helpers | `react-icons` | Supplies the icon components used throughout the interface. |
| Styling/build | `tailwindcss`, `@tailwindcss/vite`, `vite`, `@vitejs/plugin-react` | Provides styling utilities, development tooling, and production bundling. |

## Core application packages

### React - `react` and `react-dom` (`^19.2.6`)

React is the foundation of the UI. The app uses functional components and hooks throughout `src/`. `react-dom` starts or hydrates the application in [`src/main.jsx`](./src/main.jsx), allowing the prerendered landing page to be hydrated while other entry points can be rendered normally.

### React Router - `react-router-dom` (`^7.17.0`)

React Router owns client-side navigation. [`src/routes/index.jsx`](./src/routes/index.jsx) creates the browser router and connects page components to nested layouts. Components also use router APIs such as `Link`, `Navigate`, `Outlet`, `useNavigate`, `useParams`, and `useSearchParams`.

This is a central dependency: authentication, dashboards, departments, courses, payments, live rooms, and error pages all rely on it.

### Redux - `@reduxjs/toolkit` (`^2.12.0`) and `react-redux` (`^9.3.0`)

Redux Toolkit configures the store and defines the user slice:

- [`src/store/Store.js`](./src/store/Store.js) creates the application store.
- [`src/features/User/store/userSlice.js`](./src/features/User/store/userSlice.js) stores the user profile and authentication state.
- `react-redux` provides the root `Provider` plus `useSelector` and `useDispatch` hooks.

These packages work as a pair: Redux Toolkit defines state and actions, while React Redux connects that state to React.

### Internationalization

- `i18next` (`^26.3.3`) is the translation engine.
- `react-i18next` (`^17.0.8`) exposes translations through React hooks and components.
- `i18next-browser-languagedetector` (`^8.2.1`) selects a language using browser-side signals.

[`src/i18n.js`](./src/i18n.js) registers English and Arabic catalogs, falls back to English, and updates the document's `lang` and `dir` attributes. This means the localization stack also controls RTL/LTR presentation, not only translated text.

## Feature packages

### Course video - `plyr-react`, `plyr`, and `hls.js`

The course player in [`VideoContent.jsx`](./src/features/Demo/CoursePlayer/components/CourseViewer/VideoContent.jsx) combines three packages:

- `plyr-react` (`^6.0.0`) provides the React player component.
- `plyr` (`^3.8.4`) provides the underlying media player behavior and styles used by the React wrapper.
- `hls.js` (`^1.7.0`) loads `.m3u8` adaptive streams in browsers without native HLS support.

The implementation discovers available stream qualities, connects HLS to the Plyr media element, supports automatic/manual quality selection, and attempts recovery from network or media errors.

### Live sessions - `@jitsi/react-sdk` (`^1.4.4`)

[`LiveRoom.jsx`](./src/features/Demo/Lives/components/LiveRoom/LiveRoom.jsx) uses `JaaSMeeting` to embed live video rooms. The component passes the app ID, room name, JWT, participant details, and meeting configuration obtained from the app's API.

### Department chat - `socket.io-client` (`^4.8.3`)

[`departmentChatSocket.js`](./src/features/Demo/Chats/services/departmentChatSocket.js) creates the real-time chat connection. It connects to the backend's `/departmentChat` namespace with credentials, delayed manual connection, and automatic reconnection.

### Emoji picker - `emoji-mart` and `@emoji-mart/data`

[`EmojiPicker.jsx`](./src/features/Demo/Chats/components/EmojiPicker.jsx) uses:

- `emoji-mart` (`^5.6.0`) for the picker UI.
- `@emoji-mart/data` (`^1.2.1`) for emoji definitions and Arabic translations.

Both packages are dynamically imported only when the picker opens, which keeps them out of the initial page execution path.

### Certificate downloads - `html2canvas` and `jspdf`

[`CertificateCard.jsx`](./src/features/Demo/Certificates/components/CertificateCard.jsx) uses `html2canvas` (`^1.4.1`) to render a certificate DOM element to a canvas. It can download that canvas directly as a PNG or pass it to `jspdf` (`^4.2.1`) to produce an A4 landscape PDF.

### Icons - `react-icons` (`^5.6.0`)

The UI imports icon components primarily from the Ionicons 5 set (`react-icons/io5`), with some brand icons from other included sets. Vite places this package in its own production chunk because it is used widely across the app.

## Styling and build tooling

### Tailwind CSS - `tailwindcss` and `@tailwindcss/vite` (`^4.3.0`)

The Tailwind Vite plugin is registered in [`vite.config.js`](./vite.config.js), and [`src/index.css`](./src/index.css) imports Tailwind and defines the Linco theme tokens. The app also makes extensive use of CSS Modules (`*.module.css`) for feature and component styles; CSS Modules are handled directly by Vite and do not require another package.

### Vite - `vite` (`^8.0.12`) and `@vitejs/plugin-react` (`^6.0.1`)

Vite runs the development server and production builds. The React plugin handles JSX and React development behavior. The build configuration also defines chunks for the React/Redux/router core and for icons. The production script builds the client, builds the server-side prerender entry, and then prerenders the landing page.

### ESLint

The lint setup in [`eslint.config.js`](./eslint.config.js) uses:

- `eslint` and `@eslint/js` for the base JavaScript rules.
- `eslint-plugin-react-hooks` for React hook correctness.
- `eslint-plugin-react-refresh` for safe Fast Refresh exports.
- `eslint-plugin-i18next` to warn about untranslated UI strings.
- `globals` to declare browser globals.

### Translation extraction - `i18next-parser` (`^9.0.2`)

`npm run extract-i18n` scans JavaScript and JSX files and updates the English and Arabic translation catalogs according to [`i18next-parser.config.js`](./i18next-parser.config.js).

### React type packages

`@types/react` and `@types/react-dom` provide editor and tooling metadata. The app currently uses JavaScript/JSX rather than TypeScript, but these packages still improve JSX-aware editor support.

## Dependency notes

- `plyr-react` and `plyr`, the three i18n packages, Redux Toolkit and React Redux, and Emoji Mart with its data package are intentional package pairs/groups. Review their compatibility together when upgrading.
- `react-loading-skeleton` (`^3.5.0`) is declared as a runtime dependency but currently has no direct reference under `src/`. Confirm that it is not reserved for near-term work before removing it.
- `package-lock.json` is committed, so use npm and commit lockfile changes when dependencies are added or upgraded.

## Common commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run extract-i18n
```
