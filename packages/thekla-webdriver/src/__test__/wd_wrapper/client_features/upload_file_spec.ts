import {DesiredCapabilities, ServerConfig}                                   from "@thekla/config";
import {getStandardTheklaDesiredCapabilities, getStandardTheklaServerConfig} from "@thekla/support";
import {Browser, ClientHelper}                                               from "../../..";


describe(`Upload a file`, () => {

    const conf: ServerConfig = getStandardTheklaServerConfig();
    const capabilities: DesiredCapabilities =
        getStandardTheklaDesiredCapabilities(`upload_file_spec.ts`);

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });

    afterAll((): void => {
        ClientHelper.cleanup();
    });

    describe(`to the selenium server`, () => {
        let browser: Browser;

        beforeAll((): void => {
            browser = ClientHelper.create(conf, capabilities);
        });

        it(`should return the local file path
        test id: 30804244-30cd-414d-9bf7-86c938f28df8`, async () => {

            const fileName = await browser.uploadFile(`${__dirname}/../../../../__fixtures__/upload.log`);
            expect(typeof fileName).toEqual(`string`);
            expect(fileName).toContain(`upload.log`);
        });

        it(`should fail when the file does not exist`, async () => {

            await browser.uploadFile(`doesNotExist.log`)
                         .then(() => {
                             expect(true).toBeFalsy(`uploadFile should throw an error but it doesnt`)
                         })
                         .catch((e) => {
                             expect(e.toString()).toContain(`no such file or directory`)
                         })
        })
    });
});