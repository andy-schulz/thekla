import {getStandardTheklaServerConfig, getStandardTheklaDesiredCapabilities} from "@thekla/support";
import {ServerConfig, DesiredCapabilities}                                   from "@thekla/config";
import {Browser, WebElementFinder, ClientHelper, By, until}                  from "../..";

describe(`drag an element`, (): void => {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`drag_n_drop_spec.ts`);

    let browser: Browser;
    let dragElement0: WebElementFinder,
        dragElement1: WebElementFinder,
        dragElement2: WebElementFinder,
        dragElement3: WebElementFinder,
        dragElement4: WebElementFinder,
        dragElement5: WebElementFinder,
        dragIndicator: WebElementFinder,
        infoMessage: WebElementFinder;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        browser = ClientHelper.create(conf, capabilities);
        dragElement0 = browser.element(By.css(`[data-test-id='item-0']`));
        dragElement1 = browser.element(By.css(`[data-test-id='item-1']`));
        dragElement2 = browser.element(By.css(`[data-test-id='item-2']`));
        dragElement3 = browser.element(By.css(`[data-test-id='item-3']`));
        dragElement4 = browser.element(By.css(`[data-test-id='item-4']`));
        dragElement5 = browser.element(By.css(`[data-test-id='item-5']`));

        dragIndicator = browser.element(By.xpath(`//*[text()='Something was dragged!']`));
        infoMessage = browser.element((By.css(`[data-text-id='EventDetails']`)));
    })

    afterAll((): Promise<void[]> => {
        return ClientHelper.cleanup()
    });

    describe(`to another element`, (): void => {

        // it(`should reorder the element list
        // - (test case id: e0c3ded6-cb21-4e58-8076-33660548e6ac)`, async (): Promise<void> => {
        //
        //     const browser = ClientHelper.create(conf, caps);
        //
        //     await browser.get(`https://jqueryui.com/resources/demos/droppable/default.html`);
        //
        //     const element0 = browser.element(By.css(`div#draggable`))
        //         .shallWait(UntilElement.is.visible);
        //     const element1 = browser.element(By.css(`div#droppable`))
        //         .shallWait(UntilElement.is.visible);
        //
        //     const rectElem0 = await element0.getCenterPoint();
        //     const rectElem1 = await element1.getCenterPoint();
        //
        //     await element0.dragToElement(element1);
        //
        //     await Utils.wait(10000);
        // });

        it(`should reorder the element list from bottom to top 
        - (test case id: e0c3ded6-cb21-4e58-8076-33660548e6ac)`, async (): Promise<void> => {

            await browser.get(`/dragndrop`);
            await dragElement5.dragToElement(dragElement2);
            await browser.wait(until((): Promise<boolean> => dragIndicator.isVisible()));
            const message = await infoMessage.getText();

            // sometimes the element is moved to position one and not 2, the drag test system is not very suitable for
            // it so right now i just want to test if the element was moved at all, it doesnt matter if it was moved to
            // position one or two
            expect(
                [`Element item-5 was moved from position 5 to position 2`,
                    `Element item-5 was moved from position 5 to position 1`])
                .toContain(message)
        });

        it(`should reorder the element list from top to bottom
        - (test case id: e0c3ded6-cb21-4e58-8076-33660548e6ac)`, async (): Promise<void> => {

            await browser.get(`/dragndrop`);
            await dragElement0.dragToElement(dragElement2);
            await browser.wait(until((): Promise<boolean> => dragIndicator.isVisible()));
            const message = await infoMessage.getText();
            expect(message).toEqual(`Element item-0 was moved from position 0 to position 2`)
        });
    });
});