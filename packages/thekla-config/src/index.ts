export {TheklaGlobal}                                                     from "./lib/config/TheklaGlobal";
export {TheklaConfig, CucumberOptions, JasmineOptions, TestFramework}     from "./lib/config/TheklaConfig";
export {ServerConfig, ServerAddress, AutomationFramework, LogLevel}       from "./lib/config/ServerConfig"
export {RestClientConfig, RequestOptions, ResponseType, SearchParamsType} from "./lib/config/RestClientConfig";
export {getConfiguredTheklaGlobal}                                        from "./lib/finder/config_finder";
export {TheklaConfigProcessor}                                            from "./lib/processor/TheklaConfigProcessor";
export {transformToWdioConfig}                                            from "./lib/processor/config_transformation";
export {ConfigurationValidationFailed}                                    from "./lib/error/ConfigurationValidationFailed";

export {
    DesiredCapabilities, AppiumOptions, BrowserStackCapabilities, ProxyConfig, WindowConfig
}
    from "./lib/config/DesiredCapabilities";
