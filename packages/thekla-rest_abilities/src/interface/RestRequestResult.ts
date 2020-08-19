// eslint-disable-next-line
import * as http from "http"

export interface RestRequestResult {
    [key: string]: any;
}

export type RestRequestResult1 = http.IncomingMessage;