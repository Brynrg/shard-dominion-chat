// Entry point. Wires the canvas, the game loop, and the HUD.
//
// This file now implements Shard Dominion: Chat Version - a vertical slice
// RTS prototype with harvesting Aether Shards and Planet Agitation.

import { GameScene } from "./scenes/GameScene";
import "./styles.css";

const root = document.getElementById("app");
if (!root) throw Error("#app element missing in index.html");

const canvas = document.createElement("canvas");
canvas.className = "game-canvas";
root.appendChild(canvas);

// ─── Game Scene (Replace demo) ─────────────────────────────────────────────
new GameScene(canvas);

// Game loop is started in GameScene constructor

// ─── End game scene ───────────────────────────────────────────────────────
