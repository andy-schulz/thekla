import {RequestOptions}    from "@thekla/config";
import {replacePathParams} from "../../rqst/path_parameters";

describe(`defining request options`, () => {
    describe(`with pathParams`, () => {

        it(`should replace the parameter within the resource string
        test id: 4281d7d3-f85e-4564-8244-153d4d45f157`, () => {
            const resource = `a/b/{one}/{two}`
            const expected = `a/b/c/d`
            const opts: RequestOptions = {
                pathParams: {
                    one: `c`,
                    two: `d`
                }
            }

            expect(replacePathParams(resource, opts)).toEqual(expected,`path parameter not replaced`)
        });

        it(`should only replace the found path parameters
        test id: 4281d7d3-f85e-4564-8244-153d4d45f157`, () => {
            const resource = `a/b/{one}/{two}`
            const expected = `a/b/c/{two}`
            const opts: RequestOptions = {
                pathParams: {
                    one: `c`,
                    three: `d`
                }
            }

            expect(replacePathParams(resource, opts)).toEqual(expected,`only the found path parameter should have been replaced`)
        });
    });

    describe(`without pathParams`, () => {

        it(`should not replace anything within the resource string
        test id: 4281d7d3-f85e-4564-8244-153d4d45f157`, () => {
            const resource = `a/b/{one}/{two}`
            const expected = `a/b/{one}/{two}`
            const opts1: RequestOptions = {
                pathParams: {}
            }

            const opts2: RequestOptions = {
            }

            expect(replacePathParams(resource, opts1)).toEqual(expected,`path parameter for empty object not replaced`)
            expect(replacePathParams(resource, opts2)).toEqual(expected,`path parameter for absent object not replaced`)
        });
    });
});