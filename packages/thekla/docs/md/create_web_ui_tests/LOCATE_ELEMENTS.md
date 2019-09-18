---
nav_exclude: true
---

# Locate Elements

## Table of Content
1. [The Basics](#the-basics) 
1. [Chain elements](#chain-elements)
1. [Working with frames](#working-with-frames)
1. [Give your element a name](#give-your-element-a-name)
1. [Waiting for elements](#waiting-for-elements)

## The Basics 

To locate an element you can use the build in css selector as follows:

````typescript
import {element, By} from "thekla"

const myElement = element(By.css("#myElementId"));
````

Additionally you can use use the 

* ``By.xpath()`` and
* ``By.cssContainingText()`` 

selectors.

There is and there will be no ``By.tagName``, ``By.id`` or any other selector. I decided to keep it simple with those
three selector functions. If you want to select an element by Id you can use ```By.css("#myElementId")``` as shown above
and selecting an element by tag name can be achieved simply by using ``By.css("myElementTagName")``.

Use the ``By.xpath()`` selector to locate an element based on the Dom structure.

The selector ``By.cssContainingText()`` comes in handy when selecting elements from a drop down:

````typescript
import {element, By, Click} from "thekla"

const myFirstDropDownItem = element(By.cssContainingText("#myDropDownId option", "My Drop Down first Item Text"));

jonathan.attemptsTo(
    Click.on(myFirstDropDownItem)
)
````

or when locating a button with a unique text

````typescript
import {element, By, Click} from "thekla"

const myButton = element(By.cssContainingText("button", "My unique button text"));

jonathan.attemptsTo(
    Click.on(myButton)
)
````

## Chain elements

Calling the ``element(...)`` function returns an object of type SppWebElementFinder.  To use different selector 
strategies you are able to chain multiple ``element(...)`` calls.

````typescript
import {element, By, Click} from "thekla"

const myChainedElement = element(By.xpath("//my/dom/structure")).element(By.css(".myClassName"))
````

If multiple elements are found with the selector strategy always the fist element is taken. In case the xpath returns 
multiple elements, the second call to ``element(By.css(".myClassName"))`` will just search for an element with that 
class name under the first element returned by xpath.

If you dont want to limit your search you can do it with the ``all(...)`` locator function.

````typescript
import {element, all, By} from "thekla"

const myFirstTableCell = all(By.css("tr")).element(By.css("td"))
````

You can chain you elements indefinitely.

## Working with frames

A major pain when working with selenium is when you have to locate elements in- and outside of frames interchangeably.

Before locating an element inside the frame you had to switch to that frame:

````typescript
driver.switchTo().frame("id | name" | WebElement)
````

Then you could select an element inside that frame. If you wanted to click on an element outside the frame, you had to 
switch back to the default context and and start the element location again.

With thekla you can define an element inside a frame like so:

````typescript
import {element, frame, By} from "thekla"

const elementInsideFrame = frame(By.css("#MyFrameId")).element(By.css("#MyElementId"));
````

Now switching between elements inside and outside of frames is as simple as:

````typescript
import {element, frame, By, Click} from "thekla"

const myElementInsideOfFrame = frame(By.css("#MyFrameId")).element(By.css("#MyElementIdInsideOfFrame"));
const myButtonOutsideOfFrame = element(By.css("#MyButtonIdOusideOfFrame"));
const myDrowDownInsideOfFrame = frame(By.css("#MyFrameId")).element(By.css("#MyDropDownIdInsideOfFrame"));

jonathan.attemptsTo(
    Click.on(myElementInsideOfFrame),
    Click.on(myButtonOutsideOfFrame),
    Click.on(myDrowDownInsideOfFrame),
)
````

The context switch is taken care for you.

## Give your element a name

in case an element cant be found selenium tends to spits out the selector and tells you that the element cant be found.
In case you dont live in a world where your developers are nice to you and attach meaningful ids and classes to your
elements its quite hard to figure out which element couldn't be found exactly.

Thekla lets you attach a name to your element which will be returned in those circumstances.

The Test

````typescript
import {element, By, Click} from "thekla"

const myNamedElement = element(By.css("#TheTotalyUnreadableId"))
                        .called("The name that lets me know what element its is.");

jonathan.attemptsTo(
    Click.on(myNamedElement),
)
````

will throw the following error massage in case the element cant be found:

````text
Element not found: 'The name that lets me know what element its is.' selected by: >>byCss: #TheTotalyUnreadableId<<
````

## Waiting for elements

I have to admit I hate reading test scripts filled with element waits, because the site is heavily async. 
On the other hand i feel i loose control of my test scripts when i switch on implicit wait. So i implemented a way
to specify a wait condition during element specification.

````typescript
import {element, By, Click, UntilElement} from "thekla"

const myNamedElement = element(By.css("#TheTotalyUnreadableId"))
                        .shallWait(UntilElement.is.visible())

jonathan.attemptsTo(
    Click.on(myNamedElement)
)
````

The click will wait for at most 5 Seconds before it is executed. If its there after 100 ms ... great. It will be
clicked and the script continues. If its not visible, the error message is thrown after 5 Seconds and the script exits.

Sometimes elements need longer to appear. You can specify a timeout like this:

````typescript
import {element, By, Click, UntilElement} from "thekla"

const myNamedElement = element(By.css("#TheTotalyUnreadableId"))
                        .shallWait(UntilElement.is.visible().forAsLongAs(30000));

jonathan.attemptsTo(
    Click.on(myNamedElement)
)
````

Now the click is waiting for 30 Seconds for the element to appear.

Specifically in lager test scripts the reading experience is increased without those disturbing wait statements. 