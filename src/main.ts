// Entry point. Wires the canvas, the game loop, the timer, and the HUD.
//
// This file now implements Shard Dominion: Chat Version - a vertical slice
// RTS prototype with harvesting Aether Shards and Planet Agitation.

import { GameScene } from "./scenes/GameScene";
import { createHUD } from "speedrungames-sdk/hud";
import { createStorage } from "speedrungames-sdk/storage";
import "./styles.css";

// Must match game.manifest.json#slug. `pnpm new:game` substitutes this.
const SLUG: string = "shard-dominion-chat";
const UNSET_SLUG = "__SLUG__";

const root = document.getElementById("app");
if (!root) throw Error("#app element missing in index.html");

const canvas = document.createElement("canvas");
canvas.className = "game-canvas";
root.appendChild(canvas);

const hud = createHUD(root);
const storage = createStorage(SLUG === UNSET_SLUG ? "template-demo" : SLUG);

const pb = storage.getPB();
hud.setPB(pb?.ms ?? null);
hud.setStatus("Click anywhere to start");

// ─── Game Scene (Replace demo) ─────────────────────────────────────────────
// ─── Game Scene (Replace demo) ─────────────────────────────────────────────
new GameScene(canvas);

// Game loop is started in GameScene constructor

// ─── End game scene ───────────────────────────────────────────────────────
