import * as minimist       from "minimist";
import * as path           from "path";
import {helpText}          from "./commands/help";
import {versionText}       from "./commands/version";
import {Thekla}            from "./thekla";
import * as glob           from "glob";
import {getLogger, Logger} from "@log4js-node/log4js-api";



export class Command {
    private configFile: string = "";
    private specs: string[] = [];
    private logger: Logger = getLogger("Command");

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
                this.configFile = command;
                console.log(path.resolve());
                break
        }

        this.processCommands(args);
    }

    /**
     * process all options passed via command line
     * @param args
     */
    processCommands(args: minimist.ParsedArgs): void {
         if(args.specs) {
            this.specs = this.processSpecs(args);

         }
    }

    /**
     * process given spec options
     * @param args - parsed minimist args
     */
    processSpecs(args: minimist.ParsedArgs): string[] {
        let files: string[] = [];

        const globfiles = (globFinder: string[]) => {
            for(const spec of globFinder) {
                const f = glob.sync(spec);
                if(f.length != 0) {
                    files = [...files,...f]
                }
            }
        };

        globfiles(Array.isArray(args.specs) ? args.specs : [args.specs]);

        // remove duplicates before passing the files
        return [...(new Set(files))];
    }

    /**
     * load jasmine specs
     * @param speclist
     */
    loadSpecs(speclist: string[]) {
        this.thekla.loadSpecs(speclist);
    }

    /**
     * start spec execution with jasmine
     */
    run() {
        this.thekla.loadSpecs(this.specs);
        this.thekla.run();
    }
}