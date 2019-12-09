import {RestRequestResult} from "../../interface/RestRequestResult";

export const continueOnError = (continueOnError: boolean) => {
    return (e: Error): Promise<RestRequestResult> => {
        return continueOnError ? Promise.resolve(e) : Promise.reject(e)
    }
};

export interface MethodActions {
    continueOnError(): MethodActions;
}