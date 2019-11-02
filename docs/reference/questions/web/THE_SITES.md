---
title: TheSites
parent: Ref:Questions
---

# TheSites

Get the title or the url of a site.

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods

| name        | parameter | description     |
| :---        | :---      | :---            |
| `.url()*`   | -         | the sites url   |
| `.title()*` | -         | the sites title |

## Example

Use the `See` interaction to check the sites title.

````typescript
john.attemptsTo(
    See.if(TheSites.title())
        .is(Expected.toBe(`my sites title`))
)
````

Save the elements enable status to a variable.

```typescript
const myUrl = await TheSites.url().answerdBy(john)
```