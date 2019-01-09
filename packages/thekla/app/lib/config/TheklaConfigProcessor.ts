import {CucumberOptions, TestFramework, TheklaConfig} from "./TheklaConfig";
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
                const message: string = `Passed framework name as command line argument is ${name} but should be 'jasmine' or 'cucumber'`;
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

                if(Array.isArray(req)) {
                    cn.testFramework.cucumberOptions.require = req;
                } else {
                    cn.testFramework.cucumberOptions.require = [req];
                }
            };

            mergeRequire(ccOpts.require);
            const overwriteMerge = (destinationArray: any[], sourceArray: any[], options: any) => sourceArray;
            return merge(cnfg,cn, { arrayMerge: overwriteMerge });
        };

        let conf: TheklaConfig;
        conf = mergeTestframeworkName(fwk.frameworkName, config);
        conf = mergeCucumberOptions(fwk.cucumberOptions, conf);
        return conf;
    }
}