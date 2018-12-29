import {TheklaConfig} from "../../lib/config/ConfigProcessor";

export const config: TheklaConfig = {
    browserName: "firefox",

    testFramework: {
        frameworkName: "jasmine",
        jasmineOptions: {
            defaultTimeoutInterval: 1000
        }
    }
};