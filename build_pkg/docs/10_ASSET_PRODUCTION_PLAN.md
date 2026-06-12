# Shard Dominion — Asset Production Plan

## Required Asset Categories
1. Terrain tiles.
2. Building sprites.
3. Unit sprites.
4. Projectiles/effects.
5. UI panels/icons.
6. Portraits/briefing images.
7. Audio: UI, weapons, ambience, announcers.
8. Marketing capsule art.

## Model-to-Sprite Pipeline
1. Create low-poly 3D source model in Blender.
2. Assign simple material colors by faction.
3. Set orthographic camera at fixed angle.
4. Render 8 directional rotations.
5. Generate sprite sheet and atlas JSON.
6. Import into Phaser animation config.

## Recommended Render Specs
- Infantry: 64x64 frames.
- Light vehicles: 96x96 frames.
- Tanks: 128x128 frames.
- Superheavy units: 192x192 frames.
- Buildings: 128-384px depending footprint.
- Effects: 64-256px frames.

## Blender Automation
Create scripts for:
- Batch rotate object.
- Render frames.
- Pack sprite sheet.
- Export metadata.

## Placeholder Generation
Use simple geometric shapes:
- Vanguard: blue/white triangles and rectangles.
- Forge: red/orange blocks and cylinders.
- Phantom: violet/teal thin shapes.

## Audio Plan
Phase 0:
- UI click.
- Select unit.
- Move command.
- Harvester loop.
- Deposit sound.

V1:
- 20+ UI sounds.
- 30+ weapon sounds.
- 3 faction announcer voice sets.
- 6 ambient loops.
- 6 music tracks.

