import {DesiredCapabilities}    from "@thekla/config";
import {LogLevel, ServerConfig} from "@thekla/config";
import moment                   from "moment";
import {set, cloneDeep}         from "lodash";
import WebDriver                from "webdriver";

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
        set(capabilities, `bstack:options.sessionName`, name);

    return capabilities;
};

// browserstack options
if (process.env.BROWSERSTACK === `enabled`) {
    standardTheklaCapabilities[`bstack:options`] = {
        userName: process.env.CLOUD_USER ? process.env.CLOUD_USER : `fail`,
        accessKey: process.env.CLOUD_KEY ? process.env.CLOUD_KEY : `fail`,

        os: `Windows`,
        osVersion: `10`,

        projectName: `Thekla`,
        buildName: `${moment().format(`YYYY-MM-DD HH:mm:ss`)}`,
        video: false,
        seleniumVersion: `3.141.59`
    };
}

const standardWdioConfig: WebDriver.Options = {
    hostname: process.env.SERVER_HOSTNAME ? process.env.SERVER_HOSTNAME : `localhost`,
    capabilities: {
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`
    }
};

export const getNewStandardWdioConfig = (browserStackSession?: string) => {
    const opts = cloneDeep(standardWdioConfig);

    if(browserStackSession && process.env.BROWSERSTACK === `enabled`)
        set(opts, `capabilities.bstack:options.sessionName`, name);

    return opts
};

export const setBrowserStackSessionNameInWdioConfig = (opts: WebDriver.Options, name: string): void => {
    if (process.env.BROWSERSTACK === `enabled`)
        set(opts, `capabilities.bstack:options.sessionName`, name);
};