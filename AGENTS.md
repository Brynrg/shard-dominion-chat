# AGENTS.md — building a game in this repo

You are iterating on a game that ships to `speedrungames.net/games/<slug>/`.

## How deploy works (read first)

**This repo auto-deploys to the portal on every push to `main`.** You do not
deploy by hand. `.github/workflows/deploy.yml` reads the slug from
`game.manifest.json` and calls the portal's reusable workflow
(`Brynrg/speedrungames/.github/workflows/deploy-game.yml`), which builds, runs
the portal's canonical ingest, and opens an **auto-merging portal PR** that
lands only when CI + the Netlify deploy preview pass.

> ❌ **Never** copy `dist/` into the speedrungames portal yourself
> (`cp -r dist …`), never hand-edit `apps/web/public/games/` in the portal.
> That is exactly the mistake this pipeline prevents — a hand-copied build once
> shipped a "no visible change" deploy. To deploy, **push.** For a manual local
> deploy, run `npm run deploy:portal` (it runs the portal's ingest script — it
> does not copy files).

Requirements for auto-deploy to work:
- `game.manifest.json#slug` is set (not the `__SLUG__` placeholder).
- The repo has the `SPEEDRUNGAMES_TOKEN` secret (set by `pnpm new:game`).

## What you start with

A Vite + TypeScript scaffold consuming [speedrungames-sdk](https://github.com/Brynrg/speedrungames-sdk).

| File | Role |
|---|---|
| `src/main.ts` | Entry. Wires canvas + game loop + timer + HUD + PB storage + leaderboard. **Write your game here.** |
| `src/styles.css` | Theme + canvas styles. |
| `index.html` | Vite entry. Don't add `<script>`s — import from `main.ts`. |
| `game.manifest.json` | Source manifest the portal ingests. **slug/title/description/framework drive the deploy.** |
| `vite.config.ts` | **`base: "./"` is load-bearing** — relative asset URLs survive the `/games/<slug>/` mount. |
| `tests/smoke.spec.ts` | Playwright smoke: built game renders, no console errors. Runs in CI before deploy. |
| `.github/workflows/ci.yml` | Typecheck + build + path lint + smoke on every PR. |
| `.github/workflows/deploy.yml` | Auto-deploy on push to main (calls the portal reusable workflow). |

## Mandatory edits before shipping

1. **`game.manifest.json`** — set `slug`, `title`, `description`, `framework`
   (and `category`, `emoji`, `supportsMobile`). `pnpm new:game` does this for you.
2. **`src/main.ts`** — set `const SLUG` to your slug (enables PB storage +
   leaderboard), then replace the gameplay section with your game.
3. **`index.html`** — update `<title>`.

## Hard rules

1. **Relative asset URLs only.** Source: `./assets/foo.png`. CSS: `url(./foo.png)`.
   Never absolute `/...` paths in HTML/CSS. (`npm run lint:paths` + the portal's
   ingest broken-path scan both enforce this.)
2. **Don't remove `base: "./"`** from `vite.config.ts`.
3. **Keep CI green** — typecheck, build, path lint, smoke must pass, or the
   deploy PR won't auto-merge.
4. **No secrets in the repo.** The bundle ships to every player.
5. **Never deploy by hand into the portal.** Push, or `npm run deploy:portal`.

## Project spec (staged by orchestrator)

The authoritative game spec is the **`build_pkg/`** directory (Shard Dominion
chat-version build package, staged verbatim from the source zip). Entry points:
`build_pkg/README.md` and `build_pkg/docs/00_MASTER_EXECUTION_SPEC.md`; phased
work orders in `build_pkg/agent_tasks/PHASE_0..10`; data schemas in
`build_pkg/schemas/`. Where the package's repo_scaffold conflicts with this
template's deploy contract (relative paths, `base: "./"`, manifest, CI), the
deploy contract above wins. Definition of done: game live and playable at
`https://speedrungames.net/games/shard-dominion-chat/` via push-to-main
auto-deploy.

## Continuation spec v2 (staged by orchestrator 2026-06-13)

The authoritative NEXT-STEP spec is **`build_pkg_v2/`** (ChatGPT "Execution Plan v2",
staged verbatim). Entry: `build_pkg_v2/00_READ_ME_FIRST.md`, then docs/01_CURRENT_REPO_AUDIT,
docs/02_MASTER_BUILD_DIRECTIVE, then execute `build_pkg_v2/tickets/` in numerical order
(T00–T06 architecture repair FIRST — do not add feature layers until those pass — then
T10/T14/T20/T30). Phase gates: typecheck+build+test green after every ticket.

DEPLOY-CONTRACT GUARDRAIL (overrides the package where they conflict): the package says to
"apply repo_patch_files/AGENTS.md + PROJECT_PLAN.md into the repo." You may add PROJECT_PLAN.md,
but DO NOT clobber this repo's deploy contract — keep the template package.json CI scripts
(`build`, `typecheck`, `lint:paths`, `test`), keep `base: "./"` in vite.config, keep relative
asset paths, keep game.manifest.json. CI must stay green or the auto-deploy PR won't merge
(this exact gap broke game 3's deploy). Continuation builds beyond the frozen `first-pass`
tag — the bake-off comparison snapshot is already preserved.
