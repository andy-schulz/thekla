import {DesiredCapabilities, RestClientConfig, ServerConfig} from "..";
import {TheklaConfig}                                        from "..";

export interface TheklaGlobal {
    config: TheklaConfig;
    serverConfig(serverConfigName?: string): ServerConfig;
    capabilities(capabilitiesName?: string): DesiredCapabilities;
    restConfig(restConfigName?: string): RestClientConfig;
}