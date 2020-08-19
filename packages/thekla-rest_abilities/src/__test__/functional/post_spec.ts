import {RestClientConfig}                                                                       from "@thekla/config";
import {Actor}                                                                                  from "@thekla/core";
import {ExecutingRestClient, Method, On, Post, request, RestRequestResult, Send, UseTheRestApi} from "../../index";

const {REST_BASE_PORT, REST_BASE_URL, REQUEST_PROXY} = process.env;

describe(`Using the POST method`, () => {

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
        test id: b9efe29f-1b13-4db0-8556-be581c5c73c6`, async () => {
            const postReq = request(On.resource(`post`));

            let result;
            try {
                result = await Post.to(postReq).performAs(Richard);
            } catch (e) {
                console.log(e);
                throw e;
            }

            expect(result.request.options.method).toEqual(`POST`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_URL?.replace(`http://`, ``))
        });

        it(`with the general Send interaction should return status code 200
        test id: 37047b14-7597-4426-8ef7-a62a301d1c44`, async () => {
            const postReq = request(On.resource(`post`));

            const result = await Send.the(postReq).as(Method.post()).performAs(Richard);

            expect(result.request.options.method).toEqual(`POST`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(REST_BASE_URL?.replace(`http://`, ``))
        });
    });

    describe(`on a resource where POST is not allowed`, () => {

        it(`should throw a 405 status code
        test id: 15bae575-4ac9-4fee-adb8-b69e909706a7`, async () => {
            const getReq = request(On.resource(`get`));

            const result = await Post.to(getReq).performAs(Richard)
                                     .catch((result: RestRequestResult) => result);

            expect(result.request.options.method).toEqual(`POST`);
            expect(result.statusCode).toEqual(405);
            const body = result.body;
            expect(body).toContain(`405 Method Not Allowed`)
        });
    });
});