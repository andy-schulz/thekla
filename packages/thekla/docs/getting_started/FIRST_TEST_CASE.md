---
title: The Test Spec
parent: Getting Started
has_children: false
nav_order: 3
---

# Create the Test Spec

The fastest way to get started is by downloading the 
[Thekla Examples](https://github.com/andy-schulz/thekla-examples) repository


Create a file ``google_search_spec.ts`` inside the ``test`` folder with the following content:

````typescript
import {
    Actor, BrowseTheWeb, RunningBrowser, SeleniumConfig, DesiredCapabilities,
    Navigate, element, By, UntilElement, Enter, Sleep, See, 
    Expected, Value, TheklaConfig} from "thekla";

// thekla is a gloabal variable, so declare it here that you can use it
declare const thekla: {config: TheklaConfig};

describe('Search on Google with thekla', function () {

    it('should return a value', async function () {

        // configure where to find you hub
        const seleniumConfig: SeleniumConfig = {
            seleniumServerAddress: "http://localhost:4444/wd/hub"
        };

        // configure which browser capabilities to use
        const browserCapability: DesiredCapabilities = {
            browserName: "chrome"
        };

        // create a browser with the configuration
        const aBrowser = RunningBrowser
            .startedOn(seleniumConfig)
            .withDesiredCapability(browserCapability);

        // create the actor and give it a name
        const jonathan = Actor.named("Jonathan");

        // specify what your actor can do. In this case he can use a web browser with the browser created before.
        jonathan.can(BrowseTheWeb.using(aBrowser));

        // create the search field and give it a name.
        const googleSearchField = element(By.css(`[name='q']`))        // say how you want to locate the element
            .called(`The Google search field`)                       // give the element a name (optional)
            .shallWait(UntilElement.is.visible().forAsLongAs(1000));    // if its not there right away, wait for it (optional)

        await jonathan.attemptsTo(
            Navigate.to("https://www.google.com/"),                         // Go to Google
            Enter.value("software test automation")
                .into(googleSearchField),                               // send the search text to the search field
            Sleep.for(5 * 1000),                              // Wait for 5 Seconds (just to visually follow the test case)
            See.if(Value.of(googleSearchField))
                .is(Expected.toBe("software test automation"))      // check if the text was entered
        )

    });

    afterAll(() => {
        // cleanup all created browser when you are done
        return RunningBrowser.cleanup()
    });
});
````

