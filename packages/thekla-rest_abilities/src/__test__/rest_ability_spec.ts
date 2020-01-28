import {RestClientConfig}                   from "@thekla/config";
import {Actor}                              from "@thekla/core";
import {ExecutingRestClient, UseTheRestApi} from "..";

const {REST_BASE_PORT, REST_BASE_URL, MY_PROXY} = process.env;

describe(`Using ability UseTheRestApi `, () => {

    const restClientConfig: RestClientConfig = {
        requestOptions: {
            baseUrl: `${REST_BASE_URL}:${REST_BASE_PORT ?? 8443}`,
            resolveWithFullResponse: true,
            proxy: MY_PROXY
        }
    };

    const Richard: Actor = Actor.named(`Richard`);
    Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restClientConfig)));

    describe(`for retrieving an actors ability`, () => {
        it(`should return the ability
        test id: da5335c5-62f5-473f-85f7-f8eab61395d6`, () => {

            const ability = UseTheRestApi.as(Richard);
            const abilityList = ability.getAbilities();

            expect(abilityList.length).toEqual(1);
            expect(abilityList[0] instanceof UseTheRestApi).toEqual(true)
        });
    });
});