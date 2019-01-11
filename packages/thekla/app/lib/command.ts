import * as minimist                 from "minimist";
import * as path                     from "path";
import * as fs                       from "fs";
import {helpText}                    from "./commands/help";
import {versionText}                 from "./commands/version";
import {TestFramework, TheklaConfig} from "./config/TheklaConfig";
import {TheklaConfigProcessor}       from "./config/TheklaConfigProcessor";
import {Thekla}                      from "./thekla";
import {getLogger, Logger}           from "@log4js-node/log4js-api";


export class Command {
    private configFile: string = "";
    private logger: Logger = getLogger("Command");

    constructor(
        private thekla: Thekla,
        private args: minimist.ParsedArgs) {
        this.logger.debug(`passed arguments: ${JSON.stringify(args)}`);

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
                if (!fs.existsSync(this.configFile)) {
                    const message = `No Configuration file found at location ${this.configFile}`;
                    this.logger.error(message);
                    throw Error(message);
                }
                break;
        }
    }

    /**
     * process all options passed via command line
     * @param configFilePath
     */


    private loadConfigFile(configFilePath: string): Promise<TheklaConfig> {
        return import(configFilePath)
            .then((config: any) => {
                if (!config.config) {
                    const message = `An object called 'config' was expected in config file '${configFilePath}', but could not be found.`;
                    this.logger.info(message);
                    return Promise.reject(message);
                }
                return config.config
            })
    }

    /**
     * process all options passed via command line
     * @param args
     */
    private mergeCommandLineArgsIntoConfig(args: minimist.ParsedArgs, config: TheklaConfig): Promise<TheklaConfig> {
        const processor = new TheklaConfigProcessor();

        config = processor.mergeSpecs(args.specs, config);
        config = processor.mergeTestframeworkOptions(args.testFramework, config);

        return Promise.resolve(config);
    }

    /**
     * start spec execution with jasmine
     */
    run(): Promise<any> {
        return this.loadConfigFile(this.configFile)
            .then((config: TheklaConfig) => this.mergeCommandLineArgsIntoConfig(this.args, config))
            .then((config: TheklaConfig) => this.thekla.run(config));

    }
}