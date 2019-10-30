import * as Conf from "@thekla/config";

export const config: Conf.TheklaConfig = {

    specs: ["dist/01_Quick_Start_Guide/google_search_spec.js"],

    serverConfig: {
        serverAddress: {
            hostname: "localhost",
            port: 4444,
            protocol: "http",
            path: "/wd/hub"
        }
    },

    capabilities: {
        browserName: "chrome"
    },

    testFramework: {
        frameworkName: "jasmine",
        jasmineOptions: {
            defaultTimeoutInterval: 20 * 1000
        }
    }
};