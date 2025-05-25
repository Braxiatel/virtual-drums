🥁 Virtual Drumming Game

A web-based virtual drum kit + rhythm game that lets anyone practice simple beats right in the browser.

⸻

Table of Contents
	1.	Project Vision
	2.	Gameplay Features
	3.	Pages & Navigation
	4.	Default Key-Bindings
	5.	Tech Stack
	6.	Folder Structure
	7.	Local Setup
	8.	Developing & Debugging
	9.	Adding New Sounds
	10.	Deployment
	11.	Roadmap
	12.	Contributing
	13.	License

⸻

1. Project Vision
	•	Create an accessible practice tool where beginners can tap out grooves without owning drums.
	•	Combine a clickable / tappable on-screen kit with classic Guitar Hero style "note highway" gameplay to teach timing.
	•	Keep latency minimal, assets lightweight and UI intuitive so the game works on desktop and mobile.

2. Gameplay Features

Feature	MVP	Notes
Clickable drum kit	✅	Visual kit with labels + animated hit states.
Keyboard play	✅	Customisable bindings (saved to localStorage).
Audio playback	✅	Pre-loaded WAV samples for: kick, snare, four toms, ride, crash, closed HH, open HH.
Beat mode	✅	"BEATS" menu item launches a track. • 3-2-1 countdown. • Scrolling note highway (future: BPM adaptable). • Hit / Miss feedback rings. • Final score screen.
Custom BPM	✅	Adjustable tempo (30-200 BPM) for each track individually.
Multiple tracks	✅	4 difficulty levels: Country Rock (Beginner), Basic Rock (Intermediate), Heavy Rock (Advanced), Funk Rock (Master).
Settings page	✅	Remap keys, mute/solo voices, latency calibration (future).
Mobile multi-touch	⬜️	Optimise hit zones + CSS resize.
Social share	⬜️	Share final score / challenge link.

Legend: ✅ = included in this release · ⬜️ = planned

3. Pages & Navigation

/                → Main kit page (index.tsx)
    └─ Menu (overlay)
          ├─ Beats  → /play (starts first track immediately for now)
          └─ Settings → /settings
/play           → Rhythm highway & score view
/settings       → Key-binding editor + audio prefs

Navigation handled with Next.js Router; simple animated page transition using Framer Motion.

4. Default Key-Bindings

Drum	Key
Kick	F
Snare	J
High-Tom	R
Mid-Tom	T
Floor-Tom	G
Closed Hi-Hat	H
Open Hi-Hat	Y
Crash Cymbal	U
Ride Cymbal	K

Users can remap any key on /settings; layout saved in localStorage.

5. Tech Stack

Layer	Choice	Rationale
UI + Routing	Next.js 14 w/ App Router	Fast dev, file-based routing, API routes double as minimal backend for high-scores later.
Language	TypeScript	Safety + editor autocompletion.
Styling	Tailwind CSS	Utility-first, responsive kit layout in a few classes.
State Mgmt	Zustand	Tiny 1 KB store for key-bindings & global mute.
Animation	Framer Motion	Smooth hit flashes & menu transitions.
Audio	Tone.js or Howler.js + Web Audio API	Handles sample loading, low-latency triggering, volume & mute.
Game Loop	requestAnimationFrame + custom timing util	Keeps gameplay decoupled from React render.
Testing	Vitest + React Testing Library	Component & logic tests.
Lint/Format	ESLint + Prettier	Consistent codebase.
CI	GitHub Actions	Lint → test → build on PRs.

Why no separate Express server yet?

Next.js API routes cover our current needs (key-binding persistence is client-side; beat maps are static JSON). A standalone Express server can be added later if real-time multiplayer or database storage is introduced.

6. Folder Structure

virtual-drums/
├─ public/
│   ├─ audio/          # **WAV** samples (≤ 44.1 kHz, mono)
│   └─ images/         # UI icons, logo
├─ src/
│   ├─ app/            # Next.js App Router dirs (layout.tsx etc.)
│   │   ├─ page.tsx    # Main kit
│   │   ├─ play/
│   │   │   └─ page.tsx
│   │   └─ settings/
│   │       └─ page.tsx
│   ├─ components/     # Re-usable UI (DrumPad, NoteHighway, Countdown...)
│   ├─ hooks/          # `useKeyBindings`, `useAudio`
│   ├─ lib/            # Timing helpers, constants
│   ├─ stores/         # Zustand stores
│   └─ styles/         # Tailwind config, globals.css
├─ tests/
│   └─ ...
├─ .github/
│   └─ workflows/ci.yml
├─ next.config.mjs
└─ README.md

7. Local Setup

# 1. Clone and install
npm install

# 2. Dev server
npm dev      # http://localhost:3000

# 3. Lint & test
npm lint
npm test

Node ≥ 20 + pnpm ≥ 9 recommended for optimal performance.

8. Developing & Debugging
	•	Hot Reload – Next.js refreshes on save. Audio hot-reloads without losing state via custom AudioProvider.
	•	Latency – In Chrome open chrome://flags/#enable-experimental-web-platform-features and enable Audio Worklet for lowest latency.
	•	Responsive – Resize browser or run npm run dev:mobile (uses Vite preview + tunneling) to test on phone.

9. Adding New Sounds
	1.	Drop a mono WAV into public/audio (keep names lowercase-kebab).
	2.	Import path in src/lib/samples.ts.
	3.	Update DrumKitConfig (label, default key).
	4.	Add mapping to any existing beat-map JSON if needed.

10. Deployment

### Vercel (Recommended - FREE)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   # or
   vercel --prod
   ```

3. **First-time setup:**
   - Link to your GitHub account
   - Choose project name
   - Select production settings

### Alternative Options:

- **Netlify**: Also free, drag-and-drop deployment
- **GitHub Pages**: Free for public repos (requires static export)
- **Railway**: $5/month, includes database if needed later

### Custom Domain (Optional):
- Add your domain in Vercel dashboard
- Update DNS records as instructed
- Automatic HTTPS included

11. Roadmap

Milestone	Description
v0.2	Multiple difficulty tracks, BPM selector. ✅
v0.3	Mobile vibration feedback, touch drums layout.
v0.4	User high-scores saved to Supabase.
v1.0	Community beat editor & shareable links.

12. Contributing

Pull requests are welcome! Please open an issue first to discuss significant changes.
	1.	Fork → create branch feature/XYZ
	2.	pnpm install
	3.	Write tests & ensure pnpm test passes
	4.	Open PR – the CI will run lint + unit tests.

13. License

This project is released under the MIT License. Drum samples remain the property of their respective creators; see public/audio/README.md for attribution.