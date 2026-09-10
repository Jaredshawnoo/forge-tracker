# Forge — Workout & Diet Tracker

A fast, private, offline-friendly workout and diet tracker you can install on your iPhone like a native app. No account, no backend, no ads — everything is stored right on your device.

## Features

**Workouts**
- Log sets, reps, and weight for any exercise, with a built-in 40+ exercise library across Chest/Back/Shoulders/Arms/Legs/Core/Cardio
- Add your own custom exercises
- Save routines (e.g. "Push Day") to start a workout in one tap
- Automatic rest timer after each completed set
- Full workout history with per-exercise personal records (PRs)

**Diet**
- Log meals by Breakfast / Lunch / Dinner / Snacks
- Built-in food library with calories & macros, plus custom food entries
- Daily calorie & macro goals with progress bars
- Water intake tracker
- Browse any past day with the date navigator

**Dashboard**
- Today's calories, macros, water, and workout streak at a glance
- Body weight logging with a 7-entry trend chart

**Everything else**
- Installs to your iPhone home screen as a standalone app (PWA)
- Works fully offline after the first load
- Light / dark / auto theme
- Export/import your data as a JSON backup at any time

## Getting it on GitHub

From inside this `Workout App` folder:

```bash
git init
git add .
git commit -m "Initial commit: Forge workout & diet tracker"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Then in the repo on GitHub: **Settings → Pages → Source → Deploy from branch → `main` / `(root)`**. GitHub will give you a URL like `https://<your-username>.github.io/<your-repo>/`.

## Installing on your iPhone

1. Open your GitHub Pages URL in **Safari** on your iPhone (must be Safari, not Chrome).
2. Tap the **Share** icon (square with an arrow).
3. Tap **Add to Home Screen** → **Add**.
4. Launch it from your home screen — it opens full-screen with no browser bar, and works offline.

## Previewing locally

No install required — just run:

```bash
node serve.js
```

Then open `http://localhost:5173` in a browser.

## Your data

All data lives in your browser's `localStorage`, scoped to the URL you installed from. Nothing is sent anywhere. Since data doesn't sync between devices, use **Settings → Export** to save a backup, and **Settings → Import** to restore it (e.g. after reinstalling or switching phones).

## Tech

Plain HTML, CSS, and JavaScript — no build step, no frameworks, no dependencies. A service worker (`sw.js`) caches the app shell for offline use.
