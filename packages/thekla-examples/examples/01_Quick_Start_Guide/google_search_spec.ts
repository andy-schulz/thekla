import {
    Actor, BrowseTheWeb, RunningBrowser, SeleniumConfig, DesiredCapabilities,
    Navigate, element, By, UntilElement, Enter, Sleep, See, strictEqualTo, Value} from "thekla-core";

import {TheklaConfig} from "thekla/dist";

declare const thekla: {config: TheklaConfig};


describe('Search on Google with thekla', function () {

    afterAll(() => {
        RunningBrowser.cleanup()
    });

    it('should return a value', async function () {

        const aBrowser = await RunningBrowser
            .startedOn(thekla.config.seleniumConfig as SeleniumConfig)
            .withDesiredCapability((thekla.config.capabilities as DesiredCapabilities[])[0]);

        const jonathan = Actor.named("Jonathan");

        jonathan.can(BrowseTheWeb.using(aBrowser));

        const googleSearchField = element(By.css(`[name='q']`))
            .called(`The Google search field`)
            .shallWait(UntilElement.is.visible());

        await jonathan.attemptsTo(
            Navigate.to("https://www.google.com/"),                 // Go to the Site
            Enter.value("software test automation")
                .into(googleSearchField),                               // send the search text to the search field
            Sleep.for(5 * 1000),                              // Wait for 5 Seconds (just to visually follow the test case)
            See.if(Value.of(googleSearchField))
                .is(strictEqualTo("software test automation"))      // check if the text was entered
        )

    });
});