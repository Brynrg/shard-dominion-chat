# AI Specification

## Difficulty levels

### Scout
- slower reaction;
- lower economy efficiency;
- no advanced planet exploitation;
- limited focus fire;
- longer attack intervals.

### Commander
- standard economy;
- counters basic composition;
- protects harvesters;
- uses mixed attacks;
- reacts to planet events.

### Dominion
- efficient economy;
- adaptive composition;
- multi-pronged raids;
- retreats damaged units;
- uses planet systems offensively;
- no cheating vision.

## AI layers

### Strategic

- choose build order;
- expand;
- tech;
- select composition;
- choose attack timing;
- defend economy;
- react to player strategy.

### Tactical

- target priority;
- formation;
- focus fire;
- retreat;
- protect artillery;
- avoid dangerous terrain;
- pursue/hold.

### Economic

- assign harvesters;
- replace losses;
- choose fields;
- build storage;
- respond to depleted resources.

### Planet-aware

- avoid high-risk regions;
- exploit blooms;
- lure worms;
- pause air during storms;
- reroute around collapse.

## AI data

Use faction personality parameters:

- aggression;
- greed;
- caution;
- tech preference;
- raid preference;
- defense preference;
- planet-risk tolerance.

## AI fairness

Prohibited:

- reading hidden player units;
- instant reactions;
- free units;
- free credits;
- zero build time;
- ignoring fog.

Difficulty should use better decisions and modest parameter differences, not hidden omniscience.
