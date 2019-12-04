---
title: Interactions
parent: Web and Mobile Abilities
has_children: true
nav_order: 10
---

# Interactions of Web and Mobile Abilities
{: .no_toc }

1. TOC
{:toc}

# Click

Clicks on the given browser element (mobile / desktop) or an app element (mobile). 

> the `Tap` interaction is not implemented, it will follow soon

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods
{: .no_toc }

| name     | parameter           | description              |
| :---     | :---                | :---                     |
| `.on()`* | element: SppElement | the element to click on. |

## Example
{: .no_toc }

```typescript
Josh.attemptsTo(
    Click
        .on(Googles.SEARCH_BUTTON)
)
```

# Drag

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods
{: .no_toc }

| name         | parameter        | description |
| :---         | :---             | :---        |
| `.method()`* | param: PARAMETER | description |

## Example
{: .no_toc }

# Enter

Enters a value into a text field or area. 
To upload a file you are entering the file location into the uploads input field.

If the field contains already a value, the new value will be appended.

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods
{: .no_toc }

| name                         | parameter           | description                                                                                      |
| :---                         | :---                | :---                                                                                             |
| `.value()`*                  | value: string       | the string value which will be entered into the element                                          |
| `.into()`                    | element: SppElement | the input field or text area the value shall be entered into                                     |
| `.butClearsTheFieldBefore()` | -                   | remove all text from the field before entering the new value, otherwise the value will be append |

## Example
{: .no_toc }

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

# Hover
Move the mouse pointer over an element.
 

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods
{: .no_toc }

| name       | parameter | description                     |
| :---       | :---      | :---                            |
| `.over()`* | -         | move the mouse over the element |

## Example
{: .no_toc }

 ```typescript
 Josh.attemptsTo(
     Hover
         .over(Googles.IMAGINARY_HOVER_ELEMENT)
 )
```

# Navigate

Load the an URL in the browser.

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)

## Methods
{: .no_toc }

| name     | parameter   | description             |
| :---     | :---        | :---                    |
| `.to()`* | url: string | browse to the given url |

## Example
{: .no_toc }

```typescript
Josh.attemptsTo(
    Navigate
        .to("https://google.com")
)
```

# Scroll

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods
{: .no_toc }

| name                     | parameter              | description                                                                           |
| :---                     | :---                   | :---                                                                                  |
| `.to()`*                 | element: SppElement    | scroll the element to the top of the viewport                                         |
| `.atTheViewportCenter()` |                        | if scrolled to an element position the element at the center of the visible view port |
| `.toPosition()`*         | position: PagePosition | scroll to a pages position, currently implemented are Page.bottom() and Page.top()    |

## Example
{: .no_toc }

```typescript
josh.attemptsTo(
    Scroll.to(MY_ELEMENT),
    Scroll.to(MY_ELEMENT).atTheViewportCenter(),

    Scroll.to(Page.top())
)
```

# Tap NOT IMPLEMENTED YET

Tap on an element or position of an touch enabled device ( mobile or desktop / laptop).

## Ability
{: .no_toc }

- [BrowseTheWeb](../../abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](../../abilities/OPERATE_ON_MOBILE_DEVICE.md)

## Methods
{: .no_toc }

| name     | parameter                              | description                              |
| :---     | :---                                   | :---                                     |
| `.on()`* | element: SppElement or position: Point | taps on an element or a screens position |

## Example
{: .no_toc }

```typescript
Josh.attemptsTo(
    Tap.on(Googles.SEARCH_BUTTON),
    Tap.on(Position.onScreen(x,y))
)
```