# thekla
Thekla is a Screenplay Pattern Implementation in Typescript and using WebdriverIO as the browser driver.

If you want to know more about the Screenplay Pattern check out
[The Screenplay Pattern explained by the Serenity creators](https://serenity-js.org/design/screenplay-pattern.html).

I started thekla as a pet project to understand the basic principles of the Screenplay Pattern without the need to use
protractor, as it dit not provide the possibility to write browser interaction test between different browsers like
Firefox and Chrome.

# Documentation

Check the
[the official project documentation](https://andy-schulz.github.io/thekla/)
for detailed information on how to use thekla.

# Quick Start Guide

The fastest way to get started is by downloading the 
[Thekla Examples](https://github.com/andy-schulz/thekla-examples) repository

## Installation

Install ``webdriver-manager`` and start the selenium standalone server.

````bash
npm install webdriver-manager -g
webdriver-manager update
webdriver-manager start
```` 

Create a project folder and initialize a npm project.

````bash
mkdir /path/to/you/project
cd /path/to/you/project
npm init # follow the instructions
````

Install thekla.

````bash
npm install thekla --save
````