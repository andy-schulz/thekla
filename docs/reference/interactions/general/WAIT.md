---
title: Wait
parent: Ref:Interactions
has_children: false
---

# Wait

Wait for an element to change its state. Right now you can wait until the element
- is / is not visible
- is / is not enabled

To specify the desired state the [`UntilElementCondition`](../../conditions/UNTIL_ELEMENT_CONDITION.md) condition shall be used.

## Ability

none

## Methods

| name            | parameter                        | description                                               |
| :---            | :---                             | :---                                                      |
| `.for()`*      | element: SppElement              | the element it should be waited for (presence or absence) |
| `.andCheck()` | condition: UntilElementCondition | the state the element should have                         |

## Example

```typescript
Josh.attemptsTo(
    Wait
        .for(Googles.INPUT_FIELD)
        .andCheck(UntilElement.is.visible)
)
```