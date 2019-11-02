import * as minimist                         from "minimist";
import * as path                             from "path";
import * as fs                               from "fs";
import {helpText}                            from "./commands/help";
import {versionText}                         from "./commands/version";
import {TheklaConfig, TheklaConfigProcessor} from "@thekla/config";
import {Thekla}                              from "./thekla";
import {getLogger, Logger}                   from "@log4js-node/log4js-api";

export class Command {
    private readonly helpTextPrinted: boolean = false;
    private readonly configFile: string = ``;
    private readonly logger: Logger = getLogger(`Command`);

    constructor(
        private thekla: Thekla,
        private args: minimist.ParsedArgs) {
        this.logger.debug(`passed arguments: ${JSON.stringify(args)}`);

        let command = args._[0] || `help`;

        if (args.version || args.v) {
            command = `version`
        }

        if (args.help || args.h) {
            command = `help`
        }

        switch (command) {
            case `version`:
                versionText();
                this.helpTextPrinted = true;
                break;

            case `help`:
                helpText(args);
                this.helpTextPrinted = true;
                break;

            default:
                this.configFile = `${path.resolve()}/${command}`;
                if (!fs.existsSync(this.configFile)) {
                    this.helpTextPrinted = true;
                    const message = `No Configuration file found at location ${this.configFile}`;
                    this.logger.error(message);
                    throw new Error(message);
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

                if(config.config)
                    return config.config;
                if(config.default)
                    return config.default;

                const message = `An export called 'config' or an default export was expected in file '${configFilePath}', but none could be found.`;
                this.logger.info(message);
                return Promise.reject(message);

            })
    }

    /**
     * process all options passed via command line
     * @param args
     * @param config
     */
    private mergeCommandLineArgsIntoConfig(args: minimist.ParsedArgs, config: TheklaConfig): Promise<TheklaConfig> {
        const processor = new TheklaConfigProcessor();

        config = processor.mergeSpecs(args.specs, config);
        config = processor.mergeTestframeworkOptions(args.testFramework, config);
        config = processor.mergeRestConfigOptions(args.restConfig, config);

        return Promise.resolve(config);
    }

    /**
     * start spec execution with jasmine
     */
    run(): Promise<any> {
        if (this.helpTextPrinted) return Promise.resolve();

        return this.loadConfigFile(this.configFile)
            .then((config: TheklaConfig) => this.mergeCommandLineArgsIntoConfig(this.args, config))
            .then((config: TheklaConfig) => this.thekla.run(config));

    }
}