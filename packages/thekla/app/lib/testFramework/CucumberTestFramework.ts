import {frame}           from "thekla-core";
import {CucumberOptions} from "../config/ConfigProcessor";
import {getLogger}       from "@log4js-node/log4js-api";

export class CucumberTestFramework {
    private readonly logger = getLogger("CucumberTestFramework");

    private formatOptions: string[] =  [];
    constructor(private frameworkOptions: CucumberOptions) {

        if(frameworkOptions) {
            this.processFrameworkOptions(frameworkOptions);
        }
    }

    private processFrameworkOptions(frameworkOptions: CucumberOptions) {
        if(frameworkOptions.format) {
            if(!Array.isArray(frameworkOptions.format)) {
                const message = `Format options should be an Array of strings but it is: ${JSON.stringify(frameworkOptions.format)}`;
                this.logger.error(message);
                throw new Error(message);
            }

            for(let element of frameworkOptions.format) {
                this.formatOptions.push("--format");
                this.formatOptions.push(element);
            }
        }
    }

    public run(specs: string): Promise<any> {
        this.logger.debug(`Starting Cucumber tests`);

        return new Promise((resolve, reject) => {
            const Cucumber = require('cucumber');

            const cwd = process.cwd();

            // add argument cli options
            let args: string[] = [];

            args.push(process.argv[0]);
            args.push(cwd + "\\node_modules\\cucumber\\bin\\cucumber-js");
            args.push(specs);

            args = [...args, ...this.formatOptions];

            this.logger.debug(JSON.stringify(Cucumber, null, "\t"));

            const opts =  {
                argv: args,
                cwd: cwd,
                stdout: process.stdout
            };

            new Cucumber.Cli(opts).run()
                .then(resolve)
                .catch(reject);
        });
    }
}