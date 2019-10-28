import {getStandardTheklaServerConfig, getStandardTheklaDesiredCapabilities} from "@thekla/support";
import {ServerConfig, DesiredCapabilities}                                   from "@thekla/config";
import {Browser, ClientHelper}                                               from "../../..";

describe(`Using the BrowserWdjs class`, (): void => {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`title_spec.ts`);

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    describe(`and work with the title`, (): void => {
        let browser: Browser;

        beforeAll((): void => {
            browser = ClientHelper.create(conf, capabilities);
        });

        beforeEach((): Promise<void> => {
            return browser.get(`/`);
        });

        it(`the getTitle method should get the correct title 
        - (test case id: 69c764e0-ad69-4bdf-b2a1-fd259ea57d04)`, async (): Promise<void> => {
            expect(await browser.getTitle()).toEqual(`React App`);
        });
    });

    afterAll(async (): Promise<void[]> => {
        return ClientHelper.cleanup();
    })
});