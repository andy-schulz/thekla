# thekla
Thekla is a Screenplay Pattern Implementation implemented in Typescript and using WebdriverJS as the browser driver.
If you want to know more about the Screenplay Pattern check out
[The Screenplay Pattern explained by the Serenity creators](https://serenity-js.org/design/screenplay-pattern.html).

I started thekla as a pet project to understand the basic principles of the Screenplay Pattern without the need to use
protractor, as it dit not provide the possibility to write browser interaction test between different browsers like
Firefox and Chrome.

# System Setup

## Installation

install 

````bash
npm install thekla -g
````

## Start

````bash
thekla thekla_conf.js
````

where your configuration looks like

# Usage


## How to use thekla in detail
!! TODO update documentation !!
* Working elements
  * Basics of element chaining
  * Use separate locator strategies to find elements
  * [How to work with Frames](docs/creating_elements/WORKING_WITH_FRAMES.md)
  * How to wait for an elements appearance
  * Give an element a name
* Use the screenplay pattern to write your tests
  * Basics of the screenplay pattern
  * Use Jasmine or CucumberJS as a test framework
  * How to use an Actor and assign a capability

## Further Reads 
If you want to know more about the screenplay pattern, check out the following resources:
* [Presentation given by Antony Marcano (SeleniumConf 2016)](https://www.youtube.com/watch?v=8f8tdZBvAbI)
  * Gives you short an precise overview what the screenplay pattern really is
* [The SOLID principles](https://en.wikipedia.org/wiki/SOLID)