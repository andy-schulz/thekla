import {RequestOptions}    from "@thekla/config";
import {Agents}            from "got";
import {createGotOptions}  from "../../rqst/parse_config_file";
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

    describe(`with resolveBodyOnly`, () => {

        it(`should pass
        test id: 4d32b7a9-054d-481c-9b46-2397e0b2e58c`, () => {
            const opts: RequestOptions = {
                resolveBodyOnly: true
            }

            expect(createGotOptions(opts).resolveBodyOnly).toEqual(true);

        });
    });

    describe(`without resolveBodyOnly`, () => {

        it(`should pass
        test id: 861a41f6-dab1-4974-ac24-473ad1ff0bf9`, () => {
            const opts: RequestOptions = {
            }

            expect(createGotOptions(opts).resolveBodyOnly).toEqual(undefined);

        });
    });

    describe(`with proxy`, () => {

        it(`should create correct HTTP got proxy options
        test id: 312fd29f-52d2-4b07-8f85-653236c61d2d`, () => {

            const opts: RequestOptions = {
                proxy: `http://my.proxy.com:8080`
            }

            const gotOpts: any = createGotOptions(opts)

            expect(gotOpts?.agent?.http?.defaultPort).toEqual(80)
            expect(gotOpts?.agent?.http?.protocol).toEqual(`http:`)
        });

        it(`should create correct HTTPS got proxy options
        test id: 5e0317c6-2e51-43c9-bbe8-4e2de65911cb`, () => {

            const opts: RequestOptions = {
                proxy: `https://my.proxy.com:8080`
            }
            const gotOpts: any = createGotOptions(opts)

            expect(gotOpts?.agent?.http?.defaultPort).toEqual(443)
            expect(gotOpts?.agent?.http?.protocol).toEqual(`https:`)
        });
    });
});