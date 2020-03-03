import {DesiredCapabilities, ServerConfig} from "@thekla/config";
import {Actor}                             from "@thekla/core";
import {
    BoundaryCheck,
    getStandardTheklaDesiredCapabilities,
    getStandardTheklaServerConfig,
    isElementOutsideOfView
}                                          from "@thekla/support";
import {
    Browser,
    BrowseTheWeb,
    By,
    Click,
    element,
    Navigate,
    RunningBrowser,
    UntilElement
}                                          from "..";

describe(`Click`, () => {
    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`click_interaction_spec.ts`);

    let theBrowser: Browser;
    const Clair = Actor.named(`Clair`);

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

        theBrowser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
        Clair.whoCan(BrowseTheWeb.using(theBrowser));
    });

    afterAll(() => {
        return RunningBrowser.cleanup()
    });

    describe(`on centered element`, () => {

        const row50 = element(By.css(`[data-test-id='50']`))
            .shallWait(UntilElement.is.visible.forAsLongAs(5000))
            .called(`the 50th table row`);

        it(`should scroll the element into view and then click on it
        test id: c30eb717-eb00-4b99-bd26-470baa2d7a8f`, async () => {
            await Navigate.to(`/tables`).performAs(Clair);

            let isOutsideView: BoundaryCheck =
                await theBrowser.executeScript(isElementOutsideOfView, row50.locator.selector) as BoundaryCheck;

            expect(isOutsideView.anyOutside).toBeTruthy();

            await Click.on.centered(row50).performAs(Clair);

            isOutsideView =
                await theBrowser.executeScript(isElementOutsideOfView, row50.locator.selector) as BoundaryCheck;

            expect(isOutsideView.anyOutside).toBeFalsy()
        });
    });
});