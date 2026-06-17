# Test and Release Gates

## Every ticket

- typecheck;
- build;
- relative-path lint;
- Playwright;
- no console errors;
- logic tests;
- screenshot/video where visible;
- status update.

## Required automated tests

- coordinate conversion;
- screen/world conversion;
- path avoids blocked tile;
- path cost preference;
- fog reveal;
- fog explored persistence;
- finite resource depletion;
- cargo deposit;
- credits only on deposit;
- placement validity;
- footprint collision;
- power deficit stages;
- queue/refund;
- armor matrix;
- projectile impact;
- capture;
- mission objective;
- save/load;
- agitation threshold;
- event cooldown;
- AI no-hidden-vision rule.

## Vertical slice release gate

A fresh player can:

- read the map;
- select;
- move;
- harvest;
- deposit;
- place lattice;
- build power;
- build turret;
- defend raid;
- observe bloom;
- win or lose;
- understand the outcome.

## Full release gate

- 9 campaign missions;
- 4 skirmish maps;
- 3 factions;
- AI difficulties;
- save/progress;
- settings;
- final art/audio;
- no placeholder UI;
- all browsers;
- no critical console errors;
- stable 30-minute session;
- asset ledger complete;
- final IP review complete.
