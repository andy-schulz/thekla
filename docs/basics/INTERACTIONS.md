---
title: Interactions
has_children: true
nav_order: 13
---
# Interactions

Interactions are the basic building blocks of work flows and are bound to an ability.

An example for an interaction is the [`Click`](../reference/web_and_mobile/INTERACTIONS.md/#click) interaction.

An actor can execute an interaction with his `.attemptsTo()` method.

If you want to `Click` on a web page element, you actor needs the `BrowseTheWeb` ability to locate the element and then 
click on it.

```typescript
const Bernd = Actor.named(`Bernd`);

Bernd.whoCan(BrowseTheWeb.using(aBrowser));

Bernd.attemptsTo(
    Click.on(MyElement)
)
```