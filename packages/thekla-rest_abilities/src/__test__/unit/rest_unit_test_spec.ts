import {RequestOptions}  from "@thekla/config";
import * as assert       from "assert";
import {RestRequestRqst} from "../../rqst/RestRequestRqst";

class UT extends RestRequestRqst {
    public static testMerge(orig: RequestOptions, merger: RequestOptions): RequestOptions {
        return (new UT(`resource`, {})).mergeClientConfig(orig, merger);
    }
}

describe(`Using the RestAPI`, (): void => {

    describe(`and try to merge request options`, (): void => {

        it(`should return the merged option object ` +
               `- (test case id: 82878ec9-736b-4db9-912a-139c3ea16949)`, (): void => {

            const restOptsOrig: RequestOptions = {
                jsonBody: {
                    one: `one`,
                    array: [`one`]
                }
            };

            const restOptsMerger: RequestOptions = {
                jsonBody: {
                    two: `two`,
                    array: [`two`]
                }
            };

            const result: RequestOptions = {
                jsonBody: {
                    one: `one`,
                    two: `two`,
                    array: [`one`, `two`]
                }
            };

            const res = UT.testMerge(restOptsOrig, restOptsMerger);
            assert.deepStrictEqual(res, result)
        });
    });
});