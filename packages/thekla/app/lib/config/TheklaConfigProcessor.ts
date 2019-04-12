import {CucumberOptions, TheklaConfig, JasmineOptions} from "./TheklaConfig";
import merge from "deepmerge";

import {getLogger} from "@log4js-node/log4js-api";

export class TheklaConfigProcessor {
    private logger = getLogger("TheklaConfigProcessor");


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

    public mergeTestframeworkOptions(fwk: any, config: TheklaConfig): TheklaConfig {
        if(!fwk) return config;
        let c: {[key: string]: any} = {};

        const mergeTestframeworkName = (name: string | undefined, cnfg: TheklaConfig): TheklaConfig => {
            const cn:{[key: string]: any} = {};
            if(!name) return cnfg;

            if(!(name === "jasmine" || name === "cucumber")) {
                const message: string = `Passed framework name as command line argument is ${JSON.stringify(name)} but should be 'jasmine' or 'cucumber'`;
                this.logger.error(message);
                throw new Error(message);
            } else {
                cn.testFramework = {};
                cn.testFramework.frameworkName = name;
            }
            return  <TheklaConfig>merge(cnfg,cn);
        };

        const mergeCucumberOptions = (ccOpts: CucumberOptions | undefined, cnfg: TheklaConfig): TheklaConfig => {
            if(!ccOpts) return cnfg;
            const cn: any = {testFramework: {
                    cucumberOptions: {}
                }};

            const mergeAttributes = (index: string, format: string | string[] | undefined) => {
                // remove the tags if --tags="" was passed as command line
                if(format === "" && cnfg.testFramework && cnfg.testFramework.cucumberOptions && (cnfg.testFramework.cucumberOptions as {[key:string]: any})[index]) {
                    this.logger.debug(`...${index}="" was passed on command line. Removing all tags from config ...`);
                    (cnfg.testFramework.cucumberOptions as {[key:string]: any})[index] = undefined;
                    return;
                }

                if(!format) return;
                cn.testFramework.cucumberOptions[index] = Array.isArray(format) ? format : [format];
            };

            const mergeWorldParameter = (worldParams: any) => {
                if(!worldParams) return;
                if(typeof worldParams === "object" && {}.constructor == worldParams.constructor) {
                    cn.testFramework.cucumberOptions.worldParameters  =  worldParams
                } else {
                    throw new Error(`Can't parse the World Parameter ${worldParams}`)
                }
            };

            mergeAttributes("require",ccOpts.require);
            mergeAttributes("tags",ccOpts.tags);
            mergeAttributes("format",ccOpts.format);
            mergeWorldParameter(ccOpts.worldParameters);


            const overwriteMerge = (destinationArray: any[], sourceArray: any[], options: any) => sourceArray;
            return merge(cnfg,cn, { arrayMerge: overwriteMerge });
        };

        const mergeJasmineOptions = (jsmOpts: JasmineOptions| undefined, cnfg: TheklaConfig) => {
            if(!jsmOpts) return cnfg;

            throw new Error("Jasmine CLI Options are not implemented yet");
        };

        let conf: TheklaConfig;
        conf = mergeTestframeworkName(fwk.frameworkName, config);
        conf = mergeCucumberOptions(fwk.cucumberOptions, conf);
        conf = mergeJasmineOptions(fwk.jasmineOptions, conf);
        return conf;
    }
}