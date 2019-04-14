import {
    Actor, BrowseTheWeb, RunningBrowser, SeleniumConfig, DesiredCapabilities,
    Navigate, element, By, UntilElement, Enter, Sleep, See, strictEqualTo, Value} from "thekla-core";

import {TheklaConfig} from "thekla/dist";

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