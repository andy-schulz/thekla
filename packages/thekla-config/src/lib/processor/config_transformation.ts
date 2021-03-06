import deepmerge                                                                                 from "deepmerge";
import {curry, set, transform}                                                                   from "lodash"
import * as fp                                                                                   from "lodash/fp"
import {Options}                                                                                 from "webdriver"
import {AppiumOptions, BrowserStackCapabilities, DesiredCapabilities, ProxyConfig, ServerConfig} from "../..";

const transformServerConfig = (serverConfig: ServerConfig): (option: Options) => Options => {
    return (options: Options): Options => {
        const opts = options;

        if (!serverConfig.serverAddress)
            return opts;

        if (serverConfig?.serverAddress?.hostname)
            opts.hostname = serverConfig.serverAddress.hostname;

        if (serverConfig?.serverAddress?.protocol)
            opts.protocol = serverConfig.serverAddress.protocol;

        if (serverConfig?.serverAddress?.port)
            opts.port = serverConfig.serverAddress.port;

        if (serverConfig?.serverAddress?.path)
            opts.path = serverConfig.serverAddress.path;

        if (serverConfig?.automationFramework?.logLevel)
            opts.logLevel = serverConfig.automationFramework.logLevel;

        if (serverConfig?.automationFramework?.connectionRetryCount)
            opts.connectionRetryCount = serverConfig.automationFramework.connectionRetryCount;

        if (serverConfig?.automationFramework?.connectionRetryTimeout)
            opts.connectionRetryTimeout = serverConfig.automationFramework.connectionRetryTimeout;

        return opts;
    }
};
const setMainProperties = curry((capabilities: DesiredCapabilities | undefined, options: Options): Options => {
    if (!capabilities)
        return options;
    const opts = transform(capabilities, (acc: Options, value: any, key: string) => {
        if (typeof value !== `object`) {
            set(acc, `capabilities["${key}"]`, value)
        }
    }, options);

    return opts;
});

const setFirefoxOptions = curry((firefoxOptions: object | undefined, options: Options): Options => {
    if (firefoxOptions) {
        set(options, `capabilities["moz:firefoxOptions"]`, firefoxOptions)
    }
    return options;
});

const setChromeOptions = curry((chromeOptions: object | undefined, options: Options): Options => {

    if (chromeOptions) {
        set(options, `capabilities["goog:chromeOptions"]`, chromeOptions);
    }
    return options
});

const setProxy = curry((proxy: ProxyConfig | undefined, options: Options): Options => {
    if (proxy) {
        const p = deepmerge({}, proxy);
        set(options, `capabilities.proxy`, p);
    }
    return options
});

const setAppiumOptions = curry((appiumOptions: AppiumOptions | undefined, options: Options): Options => {
    if (!appiumOptions)
        return options;

    const opts = transform(appiumOptions, (acc, value, key) => {
        if (key === `android`) {
            return transform(appiumOptions.android as object, (acc: Options, value: any, key: string): void => {
                set(acc, `capabilities[${key}]`, value);
            }, acc);
        }

        if (key === `ios`)
            return transform(appiumOptions.ios as object, (acc: Options, value: any, key: string) => {
                set(acc, `capabilities[${key}]`, value);
            }, acc);

        set(acc, `capabilities[${key}]`, value);

    }, options);

    return opts;
});

const setBrowserstackOptions = curry((browserstackOptions: BrowserStackCapabilities | undefined, options: Options) => {
    if (browserstackOptions)
        set(options, `capabilities["bstack:options"]`, browserstackOptions);

    return options;
});

const transformCapabilities = (capabilities: DesiredCapabilities): (option: Options) => Options => {
    return (options: Options): Options => {
        const opts = fp.flow(
            setMainProperties(capabilities),
            setFirefoxOptions(capabilities[`moz:firefoxOptions`]),
            setChromeOptions(capabilities[`goog:chromeOptions`]),
            setProxy(capabilities.proxy),
            setAppiumOptions(capabilities.appium),
            setBrowserstackOptions(capabilities[`bstack:options`]),
        )(options);

        return opts;
    }
};

export const transformToWdioConfig =
    (serverConfig: ServerConfig, capabilities: DesiredCapabilities): Options => {
        const options: Options = {};

        const opts = fp.flow(
            transformServerConfig(serverConfig),
            transformCapabilities(capabilities)
        )(options);

        return opts;
    };