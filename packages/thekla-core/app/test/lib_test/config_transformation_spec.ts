import {DesiredCapabilities, ProxyType} from "../../config/DesiredCapabilities";
import {ServerConfig}                   from "../../config/ServerConfig";
import {transformToWdioConfig}          from "../../driver/lib/config/config_transformation";

describe(`creating the wdio config`, (): void => {
    describe(`with no serverAddress values`, (): void => {
        it(`should return an object only containing the capabilities (serverAddress is undefined)
        - (test case id: c84c4b74-fd06-413c-b402-5a8265c439bf)`, (): void => {
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`
            };

            expect(transformToWdioConfig(serverConfig, capabilities))
                .toEqual({capabilities: {browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`}})
        });

        it(`should return an object only containing the capabilities (serverAddress is empty)
        - (test case id: c9363f5f-095d-4128-90e2-e28aefbb4279)`, (): void => {
            const serverConfig: ServerConfig = {
                serverAddress: {}
            };

            const capabilities: DesiredCapabilities = {
                browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`
            };

            expect(transformToWdioConfig(serverConfig, capabilities))
                .toEqual({capabilities: {browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`}})
        });

        it(`should return an object only containing the capabilities (serverAddress contains empty values)
        - (test case id: 516bdcf4-7450-4915-b88c-a892ff69d87e)`, (): void => {
            const serverConfig: ServerConfig = {
                serverAddress: {
                    hostname: undefined,
                    port: undefined,
                    protocol: undefined,
                    path: undefined,
                }
            };

            const capabilities: DesiredCapabilities = {
                browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`
            };

            expect(transformToWdioConfig(serverConfig, capabilities))
                .toEqual({capabilities: {browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`}})
        });
    });

    describe(`with an populated serverAddress`, () => {
        it(`should return an object containing all address values 
        - (test case id: f09ca2bd-d6d1-4dba-9a46-e3bad8e8165b)`, () => {
            const serverConfig: ServerConfig = {
                serverAddress: {
                    hostname: `my.hostname.com`,
                    port: 1234,
                    protocol: `https`,
                    path: `/test/all`,
                }
            };

            const capabilities: DesiredCapabilities = {
                browserName: `chrome`
            };

            expect(transformToWdioConfig(serverConfig, capabilities))
                .toEqual({
                    hostname: `my.hostname.com`,
                    port: 1234,
                    protocol: `https`,
                    path: `/test/all`,
                    capabilities: {browserName: `chrome`}
                })
        });
    });

    describe(`with a proxy property`, (): void => {
        it(`should set noproxy when direct is given 
        - (test case id: 8d140c38-25e7-4896-8b53-043324aef4b7)`, (): void => {
            const serverConfig: ServerConfig = {
            };

            const capabilities: DesiredCapabilities = {
                browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
                proxy: {
                    proxyType: `direct`
                }
            };

            // @ts-ignore // bug in webdriver direct is not defined for option ... typings says noproxy
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual({
                capabilities: {
                    browserName: `chrome`,
                    proxy: {
                        proxyType: `direct`,
                    }
                }
            })
        });

        it(`should set system when system is given 
        - (test case id: b4f498d9-3f51-4a74-98ea-23a3f2c988ce)`, (): void => {
            const serverConfig: ServerConfig = {
            };

            const capabilities: DesiredCapabilities = {
                browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
                proxy: {
                    proxyType: `system`
                }
            };

            expect(transformToWdioConfig(serverConfig, capabilities))
                .toEqual({
                    capabilities: {
                        browserName: `chrome`,
                        proxy: {
                            proxyType: `system`
                        }
                    }
                })
        });
    });

    describe(`with chrome options`, (): void => {
        it(`should return the chrome options inside capabilities 
        - (test case id: e404f1b6-5171-4e47-a982-112228fb0e3a)`, (): void => {
            const serverConfig: ServerConfig = {
            };

            const capabilities: DesiredCapabilities = {
                "goog:chromeOptions": {
                    binary: `/doesNotExist`
                }
            };

            const expectedConf = {
                capabilities: {
                    "goog:chromeOptions": {
                        binary: `/doesNotExist`
                    }
                }
            };
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)
        });
    });

    describe(`with firefox options`, (): void => {
        it(`should return the firefox options inside capabilities 
        - (test case id: 62ae6161-4894-4d37-83bc-00ee8cfb56cb)`, (): void => {
            const serverConfig: ServerConfig = {
            };

            const capabilities: DesiredCapabilities = {
                "moz:firefoxOptions": {
                    binary: `/doesNotExist`
                }
            };

            const expectedConf = {
                capabilities: {
                    "moz:firefoxOptions": {
                        binary: `/doesNotExist`
                    }
                }
            };
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)
        });
    });

    describe(`with appium options`, (): void => {

        it(`should return the options without general appium options set
        - (test case id: e42526bc-bdf9-4d26-9ff0-4fd009617460)`, (): void => {
            const serverConfig: ServerConfig = {
            };

            const capabilities: DesiredCapabilities = {
                platformName: `android`
            };

            const expectedConf = {
                capabilities: {
                    platformName: `android`
                }
            };
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)

        });

        it(`should return the options when only appium options are set
        - (test case id: e42526bc-bdf9-4d26-9ff0-4fd009617460)`, (): void => {
            const serverConfig: ServerConfig = {
            };

            const capabilities: DesiredCapabilities = {
                appium: {
                    deviceName: `testdevice`
                }
            };

            const expectedConf = {
                capabilities: {
                    deviceName: `testdevice`
                }
            };
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)

        });

        it(`should return the options when android options are set 
        - (test case id: 15127cfb-4f50-4a2a-b335-fd594995e4db)`, (): void => {
            const serverConfig: ServerConfig = {
            };

            const capabilities: DesiredCapabilities = {
                appium: {
                    deviceName: `testdevice`,
                    android: {
                        appPackage: `thePackage`
                    }
                }
            };

            const expectedConf = {
                capabilities: {
                    deviceName: `testdevice`,
                    appPackage: `thePackage`
                }
            };
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)
        });

        it(`should return the options when iOS options are set 
        - (test case id: a76fe9b3-9a69-48b8-8d1c-e30e144f3300)`, (): void => {
            const serverConfig: ServerConfig = {
            };

            const capabilities: DesiredCapabilities = {
                appium: {
                    deviceName: `testdevice`,
                    ios: {
                        appName: `TheAppName`
                    }
                }
            };

            const expectedConf = {
                capabilities: {
                    deviceName: `testdevice`,
                    appName: `TheAppName`
                }
            };
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)
        });
    });
});