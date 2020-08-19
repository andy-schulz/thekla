import {RequestOptions, RestClientConfig}                     from "@thekla/config";
import {Actor}                                                from "@thekla/core";
import {ExecutingRestClient, Get, On, request, UseTheRestApi} from "../..";

const {REST_BASE_PORT, REST_BASE_URL, REQUEST_PROXY} = process.env;

describe(`Using options`, () => {
    const restClientConfig: RestClientConfig = {
        requestOptions: {
            baseUrl: `${REST_BASE_URL}:${REST_BASE_PORT ?? 8443}`,
            proxy: REQUEST_PROXY
        }
    };

    const Richard: Actor = Actor.named(`Richard`);
    Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

    it(`should replace the path parameters when passed to the request
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