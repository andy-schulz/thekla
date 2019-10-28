import {ServerConfig} from "@thekla/config";

export const formatNavigateToUrl = (serverConfig: ServerConfig, url: string): string => {
    return serverConfig.baseUrl && !url.startsWith(`http`) ? `${serverConfig.baseUrl}${url}` : url;
};