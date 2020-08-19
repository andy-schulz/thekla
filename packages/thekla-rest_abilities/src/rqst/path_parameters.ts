import {RequestOptions} from "@thekla/config";
import R                from "ramda";

export const replacePathParams = (resource: string, opts: RequestOptions): string => {
    if(!opts.pathParams)
        return resource;

    const pathParams = opts.pathParams;
    const reducer = (res: string, arr: [string, string | string[] | undefined]): string => {
        return res.replace(`{${arr[0]}}`,`${arr[1]}`);
    }

    return R.reduce(reducer, resource, Object.entries(pathParams))
}
