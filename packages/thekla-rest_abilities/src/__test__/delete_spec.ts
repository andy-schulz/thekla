import {RestClientConfig}                                                                 from "@thekla/config";
import {Actor}                                                                            from "@thekla/core";
import {ExecutingRestClient, Method, On, request, RestRequestResult, Send, UseTheRestApi} from "..";
import {Delete}                                                                           from "../spp/actions/Delete";

const {REST_BASE_PORT, REST_BASE_URL, MY_PROXY} = process.env;

describe(`Using the DELETE method`, () => {

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
        test id: c8c693c0-56c6-4ad1-bb87-fe03a5bdde95`, async () => {
            const deleteReq = request(On.resource(`/delete`));

            let result;
            try {
                result = await Delete.from(deleteReq).performAs(Richard);
            } catch (e) {
                console.log(e);
                throw e;
            }

            expect(result.request.method).toEqual(`DELETE`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_URL?.replace(`http://`, ``))
        });

        it(`with the general Send interaction should return status code 200
        test id: c8268867-120a-4641-aa0e-83fe4c251ff7`, async () => {
            const deleteReq = request(On.resource(`/delete`));

            let result;
            try {
                result = await Send.the(deleteReq).as(Method.delete()).performAs(Richard);
            } catch (e) {
                console.log(e);
                throw e;
            }

            expect(result.request.method).toEqual(`DELETE`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_URL?.replace(`http://`, ``))
        });
    });

    describe(`on a resource where DELETE is not allowed`, () => {

        it(`should throw a 405 status code
        test id: a25f9d4c-b9bf-417e-8523-1df56185faaa`, async () => {
            const getReq = request(On.resource(`/get`));

            const result = await Delete.from(getReq).performAs(Richard)
                                       .catch((result: RestRequestResult) => result);

            expect(result.statusCode).toEqual(405);
            expect(result.request.method).toEqual(`DELETE`);
            const body = result.body;
            expect(body).toContain(`405 Method Not Allowed`)
        });
    });
});