import fsExtra        from "fs-extra";
import {Command}      from "../../lib/command";
import {TheklaConfig} from "@thekla/config";
import {Thekla}       from "../../lib/thekla";
import {
    createCucumberTestFiles,
    createTheklaConfigFile,
    CucumberTestFileResult,
    TheklaConfigFileResult
}                     from "../__fixtures__/testFiles";
import * as minimist  from "minimist";

describe(`When Passing the World Parameters to the Cucumber Feature Files`, () => {
    let file1Result: CucumberTestFileResult;
    let theklaConfigResult: TheklaConfigFileResult;

    beforeEach(async () => {
    });

    afterEach(async () => {
        await fsExtra.remove(file1Result.baseDir);
    });

    afterEach(() => {
        if(theklaConfigResult.baseDir) {
            fsExtra.remove(theklaConfigResult.baseDir);
        }

        // reset result after deleting the test dir
        theklaConfigResult = {baseDir: ``, confFilePath: ``, relativeConfFilePath: ``};
    });

    it(`it should be accessible form "this".  ` +
        `- (test case id: f93a221e-9e70-4791-849f-45924891aebe)`, async () => {

        const testWorldParameters = {
            proxy: `test`
        };

        file1Result = await createCucumberTestFiles(`worldParameter`,
            ``,
            ``,
            `WorldParameter`,
            JSON.stringify(testWorldParameters));

        const testConfig: TheklaConfig = {
            testFramework: {
                frameworkName: `cucumber`,
                cucumberOptions: {
                    worldParameters: testWorldParameters
                }
            }
        };

        theklaConfigResult = await createTheklaConfigFile(testConfig, `SettingWorldParameter`);

        const args: minimist.ParsedArgs = {
            "_": [theklaConfigResult.relativeConfFilePath],
            "specs": `${file1Result.relativeFeatureFilePath}`,
        };

        const thekla = new Thekla();
        const command = new Command(thekla, args);
        await command.run().then((specResult: any) => {
            expect(specResult.success).toBeTruthy();
        });
    });

    it(`and it is overwritten by an command line option, it should be accessible form "this".  ` +
        `- (test case id: 3e59f251-40ab-4fa3-9724-0cb018266f9e)`, async () => {

        const testWorldParameters = {
            proxy: `new Proxy`
        };

        file1Result = await createCucumberTestFiles(`worldParameter`,
            ``,
            ``,
            `WorldParameter`,
            JSON.stringify(testWorldParameters));

        const testConfig: TheklaConfig = {
            testFramework: {
                frameworkName: `cucumber`,
                cucumberOptions: {
                    worldParameters: {
                        proxy: `test`
                    }
                }
            }
        };

        theklaConfigResult = await createTheklaConfigFile(testConfig, `ReplacingWorldParameter`);

        const a = [
            theklaConfigResult.relativeConfFilePath,
            `--specs=${file1Result.relativeFeatureFilePath}`,
            `--testFramework.cucumberOptions.worldParameters.proxy=${testWorldParameters.proxy}`
        ];

        const args: minimist.ParsedArgs = require(`minimist`)(a);

        const thekla = new Thekla();
        const command = new Command(thekla, args);
        await command.run().then((specResult: any) => {
            expect(specResult.success).toBeTruthy();
        });
    });

});