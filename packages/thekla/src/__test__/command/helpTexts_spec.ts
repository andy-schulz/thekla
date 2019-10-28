import * as child         from "child_process";
import {mainMenu, menus}  from "../../lib/commands/help";
import * as minimist      from "minimist";
import {TheklaTestResult} from "../data/client";

describe('The Help Text', () => {
    describe('on how to use thekla', () => {
        let forked: child.ChildProcess;
        let output: string = "";

        beforeEach(() => {
            forked = child.fork(`${__dirname}/../data/client.js`, [], {stdio: ['ignore', 'pipe', process.stderr, 'ipc']});
            // @ts-ignore
            forked.stdout.on("data", function (chunk) {
                output = chunk.toString()
            });
        });

        afterEach(() => {
            forked.kill();
            output = "";
        });

        const startTest = (args:minimist.ParsedArgs): Promise<any> => {
            forked.send({ args: args });

            return new Promise( (resolve, reject) => {
                try {
                    forked.on('message', (result: any) => {
                        resolve(result);
                    });
                } catch (e) {
                    const message = `Error on forked process ${e} ${Error().stack}`;
                    reject(message);
                }
            });
        };

        it('shall be printed when no config file was specified' +
            '- (test case id: 7333af32-6ea6-4c45-89ce-c1b53e0822a5)', async () => {
            const args: minimist.ParsedArgs = {
                "_": [],
            };

            return startTest(args)
                .then((result: TheklaTestResult) => {
                    expect(result.specResult).toBeUndefined();
                    expect(output.trim()).toEqual(mainMenu(result.colorSupport ?  result.colorSupport.level: 0).trim());
                });
        }, 1000000);
    });
});