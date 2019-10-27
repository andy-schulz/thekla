import {CucumberOptions} from "@thekla/config";
import {getLogger}       from "@log4js-node/log4js-api";

export class CucumberTestFramework {
    private readonly logger = getLogger(`CucumberTestFramework`);
    private ccOptionsList: string[] = [];

    private formatOptions: string[] =  [];
    constructor(
        private frameworkOptions: CucumberOptions) {

        if(frameworkOptions) {
            this.processFrameworkOptions(frameworkOptions);
        }
    }

    private processFrameworkOptions(frameworkOptions: CucumberOptions) {

        this.processOptions(frameworkOptions.require, `--require`);
        this.processOptions(frameworkOptions.format, `--format`);
        this.processOptions(frameworkOptions.tags, `--tags`);

        this.processWorldParameters(frameworkOptions.worldParameters);
    }

    private processWorldParameters (worldParams: any) {
        if(!worldParams) return;

        if(!(typeof worldParams === `object` && {}.constructor === worldParams.constructor)) {
            const message = `The World Parameters in the config file cant be parsed: ${worldParams}`;
            throw new Error(message);
        }

        this.ccOptionsList.push(`--world-parameters`);
        this.ccOptionsList.push(JSON.stringify(worldParams));
    }
    private processOptions(confOptions: undefined | string[], optsString: string) {
        this.logger.debug(`processing ${optsString} option with CONF: ${confOptions}`);

        const processOptions = (options: string[]) => {
            for(let opt of options) {
                this.ccOptionsList.push(optsString);
                this.ccOptionsList.push(opt);
            }
        };

        if(confOptions) processOptions(confOptions);
    }

    public run(specs: string): Promise<any> {
        this.logger.debug(`Starting Cucumber tests`);

        return new Promise((resolve, reject) => {

            const result = (res: any) => {
                this.logger.debug(`Cucumber: Result: ${JSON.stringify(res)}`);
                resolve(res);
            };

            const Cucumber = require(`cucumber`);

            const cwd = process.cwd();

            // add argument cli options
            let args: string[] = [];

            args.push(process.argv[0]);
            args.push(cwd + `\\node_modules\\cucumber\\bin\\cucumber-js`);
            args.push(specs);

            args = [...args, ...this.ccOptionsList];

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