import {BrowserCapabilities, SeleniumConfig} from "../../config/SeleniumConfig";
import * as _                                from "lodash";
import {WindowSize}                          from "../../driver/interface/BrowserWindow";
import {BrowserWdjs}                         from "../../driver/wdjs/BrowserWdjs";

const conf: SeleniumConfig = {
    seleniumServerAddress: "http://localhost:4444/wd/hub",

    capabilities: {
        browserName: "chrome",
    }
};

describe('creating a new Browser', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    const windowSize = function() {
        return {width: window.innerWidth, height: window.innerHeight};
    };

    afterAll(async () => {
        await BrowserWdjs.cleanup();
    });

    describe('with an initial window setSize', () => {
        it('it should be maximized when the config contains the "maximum" attribute ' +
            '- (test case id: 8a0d9a58-9591-43c1-89bb-d848319c90f1)', async () => {
            const con: SeleniumConfig = _.cloneDeep(conf);
            (<BrowserCapabilities>(con.capabilities)).window = {
                setToMaxSize: true
            };

            const browserInitialResize = await BrowserWdjs.create(con);
            const data = await browserInitialResize.executeScript(windowSize);
            const dataParsed: WindowSize = JSON.parse(JSON.stringify(data));
            expect(dataParsed.height).toBeGreaterThanOrEqual(100);
            expect(dataParsed.width).toBeGreaterThanOrEqual(100);
        });

        it('it should be maximized when maximize() is called after browser creation ' +
            '- (test case id: 1473a628-0347-41d9-b2f8-2c93f827f840)', async () => {
            const browserManualResize = await BrowserWdjs.create(conf);
            const dataBefore = await browserManualResize.executeScript(windowSize);
            const dataBeforeParsed: WindowSize = JSON.parse(JSON.stringify(dataBefore));

            await browserManualResize.window.maximize();
            const dataAfter = await browserManualResize.executeScript(windowSize);
            const dataAfterParsed: WindowSize = JSON.parse(JSON.stringify(dataAfter));

            expect(dataAfterParsed.width).toBeGreaterThanOrEqual(dataBeforeParsed.width);
            expect(dataAfterParsed.height).toBeGreaterThanOrEqual(dataBeforeParsed.height)

        });

        it('it should be maximized when the config contains the "maximum" attribute ' +
            '- (test case id: 1b7451ac-0ca2-4bdc-8700-60b4098d5829)', async () => {

            try {
                const browserResize = await BrowserWdjs.create(conf);
                await browserResize.window.setSize({width: 500, height: 500});
                expect(true).toBeFalsy(`Bug () in Selenium Webdriver 4.0 alpha has ben fixed, rewrite the test`)
            } catch (e) {
                expect(e.toString()).toContain(`this._driver.manage(...).window(...).setSize is not a function`);
            }

        });
    });
});