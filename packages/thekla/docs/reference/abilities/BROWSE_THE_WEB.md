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

## Creating a browser

To create a browser object which can be assigned to the ability, call the helper object `RunningBrowser` as follows:

````typescript
import {RunningBrowser, TheklaGlobal} from "thekla";
declare const thekla: TheklaGlobal;

const aBrowser = RunningBrowser
        .startedOn(thekla.serverConfig())
        .withCapabilities(thekla.capabilities());
````

The configuration can be passed directly or can be used from the configuration file as it is done here.

> See the [Configuration](../CONFIGURATION.md) section for more details

## Example

Pass the ability to actor `Jonathan`.

```typescript
const jonathan = Actor.named("Jonathan");

jonathan.can(BrowseTheWeb.using(aBrowser));
```

Now the actor is able to execute activities.

````typescript
jonathan.attemptsTo(
    Click.on(element)
)
````

> Find the details to locate an element in section [Element](../elements/ELEMENT.md).