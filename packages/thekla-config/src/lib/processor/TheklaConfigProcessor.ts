import {getLogger}                                     from "@log4js-node/log4js-api";
import merge                                           from "deepmerge";
import {curry, flow}                                   from "lodash/fp";
import {RequestOptions, RestClientConfig}              from "../../index";
import {CucumberOptions, JasmineOptions, TheklaConfig} from "../config/TheklaConfig";

export class TheklaConfigProcessor {
    private logger = getLogger(`TheklaConfigProcessor`);

    public mergeSpecs(specs: string | string[] | undefined, config: TheklaConfig): TheklaConfig {
        if (specs) {
            if (Array.isArray(specs)) {
                config.specs = specs;
            } else {
                config.specs = [specs];
            }
        }
        return config;
    }

    public mergeTestFrameworkOptions(fwk: any, config: TheklaConfig): TheklaConfig {
        if (!fwk) return config;
        const c: { [key: string]: any } = {};

        const mergeTestframeworkName = curry((name: string | undefined, cnfg: TheklaConfig): TheklaConfig => {
            const configToSet: { [key: string]: any } = {};
            if (!name) return cnfg;

            if (!(name === `jasmine` || name === `cucumber`)) {
                const message = `Passed framework name as command line argument is ${JSON.stringify(name)} but should be 'jasmine' or 'cucumber'`;
                this.logger.error(message);
                throw new Error(message);
            } else {
                configToSet.testFramework = {};
                configToSet.testFramework.frameworkName = name;
            }
            return merge(cnfg, configToSet) as TheklaConfig;
        });

        const mergeCucumberOptions = curry((ccOpts: CucumberOptions | undefined, cnfg: TheklaConfig): TheklaConfig => {
            if (!ccOpts) return cnfg;
            const configToSet: any = {
                testFramework: {
                    cucumberOptions: {}
                }
            };

            const mergeAttributes = (index: string, format: string | string[] | undefined): void => {
                // remove the tags if --tags="" was passed as command line
                if (format === `` && cnfg.testFramework && cnfg.testFramework.cucumberOptions && (cnfg.testFramework.cucumberOptions as { [key: string]: any })[index]) {
                    this.logger.debug(`...${index}="" was passed on command line. Removing all tags from config ...`);
                    (cnfg.testFramework.cucumberOptions as { [key: string]: any })[index] = undefined;
                    return;
                }

                if (!format) return;
                configToSet.testFramework.cucumberOptions[index] = Array.isArray(format) ? format : [format];
            };

            const mergeWorldParameter = (worldParams: any): void => {
                if (!worldParams) return;
                if (typeof worldParams === `object` && {}.constructor == worldParams.constructor) {
                    configToSet.testFramework.cucumberOptions.worldParameters = worldParams
                } else {
                    throw new Error(`Can't parse the World Parameter ${worldParams}`)
                }
            };

            mergeAttributes(`require`, ccOpts.require);
            mergeAttributes(`tags`, ccOpts.tags);
            mergeAttributes(`format`, ccOpts.format);
            mergeWorldParameter(ccOpts.worldParameters);

            const overwriteMerge = (destinationArray: any[], sourceArray: any[], options: any): any[] => sourceArray;
            return merge(cnfg, configToSet, {arrayMerge: overwriteMerge});
        });

        const mergeJasmineOptions = curry((jsmOpts: JasmineOptions | undefined, cnfg: TheklaConfig) => {
            if (!jsmOpts) return cnfg;

            throw new Error(`Jasmine CLI Options are not implemented yet`);
        });

        // let conf: TheklaConfig;

        return flow(
            mergeTestframeworkName(fwk.frameworkName),
            mergeCucumberOptions(fwk.cucumberOptions),
            mergeJasmineOptions(fwk.jasmineOptions)
        )(config);

        // conf = mergeTestframeworkName(fwk.frameworkName, config);
        // conf = mergeCucumberOptions(fwk.cucumberOptions, conf);
        // conf = mergeJasmineOptions(fwk.jasmineOptions, conf);
        // return conf;
    }

    public mergeRequestConfigOptions(restConfig: RestClientConfig | undefined, config: TheklaConfig): TheklaConfig {
        if (!restConfig) return config;

        if (!config.restConfig)
            config.restConfig = {};

        const setRestClient = curry((restClientName: string | undefined, config: TheklaConfig): TheklaConfig => {
            if (!restClientName) return config;

            const conf = config;

            if (restClientName === `got`)
                (conf.restConfig as RestClientConfig).restClientName = `got`;
            else
                throw new Error(`Dont know rest client ${restClientName}. Only nodjs got client is implemented. `);

            return conf;
        });

        const mergeRestClientOptions = curry((restClientOptions: RequestOptions | undefined, config: TheklaConfig) => {
            if (!restClientOptions)
                return config;

            const conf = config;

            if (!(conf.restConfig as RestClientConfig).requestOptions) {
                (conf.restConfig as RestClientConfig).requestOptions = {};
            }
            const m: RequestOptions =
                (conf.restConfig as RestClientConfig).requestOptions as RequestOptions;

            const mergedOpts = merge(m, restClientOptions);

            (conf.restConfig as RestClientConfig).requestOptions = mergedOpts;

            return conf
        });

        return flow(
            setRestClient(restConfig.restClientName),
            mergeRestClientOptions(restConfig.requestOptions)
        )(config);

        // const conf1 = setRestClient(restConfig.restClient, config);
        // const conf2 = mergeRestClientOptions(restConfig.restClientOptions, config);
        // return conf2
    }
}