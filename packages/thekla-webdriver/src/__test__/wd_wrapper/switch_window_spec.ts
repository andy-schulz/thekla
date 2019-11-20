import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig} from "@thekla/support";
import {Browser, ClientHelper}                                               from "../..";
import {DesiredCapabilities, ServerConfig}                                   from "@thekla/config";
import {DidNotFindWindow}                                                    from "../../errors/DidNotFindWindow";

describe(`A browser Window`, () => {
    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`switch_window_spec.ts`);

    let browser: Browser;

    beforeAll((): void => {
        // testing on browserstack takes a while for retrieving all elements
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
        browser = ClientHelper.create(conf, capabilities);
    });

    afterAll(async (): Promise<void[]> => {
        return await ClientHelper.cleanup()
    });

    describe(`as Tab`, () => {

        it(`should be created and closed
        test id: 82cc0933-f6f6-4856-be69-5da354e2cad4`, async () => {
            await browser.get(`/`);

            let handles = await browser.getWindowHandles();
            expect(handles.length).toEqual(1, `more or less than 1 window handle found after opening the browser`);

            const tabWindowHandle = await browser.createTab();

            handles = await browser.getWindowHandles();
            expect(handles.length).toEqual(2, `more or less than 2 window handles found after creating a new tab`);

            await browser.switchToWindow(tabWindowHandle);

            const titleNewTab = await browser.getTitle();
            expect(titleNewTab).toEqual(``);

            await browser.closeWindow();

            const remainingHandles = await browser.getWindowHandles();
            expect(remainingHandles.length).toEqual(1);

            await browser.switchToWindow(remainingHandles[0]);

            const remainingTabTitle = await browser.getTitle();
            expect(remainingTabTitle).toEqual(`React App`)

        });
    });

    describe(`as separate windows`, () => {

        it(`should be created and closed
        test id: 79a7af87-4720-4501-8515-65a8c32e302c`, async () => {
            await browser.get(`/`);

            let handles = await browser.getWindowHandles();
            expect(handles.length).toEqual(1, `more or less than 1 window handle found after opening the browser`);

            const separateWindowHandle = await browser.createWindow();

            handles = await browser.getWindowHandles();
            expect(handles.length).toEqual(2, `more or less than 2 window handles found after creating a new tab`);

            await browser.switchToWindow(separateWindowHandle);

            const titleNewWindow = await browser.getTitle();
            expect(titleNewWindow).toEqual(``);

            await browser.closeWindow();

            const remainingHandles = await browser.getWindowHandles();
            expect(remainingHandles.length).toEqual(1);

            await browser.switchToWindow(remainingHandles[0]);

            const remainingWindowTitle = await browser.getTitle();
            expect(remainingWindowTitle).toEqual(`React App`)
        });

        it(`should be switched by checking a title
        test id: 48664893-f84c-4e07-bfd9-b6e80b0bc9a0`, async () => {
            await browser.get(`/`);
            const newWindowHandle = await browser.createWindow();
            await browser.switchToWindow(newWindowHandle);

            expect(await browser.getTitle()).toEqual(``);

            await browser.switchToWindowMatchingTheTitle(`React`);

            expect(await browser.getTitle()).toEqual(`React App`);

            await browser.switchToWindow(newWindowHandle);
            await browser.closeWindow();

            const remainingHandle = await browser.getWindowHandles();
            await browser.switchToWindow(remainingHandle[0])
        });
    });

    describe(`which does not exist`, () => {

        it(`should throw an error and print the found titles
        test id: 0c87c2e1-8d74-48a5-b780-ca943f11e158`, async () => {
            await browser.get(`/`);
            await browser.switchToWindowMatchingTheTitle(`DoesNotExist`)
                .then(() => {
                    expect(true).toBeFalsy(`switching to a non existing window should throw an error, but it doesn't`)
                })
                .catch((e: DidNotFindWindow) => {
                    expect(e.name).toEqual(`DidNotFindWindow`);
                    expect(e.foundWindowTitles).toEqual([`React App`])
                });
        });
    });
});