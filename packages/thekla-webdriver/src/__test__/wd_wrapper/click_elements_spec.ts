import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig} from "@thekla/support";
import {Browser, By, ClientHelper, WebElementFinder, WebElementListFinder}   from "../..";
import { ServerConfig, DesiredCapabilities }                                 from "@thekla/config";

describe(`Click`, () => {
    let browser: Browser;

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`click_elements_spec.ts`);

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        browser = ClientHelper.create(conf, capabilities);
    });

    afterAll((): Promise<void[]> => {
        return ClientHelper.cleanup();
    });

    describe(`on multiple elements`, () => {
        let checkboxes: WebElementListFinder;
        let checkbox1: WebElementFinder;
        let checkbox2: WebElementFinder;

        it(`should throw an error when no element can be found
        test id: efaa8c38-7c83-4a6d-8ee8-49f1c308b21c`, async () => {
            checkboxes = browser.all(By.css(`[data-test-id^='doesNotExist']`));

            await browser.get(`/`);

            return checkboxes.click()
                .then(() => {
                    expect(true)
                        .toBeFalsy(`click on an not existing element should throw an error. But it doesnt.`)
                })
                .catch((e: Error) => {
                    expect(e.name).toEqual(`DidNotFindElement`)
                });
        });

        it(`the system should wait for a second 
        - (test case id: d106ba43-542c-44c7-959e-f64dcdc6943d)`, async (): Promise<void> => {
            checkboxes = browser.all(By.css(`[data-test-id^='checkbox']`));
            checkbox1 = browser.element(By.css(`[data-test-id^='checkbox1']`));
            checkbox2 = browser.element(By.css(`[data-test-id^='checkbox2']`));

            await browser.get(`/`);

            expect(await checkbox1.getAttribute(`checked`)).toBeFalsy();
            expect(await checkbox2.getAttribute(`checked`)).toBeFalsy();

            await checkboxes.click();

            expect(await checkbox1.getAttribute(`checked`)).toBeTruthy();
            expect(await checkbox2.getAttribute(`checked`)).toBeTruthy();
        });
    });
});