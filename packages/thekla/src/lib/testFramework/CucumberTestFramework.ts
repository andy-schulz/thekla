import {CucumberOptions}         from "@thekla/config";
import {getLogger}               from "@log4js-node/log4js-api";
import {processFrameworkOptions} from "./CucumberUtils";

export class CucumberTestFramework {
    private readonly logger = getLogger(`CucumberTestFramework`);
    private ccOptionsList: string[] = [];

    private formatOptions: string[] = [];

    constructor(
        private frameworkOptions: CucumberOptions) {

        if (frameworkOptions) {
            this.ccOptionsList = processFrameworkOptions(frameworkOptions);
        }
    }

    public run(specs: string): Promise<any> {
        this.logger.debug(`Starting Cucumber tests`);
        return new Promise((resolve, reject) => {

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const Cucumber = require(`cucumber`);

            const cwd = process.cwd();

            // add argument cli options
            let args: string[] = [];

            args.push(process.argv[0]);
            args.push(cwd + `\\node_modules\\cucumber\\bin\\cucumber-js`);
            args.push(specs);

            args = [...args, ...this.ccOptionsList];

            this.logger.debug(JSON.stringify(Cucumber, null, `\t`));

            const opts = {
                argv: args,
                cwd: cwd,
                stdout: process.stdout
            };

            const result = (res: any): void => {
                this.logger.debug(`Cucumber: Result: ${JSON.stringify(res)}`);
                resolve(res);
            };

            new Cucumber.Cli(opts).run()
                                  .then(result)
                                  .catch(reject);
        });
    }
}