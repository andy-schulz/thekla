import * as minimist         from "minimist";
import chalk, {ColorSupport} from "chalk";
import {run}                 from "../../lib/Runner";

export interface TheklaTestData {
    args: minimist.ParsedArgs;
}

export interface TheklaTestResult {
    specResult: any;
    colorSupport: ColorSupport | false;
}

const proc = process;

proc.on(`message`, async (testData: TheklaTestData) => {
    // const thekla = new Thekla();
    // const command = new Command(thekla, testData.args);
    // return  command.run()
    run(testData.args)
        .then((specResult: any) => {
            const theklaResult: TheklaTestResult = {
                specResult: specResult,
                colorSupport: chalk.supportsColor
            };

            // send the results in case the call was successful, the result evaluation will be done by the test
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            proc.send(theklaResult);

        })
        .catch((e: any) => {
            // send the results in case the call was NOT successful, again ... the evaluation will be done by the test
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            proc.send({error: e});
        });

});