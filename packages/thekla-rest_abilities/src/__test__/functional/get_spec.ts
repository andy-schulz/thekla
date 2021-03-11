import {RestClientConfig}                                                        from "@thekla/config";
import {Actor}                                                                   from "@thekla/core";
import {ExecutingRestClient, Get, On, request, RestRequestResult, UseTheRestApi} from "../../index";

const {REST_BASE_PORT, REST_BASE_URL, REQUEST_PROXY} = process.env;

describe(`Using the GET method`, () => {

    const restClientConfig: RestClientConfig = {
        requestOptions: {
            baseUrl: `${REST_BASE_URL}:${REST_BASE_PORT ?? 8443}`,
            proxy: REQUEST_PROXY
        }
    };

    const Richard: Actor = Actor.named(`Richard`);
    Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

    describe(`on a resource`, () => {
        it(`should return status code 200
        test id: 15bae575-4ac9-4fee-adb8-b69e909706a7`, async () => {
            const getReq = request(On.resource(`get`));

            let result;
            try {
                result = await Get.from(getReq).performAs(Richard);
            } catch (e) {
                console.log(e);
                throw e;
            }
            expect(result.request.options.method).toEqual(`GET`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_URL?.replace(`http://`, ``))
        });

        it(`should return status code 200
        test id: 15bae575-4ac9-4fee-adb8-b69e909706a7`, async () => {
            const getReq = request(On.resource(`get`));

            let result;
            try {
                result = await Get.from(getReq).performAs(Richard);
            } catch (e) {
                console.log(e);
                throw e;
            }

            expect(result.request.options.method).toEqual(`GET`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_URL?.replace(`http://`, ``))
        });
    });

    describe(`on a resource where GET is not allowed`, () => {

        it(`should throw a 405 status code
        test id: 15bae575-4ac9-4fee-adb8-b69e909706a7`, async () => {
            const postReq = request(On.resource(`post`));

            const result = await Get.from(postReq).performAs(Richard)
                                    .catch((result: RestRequestResult) => result)

            expect(result.request.options.method).toEqual(`GET`);
            expect(result.statusCode).toEqual(405);
            const body = result.body;
            expect(body).toContain(`405 Method Not Allowed`)
        });
    });
});