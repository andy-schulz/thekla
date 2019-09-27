---
title: OperateOnMobileDevice
parent: Ref:Abilities
---

# OperateOnMobileDevice

Acors ability to operate an app on a mobile device.

## Methods

| name        | parameter                 | description                                     |
| :---        | :---                      | :---                                            |
| `.using()`* | client: Client | returns an ability instance with                |

## Example

Pass the ability to an actor.

```typescript
const jonathan = Actor.named("Jonathan");
jonathan.can(OperateOnMobileDevice.using(aClient));
