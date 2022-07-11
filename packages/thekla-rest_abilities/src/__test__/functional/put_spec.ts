import {RestClientConfig}                                                                      from "@thekla/config";
import {Actor}                                                                                 from "@thekla/core";
import {ExecutingRestClient, Method, On, Put, request, RestRequestResult, Send, UseTheRestApi} from "../../index";

const {REST_BASE_HOST, REQUEST_PROXY} = process.env;

describe(`Using the PUT method`, () => {

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

    describe(`on an http resource`, () => {

        it(`should return status code 200
        test id: 54bcd36c-e0a3-4310-bc86-20fc43734aa8`, async () => {
            const putReq = request(On.resource(`put`));

            let result;
            try {
                result = await Put.to(putReq).performAs(Richard);
            } catch (e) {
                console.log(e);
                throw e;
            }

            expect(result.request.options.method).toEqual(`PUT`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_HOST)
        });

        it(`with the general Send interaction should return status code 200
        test id: 2d1c21b6-87ac-4165-8e2f-81a2578e7d96`, async () => {
            const putReq = request(On.resource(`put`));

            let result;
            try {
                result = result = await Send.the(putReq).as(Method.put()).performAs(Richard);
            } catch (e) {
                console.log(e);
                throw e;
            }

            expect(result.request.options.method).toEqual(`PUT`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_HOST)
        });
    });

    describe(`on an http resource`, () => {

        it(`should return status code 200
        test id: 54bcd36c-e0a3-4310-bc86-20fc43734aa8`, async () => {
            const putReq = request(On.resource(`put`));

            let result;
            try {
                result = await Put.to(putReq).performAs(SecureRichard);
            } catch (e) {
                console.log(e);
                throw e;
            }

            expect(result.request.options.method).toEqual(`PUT`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_HOST)
        });

        it(`with the general Send interaction should return status code 200
        test id: 2d1c21b6-87ac-4165-8e2f-81a2578e7d96`, async () => {
            const putReq = request(On.resource(`put`));

            let result;
            try {
                result = result = await Send.the(putReq).as(Method.put()).performAs(SecureRichard);
            } catch (e) {
                console.log(e);
                throw e;
            }

            expect(result.request.options.method).toEqual(`PUT`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_HOST)
        });
    });

    describe(`on a resource where PUT is not allowed`, () => {

        it(`should throw a 405 status code
        test id: d4ce3bd3-3c01-4dc0-a699-e5e1070e12bb`, async () => {
            const getReq = request(On.resource(`get`));

            const result = await Put.to(getReq).performAs(Richard)
                                    .catch((result: RestRequestResult) => result);

            expect(result.request.options.method).toEqual(`PUT`);
            expect(result.statusCode).toEqual(405);
            const body = result.body;
            expect(body).toContain(`405 Method Not Allowed`)
        });
    });
});