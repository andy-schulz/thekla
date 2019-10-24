import {getConfiguredTheklaGlobal, TheklaConfig} from "..";

describe(`Creating the global object`, (): void => {
    describe(`from a minimal thekla config`, (): void => {
        it(`should create an empty global config object with config retriever function
        - (test case id: 865d158f-5683-47cb-87b7-ac39e2ac7412)`, (): void => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                }
            };

            const globalConfig = getConfiguredTheklaGlobal(config);

            expect(globalConfig.config).toEqual(expected);
            expect(typeof globalConfig.serverConfig).toBe(`function`,
                `globalConfig.serverConfig is not a function`);
            expect(typeof globalConfig.serverConfig()).toBe(`object`,
                `globalConfig.serverConfig does not return an object`);
            expect(globalConfig.serverConfig()).toEqual({},
                `globalConfig.serverConfig does not return an empty object`);

            expect(typeof globalConfig.capabilities).toBe(`function`,
                `globalConfig.capabilities is not a function`);
            expect(typeof globalConfig.capabilities()).toBe(`object`,
                `globalConfig.capabilities does not return an object`);
            expect(globalConfig.capabilities()).toEqual({},
                `globalConfig.capabilities does not return an empty object`);

            expect(typeof globalConfig.restConfig).toBe(`function`,
                `globalConfig.restConfig is not a function`);
            expect(typeof globalConfig.restConfig()).toBe(`object`,
                `globalConfig.restConfig does not return an object`);
            expect(globalConfig.restConfig()).toEqual({},
                `globalConfig.restConfig does not return an empty object`);
        });
    });
});