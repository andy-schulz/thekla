import {RestClientConfig}                                     from "@thekla/config";
import {Actor}                                                from "@thekla/core";
import {ExecutingRestClient, Get, On, request, UseTheRestApi} from "..";

const {REST_BASE_PORT, REST_BASE_URL, MY_PROXY} = process.env;

describe(`Using the REST Client`, () => {

    describe(`without a config`, () => {

        const restClientConfig: RestClientConfig = {};

        const Richard: Actor = Actor.named(`Richard`);
        Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

        it(`should return a working client
        test id: 57cb62d2-5ae0-4101-a62c-5081512de205`, async () => {
            const getReq = request(On.resource(`/get`))
                .using({
                           baseUrl: `${REST_BASE_URL}:${REST_BASE_PORT ?? 8443}`,
                           resolveWithFullResponse: true,
                           proxy: MY_PROXY
                       });

            const result = await Get.from(getReq).performAs(Richard);
            expect(result.request.method).toEqual(`GET`);
            expect(result.statusCode).toEqual(200);

        });
    });
});