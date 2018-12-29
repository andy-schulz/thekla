import * as minimist           from "minimist";
import * as path               from "path";
import * as fs               from "fs";
import {ProcessedTheklaConfig} from "thekla-core";
import {helpText}              from "./commands/help";
import {versionText}           from "./commands/version";
import {Thekla}                from "./thekla";
import * as glob               from "glob";
import {getLogger, Logger}     from "@log4js-node/log4js-api";


export class Command {
    private configFile: string = "";
    private specs: string[] = [];
    private logger: Logger = getLogger("Command");
    private configPath = "";

    constructor(
        private thekla: Thekla,
        private args: minimist.ParsedArgs) {
        let command = args._[0] || 'help';


        if (args.version || args.v) {
            command = 'version'
        }

        if (args.help || args.h) {
            command = 'help'
        }

        switch (command) {
            case 'version':
                versionText();
                break;

            case 'help':
                helpText(args);
                break;

            default:
                this.configFile = `${path.resolve()}/${command}`;
                console.log(this.configFile);
                if(!fs.existsSync(this.configFile)) {
                    const message = `No Configuration file found at location ${this.configFile}`;
                    this.logger.error(message);
                    throw Error(message);
                }
                break;
        }

        this.processOptions(args);
    }

    /**
     * process all options passed via command line
     * @param args
     */
    processOptions(args: minimist.ParsedArgs): void {
        if (args.specs) {
            if (Array.isArray(args.specs)) {
                this.specs = args.specs;
            } else {
                this.specs = [args.specs];
            }
        }
    }



    // loadConfig(): Promise<ProcessedTheklaConfig> {
    // }

    /**
     * load jasmine specs
     * @param speclist
     */
    // loadSpecs(speclist: string[]) {
    //     this.thekla.loadSpecs(speclist);
    // }

    /**
     * start spec execution with jasmine
     */
    run() {
        return this.thekla.loadConfig(this.configFile)
            .then(() => this.thekla.processSpecsFromCommandLine(this.specs))
            .then(() => this.thekla.run());

    }
}