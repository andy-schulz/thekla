import {configure}             from "log4js";
import {TheklaConfig}          from "..";
import {TheklaConfigProcessor} from "..";

configure({
    appenders: { output: {type: `stdout`}},
    categories: {   default: { appenders: [`output`], level: `error` },
                    TheklaConfigProcessor: { appenders: [`output`], level: `error` } }
});

describe(`Merge into TheklaConfig`, () => {
    const processor = new TheklaConfigProcessor();

    describe(`new specs given on command line`, () => {
        it(`as a single spec - (test case id: 47171f61-65e7-4bba-8fbc-34784da633cc)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `jasmine`
                }
            };

            const specs = `a/b/c/d`;

            const expected: TheklaConfig = {
                specs: [`a/b/c/d`],
                testFramework: {
                    frameworkName: `jasmine`
                }
            };

            expect(processor.mergeSpecs(specs,config)).toEqual(expected);
        });

        it(`as a spec array - (test case id: 3a1545f7-6104-4b2a-a06d-fa18dbcb37bb)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `jasmine`
                }
            };

            const specs = [`a`,`b`,`c`];

            const expected: TheklaConfig = {
                specs: [`a`,`b`,`c`],
                testFramework: {
                    frameworkName: `jasmine`
                }
            };

            expect(processor.mergeSpecs(specs,config)).toEqual(expected);
        });
    });

    describe(`new test framework name given on command line`, () => {
        it(`as a single framework name string - (test case id: 7a628569-5d39-4b6d-929a-1b47f236366b)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `jasmine`
                }
            };

            const fn = {
                testFramework: {
                    frameworkName: `cucumber`
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`
                }
            };

            expect(processor.mergeTestframeworkOptions(fn.testFramework,config)).toEqual(expected);
        });

        it(`as an empty framework name string - (test case id: e351a223-889a-490c-9c71-b13b5a861c7f)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `jasmine`
                }
            };

            const fn = {
                testFramework: {
                    frameworkName: ``
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `jasmine`
                }
            };

            expect(processor.mergeTestframeworkOptions(fn.testFramework,config)).toEqual(expected);
        });
    });

    describe(`new test framework options given on command line`, () => {
        // require option
        it(`with an unknown options - (test case id: 9cec3689-6b1d-4176-a93a-4ae71b801bd8)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        require: [`TESTREQUIRE`, `TESTREQUIRE2`],
                        unknown: `THIS IS UNKNOWN BY THEKLA CONFIG`
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        require: [`TESTREQUIRE`, `TESTREQUIRE2`]
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with new single require option - (test case id: 9c89d7d2-95b3-45b1-88a4-51943b512744)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        require: `TESTREQUIRE`
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        require: [`TESTREQUIRE`]
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with new multiple require options - (test case id: e7b29abb-367b-49c2-9908-50e779071d76)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        require: [`TESTREQUIRE`, `TESTREQUIRE2`]
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        require: [`TESTREQUIRE`, `TESTREQUIRE2`]
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with a replacement to the require options - (test case id: 9cec3689-6b1d-4176-a93a-4ae71b801bd8)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        require: [`original`],
                    }
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        require: [`replacement`],
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        require: [`replacement`],
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        // Tags option
        it(`with new single tags option - (test case id: 2d14cd88-569a-47a2-8112-33c3511b09ca)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        tags: `@Focus`
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        tags: [`@Focus`]
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with new multiple tags options - (test case id: 9af82806-0607-47e1-8389-de98d16664a2)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        tags: [`@TAGS`, `@tags`]
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        tags: [`@TAGS`, `@tags`]
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with a replacement to the tags options - (test case id: 1ea0ebc5-bad9-497f-b6a5-f62c71e83aa6)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        tags: [`@original`],
                    }
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        tags: [`@replacement`],
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        tags: [`@replacement`],
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with an empty replacement to the tags options - (test case id: bc197e55-2413-4318-8d0e-20d623d216fc)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        tags: [`@original`],
                    }
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        tags: ``,
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        tags: undefined,
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        // format option
        it(`with new single format option - (test case id: 7f404e2b-0748-4e4a-9011-e0bf020285d4)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        format: `myNewReportFormatter`
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        format: [`myNewReportFormatter`]
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with new multiple format options - (test case id: a48f3c2c-5166-4964-939e-5bd4c566dfb8)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        format: [`format1`, `format2`]
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        format: [`format1`, `format2`]
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with a replacement to the format options - (test case id: 00bab9bb-2537-4efc-b78a-d2f35ecafe0c)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        format: [`original format`],
                    }
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        format: [`the replacement format`],
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        format: [`the replacement format`],
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with an empty replacement to the format options - (test case id: 09fd0dd4-9aef-4217-bdc5-405f8fb858ad)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        format: [`original format`],
                    }
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        format: ``,
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        format: undefined,
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        // world parameter
        it(`with an new empty worldParameter - (test case id: 0ec768b4-6c6e-4a2c-ab93-3ed8edc7c263)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                    }
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        worldParameters: ``,
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with an new worldParameter attribute - (test case id: 0453934a-b4d9-43e6-bcd6-c2671c9352ba)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        worldParameters: {
                            proxy: `testproxy`
                        }
                    }
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        worldParameters: {
                            attribute: `testattribute`
                        },
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        worldParameters: {
                            proxy: `testproxy`,
                            attribute: `testattribute`
                        }
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with an new empty worldParameter - (test case id: c58a57c0-14bb-4bc5-ad93-6d06e64bc913)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        worldParameters: {
                            proxy: `testproxy`
                        }
                    }
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        worldParameters: {
                        },
                    }
                }
            };

            const expected: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        worldParameters: {
                            proxy: `testproxy`,
                        }
                    }
                }
            };
            const actual = processor.mergeTestframeworkOptions(fn.testFramework,config);
            expect(actual).toEqual(expected);
        });

        it(`with an new string worldParameter - (test case id: f7640175-e0da-441f-b294-77e06aebb024)`, () => {
            const config: TheklaConfig = {
                testFramework: {
                    frameworkName: `cucumber`,
                    cucumberOptions: {
                        worldParameters: {
                            proxy: `testproxy`
                        }
                    }
                }
            };

            const fn = {
                testFramework: {
                    cucumberOptions: {
                        worldParameters: `worldParameters`,
                    }
                }
            };

            try {
                processor.mergeTestframeworkOptions(fn.testFramework,config);
                expect(false).toBeTruthy(`processor.mergeTestframeworkOptions should throw an Error, but it doesnt.`);
            } catch (e) {
                expect(e.toString()).toContain(`Can't parse the World Parameter worldParameters`);
                expect(e.name).toEqual(`Error`);
            }
        });
    });
});