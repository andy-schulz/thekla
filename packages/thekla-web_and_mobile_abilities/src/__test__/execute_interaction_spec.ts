import {DesiredCapabilities, ServerConfig}                                   from "@thekla/config";
import {Actor}                                                               from "@thekla/core";
import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig} from "@thekla/support";
import {Browser, BrowseTheWeb, Execute, Navigate, RunningBrowser}            from "..";

describe(`Execute`, () => {
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

    describe(`script`, () => {

        it(`should change the border style on an element
        test id: e9a378f7-1620-4c39-8568-d25a24862c5f`, async () => {
            await Navigate.to(`/`).performAs(Clair);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const noStyle: [unknown] = await theBrowser.executeScript(() => document.getElementById(`exampleSelect`).style);
            expect(noStyle.length > 0).toBeFalsy()

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await Execute.script(() => document.getElementById(`exampleSelect`).style[`border-style`] = `dotted`).performAs(Clair);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const hasStyle: [unknown] = await theBrowser.executeScript(() => document.getElementById(`exampleSelect`).style);
            expect(hasStyle.length > 0).toBeTruthy()
        });
    });
});