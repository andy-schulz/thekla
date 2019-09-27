---
title: Sleep
parent: Ref:Interactions
has_children: false
---

# SLEEP

Sleep will pause the interaction execution flow. Only the execution is paused, the generation of the interaction and 
task objects is not interrupted and will be finished first.

## Ability

none

## Methods

| name         | parameter           | description                                           |
| :---         | :---                | :---                                                  |
| `.for()`*    | sleepTime: number   | sleep for the amount of time in ms                    |
| `.because()` | sleepReason: string | reason to use the sleep, will be used in activity log |


In later versions Sleep will only be used in debug mode and will be automatically deactivated during test execution. 
So please be careful when using it.

## Example

```typescript
Josh.attemptsTo(
    Sleep.for(5000)
)
```