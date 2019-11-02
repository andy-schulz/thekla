import {getStandardTheklaServerConfig, getStandardTheklaDesiredCapabilities} from "@thekla/support";
import {BoundaryCheck}                                                       from "@thekla/support";
import {ServerConfig, DesiredCapabilities}                                   from "@thekla/config";
import {isElementOutsideOfView}                                              from "@thekla/support/dist";
import {UntilElement, By, Browser, RunningBrowser}                           from "@thekla/webdriver";
import {element, BrowseTheWeb, Scroll, Navigate, Page}                       from "..";
import {Actor}                                                               from "@thekla/core";

describe(`Scroll`, (): void => {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`scroll_interaction_spec.ts`);

    let theBrowser: Browser;
    const Sam = Actor.named(`Sam`);

    const lastTableRow = element(By.css(`[data-test-id='lastTableRow']`))
        .shallWait(UntilElement.is.visible().forAsLongAs(5000))
        .called(`the last row element inside the large table`);

    const row49 = element(By.css(`[data-test-id='49']`))
        .shallWait(UntilElement.is.visible().forAsLongAs(5000))
        .called(`the 49th table row`);

    const row50 = element(By.css(`[data-test-id='50']`))
        .shallWait(UntilElement.is.visible().forAsLongAs(5000))
        .called(`the 50th table row`);

    const row51 = element(By.css(`[data-test-id='51']`))
        .shallWait(UntilElement.is.visible().forAsLongAs(5000))
        .called(`the 51th table row`);

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });

    beforeAll((): void => {
        theBrowser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
        Sam.whoCan(BrowseTheWeb.using(theBrowser));
    });

    afterAll((): Promise<void[]> => {
        return RunningBrowser.cleanup();
    });

    describe(`to a pages position`, (): void => {

        it(`should succeed when scrolled to the end of the page 
        - (test case id: 8fc292fe-883d-48ce-878e-11fcdff579df)`, async (): Promise<void> => {

            await Navigate.to(`/tables`).performAs(Sam);

            let viewportCheck: BoundaryCheck =
                await theBrowser.executeScript(isElementOutsideOfView, lastTableRow.locator.selector) as BoundaryCheck;

            expect(viewportCheck.elementOutside).toBeTruthy(
                `Error: last row is not outside of view initially`);

            await Scroll.toPosition(Page.bottom()).performAs(Sam);

            viewportCheck =
                await theBrowser.executeScript(isElementOutsideOfView, lastTableRow.locator.selector) as BoundaryCheck;

            expect(viewportCheck.elementOutside).toBeFalsy(
                `Error: after trying to scroll to the bottom of the page the last row is not visible`);

            await Scroll.toPosition(Page.top()).performAs(Sam);

            viewportCheck =
                await theBrowser.executeScript(isElementOutsideOfView, lastTableRow.locator.selector) as BoundaryCheck;

            expect(viewportCheck.elementOutside).toBeTruthy(
                `Error: last row is not outside view after page was scrolled to the top again`);
        });
    });

    describe(`an element into view`, (): void => {

        it(`should move the element into the viewport 
        - (test case id: bc7ff4ef-d0ea-4ac1-b2c6-5cedefd11391)`, async (): Promise<void> => {

            await Navigate.to(`/tables`).performAs(Sam);

            let isOutsideView: BoundaryCheck =
                await theBrowser.executeScript(isElementOutsideOfView, lastTableRow.locator.selector) as BoundaryCheck;

            expect(isOutsideView.anyOutside).toBeTruthy();

            await Scroll.to(lastTableRow).performAs(Sam);

            isOutsideView =
                await theBrowser.executeScript(isElementOutsideOfView, lastTableRow.locator.selector) as BoundaryCheck;

            expect(isOutsideView.anyOutside).toBeFalsy()
        });

        it(`should move the element into the viewports center
        - (test case id: fc96865f-7be8-4c3e-aa4b-757f5462b0cc)`, async (): Promise<void> => {

            await Navigate.to(`/tables`).performAs(Sam);

            let row49IsOutsideView: BoundaryCheck =
                await theBrowser.executeScript(isElementOutsideOfView, row49.locator.selector) as BoundaryCheck;

            let row50isOutsideView: BoundaryCheck =
                await theBrowser.executeScript(isElementOutsideOfView, row50.locator.selector) as BoundaryCheck;

            let row51isOutsideView: BoundaryCheck =
                await theBrowser.executeScript(isElementOutsideOfView, row51.locator.selector) as BoundaryCheck;

            expect(row49IsOutsideView.anyOutside).toBeTruthy(`row 49 is inside view, but it should be outside`);
            expect(row50isOutsideView.anyOutside).toBeTruthy(`row 50 is inside view, but it should be outside`);
            expect(row51isOutsideView.anyOutside).toBeTruthy(`row 51 is inside view, but it should be outside`);

            await Scroll.to(row50).atTheViewportCenter()
                        .performAs(Sam);

            row49IsOutsideView =
                await theBrowser.executeScript(isElementOutsideOfView, row49.locator.selector) as BoundaryCheck;

            row50isOutsideView =
                await theBrowser.executeScript(isElementOutsideOfView, row50.locator.selector) as BoundaryCheck;

            row51isOutsideView =
                await theBrowser.executeScript(isElementOutsideOfView, row51.locator.selector) as BoundaryCheck;

            expect(row49IsOutsideView.anyOutside).toBeFalsy(`row 49 is outside view, but it should be inside`);
            expect(row50isOutsideView.anyOutside).toBeFalsy(`row 50 is outside view, but it should be inside`);
            expect(row51isOutsideView.anyOutside).toBeFalsy(`row 51 is outside view, but it should be inside`);

        });
    });
});