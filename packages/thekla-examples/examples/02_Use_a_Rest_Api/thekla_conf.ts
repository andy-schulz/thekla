import {TheklaConfig} from "thekla"

export const config: TheklaConfig = {

    specs: ["dist/02_Use_a_Rest_Api/use_the_math_api_spec.js"],

    testFramework: {
        frameworkName: "jasmine",
        jasmineOptions: {
            defaultTimeoutInterval: 10 * 1000
        }
    },

    restConfig: {
        requestOptions: {
            resolveWithFullResponse: false,
            proxy: process.env.MY_PROXY ? process.env.MY_PROXY : "",
        }
    }
};