---
title: Working Principles
has_children: true
nav_order: 1
---
# Working Principles

## Overview
![Overview](../res/images/screenplay_overview.png)

## Interactions

Interactions are the basic elements provided by an ability.
 e.g.
 - [`Sleep`](../reference/interactions/general#sleep) for an amount of time
 - `Click` on an element
 - `Enter` a text into a text field or area
 - `See` if a `Question` matches a specified state
 - `Post` a rest request
 
 There are interactions which execute user actions on an device like `Click` or `Enter`
 and there are interactions which query the status of an device like `See`
 
 ## Tasks
 
 Tasks are the building blocks of work flows an consists of:
 - interactions and
 - tasks
 
 ## Questions
 
 a question retrieves the state of a device attribute or element.
 `Text` for example is a Question which retrieves the text of a web element.
 
 for example:
 ```typescript
const logan: Actor = Actor.named(`Logan`);

logan.attemptsTo(
    See.if(Text.of(MY_ELEMENT))
        .is(Expected.toBe(`the text of the element`))
)
```