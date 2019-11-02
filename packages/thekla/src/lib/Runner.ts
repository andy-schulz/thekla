import {Command}     from "../lib/command";
import {Thekla}      from "../lib/thekla";
import {helpText}    from "../lib/commands/help";
import * as minimist from "minimist";

export const run = (pArgs: minimist.ParsedArgs): Promise<any> => {
    try {
        const thekla = new Thekla();
        const command = new Command(thekla, pArgs);
        return command.run()
    } catch (e) {
        if (e instanceof Error)
            console.log(e.message);
        helpText({_: [`help`]});
        return Promise.reject(e)
    }
};