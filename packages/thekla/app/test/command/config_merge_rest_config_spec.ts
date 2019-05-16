import {configure}             from "log4js";
import {RestApiConfig}         from "thekla-core";
import {TheklaConfig}          from "../../lib/config/TheklaConfig";
import {TheklaConfigProcessor} from "../../lib/config/TheklaConfigProcessor";

configure({
    appenders: { output: {"type": "stdout"}},
    categories: {   default: { appenders: ['output'], level: 'error' },
                    TheklaConfigProcessor: { appenders: ['output'], level: 'debug' } }
});

describe('Passing the rest config', () => {
    const processor = new TheklaConfigProcessor();

    describe('request client name on command line', () => {
        it('should be merged into the config file ' +
            '- (test case id: ea309d36-1549-4cdd-94b6-d01113be44bc)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                }

            };

            const fn: RestApiConfig = {
                    restClient: "request"
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                },
                restConfig: {
                    restClient: "request"
                }
            };

            expect(processor.mergeRestConfigOptions(fn,config)).toEqual(expected);
        });

        it('as an undefined value should not replace the  ' +
            '- (test case id: 713e721f-852b-4520-8904-02dd6f2a627f)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine",
                },
                restConfig: {
                    restClient: "request"
                }
            };

            const fn = {
                restClient: undefined
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                },
                restConfig: {
                    restClient: "request"
                }
            };

            expect(processor.mergeRestConfigOptions(fn,config)).toEqual(expected);
        });
    });

    describe('request client options on command line', () => {
        // require option
        it('with an unknown options ' +
            '- (test case id: 9cec3689-6b1d-4176-a93a-4ae71b801bd8)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                }
            };

            const fn = {
                restClientOptions: {
                    body: {
                        test: "myElement"
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                },
                restConfig: {
                    restClientOptions: {
                        body: {
                            test: "myElement"
                        }
                    }
                }
            };
            const actual = processor.mergeRestConfigOptions(fn,config);

            expect(actual).toEqual(expected);
        });

        it('should replace an existing value ' +
            '- (test case id: 55c3c90f-6a2b-4066-9fc4-89b26accece4)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                },
                restConfig: {
                    restClient: "request",
                    restClientOptions: {
                        proxy: "mzProxy"
                    }
                },

            };

            const fn = {
                restClientOptions: {
                    proxy: "mzProxy2"
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                },
                restConfig: {
                    restClient: "request",
                    restClientOptions: {
                        proxy: "mzProxy2"
                    }
                },
            };
            const actual = processor.mergeRestConfigOptions(fn,config);

            expect(actual).toEqual(expected);
        });
    });
});