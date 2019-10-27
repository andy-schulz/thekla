import {DesiredCapabilities, RestClientConfig, ServerConfig} from "../../index";
import {TheklaConfig}                                        from "../../index";

export interface TheklaGlobal {
    config: TheklaConfig;
    serverConfig(serverConfigName?: string): ServerConfig;
    capabilities(capabilitiesName?: string): DesiredCapabilities;
    restConfig(restConfigName?: string): RestClientConfig;
}