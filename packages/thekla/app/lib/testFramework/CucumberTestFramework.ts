import {CucumberOptions} from "../config/ConfigProcessor";
import {getLogger}       from "@log4js-node/log4js-api";
import {TheklaCliOpts}   from "../thekla";

export class CucumberTestFramework {
    private readonly logger = getLogger("CucumberTestFramework");
    private requireOptions: string[] = [];

    private formatOptions: string[] =  [];
    constructor(
        private frameworkOptions: CucumberOptions,
        private cliOptions: TheklaCliOpts) {

        if(frameworkOptions) {
            this.processFrameworkOptions(cliOptions, frameworkOptions);
        }
    }

    private processFrameworkOptions(cliOptions: TheklaCliOpts, frameworkOptions: CucumberOptions) {

        this.processOptions(cliOptions.require, frameworkOptions.require, "--require");
        this.processOptions(cliOptions.format, frameworkOptions.format, "--format");
    }


    private processOptions(cliOptions: undefined | string | string[], confOptions: undefined | string[], optsString: string) {
        this.logger.debug(`processing ${optsString} option with CLI: ${cliOptions} and CONF: ${confOptions}`);

        const processOptions = (options: string[]) => {
            for(let opt of options) {
                this.requireOptions.push(optsString);
                this.requireOptions.push(opt);
            }
        };

        const processCliOptions = (options: string | string[]) => {
            processOptions (Array.isArray(options) ? options : [options])
        };

        if(cliOptions && confOptions) {
            this.logger.warn(`${optsString} are specified on command line and in the config file. I am going to use the command line options and ignore the config file.`);
            processCliOptions(cliOptions);
        } else if (cliOptions) {
            processCliOptions(cliOptions);
        } else if (confOptions) {
            processOptions(confOptions)
        }
    }


    public run(specs: string): Promise<any> {
        this.logger.debug(`Starting Cucumber tests`);

        return new Promise((resolve, reject) => {

            const result = (res: any) => {
                this.logger.debug(`Cucumber: Result: ${JSON.stringify(res)}`);
                resolve(res);
            };


            const Cucumber = require('cucumber');

            const cwd = process.cwd();

            // add argument cli options
            let args: string[] = [];

            args.push(process.argv[0]);
            args.push(cwd + "\\node_modules\\cucumber\\bin\\cucumber-js");
            args.push(specs);

            args = [...args, ...this.formatOptions];
            args = [...args, ...this.requireOptions];

            this.logger.debug(JSON.stringify(Cucumber, null, "\t"));

            const opts =  {
                argv: args,
                cwd: cwd,
                stdout: process.stdout
            };

            new Cucumber.Cli(opts).run()
                .then(result)
                .catch(reject);
        });
    }
}