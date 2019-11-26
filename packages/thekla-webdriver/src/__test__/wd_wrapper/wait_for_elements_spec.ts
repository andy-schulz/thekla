import {DesiredCapabilities, ServerConfig}                                   from "@thekla/config";
import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig} from "@thekla/support";
import {configure}                                                           from "log4js";
import {Browser, By, ClientHelper, until, UntilElement, WebElementFinder}    from "../..";
import {WebElementListWd}                                                    from "../../lib/element/WebElementListWd";

configure(`src/__test__/__config__/log4js.json`);

describe(`Waiting for WD Elements`, (): void => {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`wait_for_element_spec.ts`);

    let browser: Browser;
    let appearButton4000ShallWait: WebElementFinder;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        browser = ClientHelper.create(conf, capabilities);
    });

    afterAll((): Promise<void[]> => {
        return ClientHelper.cleanup();
    });

    describe(`and try to explicitly wait for an Element`, (): void => {

        it(`the system should wait for a second 
        - (test case id: d106ba43-542c-44c7-959e-f64dcdc6943d)`, async (): Promise<void> => {
            appearButton4000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy4000']`))
                                               .shallWait(UntilElement.is.visible.forAsLongAs(1000));

            await browser.get(`/delayed`);
            expect(await appearButton4000ShallWait.isVisible()).toEqual(false)
        });

        it(`the system should wait for 7 seconds 
        - (test case id: 2af14d42-6f9d-4532-a151-c4d4390c352e)`, async (): Promise<void> => {
            appearButton4000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy4000']`))
                                               .shallWait(UntilElement.is.visible.forAsLongAs(7000));

            await browser.get(`/delayed`);
            expect(await appearButton4000ShallWait.isVisible()).toEqual(true)
        });

        it(`the system should wait for element after redirect 
        - (test case id: a86b8f45-9706-40ab-bdd2-a5319cde0d0f)`, async (): Promise<void> => {
            appearButton4000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy4000']`))
                                               .shallWait(UntilElement.is.visible.forAsLongAs(11000));

            await browser.get(`/redirectToDelayed`);
            expect(await appearButton4000ShallWait.isVisible()).toEqual(true)
        });
    });

    describe(`and try to implicitly wait for an Element`, (): void => {

        afterEach(() => {
            WebElementListWd.setStandardWait(0);
        });

        it(`the system should wait for a second and dont find the visible element
        - (test case id: da251005-5d54-45f4-98cd-983ceac32591)`, async (): Promise<void> => {
            WebElementListWd.setStandardWait(1000);
            appearButton4000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy4000']`));

            await browser.get(`/delayed`);
            const waiting = await appearButton4000ShallWait.isVisible();
            expect(waiting).toEqual(false)
        });

        it(`the system should wait for the element to be visible
        - (test case id: 9cb0891c-6c3e-43fc-9ead-24e7da07da42)`, async (): Promise<void> => {
            WebElementListWd.setStandardWait(5000);
            appearButton4000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy4000']`));

            await browser.get(`/delayed`);
            const waiting = await appearButton4000ShallWait.isVisible();
            expect(waiting).toEqual(true)
        });

        it(`the system should wait for the element to be visible
        - (test case id: 6a54bd71-1451-4ec4-8069-6608f147c3d0)`, async (): Promise<void> => {
            WebElementListWd.setStandardWait(5000);
            const disappearButton4000 = browser.element(By.css(`[data-test-id='DisappearButtonBy4000']`))
                                               .shallNotImplicitlyWait();

            await browser.get(`/delayed`);

            const statusBeforeWaiting = await disappearButton4000.isVisible();
            expect(statusBeforeWaiting).toEqual(true);

            await browser.wait(until.not(() => disappearButton4000.isVisible()));

            const statusAfterWaiting = await disappearButton4000.isVisible();
            expect(statusAfterWaiting).toEqual(false)
        });

        it(`the system should wait for element to be visible after redirect 
        - (test case id: 7f5d0233-b68d-465c-a97b-2b91c336de00)`, async (): Promise<void> => {
            WebElementListWd.setStandardWait(11000);
            appearButton4000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy4000']`));

            await browser.get(`/redirectToDelayed`);
            expect(await appearButton4000ShallWait.isVisible()).toEqual(true)
        });
    });

    describe(`which are chained by xpath`, (): void => {
        it(`should find the element after 5 Seconds 
        - (test case id: 958da8f9-82eb-465c-ace8-bb4496f8f77b)`, async () => {
            const appearRow = browser.element(By.xpath(`//*[@data-test-id='appear']`))
                                     .shallWait(UntilElement.is.visible.forAsLongAs(11000));

            const appearCol1 = appearRow.element(By.xpath(`.//*[@data-test-id='appearCol1']`));

            const button = appearCol1.element(By.xpath(`.//button`))
                                     .shallWait(UntilElement.is.visible.forAsLongAs(10000));

            await browser.get(`/delayed`);
            expect(await button.isVisible()).toEqual(true)

        });
    });
});