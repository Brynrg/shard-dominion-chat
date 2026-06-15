# 14 — SpeedrunGames / Netlify Deploy

## Manifest target

`game.manifest.json` should eventually use:

```json
{
  "slug": "shard-dominion",
  "title": "Shard Dominion",
  "description": "A retro-modern sci-fi RTS where harvesting wakes a hostile living planet.",
  "framework": "vite-phaser",
  "category": "strategy",
  "supportsMobile": false,
  "version": "0.1.0",
  "emoji": "🜁",
  "entry": "index.html",
  "buildCommand": "npm run build",
  "repo": "Brynrg/shard-dominion-chat"
}
```

Mobile support should be false until touch controls are intentionally designed.

## Build requirements

- all paths relative
- `vite.config.ts` base should support Netlify static path
- no server requirement for v1
- assets compressed
- no secrets
- no external paid APIs

## Portal entry

Add to speedrungames portal after first playable vertical slice only.

Do not list as a complete game while it is still an architecture prototype.
