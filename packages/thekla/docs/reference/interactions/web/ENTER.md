---
title: Enter
parent: Interactions
grand_parent: Reference
has_children: false
---

# Enter

Enters a value into a text field or area. 
To upload a file you are entering the file location into the uploads input field.

If the field contains already a value, the new value will be appended.

## Ability

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods

| T    | name                          | parameter           | description                                                                                      |
| :--- | :---                          | :---                | :---                                                                                             |
| s    | ` .value()`                   | value: string       | the string value which will be entered into the element                                          |
| m    | ` .into()`                    | element: SppElement | the input field or text area the value shall be entered into                                     |
| m    | ` .butClearsTheFieldBefore()` | -                   | remove all text from the field before entering the new value, otherwise the value will be append |

## Example

Enter new text into Googles search field.

```typescript
Josh.attemptsTo(
    Enter
        .value("Software Test Automation")
        .into(Googles.SEARCH_FIELD)
)
```

Clear the field before entering a new value.

```typescript
Josh.attemptsTo(
    Enter
        .value("Software Test Automation extreme")
        .into(Googles.SEARCH_FIELD)
        .butClearsTheFieldBefore()
)
```