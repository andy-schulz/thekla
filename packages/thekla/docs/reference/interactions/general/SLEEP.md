---
title: Sleep
parent: Interactions
grand_parent: Reference
has_children: false
---

# SLEEP

Sleep will pause the interaction execution flow. Only the execution is paused, the generation of the interaction and 
task objects is not interrupted and will be finished first.

## Ability

none

## Methods

| name  | parameter    | description                        |
| :---  | :---         | :---                               |
| for() | time: number | sleep for the amount of time in ms |


In later versions Sleep will only be used in debug mode and will be automatically deactivated during test execution. 
So please be careful when using it.

## Example

```typescript
Josh.attemptsTo(
    Sleep.for(5000)
)
```