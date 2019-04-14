import {TheklaConfig} from "thekla"

export const config: TheklaConfig = {

    specs: ["dist/01_Quick_Start_Guide/google_search_spec.js"],

    seleniumConfig: {
        seleniumServerAddress: "http://localhost:4444/wd/hub"
    },

    capabilities: [{
        browserName: "chrome"
    }],

    testFramework: {
        frameworkName: "jasmine",
        jasmineOptions: {
            defaultTimeoutInterval: 10 * 1000
        }
    }
};