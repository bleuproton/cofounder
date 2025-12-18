# Theia IDE integration

Spin up an in-browser IDE that mounts the generated Cofounder apps and exposes the same dev ports used by Vite + the backend.

## Prereqs
- Docker + docker compose
- Ports 3000 (Theia UI), 5173/5174 (Vite) free on the host

## Run
```sh
cd ops/theia
docker compose up --build
```
Then open http://localhost:3000. The repository is mounted at `/home/project` inside the container.

## Using with generated apps
1. Generate or open an app under `apps/{YourApp}`.
2. Run the task generator to scaffold Theia tasks per app:
   ```sh
   node scripts/generate-theia-tasks.js
   ```
3. In Theia, open the folder for your app. Use the Tasks panel to run:
   - **npm install (app)** — installs dependencies
   - **npm run dev (app)** — starts backend + Vite concurrently
4. Vite will be available on http://localhost:5173 (and 5174 if Vite picks an alternate port).

## Notes
- The image installs Node.js 22 via `nvm` so Theia terminals match the required runtime for Cofounder.
- The repo is mounted read/write; your edits in Theia are immediately reflected on the host.
- If you have multiple apps, re-run the task generator any time a new app directory appears.
