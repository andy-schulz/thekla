---
title: Abilities
has_children: true
nav_order: 30
---

# Abilities

An ability provides specific capabilities to an actor.

e.g.

- [use a browser](../reference/web_and_mobile/ABILITIES.md)
- [user a mobile device](../reference/web_and_mobile/ABILITIES.md)
- [use a rest API](../reference/rest/ABILITIES.md)

````typescript
import {UseAnAbility} from "theoreticalAbilities";
import {Actor} from "@thekla/core";

const abby = Actor.named(`Abby`);
abby.whoCan(UseAnAbility);
````

