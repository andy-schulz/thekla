import {DesiredCapabilities, RestClientConfig, ServerConfig} from "thekla-core";
import {TheklaConfig}                                        from "../config/TheklaConfig";

export interface TheklaGlobal {
    config: TheklaConfig;
    serverConfig(serverConfigName?: string): ServerConfig;
    capabilities(capabilitiesName?: string): DesiredCapabilities;
    restConfig(restConfigName?: string): RestClientConfig;
}