---
title: Abilities
has_children: true
nav_order: 30
---

# Abilities

An ability provides specific capabilities to an actor.

e.g.

- [use a browser](docs/features/web_and_mobile/ABILITIES.md)
- [user a mobile device](docs/features/web_and_mobile/ABILITIES.md)
- [use a rest API](docs/features/rest/ABILITIES.md)

````typescript
import {UseAnAbility} from "theoreticalAbilities";
import {Actor} from "@thekla/core";

const abby = Actor.named(`Abby`);
abby.whoCan(UseAnAbility);
````

