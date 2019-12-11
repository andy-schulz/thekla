import {RestClientConfig}                                                                       from "@thekla/config";
import {Actor}                                                                                  from "@thekla/core";
import {ExecutingRestClient, Method, On, Post, request, RestRequestResult, Send, UseTheRestApi} from "..";

describe(`Using the POST method`, () => {

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
        test id: b9efe29f-1b13-4db0-8556-be581c5c73c6`, async () => {
            const postReq = request(On.resource(`/post`));

            const result = await Post.to(postReq).performAs(Richard);

            expect(result.request.method).toEqual(`POST`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(process?.env?.BASEURL?.replace(`http://`, ``))
        });

        it(`with the general Send interaction should return status code 200
        test id: 37047b14-7597-4426-8ef7-a62a301d1c44`, async () => {
            const postReq = request(On.resource(`/post`));

            const result = await Send.the(postReq).as(Method.post()).performAs(Richard);

            expect(result.request.method).toEqual(`POST`);
            expect(result.statusCode).toEqual(200);
            const body = JSON.parse(result.body);
            expect(body?.headers?.Host).toContain(process?.env?.BASEURL?.replace(`http://`, ``))
        });
    });

    describe(`on a resource where POST is not allowed`, () => {

        it(`should throw a 405 status code
        test id: 15bae575-4ac9-4fee-adb8-b69e909706a7`, async () => {
            const getReq = request(On.resource(`/get`));

            const result = await Post.to(getReq).performAs(Richard)
                                     .catch((result: RestRequestResult) => result);

            expect(result.request.method).toEqual(`POST`);
            expect(result.statusCode).toEqual(405);
            const body = result.body;
            expect(body).toContain(`405 Method Not Allowed`)
        });
    });
});