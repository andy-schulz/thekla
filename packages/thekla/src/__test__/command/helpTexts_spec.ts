import * as child         from "child_process";
import {mainMenu}         from "../../lib/commands/help";
import * as minimist      from "minimist";
import {TheklaTestResult} from "../__fixtures__/client";

describe(`The Help Text`, () => {
    describe(`on how to use thekla`, () => {
        let forked: child.ChildProcess;
        let output: string[] = [];

        beforeEach(() => {
            forked = child.fork(`${__dirname}/../__fixtures__/client.js`, [], {stdio: [`ignore`, `pipe`, process.stderr, `ipc`]});
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            forked.stdout.on(`data`, function (chunk) {
                output.push(chunk.toString())
            });
        });

        afterEach(() => {
            forked.kill();
            output = [];
        });

        const startTest = (args: minimist.ParsedArgs): Promise<any> => {
            forked.send({args: args});

            return new Promise((resolve, reject) => {
                try {
                    forked.on(`message`, (result: any) => {
                        resolve(result);
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            });
        };

        it(`shall be printed when no config file was specified` +
            `- (test case id: 7333af32-6ea6-4c45-89ce-c1b53e0822a5)`, async () => {
            const args: minimist.ParsedArgs = {
                "_": [],
            };

            return startTest(args)
                .then((result: TheklaTestResult) => {
                    expect(result.specResult).toBeUndefined();
                    expect(output.map((item: string) => item.trim()))
                        .toContain(mainMenu(result.colorSupport ? result.colorSupport.level : 0).trim());
                });
        }, 10000);

        it(`shall be printed when no config file was specified
        - (test case id: 1c423511-c338-4a3c-892a-3e45b784b50c)`, async () => {
            const args: minimist.ParsedArgs = {
                "_": [`_testData/fileDoesNotExist.js`],
            };

            return startTest(args)
                .then((result: TheklaTestResult) => {
                    expect(result.specResult).toBeUndefined();

                    expect(output.length).toEqual(2);

                    expect(output.map((item: string) => item.trim()))
                        .toContain(mainMenu(result.colorSupport ? result.colorSupport.level : 0).trim());

                    expect(output[0])
                        .toMatch(/No Configuration file found at location(.*)_testData\/fileDoesNotExist.js/);

                }).catch((e: Error) => {
                    console.log(e);
                });
        });
    });
});