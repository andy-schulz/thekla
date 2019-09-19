---
title: See
parent: Interactions
grand_parent: Reference
has_children: false
---

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

> See [Questions](../../QUESTIONS.md).

The `Matcher` is a function of type `(answer: <TYPE>) => boolean)`.
You can provide you own function or choose one provided by see `Expected` module.

> See [Matcher](../../MATCHER.md).

## Ability

none

## Methods

| name           | parameter                                | description                                                                               |
| :---           | :---                                     | :---                                                                                      |
| `.if()`*       | question: Question                       | extract                                                                                   |
| `.is()`        | matcher: (value: <GENERIC>) => boolean)  | verify that the Question passed in `if()` fulfills the function                           |
| `.repeatFor()` | maxIterations: number,  interval: number | repeat until check is `true` for `maxIterations` and wait for `intervall` between retries |
| `.then()`      | activities: Activity[]                   | if check is `true` execute the following activites                                        |
| `.otherwise()` | activities: Activity[]                   | if check is `false` execute the following activities                                      |

## Example

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