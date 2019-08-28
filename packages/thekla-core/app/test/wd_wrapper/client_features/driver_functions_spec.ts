import {ProxyType}                                                from "../../../config/DesiredCapabilities";
import {Browser, ClientHelper, DesiredCapabilities, ServerConfig} from "../../../index";
import {LogLevel}                                                 from "../../../config/ServerConfig";
import {clientRect}                                               from "../../0_helper/browser_viewport";

interface Rect { bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
}

describe(`Using the browser object`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    const selConfig: ServerConfig = {
        automationFramework: {
            type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
            logLevel:  (process.env.LOGLEVEL ? process.env.LOGLEVEL : `info`) as LogLevel
        },
        serverAddress: {
            hostname: process.env.SERVER_HOSTNAME ? process.env.SERVER_HOSTNAME : `localhost`
        },
        baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`
    };

    const testUrl: string = process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`;

    const desiredCapabilities: DesiredCapabilities =  {
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
        proxy: process.env.PROXY_TYPE === `manual` ? {
            proxyType: `manual`,
            httpProxy: process.env.PROXY_SERVER,
            sslProxy: process.env.PROXY_SERVER,
        } : {
            proxyType: `system`
        }
    };

    afterAll(async (): Promise<void[]> => {
        return ClientHelper.cleanup();
    });

    describe(`to retrieve the title`, (): void => {

        afterEach((): Promise<void[]> => {
            return ClientHelper.cleanup()
        });

        it(`should equal the site title 
        - (test case id: 5411140d-4b1a-408b-ab9a-995ab200825d)`, async (): Promise<void> => {
            const title = `React App`;

            const browser: Browser = ClientHelper.create(selConfig, desiredCapabilities);

            await browser.get(`/delayed`);
            expect(await browser.getTitle()).toBe(title);
        });
    });

    describe(`to retrieve the url`, (): void => {

        afterEach((): Promise<void[]> => {
            return ClientHelper.cleanup()
        });

        it(`should equal the sites url 
        - (test case id: 9603e1c2-bfe2-4243-b0a3-401096ad31ff)`, async (): Promise<void> => {
            const url = `${testUrl}/delayed`;

            const browser: Browser = ClientHelper.create(selConfig, desiredCapabilities);

            await browser.get(`${testUrl}/delayed`);
            expect(await browser.getCurrentUrl()).toBe(url);
        });
    });

    describe(`to scroll the page`, (): void => {

        afterEach((): Promise<void[]> => {
            return ClientHelper.cleanup()
        });

        it(`should succeed when page is scrolled down 
        - (test case id: 6fef0368-82c6-4d08-9bfa-a9c399c0446d)`, async (): Promise<void> => {
            const browser: Browser = ClientHelper.create(selConfig, desiredCapabilities);
            await browser.window.setSize({width: 500, height: 900});
            await browser.get(`/tables`);

            const rectStart: Rect[] = (await browser.executeScript(clientRect)) as Rect[];
            expect(rectStart[0].top).toBe(0);
            expect(rectStart[0].bottom).toBeGreaterThanOrEqual(7000);

            await browser.scrollTo({x:0,y:-1});

            const rectEnd: Rect[] = await browser.executeScript(clientRect) as Rect[];
            expect(rectEnd[0].top).toBeLessThanOrEqual(6000);
            expect(rectEnd[0].bottom).toBeLessThanOrEqual(1000);

            await browser.scrollTo({x:0,y:0});

            const rectStart2: Rect[] = (await browser.executeScript(clientRect)) as Rect[];
            expect(rectStart2[0].top).toBe(0);
            expect(rectStart2[0].bottom).toBeGreaterThanOrEqual(7000);
        });
    });
});