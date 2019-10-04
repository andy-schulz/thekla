---
title: Text
parent: Ref:Questions
---

# Text

Get the content / text of element.

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods

| name     | parameter           | description                      |
| :---     | :---                | :---                             |
| `.of()*` | element: SppElement | the element to get the text from |

## Example

Use the `See` interaction to check for a text

````typescript
john.attemptsTo(
    See.if(Text.of(element))
        .is(Expected.toBe(`MyText`))
)
````

Save the text to a variable.

```typescript
const text = await Text.of(element).answerdBy(john)
```