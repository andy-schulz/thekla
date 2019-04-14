# thekla
Thekla is a Screenplay Pattern Implementation implemented in Typescript and using WebdriverJS as the browser driver.
If you want to know more about the Screenplay Pattern check out
[The Screenplay Pattern explained by the Serenity creators](https://serenity-js.org/design/screenplay-pattern.html).

I started thekla as a pet project to understand the basic principles of the Screenplay Pattern without the need to use
protractor, as it dit not provide the possibility to write browser interaction test between different browsers like
Firefox and Chrome.

# Quick Start Guide

Examples using thekla can be found in the [Thekla Examples](https://github.com/andy-schulz/thekla-examples) repository

## Preparation

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

## Create the test spec

Create the test folder ``test`` inside your projects folder.

````bash
mkdir /path/to/your/project/test
````

Create a file ``google_search_spec.ts`` inside the ``test`` folder with the following content:

````typescript
import {
    Actor, BrowseTheWeb, RunningBrowser, SeleniumConfig, DesiredCapabilities,
    Navigate, element, By, UntilElement, Enter, Sleep, See, strictEqualTo, Value} from "thekla-core";

import {TheklaConfig} from "thekla";

// thekla is a gloabal variable, so declare it here that you can use it
declare const thekla: {config: TheklaConfig};


describe('Search on Google with thekla', function () {

    it('should return a value', async function () {

        // create a browser with the configuration from thekla_conf.ts
        // the browser is created async right away, this will change in future versions, then it will created upon first use
        const aBrowser = await RunningBrowser
            .startedOn(thekla.config.seleniumConfig as SeleniumConfig)
            .withDesiredCapability((thekla.config.capabilities as DesiredCapabilities[])[0]);

        // create the actor and give it a name
        const jonathan = Actor.named("Jonathan");

        // specify what your actor can do. In this case he can use a web browser with the browser created before.
        jonathan.can(BrowseTheWeb.using(aBrowser));

        // create the search field and give it a name. If
        const googleSearchField = element(By.css(`[name='q']`))        // say how you want to locate the element
            .called(`The Google search field`)                       // give the element a name (optional)
            .shallWait(UntilElement.is.visible().forAsLongAs(1000));    // if its not there right away, wait for it (optional)

        await jonathan.attemptsTo(
            Navigate.to("https://www.google.com/"),                         // Go to Google
            Enter.value("software test automation")
                .into(googleSearchField),                               // send the search text to the search field
            Sleep.for(5 * 1000),                              // Wait for 5 Seconds (just to visually follow the test case)
            See.if(Value.of(googleSearchField))
                .is(strictEqualTo("software test automation"))      // check if the text was entered
        )

    });

    afterAll(() => {
        RunningBrowser.cleanup()            // cleanup all created browser when you are done
    });
});
````

## Create the test configuration

Create the file ``thekla_conf.ts`` in the ``test`` folder with the following content:

````typescript
import {TheklaConfig} from "thekla"

export const config: TheklaConfig = {

    specs: ["dist/google_search_spec.js"],

    seleniumConfig: {
        seleniumServerAddress: "http://localhost:4444/wd/hub"
    },

    capabilities: [{
        browserName: "chrome"
    }],

    testFramework: {
        frameworkName: "jasmine",
        jasmineOptions: {
            defaultTimeoutInterval: 10 * 1000
        }
    }
};
````

## Tell Typescript on how to transpile the code

Create the file ``tsconfig.json`` in the root directory of your project.

````json
{
  "compilerOptions": {
        "target": "ES2016"
        ,"module": "commonjs"
        ,"sourceMap": true
        ,"outDir": "dist"
        ,"rootDir": "test"
        ,"strict": true
        ,"noImplicitAny": true
        ,"inlineSources": true
  }
}
````

## Add the test scripts to package.json

````json
  "scripts": {
    "pretest": "tsc",
    "test": "node_modules/.bin/thekla dist/thekla_conf.js"
  },
````

## Start the tests

````bash
npm test
````

# Further Usage Information

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

## Detailed Information about the Screenplay Pattern 
If you want to know more about the screenplay pattern, check out the following resources:
* [Presentation given by Antony Marcano (SeleniumConf 2016)](https://www.youtube.com/watch?v=8f8tdZBvAbI)
  * Gives you short an precise overview what the screenplay pattern really is
* [The SOLID principles](https://en.wikipedia.org/wiki/SOLID)