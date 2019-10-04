import {
    Actor, BrowseTheWeb, RunningBrowser, SppElement,
    Navigate, element, By, UntilElement, Enter, Sleep, See, Expected, Value } from "thekla-core";

import {TheklaGlobal} from "thekla";

// declare thekla, its global
declare const thekla: TheklaGlobal;


describe('Search on Google with thekla', function () {

    let googleSearchField: SppElement;
    let jonathan: Actor;

    beforeAll(() => {

        // create a browser with the configuration
        const aBrowser = RunningBrowser
        // get the server config from theklas config file
            .startedOn(thekla.serverConfig())
            // get the capabilities from theklas config file
            .withCapabilities(thekla.capabilities());

        // create the actor and give it a name
        jonathan = Actor.named("Jonathan");

        // specify what your actor can do.
        // In this case he can use a web browser with the browser created before.
        jonathan.can(BrowseTheWeb.using(aBrowser));

        // create the search field and give it a name.
        // 1. locate the element by css
        googleSearchField = element(By.css(`[name='q']`))
            // 2. name the element
            .called(`The Google search field`)
            // wait for the element if its not there right away
            .shallWait(UntilElement.is.visible().forAsLongAs(1000));
    });

    it('should fill the search field with a text', async function () {

        await jonathan.attemptsTo(
            // Go to Google
            Navigate.to("https://www.google.com/"),
            // send the search text to the search field
            Enter.value("software test automation")
                .into(googleSearchField),
            // Wait for 5 Seconds (just to visually follow the test case)
            Sleep.for(5 * 1000),
            // check if the text was entered
            See.if(Value.of(googleSearchField))
                .is(Expected.toBe("software test automation"))
        )

    });

    afterAll((): Promise<void[]> => {
        // cleanup all created browser when you are done
        return RunningBrowser.cleanup();
    });
});