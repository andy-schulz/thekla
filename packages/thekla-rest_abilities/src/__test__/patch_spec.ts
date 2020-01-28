import {RestClientConfig}                                                                        from "@thekla/config";
import {Actor}                                                                                   from "@thekla/core";
import {ExecutingRestClient, Method, On, Patch, request, RestRequestResult, Send, UseTheRestApi} from "..";

const {REST_BASE_PORT, REST_BASE_URL, MY_PROXY} = process.env;

describe(`Using the PATCH method`, () => {

    const restClientConfig: RestClientConfig = {
        requestOptions: {
            baseUrl: `${REST_BASE_URL}:${REST_BASE_PORT ?? 8443}`,
            resolveWithFullResponse: true,
            proxy: MY_PROXY
        }
    };

    const Richard: Actor = Actor.named(`Richard`);
    Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

    describe(`on a resource`, () => {
        it(`should return status code 200
        test id: f7411bc6-7016-425e-b9f3-4343f9da9cf0`, async () => {
            const patchReq = request(On.resource(`/patch`));

            const result = await Patch.to(patchReq).performAs(Richard);

            expect(result.request.method).toEqual(`PATCH`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_URL?.replace(`http://`, ``))
        });

        it(`with the general Send interaction should return status code 200
        test id: 920f3c2c-9764-4780-bce7-52f00d6f7904`, async () => {
            const patchReq = request(On.resource(`/patch`));

            const result = await Send.the(patchReq).as(Method.patch()).performAs(Richard);

            expect(result.request.method).toEqual(`PATCH`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_URL?.replace(`http://`, ``))
        });
    });

    describe(`on a resource where PATCH is not allowed`, () => {

        it(`should throw a 405 status code
        test id: cbdadfaa-991c-4701-bf55-d090c7a65aa6`, async () => {
            const getReq = request(On.resource(`/get`));

            const result = await Patch.to(getReq).performAs(Richard)
                                      .catch((result: RestRequestResult) => result);

            expect(result.request.method).toEqual(`PATCH`);
            expect(result.statusCode).toEqual(405);
            const body = result.body;
            expect(body).toContain(`405 Method Not Allowed`)
        });
    });
});