# Weather App

A course submission: a web development assignment that builds a weather app with Vue 3 and Bootstrap 5.
The app shows the current weather and a five-card forecast for the browser's location, or for Vienna when location access fails or times out.

Live demo: https://weatherapp-vue.thomasscheiber.com

The app has no bundler. `index.html` loads Vue and Bootstrap from `assets/`, a folder that only exists in `dist/`. `npm run build` copies those files from `node_modules` into `dist/`.

## What the app does

- Asks the browser for its position with an 8-second timeout. Without a position it uses Vienna (48.208174, 16.373819).
- Reverse-geocodes the position with the geocoder of the Google Maps JavaScript API and shows the first `formatted_address`.
- Requests current weather and a 3-hour forecast from OpenWeatherMap, in metric units and German.
- Shows the temperature, the weather icon and description, and the date and time from the weather timestamp.
- Shows five forecast cards from forecast entries 0, 8, 16, 24 and 32, which are 24 hours apart.

## Stack

- Vue 3.5.45 (`vue.global.prod.js`) and Bootstrap 5.3.9, installed from npm and pinned exactly in `package.json`.
- Plain HTML, CSS and JavaScript in `index.html`, `style.css` and `script.js`.
- Node.js scripts for config generation, the build, validation and tests. The `engines` field requires Node.js 22.23.2 or later.

## Setup

1. Install the locked dependencies: `npm ci`
2. Create `.env` in the repository root with both keys. Get them from https://openweathermap.org/api and https://console.cloud.google.com/ (enable the Maps JavaScript API and the Geocoding API):

   ```env
   OPENWEATHER_API_KEY=your_openweathermap_key
   GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

3. Build: `npm run build`. This generates `config.js` and writes `dist/`.
4. Serve `dist/` with any static server, for example `npx serve dist`.

## How the API keys are supplied

`generate-config.js` reads the keys in this order:

1. If `CI` is `true`, both values are the placeholder `ci-placeholder`.
2. If `OPENWEATHER_API_KEY` and `GOOGLE_MAPS_API_KEY` are both set in the environment, it uses those.
3. Otherwise it reads `.env`. If `.env` is missing, it exits with code 1.

Values that contain `your_` or `here` are rejected. `npm run build` runs this step, so set the keys before you build.
`config.example.js` shows the shape of `CONFIG`, but no script reads it. Running `generate-config` overwrites a hand-written `config.js`.

The keys reach the browser. The page loads `config.js`. The OpenWeatherMap requests carry their key in the URL (`appid=`), and `script.js` loads the Maps JavaScript API with the Google key (`key=`).
Anyone who opens the page can read both keys, so limit what they can do:

- Restrict the Google key to the address of your site and to the two Google APIs named above. The page uses the JavaScript library for this reason. The Geocoding web service rejects keys that are restricted to websites.
- OpenWeatherMap keys cannot be restricted. Use a free-tier key that nothing else depends on.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run generate-config` | Writes `config.js` from the environment or `.env`. |
| `npm run build` | Generates `config.js`, checks that installed Vue and Bootstrap match `package.json`, and copies the allowlisted files to `dist/`. |
| `npm run validate` | Checks JavaScript syntax, the lockfile pins, that `index.html` has no external script or stylesheet, and the five forecast slots. |
| `npm test` | Runs the Node test runner on `tests/*.test.mjs`. |

The config tests compare POSIX-style paths, so four of the 22 tests fail on Windows.

## Deployment

- GitHub Pages: `.github/workflows/pages.yml` calls a shared publishing workflow on pushes to `main`, when the repository variable `STATIC_PAGES_ENABLED` is `true`.
  The published page is at https://t-scheiber.github.io/ScheiberVueAppAbgabe/
  The published `config.js` has empty keys, so the page loads without weather data and shows its default values.
- Coolify, for the live demo: the app builds with `npm ci` and `env -u CI npm run build`, and nginx serves `dist/`.
  Nixpacks sets `CI=true` during the build, which would write the placeholder keys, so the build command unsets it.
- Nixpacks: `nixpacks.toml` runs `bun install` and `bun run generate-config`, then serves the repository root.
  The root has no `assets/` folder, so Vue and Bootstrap do not load from that setup. Serve `dist/` instead.

## Tests

`npm test` covers config generation, the built files in `dist/`, and the logic in `script.js` with mocked browser APIs.
The application tests run the script in a VM with stub `fetch` and geolocation, so they do not call the real APIs.
