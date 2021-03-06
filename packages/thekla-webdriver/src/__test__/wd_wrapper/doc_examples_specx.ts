import {DesiredCapabilities, ServerConfig}                                              from "@thekla/config";
import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig}            from "@thekla/support";
import {Browser, By, ClientHelper, Key, RunningBrowser, UntilElement, WebElementFinder} from "../..";

describe(`Using Google Search to find an online calculator`, (): void => {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`doc_examples_spec.ts`);

    describe(`with the WebdriverJS wrapper,`, (): void => {
        // define your elements preferably in a separate class like a page object
        let b: Browser;
        let searchField: WebElementFinder;
        let submitSearch: WebElementFinder;
        let calculatorInput: WebElementFinder;

        beforeAll((): void => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

            b = ClientHelper.create(conf, capabilities);
            searchField = b.element(By.css(`[name='q']`))
                           .shallWait(UntilElement.is.visible.forAsLongAs(5000))
                           .called(`The Google search field (describe)`);

            submitSearch = b.element(By.css(`.FPdoLc [name='btnK']`))
                            .called(`The Google Submit Search button on the main Page`);

            calculatorInput = b.element(By.css(`#cwos`))
                               .called(`Google calculator input field`)
                               .shallWait(UntilElement.is.visible.forAsLongAs(5000));
        });

        // google now requires to accept cookies, disabled the test until i know how to get rid of it
        xit(`the google calculator should be loaded - (test case id: 09fb5738-86b1-4f12-8d33-91bcddcde106)`, async (): Promise<void> => {
            await b.get(`http://www.google.com`);

            await new Promise((fulfill): void => {
                setTimeout((): void => {
                    fulfill(`Time waited: ${60}`)
                }, 60);
            })

            await searchField.sendKeys(`calculator`);
            await searchField.sendKeys(Key.TAB);
            await submitSearch.click();
            expect(await calculatorInput.isVisible()).toBe(true,
                                                           `Google calculator input field not found`)
        });
    });

    afterAll(async (): Promise<void[]> => {
        return RunningBrowser.cleanup();
    })
});

