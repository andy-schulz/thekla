import {DesiredCapabilities, RestClientConfig, ServerConfig}                       from "thekla-core";
import {TheklaGlobal}                                                              from "../globals/TheklaGlobal";
import {ServerConfigSet, CapabilitiesConfigSet, RestClientConfigSet, TheklaConfig} from "./TheklaConfig";

const defaultObjectMissingError  = (
    name: string,
    defaultName: string,
    searchForDefault: boolean,
    config: string,
    attribute: string,
    configType: string) => `
Configuration does not contain a ${configType} object called '${searchForDefault ? defaultName : name}':

Expected:
    ${attribute}: {
        default: "${searchForDefault ? defaultName : `aDefaultConfig` }",
        ${name}: { ... } // is of type ${configType}
    }

But got:
    ${attribute}: ${config}`;

const defaultMissingError = (config: string, attribute: string, configType: string) => `
Please specify a default config for type ${configType}:

Expected:
    ${attribute}: {
        default: "myConfig",
        myConfig: { ... } // is of type ${configType}
        myConfig2: { ... } // is of type ${configType}
    }

But got: 
    ${attribute}: ${config}`;

const getServerConfig = (config: ServerConfigSet | undefined): (name?: string) => ServerConfig => {
    return (name?: string): ServerConfig => {
        if (!config)
            return {};

        if (!('default' in config))
            return config as ServerConfig;

        if(name) {
            if (name in config)
                return config[name] as ServerConfig;

            throw new Error(defaultObjectMissingError(
                name,
                `aDefaultServerConfig`,
                false,
                JSON.stringify(config, null, `        `),
                `serverConfig`, `ServerConfig`));

        } else {
            if (!config.default)
                throw new Error(defaultMissingError(
                    JSON.stringify(config, null, `        `),
                    `serverConfig`,
                    `ServerConfig`));

            if(!(config.default in config))
                throw new Error(defaultObjectMissingError(
                    config.default,
                    config.default,
                    true,
                    JSON.stringify(config, null, `        `),
                    `serverConfig`, `ServerConfig`));

            return config[config.default] as ServerConfig;
        }
    }
};

const getCapabilities = (caps: CapabilitiesConfigSet | undefined): (name?: string) => DesiredCapabilities => {
    return (name?: string): DesiredCapabilities => {
        if (!caps)
            return {};

        if (!('default' in caps))
            return caps as DesiredCapabilities;

        if(name) {
            if (name in caps)
                return caps[name] as DesiredCapabilities;

            throw new Error(defaultObjectMissingError(
                name,
                caps.default,
                false,
                JSON.stringify(caps, null, `        `),
                `capabilities`, `DesiredCapabilities`));

        } else {
            if (!caps.default)
                throw new Error(defaultMissingError(
                    JSON.stringify(caps, null, `        `),
                    `capabilities`,
                    `DesiredCapabilities`));

            if(!(caps.default in caps))
                throw new Error(defaultObjectMissingError(
                    caps.default,
                    caps.default,
                    true,
                    JSON.stringify(caps, null, `        `),
                    `capabilities`, `DesiredCapabilities`));

            return caps[caps.default] as DesiredCapabilities;
        }
    }
};

const getRestClientConfig = (config: RestClientConfigSet | undefined): (name?: string) => RestClientConfig => {

    return (name?: string): RestClientConfig => {
        if (!config)
            return {};

        if (!('default' in config))
            return config as RestClientConfig;

        if(name) {
            if (name in config)
                return config[name] as RestClientConfig;

            throw new Error(defaultObjectMissingError(
                name,
                config.default,
                false,
                JSON.stringify(config, null, `        `),
                `restConfig`, `RestClientConfig`));

        } else {
            if (!config.default)
                throw new Error(defaultMissingError(
                    JSON.stringify(config, null, `        `),
                    `restConfig`,
                    `RestClientConfig`));

            if(!(config.default in config))
                throw new Error(defaultObjectMissingError(
                    config.default,
                    config.default,
                    true,
                    JSON.stringify(config, null, `        `),
                    `restConfig`, `RestClientConfig`));

            return config[config.default] as RestClientConfig;
        }
    }
};

export const getConfiguredTheklaGlobal = (config: TheklaConfig): TheklaGlobal => {
    return {
        config: config,
        serverConfig: getServerConfig(config.serverConfig),
        capabilities: getCapabilities(config.capabilities),
        restConfig: getRestClientConfig(config.restConfig)
    }
};