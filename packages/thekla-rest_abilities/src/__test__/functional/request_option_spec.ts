import {RequestOptions, RestClientConfig}                     from "@thekla/config";
import {Actor}                                                from "@thekla/core";
import {ExecutingRestClient, Get, On, request, UseTheRestApi} from "../..";

const {REST_BASE_HOST, REQUEST_PROXY} = process.env;

describe(`Using option`, () => {
    const restClientConfig: RestClientConfig = {
        requestOptions: {
            baseUrl: `https://${REST_BASE_HOST}`,
            proxy:   REQUEST_PROXY
        }
    };

    const Richard: Actor = Actor.named(`Richard`);
    Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

    beforeAll(() => {
        if (process.env.REST_BASE_HOST == undefined)
            return Promise.reject(`Environment variable REST_BASE_URL not set.`)
    })

    describe(`pathParameters`, () => {

        it(`should replace the path parameters
        test id: 7cb43181-e7d2-4012-b152-335f2f447a9e`, async () => {

            const statusCode = 204;

            const putReq = request(On.resource(`status/{codes}`));

            const opts: RequestOptions = {
                pathParams: {
                    codes: `${statusCode}`,
                }
            }

            return Get.from(putReq.using(opts))
                .performAs(Richard)
                .then((result) => {
                    expect(result.statusCode).toEqual(statusCode)
                })
                .catch((error) => {
                    console.log(error)
                    throw error;
                });
        }, 10000);
    });

    describe(`resolveBodyOnly`, () => {

        it(`should return the body as result object only
        test id: 711d594b-b6d3-4360-ae5d-40332af78b1c`, () => {

            const putReq = request(On.resource(`get`));

            const opts: RequestOptions = {
                resolveBodyOnly: true,
                responseType:    `json`
            }

            return Get.from(putReq.using(opts))
                .performAs(Richard)
                .then((body) => {
                    expect(body.url).toEqual(`https://httpbin.org/get`)
                    expect(body.args).toEqual({}, `check was not performed on body, only body contains the "args" attribute`)
                })
                .catch((error) => {
                    console.log(error)
                    throw error;
                });

        }, 10000);

    });

    describe(`headers`, () => {

        it(`with cookies should send cookies to the server
        test id: 0212ddf0-df0c-4477-a2e6-6aaa1eea02bf`, () => {

            const putReq = request(On.resource(`cookies`));

            const opts: RequestOptions = {
                headers:      {
                    Cookie:`JSESSIONID=ABCDEFG`
                },
                resolveBodyOnly: true,
                responseType: `json`
            }

            const expected = {
                JSESSIONID: `ABCDEFG`
            }

            return Get.from(putReq.using(opts))
                .performAs(Richard)
                .then((body) => {
                    expect(body.cookies).toEqual(expected, `cookies not transfered to sever`)
                })
                .catch((error) => {
                    console.log(error)
                    throw error;
                });
        });
    });
});