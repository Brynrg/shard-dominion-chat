# T02 — Single WorldState

## Problem
MovementSystem keeps copied units that diverge from rendered GameState.

## Tasks
- Create or refactor to one central WorldState/GameState
- Systems must mutate the same unit objects or use state update API
- Remove permanent copied unit maps from MovementSystem
- Add stable entity IDs
- Add tests or dev assertions for entity presence

## Acceptance
- movement is visible in renderer
- harvesting sees moved positions
- fog sees moved positions
- unit state does not diverge across systems
