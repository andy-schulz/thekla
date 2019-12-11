import {RestClientConfig}                                                                      from "@thekla/config";
import {Actor}                                                                                 from "@thekla/core";
import {ExecutingRestClient, Method, On, Put, request, RestRequestResult, Send, UseTheRestApi} from "..";

describe(`Using the PUT method`, () => {

    const restClientConfig: RestClientConfig = {
        requestOptions: {
            baseUrl: `${process.env.BASEURL}:8443`,
            resolveWithFullResponse: true,
            proxy: process.env.MY_PROXY
        }
    };

    const Richard: Actor = Actor.named(`Richard`);
    Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

    describe(`on a resource`, () => {

        it(`should return status code 200
        test id: 2d1c21b6-87ac-4165-8e2f-81a2578e7d96`, async () => {
            const putReq = request(On.resource(`/put`));

            const result = await Put.to(putReq).performAs(Richard);

            expect(result.request.method).toEqual(`PUT`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(process?.env?.BASEURL?.replace(`http://`, ``))
        });

        it(`with the general Send interaction should return status code 200
        test id: 2d1c21b6-87ac-4165-8e2f-81a2578e7d96`, async () => {
            const putReq = request(On.resource(`/put`));

            const result = await Send.the(putReq).as(Method.put()).performAs(Richard);

            expect(result.request.method).toEqual(`PUT`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(process?.env?.BASEURL?.replace(`http://`, ``))
        });
    });

    describe(`on a resource where PUT is not allowed`, () => {

        it(`should throw a 405 status code
        test id: d4ce3bd3-3c01-4dc0-a699-e5e1070e12bb`, async () => {
            const getReq = request(On.resource(`/get`));

            const result = await Put.to(getReq).performAs(Richard)
                                    .catch((result: RestRequestResult) => result);

            expect(result.request.method).toEqual(`PUT`);
            expect(result.statusCode).toEqual(405);
            const body = result.body;
            expect(body).toContain(`405 Method Not Allowed`)
        });
    });
});