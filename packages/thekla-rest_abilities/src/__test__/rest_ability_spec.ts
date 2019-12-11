import {RestClientConfig}                   from "@thekla/config";
import {Actor}                              from "@thekla/core";
import {ExecutingRestClient, UseTheRestApi} from "..";

describe(`Using ability UseTheRestApi `, () => {

    const restClientConfig: RestClientConfig = {
        requestOptions: {
            baseUrl: `${process.env.BASEURL}:8443`,
            resolveWithFullResponse: true,
            proxy: process.env.MY_PROXY
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