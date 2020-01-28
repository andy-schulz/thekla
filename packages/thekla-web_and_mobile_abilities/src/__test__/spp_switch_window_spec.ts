import {ServerConfig, DesiredCapabilities}                                   from "@thekla/config";
import {Actor, See}                                                from "@thekla/core";
import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig} from "@thekla/support";
import {Browser, RunningBrowser}                                             from "@thekla/webdriver";
import {BrowseTheWeb, SwitchToWindow, TheSites}                              from "..";
import { Expected } from "@thekla/assertion";

describe(`Switching Window`, () => {

    const seleniumConfig: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`spp_questions_spec.ts`);

    let browser: Browser;

    const Janine: Actor = Actor.named(`Janine`);

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        browser = RunningBrowser.startedOn(seleniumConfig).withCapabilities(capabilities);
        Janine.whoCan(BrowseTheWeb.using(browser));
    });

    afterAll(async (): Promise<void[]> => {
        return RunningBrowser.cleanup();
    });

    describe(`by title`, () => {

        let newHandle: string;
        let originHandles: string[];

        beforeEach(async () => {
            await browser.get(`/`);
            originHandles = await browser.getWindowHandles();
            newHandle = await browser.createTab();
            await browser.switchToWindow(newHandle);
        });

        afterEach(async () => {
            await browser.switchToWindow(newHandle);
            await browser.closeWindow();
            await browser.switchToWindow(originHandles[0]);
        });

        it(`should switch to the new tab if the title exists
        test id: 267efd80-b373-4598-9ff3-529465df885c`, async () => {
            await SwitchToWindow.matchingTheTitle(`React`).performAs(Janine);
            await See.if(TheSites.title).is(Expected.to.equal(`React App`)).performAs(Janine);
        });

        it(`should throw an error if the title does not exist
        test id: 267efd80-b373-4598-9ff3-529465df885c`, async () => {
            await SwitchToWindow
                .matchingTheTitle(`DoesNotExist`).performAs(Janine)
                .then(() => expect(true).toBeFalsy(`Switching to a non existing window should throw an error, but it doesn't`))
                .catch((e: Error) => expect(e.name).toEqual(`DidNotFindWindow`));

        });
    });
});