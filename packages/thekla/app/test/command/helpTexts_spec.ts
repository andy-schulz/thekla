import * as child    from "child_process";
import {menus}       from "../../lib/commands/help";
import * as minimist from "minimist";

describe('The Help Text', () => {
    describe('on how to use thekla', () => {
        let forked: child.ChildProcess;
        let output: string = "";

        beforeEach(() => {
            forked = child.fork(`${__dirname}/../data/client.js`, [], {stdio: ['ignore', 'pipe', process.stderr, 'ipc']});
            forked.stdout.on("data", function (chunk) { output = chunk.toString()});
        });

        afterEach(() => {
            forked.kill();
            output = "";
        });

        const startTest = (args:minimist.ParsedArgs): Promise<any> => {
            forked.send({ args: args });

            return new Promise( (resolve, reject) => {
                try {
                    forked.on('message', (specResult: any) => {
                        resolve(specResult);
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
                .then((specResult: any) => {
                    expect(specResult.error).toEqual({});
                    console.log(`Output length: `, output.trim().length);
                    console.log(`Expected menu length: `, menus.main.trim().length);
                    // expect(output.trim().length === menus.main.trim()).toBeTruthy()
                });
        });
    });
});