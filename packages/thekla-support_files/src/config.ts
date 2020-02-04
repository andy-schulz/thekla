import {DesiredCapabilities, LogLevel, ServerConfig} from "@thekla/config";
import {config}                                      from "dotenv"
import {cloneDeep, set}                              from "lodash";
import moment                                        from "moment";
import {resolve}                                     from "path"
import WebDriver, {WebDriverLogTypes}                from "webdriver";

config({path: resolve(__dirname, `./../../../.build`)});

const {LOGLEVEL, SERVER_HOSTNAME, SERVER_PORT, BASEURL,
    BROWSERNAME, PROXY_TYPE, PROXY_SERVER, BROWSERSTACK,
    BUILD_NAME, CLOUD_USER, CLOUD_KEY} = process.env;

const standardTheklaServerConfig: ServerConfig = {
    automationFramework: {
        logLevel: (LOGLEVEL ?? `info`) as LogLevel
    },
    serverAddress: {
        hostname: SERVER_HOSTNAME ?? `localhost`,
        port: SERVER_PORT ? parseInt(SERVER_PORT) : 4444
    },

    baseUrl: BASEURL ?? `http://localhost:3000`,
    annotateElement: false
};
if (BASEURL) standardTheklaServerConfig.baseUrl = BASEURL;

export const getStandardTheklaServerConfig = (): ServerConfig => {
    return cloneDeep(standardTheklaServerConfig)
};

const standardTheklaCapabilities: DesiredCapabilities = {
    browserName: BROWSERNAME ? BROWSERNAME : `chrome`,
    proxy: PROXY_TYPE === `manual` ? {
        proxyType: `manual`,
        httpProxy: PROXY_SERVER,
        sslProxy: PROXY_SERVER
    } : {
        proxyType: `system`
    }
};

export const getStandardTheklaDesiredCapabilities = (browserstackSessionName?: string): DesiredCapabilities => {

    const capabilities = cloneDeep(standardTheklaCapabilities);

    if (BROWSERSTACK === `enabled` && browserstackSessionName)
        set(capabilities, `bstack:options.sessionName`, browserstackSessionName);

    return capabilities;
};

const standardWdioConfig: WebDriver.Options = {
    hostname: SERVER_HOSTNAME ?? `localhost`,
    port: SERVER_PORT ? parseInt(SERVER_PORT) : 4444,
    logLevel: (LOGLEVEL ? LOGLEVEL as WebDriverLogTypes : `info`),
    capabilities: {
        browserName: BROWSERNAME ?? `chrome`,
        proxy: PROXY_TYPE === `manual` ? {
            proxyType: `manual`,
            httpProxy: PROXY_SERVER,
            sslProxy: PROXY_SERVER
        } : {

            proxyType: `system`
        }
    }
};

// browserstack options
const buildName = BUILD_NAME ?? `${moment().format(`YYYY-MM-DD HH:mm:ss`)}`;

if (BROWSERSTACK === `enabled`) {

    // add opts for standard Thekla conf

    standardTheklaCapabilities[`bstack:options`] = {
        userName: CLOUD_USER ?? `fail`,
        accessKey: CLOUD_KEY ?? `fail`,

        os: `Windows`,
        osVersion: `10`,

        projectName: `Thekla`,
        buildName: buildName,
        video: false,
        seleniumVersion: `3.141.59`
    };
}

export const getNewStandardWdioConfig = (browserStackSession?: string): WebDriver.Options => {
    const opts = cloneDeep(standardWdioConfig);

    if (BROWSERSTACK === `enabled`) {

        // add opts for wdio conf
        if (!opts.capabilities) {
            opts.capabilities = {};
        }

        opts.port = 443;
        opts.protocol = `https`;

        opts.capabilities[`bstack:options`] = {
            userName: CLOUD_USER ?? `fail`,
            accessKey: CLOUD_KEY ?? `fail`,

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