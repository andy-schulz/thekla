---
title: Interactions
parent: Basic Abilities
has_children: true
nav_order: 10
---

# Basic Interactions
{: .no_toc }

1. TOC
{:toc}

# SEE

The See interaction executes a `Question` and checks if the answer matches a given state. 
e.g.

```typescript
See.if(Text.of(MYELEMENT))
    .is(Expected.toBe(`Total: $123.456`))
```

Possible `Questions` are:
- Text.of(ELEMENT)
- Value.of(ELEMENT)
- Attribute.of(ELEMENT).called(ATTRIBUTE_NAME)
- etc. 

> See [Questions](../../../basics/QUESTIONS.md).

The `Matcher` is a function of type `(answer: <TYPE>) => boolean)`.
You can provide you own function or choose one provided by see `Expected` module.

> See [Matcher](../../../basics/MATCHER.md).

## Ability
{: .no_toc }

none

## Methods
{: .no_toc }

| name           | parameter                                | description                                                                               |
| :---           | :---                                     | :---                                                                                      |
| `.if()`*       | question: Question                       | extract                                                                                   |
| `.is()`        | matcher: (value: <GENERIC>) => boolean)  | verify that the Question passed in `if()` fulfills the function                           |
| `.repeatFor()` | maxIterations: number,  interval: number | repeat until check is `true` for `maxIterations` and wait for `intervall` between retries |
| `.then()`      | activities: Activity[]                   | if check is `true` execute the following activites                                        |
| `.otherwise()` | activities: Activity[]                   | if check is `false` execute the following activities                                      |

## Example
{: .no_toc }

```typescript
Josh.attemptsTo(
    See.if(Text.of(myElement))
        .is(Expected.toBe(`The Text`))
        .repeatFor(5, 5000)
        .then(
            Click.on(mySaveButton))
        .otherwise(
            Click.on(myCancelButton))
```

# SLEEP

Sleep will pause the interaction execution flow. Only the execution is paused, the generation of the interaction and 
task objects is not interrupted and will be finished first.

## Ability
{: .no_toc }

none

## Methods
{: .no_toc }

| name         | parameter           | description                                           |
| :---         | :---                | :---                                                  |
| `.for()`*    | sleepTime: number   | sleep for the amount of time in ms                    |
| `.because()` | sleepReason: string | reason to use the sleep, will be used in activity log |


In later versions Sleep will only be used in debug mode and will be automatically deactivated during test execution. 
So please be careful when using it.

## Example
{: .no_toc }

```typescript
Josh.attemptsTo(
    Sleep.for(5000)
)
```

# Wait

Wait for an element to change its state. Right now you can wait until the element
- is / is not visible
- is / is not enabled

To specify the desired state the [`UntilElementCondition`](../../conditions/UNTIL_ELEMENT_CONDITION.md) condition shall be used.

## Ability
{: .no_toc }

none

## Methods
{: .no_toc }

| name            | parameter                        | description                                               |
| :---            | :---                             | :---                                                      |
| `.for()`*      | element: SppElement              | the element it should be waited for (presence or absence) |
| `.andCheck()` | condition: UntilElementCondition | the state the element should have                         |

## Example
{: .no_toc }

```typescript
Josh.attemptsTo(
    Wait
        .for(Googles.INPUT_FIELD)
        .andCheck(UntilElement.is.visible)
)
```