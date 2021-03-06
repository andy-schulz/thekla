import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig} from "@thekla/support";
import {ServerConfig, DesiredCapabilities}                                   from "@thekla/config";
import {ClientHelper, Browser}                                               from "../../index";

describe(`When using the ClientWdio class`, (): void => {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities = getStandardTheklaDesiredCapabilities(`browser_creation_spec`);

    beforeAll(async (): Promise<void> => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        await ClientHelper.cleanup();
    });

    afterEach(async (): Promise<void> => {
        await ClientHelper.cleanup();
    });

    describe(`to start a single browser`, (): void => {
        it(`with an empty browser name, it should throw an invalid browser name error ` +
            `- (test case id: f25ffac2-c583-458b-9ee1-db22a6ef0423)`, (): void => {
            try {
                ClientHelper.create(conf, capabilities, ``);
                expect(true).toBeFalsy(`Creating a client with an empty string should throw an error, but it doesnt`);
            } catch (e) {
                expect(e.toString()).toContain(`invalid client name ''`);
            }
        });

        it(`with invalid browser name characters, it should throw an invalid character error ` +
            `- (test case id: cbbc5a1b-efe9-4152-800e-dab0a1ba5d8b)`, (): void => {
            const browserNames: string[] = [`A1 2`, `!test`, `$Test`, `A123 `];

            browserNames.map(async (browserName: string): Promise<void> => {
                try {
                    ClientHelper.create(conf, capabilities, browserName);
                    expect(true).toBeFalsy(`Creating a browser with invalid characters should throw an error, but it doesnt!`);
                } catch (e) {
                    expect(e.toString()).toMatch(/^Error: client name (.*) contains invalid characters. Allowed characters are: (.*)/)
                }

            });
        });

        it(`without a name,it should be created with a default name 
        - (test case id: 92f1df53-f16e-4e7d-9def-340910a2d054)`, (): void => {
            const browser: Browser = ClientHelper.create(conf, capabilities);

            expect(ClientHelper.availableSessions.length).toBe(1, `length check for # of browser in ClientWdio failed`);
            expect((ClientHelper.availableSessions[0]) as string).toBe(`client1`);
            expect(ClientHelper.getClient(`client1`)).toEqual(browser);
        });

        it(`with a name, it should set this name 
        - (test case id: f2e8b6f5-d639-445c-95a6-ce2ebd82a1ed)`, (): void => {

            const browser: Browser = ClientHelper.create(conf, capabilities, `theNewBrowserName`);

            expect(ClientHelper.availableSessions.length).toBe(1, `length check for # of browser in ClientWdio failed`);
            expect(ClientHelper.availableSessions[0]).toBe(`theNewBrowserName`);
            expect(ClientHelper.getClient(`theNewBrowserName`)).toEqual(browser);

        });
    });

    describe(`to attach a single browser`, (): void => {
        it(` it should create a new browser in the attachedClientMap
        - (test case id: 95c7191b-f45b-4c9b-b544-0dcdad9133de)`, async (): Promise<void> => {
            const browser: Browser = ClientHelper.attachToSession(conf, capabilities, `123`);

            expect(ClientHelper.availableSessions.length).toBe(0, `length check for # of newly created browser in ClientWdio failed`);
            expect(ClientHelper.availableAttachedSessions.length).toBe(1, `length check for # of attached browser in ClientWdio failed`);
            expect(ClientHelper.availableAttachedSessions[0]).toBe(`client1`);

            const browser2: Browser = ClientHelper.attachToSession(conf, capabilities, `345`);

            expect(ClientHelper.availableSessions.length).toBe(0, `length check for # of newly created browser in ClientWdio failed`);
            expect(ClientHelper.availableAttachedSessions.length).toBe(2, `length check for # of attached browser in ClientWdio failed`);
            expect(ClientHelper.availableAttachedSessions[1]).toBe(`client2`);

            await ClientHelper.cleanup();

            expect(ClientHelper.availableSessions.length).toBe(0, `length check for # of newly created browser in ClientWdio failed`);
            expect(ClientHelper.availableAttachedSessions.length).toBe(2, `length check for # of attached browser in ClientWdio failed`);
            expect(ClientHelper.availableAttachedSessions[1]).toBe(`client2`);

            await ClientHelper.cleanup([browser], true);

            expect(ClientHelper.availableAttachedSessions.length).toBe(1, `attached Sessions should be 0 after cleanup`);
            expect(ClientHelper.availableAttachedSessions[0]).toBe(`client2`);

            await ClientHelper.cleanup([], true);

            expect(ClientHelper.availableAttachedSessions.length).toBe(0, `attached Sessions should be 0 after cleanup`);

        });
    });

    describe(`to start multiple browser`, (): void => {
        it(`without a name, they should be created with a default name ` +
            `- (test case id: 126d1e0a-1b89-4d74-8774-69c0f446084c)`, (): void => {
            const browser1: Browser = ClientHelper.create(conf, capabilities);
            const browser2: Browser = ClientHelper.create(conf, capabilities);

            expect(ClientHelper.availableSessions.length).toBe(2, `length check for # of browser in ClientWdio failed`);
            expect(ClientHelper.availableSessions[0]).toBe(`client1`);
            expect(ClientHelper.availableSessions[1]).toBe(`client2`);
            expect(ClientHelper.getClient(`client1`)).toEqual(browser1);
            expect(ClientHelper.getClient(`client2`)).toEqual(browser2);
        });

        it(`and only the first browser gets a name, the second browser should get a default name 
        - (test case id: 237534dd-ca61-4bb2-8e31-4d9f61be968e)`, (): void => {
            const browser1: Browser = ClientHelper.create(conf, capabilities, `theFirstBrowser`);
            const browser2: Browser = ClientHelper.create(conf, capabilities);

            expect(ClientHelper.availableSessions.length).toBe(2, `length check for # of browser in ClientWdio failed`);
            expect(ClientHelper.availableSessions[0]).toBe(`theFirstBrowser`);
            expect(ClientHelper.availableSessions[1]).toBe(`client2`);
            expect(ClientHelper.getClient(`theFirstBrowser`)).toEqual(browser1);
            expect(ClientHelper.getClient(`client2`)).toEqual(browser2);

        });

        it(`and only the second browser gets a name, the first browser should get a default name ` +
            `- (test case id: 41e48bc0-31bb-47ba-bf11-48ad36d5e065)`, (): void => {
            const browser1: Browser = ClientHelper.create(conf, capabilities);
            const browser2: Browser = ClientHelper.create(conf, capabilities, `theSecondBrowser`);

            expect(ClientHelper.availableSessions.length).toBe(2, `length check for # of browser in ClientWdio failed`);
            expect(ClientHelper.availableSessions[0]).toBe(`client1`);
            expect(ClientHelper.availableSessions[1]).toBe(`theSecondBrowser`);
            expect(ClientHelper.getClient(`client1`)).toEqual(browser1);
            expect(ClientHelper.getClient(`theSecondBrowser`)).toEqual(browser2);
        });

        it(`and both browser get a name, they should be set ` +
            `- (test case id: 436904a1-447f-496a-ba14-9c5aee9beb80)`, (): void => {
            const browser1: Browser = ClientHelper.create(conf, capabilities, `theFirstBrowser`);
            const browser2: Browser = ClientHelper.create(conf, capabilities, `theSecondBrowser`);

            expect(ClientHelper.availableSessions.length).toBe(2, `length check for # of browser in ClientWdio failed`);
            expect(ClientHelper.availableSessions[0]).toBe(`theFirstBrowser`);
            expect(ClientHelper.availableSessions[1]).toBe(`theSecondBrowser`);
            expect(ClientHelper.getClient(`theFirstBrowser`)).toEqual(browser1);
            expect(ClientHelper.getClient(`theSecondBrowser`)).toEqual(browser2);
        });
    });

    describe(`to delete a single browser`, (): void => {

        afterEach(async (): Promise<void> => {
            await ClientHelper.cleanup();
        });

        it(`the browser map should be empty when the browser is deleted ` +
            `- (test case id: 7125c259-247f-4535-a94a-e753a82c1582)`, async (): Promise<void> => {
            const browser = ClientHelper.create(conf, capabilities);

            expect(ClientHelper.availableSessions.length).toBe(1,
                `After creating a browser the length should be 1 but its not.`);
            await ClientHelper.cleanup([browser]);
            expect(ClientHelper.availableSessions.length).toBe(0,
                `After deleting the sole browser the # of available browser should be 0 but its not`);
        });
    });

    describe(`to delete multiple browser`, (): void => {
        let browser1: Browser;
        let browser2: Browser;
        let browser3: Browser;
        let browser4: Browser;

        beforeEach((): void => {
            browser1 = ClientHelper.create(conf, capabilities, `browser_1`);
            browser2 = ClientHelper.create(conf, capabilities, `browser_2`);
            browser3 = ClientHelper.create(conf, capabilities, `browser_3`);
            browser4 = ClientHelper.create(conf, capabilities, `browser_4`);
        });

        afterEach(async (): Promise<void> => {
            await ClientHelper.cleanup();
        });

        it(`at once should remove the browser form the list ` +
            `- (test case id: f6ee38b0-22a9-4eb2-a9d6-7e98c635550f)`, async (): Promise<void> => {
            expect(ClientHelper.availableSessions.length).toEqual(4,
                `4 browser should be available`);
            await ClientHelper.cleanup([browser1, browser2, browser4]);
            expect(ClientHelper.availableSessions.length).toEqual(1,
                `deleting 3 of 4 browser shall lead to 1 remaining browser`);
            expect(ClientHelper.availableSessions).toEqual([`browser_3`]);
        }, 20000);

        it(`after another should remove the browser from the browser map ` +
            `- (test case id: 343a1085-4414-4e2c-8f42-c76545462dcb)`, async (): Promise<void> => {
            expect(ClientHelper.availableSessions.length).toEqual(4,
                `4 browser should be available`);

            // remove the first browser
            await ClientHelper.cleanup([browser2]);
            expect(ClientHelper.availableSessions.length).toEqual(3,
                `deleting 1 of 4 browser shall lead to 3 remaining browser`);
            expect(ClientHelper.availableSessions).toEqual([`browser_1`, `browser_3`, `browser_4`]);

            // remove the second browser
            await ClientHelper.cleanup([browser4]);
            expect(ClientHelper.availableSessions.length).toEqual(2,
                `deleting 1 of 3 browser shall lead to 2 remaining browser`);
            expect(ClientHelper.availableSessions).toEqual([`browser_1`, `browser_3`]);

            // remove the third browser
            await ClientHelper.cleanup([browser1]);
            expect(ClientHelper.availableSessions.length).toEqual(1,
                `deleting 1 of 2 browser shall lead to 1 remaining browser`);
            expect(ClientHelper.availableSessions).toEqual([`browser_3`]);
        });

        it(`which dont exist, should not change the browser map ` +
            `- (test case id: 8e74188b-0a1a-41d0-ad2b-188a9a5884e4)`, async (): Promise<void> => {
            expect(ClientHelper.availableSessions.length).toEqual(4,
                `4 browser should be available`);

            // remove 2 browser
            await ClientHelper.cleanup([browser2, browser4]);
            expect(ClientHelper.availableSessions.length).toEqual(2,
                `deleting 2 of 4 browser shall lead to 2 remaining browser`);
            expect(ClientHelper.availableSessions).toEqual([`browser_1`, `browser_3`]);

            // remove the same browser
            await ClientHelper.cleanup([browser2, browser4]);
            expect(ClientHelper.availableSessions.length).toEqual(2,
                `deleting non existing browser shall not change the browser list`);
            expect(ClientHelper.availableSessions).toEqual([`browser_1`, `browser_3`]);

            // remove the same browser
            await ClientHelper.cleanup([browser2]);
            expect(ClientHelper.availableSessions.length).toEqual(2,
                `deleting non existing browser shall not change the browser list`);
            expect(ClientHelper.availableSessions).toEqual([`browser_1`, `browser_3`]);

            // remove the same browser
            await ClientHelper.cleanup([browser4]);
            expect(ClientHelper.availableSessions.length).toEqual(2,
                `deleting non existing browser shall not change the browser list`);
            expect(ClientHelper.availableSessions).toEqual([`browser_1`, `browser_3`]);
        });
    });
});