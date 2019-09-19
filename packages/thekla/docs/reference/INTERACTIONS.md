---
title: Interactions
parent: Reference
has_children: true
nav_order: 3
---
# Interactions

Interactions are the basic building blocks of work flows and are bound to an ability.

An example for an interaction is the [`Click`](../reference/interactions/web/CLICK.md) interaction.

An actor can execute an interaction with his `.attemptsTo()` method.

If you want to `Click` on a web page element, you actor needs the `BrowseTheWeb` ability to locate the element and then 
click on it.

```typescript
const bernd = Actor.named(`Bernd`);

bernd.whoCan(BrowseTheWeb.using(aBrowser));

bernd.attemptsTo(
    Click.on(MyElement)
)
```