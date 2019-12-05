---
title: Actor
has_children: true
nav_order: 20
---
# Actor

An actor is a persona or role executing a set of activities against a system. An Actor can be created as follows:

````typescript
const theActor = Actor.named(`the actors name`)
````

To be able to execute those activities, an [ability](ABILITIES.md) is needed. 

For example to interact with a browser the ability [BrowseTheWeb](../reference/web_and_mobile/ABILITIES.md) 
can be assigned to the actor.

````typescript
theActor.whoCan(BrowseTheWeb.using(aBrowser));
````
> browser creation is explained in section [BrowseTheWeb](../reference/abilities/BROWSE_THE_WEB.md)

With the ability assigned the actor is now ready to execute activities:

````typescript
theActor.attemptsTo(
    Click.on(element),
    Enter.value(`my value`).into(inputField)
)
````
