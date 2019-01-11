import {CucumberOptions, TheklaConfig, JasmineOptions} from "./TheklaConfig";
import merge from "deepmerge";

import {getLogger} from "log4js";

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


            const mergeRequire = (req: string | string[] | undefined) => {
                if(!req) return;
                cn.testFramework.cucumberOptions.require = Array.isArray(req) ? req : [req];
            };

            const mergeTags = (tags: string | string[] | undefined) => {
                if(!tags) return;
                cn.testFramework.cucumberOptions.tags = Array.isArray(tags) ? tags : [tags];
            };

            const mergeWorldParameter = (worldParams: any) => {
                if(!worldParams) return;
                if(typeof worldParams === "object" && {}.constructor == worldParams.constructor) {
                    cn.testFramework.cucumberOptions.worldParameters  =  worldParams
                } else {
                    throw new Error(`Can't parse the World Parameter ${worldParams}`)
                }
            };

            mergeRequire(ccOpts.require);
            mergeTags(ccOpts.tags);
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