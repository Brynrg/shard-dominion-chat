# 11 — Implementation Phases

## Phase A — Repo Repair

Tickets:
- T00 Add canonical docs and AGENTS.md
- T01 Coordinate model
- T02 Single WorldState
- T03 Real economy credits
- T04 Action-driven agitation
- T05 README replacement
- T06 CI/build/typecheck cleanup

Gate:
- harvester moves correctly on grid
- harvest/deposit adds credits
- agitation changes from actions
- build passes

## Phase B — RTS Foundation

Tickets:
- T10 Selection and commands
- T11 Camera pan/zoom
- T12 Fog optimization
- T13 Minimap click/ping
- T14 Build placement grid
- T15 Anchor Lattice
- T16 Power network
- T17 Construction queue

Gate:
- player can build a tiny base and power it

## Phase C — Combat Slice

Tickets:
- T20 health/damage
- T21 weapons/projectiles
- T22 attack-move
- T23 enemy stub AI
- T24 turrets
- T25 engineers/capture
- T26 victory/defeat

Gate:
- player can fight and win/lose a small mission

## Phase D — First Lattice Mission

Tickets:
- T30 mission runtime
- T31 objective tracker
- T32 scripted events
- T33 shard bloom
- T34 worm sign
- T35 First Lattice full mission
- T36 tutorial prompts

Gate:
- complete vertical slice with start, middle, end

## Phase E — Faction Expansion

Tickets:
- T40 data-driven faction definitions
- T41 Vanguard complete roster
- T42 Forge basic roster
- T43 Phantom basic roster
- T44 faction doctrines
- T45 faction UI styling

Gate:
- three factions playable in skirmish at basic level

## Phase F — Skirmish AI

Tickets:
- T50 AI economy
- T51 AI build order
- T52 AI scouting
- T53 AI attack waves
- T54 faction AI personalities
- T55 difficulty levels

Gate:
- skirmish vs AI is replayable

## Phase G — Campaign

Tickets:
- T60 mission select
- T61 briefing/debriefing
- T62 missions 1–3
- T63 missions 4–6
- T64 missions 7–9
- T65 endings
- T66 save/progress

Gate:
- 9-mission campaign playable

## Phase H — Asset/Audio/Polish

Tickets:
- T70 asset import pipeline
- T71 terrain art pass
- T72 building art pass
- T73 unit art pass
- T74 effects pass
- T75 UI skin pass
- T76 sound effects
- T77 music/ambience
- T78 accessibility/readability
- T79 performance optimization

Gate:
- release candidate

## Phase I — Release

Tickets:
- T80 balance pass
- T81 QA checklist
- T82 SpeedrunGames manifest
- T83 Netlify deployment
- T84 release notes
