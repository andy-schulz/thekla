import { resolve } from "path"
import { config } from "dotenv"

config({ path: resolve(__dirname, "./../../../.build") });

import {LogLevel, ServerConfig, DesiredCapabilities} from "@thekla/config";
import moment                                        from "moment";
import {set, cloneDeep}                              from "lodash";
import WebDriver, {WebDriverLogTypes}                from "webdriver";

const standardTheklaServerConfig: ServerConfig = {
    automationFramework: {
        logLevel: (process.env.LOGLEVEL ? process.env.LOGLEVEL : `info`) as LogLevel
    },
    serverAddress: {
        hostname: process.env.SERVER_HOSTNAME ? process.env.SERVER_HOSTNAME : `localhost`
    },

    baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`,
    annotateElement: false
};
if (process.env.BASEURL) standardTheklaServerConfig.baseUrl = process.env.BASEURL;

export const getStandardTheklaServerConfig = (): ServerConfig => {
    return cloneDeep(standardTheklaServerConfig)
};

const standardTheklaCapabilities: DesiredCapabilities = {
    browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
    proxy: process.env.PROXY_TYPE === `manual` ? {
        proxyType: `manual`,
        httpProxy: process.env.PROXY_SERVER,
        sslProxy: process.env.PROXY_SERVER,
    } : {
        proxyType: `system`
    }
};

export const getStandardTheklaDesiredCapabilities = (browserstackSessionName?: string): DesiredCapabilities => {

    const capabilities = cloneDeep(standardTheklaCapabilities);

    if (process.env.BROWSERSTACK === `enabled` && browserstackSessionName)
        set(capabilities, `bstack:options.sessionName`, browserstackSessionName);

    return capabilities;
};

const standardWdioConfig: WebDriver.Options = {
    hostname: process.env.SERVER_HOSTNAME ? process.env.SERVER_HOSTNAME : `localhost`,
    logLevel: (process.env.LOGLEVEL ? process.env.LOGLEVEL as WebDriverLogTypes : `info`),
    capabilities: {
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
        proxy: process.env.PROXY_TYPE === `manual` ? {
            proxyType: `manual`,
            httpProxy: process.env.PROXY_SERVER,
            sslProxy: process.env.PROXY_SERVER,
        } : {
            proxyType: `system`
        }
    }
};

// browserstack options
const buildName = process.env.BUILD_NAME ? process.env.BUILD_NAME : `${moment().format(`YYYY-MM-DD HH:mm:ss`)}`;

if (process.env.BROWSERSTACK === `enabled`) {

    // add opts for standard Thekla conf
    standardTheklaCapabilities[`bstack:options`] = {
        userName: process.env.CLOUD_USER ? process.env.CLOUD_USER : `fail`,
        accessKey: process.env.CLOUD_KEY ? process.env.CLOUD_KEY : `fail`,

        os: `Windows`,
        osVersion: `10`,

        projectName: `Thekla`,
        buildName: buildName,
        video: false,
        seleniumVersion: `3.141.59`
    };
}

export const getNewStandardWdioConfig = (browserStackSession?: string) => {
    const opts = cloneDeep(standardWdioConfig);

    if (process.env.BROWSERSTACK === `enabled`) {

        // add opts for wdio conf
        if (!opts.capabilities) {
            opts.capabilities = {};
        }

        opts.capabilities[`bstack:options`] = {
            userName: process.env.CLOUD_USER ? process.env.CLOUD_USER : `fail`,
            accessKey: process.env.CLOUD_KEY ? process.env.CLOUD_KEY : `fail`,

            os: `Windows`,
            osVersion: `10`,

            projectName: `Thekla`,
            buildName: buildName,
            video: false,
            seleniumVersion: `3.141.59`
        };

        if (browserStackSession)
            set(opts, `capabilities.bstack:options.sessionName`, browserStackSession);
    }
    return opts
};

export const setBrowserStackSessionNameInWdioConfig = (opts: WebDriver.Options, name: string): void => {
    if (process.env.BROWSERSTACK === `enabled`)
        set(opts, `capabilities.bstack:options.sessionName`, name);
};