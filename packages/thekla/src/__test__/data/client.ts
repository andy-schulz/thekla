import {Command}             from "../../lib/command";
import {Thekla}              from "../../lib/thekla";
import * as minimist         from "minimist";
import chalk, {ColorSupport} from "chalk";

export interface TheklaTestData {
    args: minimist.ParsedArgs;
}

export interface TheklaTestResult {
    specResult: any;
    colorSupport: ColorSupport;
}

const proc = process;

proc.on('message', async (testData: TheklaTestData) => {
    const thekla = new Thekla();
    const command = new Command(thekla, testData.args);
    return  command.run()
        .then((specResult: any) => {
            const theklaResult: TheklaTestResult = {
                specResult: specResult,
                colorSupport: chalk.supportsColor};

            // @ts-ignore
            proc.send(theklaResult);

        })
        .catch((e: any) => {
            // @ts-ignore
            proc.send({ error: e });
        });

});