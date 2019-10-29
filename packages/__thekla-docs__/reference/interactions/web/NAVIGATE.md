---
title: Navigate
parent: Ref:Interactions
has_children: false
---

# Navigate

Load the an URL in the browser.

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods

| name     | parameter   | description             |
| :---     | :---        | :---                    |
| `.to()`* | url: string | browse to the given url |

## Example

```typescript
Josh.attemptsTo(
    Navigate
        .to("https://google.com")
)
```