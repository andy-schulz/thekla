---
title: UntilElementCondition
parent: Conditions
grand_parent: Reference
has_children: false
---

# UntilElementCondition

The UntilElementCondition specifies the state an element can have. Right now 4 states are implemented:

1. is visible
1. is not visible
1. is enabled
1. is not enabled

# Methods and Attributes

| name            | parameter                        | description                                        |
| :---          | :---                             | :---                                                |
| ` .is*`       | element: SppElement              | attribute to specify that the status is present     |
| ` .isNot*`    | condition: UntilElementCondition | attribute to specify that the status is not present |
| ` .visible()` | condition: UntilElementCondition | check for the visibility status                     |
| ` .enabled()` | condition: UntilElementCondition | check for the enabled status                        |

## Example

```typescript
john.attemptsTo(
    Wait.for(MYELEMENT)
        andCheck(UntilElement.is.visible())
)
```

