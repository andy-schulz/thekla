import {configure}             from "log4js";
import {TheklaConfig}          from "../../lib/config/TheklaConfig";
import {TheklaConfigProcessor} from "../../lib/config/TheklaConfigProcessor";
configure({
    appenders: { output: {"type": "stdout"}},
    categories: {   default: { appenders: ['output'], level: 'error' },
                    TheklaConfigProcessor: { appenders: ['output'], level: 'debug' } }
});

describe('Merge into TheklaConfig', () => {
    const processor = new TheklaConfigProcessor();

    describe('new specs given on command line', () => {
        it('as a single spec - (test case id: 47171f61-65e7-4bba-8fbc-34784da633cc)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                }
            };

            const specs = "a/b/c/d";

            const expected: TheklaConfig = {
                specs: ["a/b/c/d"],
                testFramework: {
                    frameworkName: "jasmine"
                }
            };

            expect(processor.mergeSpecs(specs,config)).toEqual(expected);
        });

        it('as a spec array - (test case id: 3a1545f7-6104-4b2a-a06d-fa18dbcb37bb)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                }
            };

            const specs = ["a","b","c"];

            const expected: TheklaConfig = {
                specs: ["a","b","c"],
                testFramework: {
                    frameworkName: "jasmine"
                }
            };

            expect(processor.mergeSpecs(specs,config)).toEqual(expected);
        });
    });

    describe('new test framework name given on command line', () => {
        it('as a single framework name string - (test case id: 7a628569-5d39-4b6d-929a-1b47f236366b)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                }
            };

            const fn = {
                testFramework: {
                    frameworkName: "cucumber"
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber"
                }
            };

            expect(processor.mergeTestframeworkOptions(fn.testFramework,config)).toEqual(expected);
        });

        it('as an empty framework name string - (test case id: e351a223-889a-490c-9c71-b13b5a861c7f)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                }
            };

            const fn = {
                testFramework: {
                    frameworkName: ""
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: "jasmine"
                }
            };

            expect(processor.mergeTestframeworkOptions(fn.testFramework,config)).toEqual(expected);
        });
    });
    describe('new test framework options given on command line', () => {
        it('with new single require option - (test case id: 9c89d7d2-95b3-45b1-88a4-51943b512744)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber"
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        require: "TESTREQUIRE"
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                    cucumberOptions: {
                        require: ["TESTREQUIRE"]
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it('with new multiple require options - (test case id: e7b29abb-367b-49c2-9908-50e779071d76)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber"
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        require: ["TESTREQUIRE", "TESTREQUIRE2"]
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                    cucumberOptions: {
                        require: ["TESTREQUIRE", "TESTREQUIRE2"]
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it('with an unknown options - (test case id: 9cec3689-6b1d-4176-a93a-4ae71b801bd8)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber"
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        require: ["TESTREQUIRE", "TESTREQUIRE2"],
                        unknown: "THIS IS UNKNOWN BY THEKLA CONFIG"
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                    cucumberOptions: {
                        require: ["TESTREQUIRE", "TESTREQUIRE2"]
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it('with a replacement to the require options - (test case id: 9cec3689-6b1d-4176-a93a-4ae71b801bd8)', () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                    cucumberOptions: {
                        require: ["original"],
                    }
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        require: ["replacement"],
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: "cucumber",
                    cucumberOptions: {
                        require: ["replacement"],
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });
    });
});