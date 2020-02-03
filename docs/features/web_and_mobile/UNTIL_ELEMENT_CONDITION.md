---
title: Conditions
parent: Web and Mobile Features
has_children: true
nav_order: 10
---

# Web And Mobile Conditions
{: .no_toc }

1. TOC
{:toc}

# UntilElementCondition

The UntilElementCondition specifies the state an element can have. Right now 4 states are implemented:

1. is visible
1. is not visible
1. is enabled
1. is not enabled

# Methods and Attributes

| name         | parameter | description                                         |
| :---         | :---      | :---                                                |
| `.is`*        | -         | attribute to specify that the status is present     |
| `.isNot`*     | -         | attribute to specify that the status is not present |
| `.visible()` | -         | check for the visibility status                     |
| `.enabled()` | -         | check for the enabled status                        |

## Example

```typescript
john.attemptsTo(
    Wait.for(MYELEMENT)
        andCheck(UntilElement.is.visible)
)
```

