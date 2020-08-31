import {RequestOptions, RestClientConfig}                     from "@thekla/config";
import {Actor}                                                from "@thekla/core";
import {ExecutingRestClient, Get, On, request, UseTheRestApi} from "../..";

const {REST_BASE_PORT, REST_BASE_URL, REQUEST_PROXY} = process.env;

describe(`Using option`, () => {
    const restClientConfig: RestClientConfig = {
        requestOptions: {
            baseUrl: `${REST_BASE_URL}:${REST_BASE_PORT ?? 8443}`,
            proxy: REQUEST_PROXY
        }
    };

    const Richard: Actor = Actor.named(`Richard`);
    Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

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

            const statusCode = 204;

            const putReq = request(On.resource(`get`));

            const opts: RequestOptions = {
                resolveBodyOnly: true,
                responseType: `json`
            }

            return Get.from(putReq.using(opts))
                      .performAs(Richard)
                      .then((body) => {
                          expect(body.url).toEqual(`http://httpbin.org/get`)
                          expect(body.args).toEqual({}, `check was not performed on body, only body contains the "args" attribute`)
                      })
                      .catch((error) => {
                          console.log(error)
                          throw error;
                      });

        }, 10000);
    });
});