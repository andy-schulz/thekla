import {Command}                                        from "../../lib/command";
import {Thekla}                                         from "../../lib/thekla";
import * as minimist                                    from "minimist";

export interface TheklaTestData {
    args: minimist.ParsedArgs;
}

const proc = process;

proc.on('message', async (testData: TheklaTestData) => {
    const thekla = new Thekla();
    const command = new Command(thekla, testData.args);
    return  command.run()
        .then((specResult: any) => {
            // @ts-ignore
            proc.send(specResult);
        })
        .catch((e: any) => {
            // @ts-ignore
            proc.send({ error: e });
        });

});