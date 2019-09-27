---
title: BrowseTheWeb
parent: Ref:Abilities
---

# BrowseTheWeb

Acors ability to use a browser and interact with it.

## Methods

| name        | parameter                 | description                      |
| :---        | :---                      | :---                             |
| `.using()`* | browser: Browser / Client | returns an ability instance with |

## Example

Pass the ability to an actor.

```typescript
const jonathan = Actor.named("Jonathan");
jonathan.can(BrowseTheWeb.using(aBrowser));

```