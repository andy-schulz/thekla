import {RestClientConfig}                                                                        from "@thekla/config";
import {Actor}                                                                                   from "@thekla/core";
import {ExecutingRestClient, Method, On, Patch, request, RestRequestResult, Send, UseTheRestApi} from "../../index";

const {REST_BASE_PORT, REST_BASE_HOST, REQUEST_PROXY} = process.env;

describe(`Using the PATCH method`, () => {

    const restClientConfig: RestClientConfig = {
        requestOptions: {
            baseUrl: `http://${REST_BASE_HOST}`,
            proxy: REQUEST_PROXY
        }
    };

    const secureClientConfig: RestClientConfig = {
        requestOptions: {
            baseUrl: `https://${REST_BASE_HOST}`,
            proxy: REQUEST_PROXY
        }
    };

    const Richard: Actor = Actor.named(`Richard`);
    Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

    const SecureRichard: Actor = Actor.named(`SecureRichard`);
    SecureRichard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(secureClientConfig)));

    beforeAll(() => {
        if (process.env.REST_BASE_HOST == undefined)
            return Promise.reject(`Environment variable REST_BASE_URL not set.`)
    })

    describe(`on a http resource`, () => {
        it(`should return status code 200
        test id: f7411bc6-7016-425e-b9f3-4343f9da9cf0`, async () => {
            const patchReq = request(On.resource(`patch`));

            const result = await Patch.to(patchReq).performAs(Richard);

            expect(result.request.options.method).toEqual(`PATCH`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_HOST)
        });

        it(`with the general Send interaction should return status code 200
        test id: 920f3c2c-9764-4780-bce7-52f00d6f7904`, async () => {
            const patchReq = request(On.resource(`patch`));

            const result = await Send.the(patchReq).as(Method.patch()).performAs(Richard);

            expect(result.request.options.method).toEqual(`PATCH`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_HOST)
        });
    });

    describe(`on a https resource`, () => {
        it(`should return status code 200
        test id: f7411bc6-7016-425e-b9f3-4343f9da9cf0`, async () => {
            const patchReq = request(On.resource(`patch`));

            const result = await Patch.to(patchReq).performAs(SecureRichard);

            expect(result.request.options.method).toEqual(`PATCH`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_HOST)
        });

        it(`with the general Send interaction should return status code 200
        test id: 920f3c2c-9764-4780-bce7-52f00d6f7904`, async () => {
            const patchReq = request(On.resource(`patch`));

            const result = await Send.the(patchReq).as(Method.patch()).performAs(SecureRichard);

            expect(result.request.options.method).toEqual(`PATCH`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_HOST)
        });
    });

    describe(`on a resource where PATCH is not allowed`, () => {

        it(`should throw a 405 status code
        test id: cbdadfaa-991c-4701-bf55-d090c7a65aa6`, async () => {
            const getReq = request(On.resource(`get`));

            const result = await Patch.to(getReq).performAs(Richard)
                                      .catch((result: RestRequestResult) => result);

            expect(result.request.options.method).toEqual(`PATCH`);
            expect(result.statusCode).toEqual(405);
            const body = result.body;
            expect(body).toContain(`405 Method Not Allowed`)
        });
    });
});