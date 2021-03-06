import {Expected}                                                               from "@thekla/assertion";
import {DesiredCapabilities, ServerConfig}                                      from "@thekla/config";
import {Actor, See}                                                             from "@thekla/core";
import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig}    from "@thekla/support";
import {Browser, BrowseTheWeb, By, Drag, element, Navigate, RunningBrowser, SppElement, Text, UntilElement} from "..";

describe(`Drag an Element`, (): void => {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`spp_drag_and_drop_spec.ts`);

    let theBrowser: Browser;
    let Donnie: Actor;

    let element0: SppElement,
        element1: SppElement,
        dragIndicator: SppElement;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        theBrowser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
        Donnie = Actor.named(`Donnie`);
        Donnie.whoCan(BrowseTheWeb.using(theBrowser));

        element0 = element(By.css(`[data-test-id='item-0']`)).called(`draggable item 0`);
        element1 = element(By.css(`[data-test-id='item-1']`)).called(`draggable item 1`);
        dragIndicator = element(By.css(`[data-text-id='EventDetails']`))
            .called(`The dragNDrop Indicator`)
            .shallWait(UntilElement.is.visible);
    });

    afterAll((): Promise<void[]> => {
        return RunningBrowser.cleanup();
    });

    describe(`onto another element`, (): void => {
        it(`should move the element to the new position 
        - (test case id: 17daa294-72a1-421a-a4c1-a8c3821b1a37)`, async (): Promise<void> => {

            await Navigate.to(`/dragndrop`).performAs(Donnie);

            await Donnie.attemptsTo(
                Drag.element(element0).toElement(element1)
            );

            // await Drag.element(element0).toElement(element1).performAs(Donnie);

            await See.if(Text.of(dragIndicator))
                     .is(Expected.to.equal(`Element item-0 was moved from position 0 to position 1`))
                     .repeatFor(5, 1000)
                     .performAs(Donnie)
        });
    });
});