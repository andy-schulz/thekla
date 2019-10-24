import {RestClientConfig, getConfiguredTheklaGlobal, TheklaConfig} from "..";
import _                                                           from "lodash";

describe(`The config retrievers`, (): void => {
    const basicConfig: TheklaConfig = {
        serverConfig: {
            default: `myServerConfig2`,
            myServerConfig: {
                serverAddress: {}
            },
            myServerConfig2: {
                serverAddress: {
                    hostname: `host2`
                }
            }
        },
        capabilities: {
            default: `myCapabilities2`,
            myCapabilities: {
                browserName: `myBrowser`
            },
            myCapabilities2: {
                browserName: `myBrowser2`
            }
        },
        restConfig: {
            default: `myRestConfig2`,
            myRestConfig: {
                restClientName: `request`
            },
            myRestConfig2: {
                restClientName: `request`,
                requestOptions: {
                    host: `restClientHost2`
                }
            }
        },
        testFramework: {
            frameworkName: `jasmine`
        }
    };

    describe(`should throw an error `, (): void => {

        it(`when no default value is set 
        - (test case id: 7310d772-1f49-4b30-9792-e28e0639d843)`, (): void => {
            const merge = {
                serverConfig: {
                    default: ``,
                },
                capabilities: {
                    default: ``,
                },
                restConfig: {
                    default: ``,
                },
            };

            const config = _.merge(_.cloneDeep(basicConfig), merge);

            const globalConfig = getConfiguredTheklaGlobal(config);
            expect(globalConfig.serverConfig).toThrowError(`
Please specify a default config for type ServerConfig:

Expected:
    serverConfig: {
        default: "myConfig",
        myConfig: { ... } // is of type ServerConfig
        myConfig2: { ... } // is of type ServerConfig
    }

But got: 
    serverConfig: {
        "default": "",
        "myServerConfig": {
                "serverAddress": {}
        },
        "myServerConfig2": {
                "serverAddress": {
                        "hostname": "host2"
                }
        }
}`);
            expect(globalConfig.capabilities).toThrowError(`
Please specify a default config for type DesiredCapabilities:

Expected:
    capabilities: {
        default: "myConfig",
        myConfig: { ... } // is of type DesiredCapabilities
        myConfig2: { ... } // is of type DesiredCapabilities
    }

But got: 
    capabilities: {
        "default": "",
        "myCapabilities": {
                "browserName": "myBrowser"
        },
        "myCapabilities2": {
                "browserName": "myBrowser2"
        }
}`);

            expect(globalConfig.restConfig).toThrowError(`
Please specify a default config for type RestClientConfig:

Expected:
    restConfig: {
        default: "myConfig",
        myConfig: { ... } // is of type RestClientConfig
        myConfig2: { ... } // is of type RestClientConfig
    }

But got: 
    restConfig: {
        "default": "",
        "myRestConfig": {
                "restClientName": "request"
        },
        "myRestConfig2": {
                "restClientName": "request",
                "requestOptions": {
                        "host": "restClientHost2"
                }
        }
}`);
        });

        it(`when the default value does not match a named config
        - (test case id: 4298e472-a0af-4e5d-aae1-0725b1e93272)`, (): void => {
            const merge = {
                serverConfig: {
                    default: `doesNotExist`,
                },
                capabilities: {
                    default: `doesNotExist`,
                },
                restConfig: {
                    default: `doesNotExist`,
                },
            };

            const config = _.merge(_.cloneDeep(basicConfig), merge);

            const globalConfig = getConfiguredTheklaGlobal(config);
            expect(globalConfig.serverConfig).toThrowError(`
Configuration does not contain a ServerConfig object called 'doesNotExist':

Expected:
    serverConfig: {
        default: "doesNotExist",
        doesNotExist: { ... } // is of type ServerConfig
    }

But got:
    serverConfig: {
        "default": "doesNotExist",
        "myServerConfig": {
                "serverAddress": {}
        },
        "myServerConfig2": {
                "serverAddress": {
                        "hostname": "host2"
                }
        }
}`);
            expect(globalConfig.capabilities).toThrowError(`
Configuration does not contain a DesiredCapabilities object called 'doesNotExist':

Expected:
    capabilities: {
        default: "doesNotExist",
        doesNotExist: { ... } // is of type DesiredCapabilities
    }

But got:
    capabilities: {
        "default": "doesNotExist",
        "myCapabilities": {
                "browserName": "myBrowser"
        },
        "myCapabilities2": {
                "browserName": "myBrowser2"
        }
}`);

            expect(globalConfig.restConfig).toThrowError(`
Configuration does not contain a RestClientConfig object called 'doesNotExist':

Expected:
    restConfig: {
        default: "doesNotExist",
        doesNotExist: { ... } // is of type RestClientConfig
    }

But got:
    restConfig: {
        "default": "doesNotExist",
        "myRestConfig": {
                "restClientName": "request"
        },
        "myRestConfig2": {
                "restClientName": "request",
                "requestOptions": {
                        "host": "restClientHost2"
                }
        }
}`);
        });

        it(`when the named server config does not exist 
        - (test case id: 18f5451d-ba11-45e3-b187-30df4d0e12ee)`, (): void => {
            const config = _.cloneDeep(basicConfig);

            const theklaGlobal = getConfiguredTheklaGlobal(config);

            expect(() => theklaGlobal.serverConfig(`doesNotExist`)).toThrowError(`
Configuration does not contain a ServerConfig object called 'doesNotExist':

Expected:
    serverConfig: {
        default: "aDefaultConfig",
        doesNotExist: { ... } // is of type ServerConfig
    }

But got:
    serverConfig: {
        "default": "myServerConfig2",
        "myServerConfig": {
                "serverAddress": {}
        },
        "myServerConfig2": {
                "serverAddress": {
                        "hostname": "host2"
                }
        }
}`)
        });

        it(`when the named capabilities object does not exist 
        - (test case id: eea2118d-e5ca-4b77-8785-fd0e157c7a89)`, (): void => {
            const config = _.cloneDeep(basicConfig);

            const theklaGlobal = getConfiguredTheklaGlobal(config);

            expect(() => theklaGlobal.capabilities(`doesNotExist`)).toThrowError(`
Configuration does not contain a DesiredCapabilities object called 'doesNotExist':

Expected:
    capabilities: {
        default: "aDefaultConfig",
        doesNotExist: { ... } // is of type DesiredCapabilities
    }

But got:
    capabilities: {
        "default": "myCapabilities2",
        "myCapabilities": {
                "browserName": "myBrowser"
        },
        "myCapabilities2": {
                "browserName": "myBrowser2"
        }
}`)
        });

        it(`when the named rest config object does not exist 
        - (test case id: 64b90c90-74c8-41b0-92d6-87fd4e0323f8)`, (): void => {
            const config = _.cloneDeep(basicConfig);

            const theklaGlobal = getConfiguredTheklaGlobal(config);

            expect(() => theklaGlobal.restConfig(`doesNotExist`)).toThrowError(`
Configuration does not contain a RestClientConfig object called 'doesNotExist':

Expected:
    restConfig: {
        default: "aDefaultConfig",
        doesNotExist: { ... } // is of type RestClientConfig
    }

But got:
    restConfig: {
        "default": "myRestConfig2",
        "myRestConfig": {
                "restClientName": "request"
        },
        "myRestConfig2": {
                "restClientName": "request",
                "requestOptions": {
                        "host": "restClientHost2"
                }
        }
}`)
        });
    });

    describe(`on an empty thekla config`, (): void => {

        it(`should return empty configs
        - (test case id: 745a7abe-60f3-49f5-bf20-ed0aedb8bcc4)`, (): void => {
            const config: TheklaConfig = {testFramework: {frameworkName: `jasmine`}};

            const globalConfig = getConfiguredTheklaGlobal(config);
            expect(globalConfig.serverConfig()).toEqual({});
            expect(globalConfig.capabilities()).toEqual({});
            expect(globalConfig.serverConfig()).toEqual({});
        });

        it(`should return the basic configs 
        - (test case id: ea8d728c-79bb-45f9-94c7-8872f894f2a6)`, (): void => {
            const config: TheklaConfig = {
                serverConfig: {
                    serverAddress: {}
                },
                capabilities: {
                    browserName: `myBrowser`
                },
                restConfig: {
                    restClientName: `request`
                },
                testFramework: {frameworkName: `jasmine`}
            };

            const globalConfig = getConfiguredTheklaGlobal(config);
            expect(globalConfig.serverConfig()).toEqual({serverAddress: {}});
            expect(globalConfig.capabilities()).toEqual({browserName: `myBrowser`});
            expect(globalConfig.restConfig()).toEqual({restClientName: `request`});
        });

    });

    describe(`when called by name`, (): void => {

        it(`should return the named server config
        - (test case id: badddfc4-fd4a-4ebf-b909-abd4e07a9a34)`, (): void => {
            const merge = {
                serverConfig: {
                    default: `myServerConfig2`
                }
            };

            const config = _.merge(_.cloneDeep(basicConfig), merge);

            const expectedServerConf = {
                serverAddress: {
                    hostname: `host2`
                }
            };

            const theklaGlobal = getConfiguredTheklaGlobal(config);
            expect(theklaGlobal.serverConfig()).toEqual(expectedServerConf);

        });

        it(`should return the named capabilities config
        - (test case id: fbf19058-6a56-42b1-b8a9-b47a4e7a0592)`, (): void => {
            const merge = {
                capabilities: {
                    default: `myCapabilities2`
                }
            };

            const config = _.merge(_.cloneDeep(basicConfig), merge);

            const expectedCapabilities = {
                browserName: `myBrowser2`
            };

            const theklaGlobal = getConfiguredTheklaGlobal(config);
            expect(theklaGlobal.capabilities()).toEqual(expectedCapabilities);

        });

        it(`should return the named rest config
        - (test case id: c415250f-4aa7-41ba-965a-6bb0b6a57ee6)`, (): void => {
            const merge = {
                restConfig: {
                    default: `myRestConfig2`
                }
            };

            const config = _.merge(_.cloneDeep(basicConfig), merge);

            const expectedRestClientConfig: RestClientConfig = {
                restClientName: `request`,
                requestOptions: {
                    host: `restClientHost2`
                }
            };

            const theklaGlobal = getConfiguredTheklaGlobal(config);
            expect(theklaGlobal.restConfig()).toEqual(expectedRestClientConfig);

        });
    });
});