import {TheklaConfig} from "../../lib/config/ConfigProcessor";
import {Thekla} from "../../lib/thekla";

export interface TheklaTestData {
    config: TheklaConfig;

    /**
     * specs == undefined
     */
    specs?: string | null;
}

const proc = process;

proc.on('message', async (testData: TheklaTestData) => {
    const thekla = new Thekla();

    if(!testData.specs !== null) {
        await thekla.processSpecsFromCommandLine(<string[] | undefined>testData.specs);
    }

    await thekla.processConfig({config: testData.config});
    return thekla.run()
        .then((specResult: any) => {
            // @ts-ignore
            proc.send(specResult);
        })
        .catch((e: any) => {
            // @ts-ignore
            proc.send({ error: e });
        });

});