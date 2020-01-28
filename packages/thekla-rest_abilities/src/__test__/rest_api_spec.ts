import {RequestOptions, RestClientConfig}                                                   from "@thekla/config";
import {Actor, See}                                                                         from "@thekla/core";
import {curry}                                                                              from "lodash";
import fp                                                                                   from "lodash/fp";
import {ExecutingRestClient, Get, Method, On, Post, request, Response, Send, UseTheRestApi} from ".."
import {RestRequestResult}                                                                  from "../interface/RestRequestResult";

const {MY_PROXY} = process.env;

describe(`Trying to Add two numbers by the mathjs API`, (): void => {

    const a = 5;
    const b = -3;
    const calculationResult = 2;

    // rest client config
    const restConfig: RestClientConfig = {
        restClientName: `request`,
        requestOptions: {
            baseUrl: `http://api.mathjs.org/v4`,
            resolveWithFullResponse: true,
            proxy: MY_PROXY
        }
    };

    const Richard: Actor = Actor.named(`Richard`);
    Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restConfig)));

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    describe(`using two simple integers,`, (): void => {

        it(`it should succeed when using the GET request
        - (test case id: 87b6d0ac-d022-4dc6-b0ce-b542550d6be1)`, async (): Promise<void> => {
            const req = request(On.resource(`/?expr=${a}%2B${b}`));

            const result: RestRequestResult = await Get.from(req).performAs(Richard);

            expect(result?.statusCode).toEqual(200);
            expect(result?.body).toEqual(`${calculationResult}`);
        });

        it(`it should succeed when using the GET Method and setting it on the Activity
        - (test case id: 80e8f4fe-a623-4e0f-a835-d49f1d507541)`, async (): Promise<void> => {
            const req = request(On.resource(`/?expr=${a}%2B${b}`));

            const result: RestRequestResult = await Send.the(req).as(Method.get()).performAs(Richard);

            expect(result.statusCode).toEqual(200);
            expect(result.body).toEqual(`${calculationResult}`);
        });

        it(`it should succeed when using the POST request
        - (test case id: d91b70c0-941d-4a67-a64c-a7f666694099)`, async (): Promise<void> => {
            const opts: RequestOptions = {
                body: JSON.stringify({
                                         expr: [
                                             `${a} + ${b}`
                                         ],
                                         "precision": 2
                                     })
            };

            const req = request(On.resource(`/`))
                .using(opts);

            const result: RestRequestResult = await Post.to(req).performAs(Richard);

            expect(result.statusCode).toEqual(200);
            expect(JSON.parse(result.body).result[0]).toEqual(`${calculationResult}`);
        });

        it(`it should succeed when using the POST Method and setting it on the Activity
        - (test case id: 81089f86-cf3d-4112-bb9f-bfcb5d51cc0b)`, async (): Promise<void> => {
            const opts: RequestOptions = {
                body: JSON.stringify({
                                         expr: [
                                             `${a} + ${b}`
                                         ],
                                         "precision": 2
                                     })
            };

            const req = request(On.resource(`/`))
                .using(opts);

            const result: RestRequestResult = await Send.the(req).as(Method.post()).performAs(Richard);

            expect(result.statusCode).toEqual(200);
            expect(JSON.parse(result.body).result[0]).toEqual(`${calculationResult}`);
        });
    });

    describe(`it should throw an error if the the new config passes a wrong url`, (): void => {
        const wrongBaseUrl = {
            baseUrl: `http://api.mathjs.org/v5`, // wrong base Url, should throw an error when used
            resolveWithFullResponse: true
        };

        it(`when using the GET request
        - (test case id: 850015a4-6126-41a6-aa3c-7a6e621fd4b8)`, (): Promise<boolean | void> => {
            const req = request(On.resource(`/?expr=${a}%2B${b}`))
                .using(wrongBaseUrl);

            return Get.from(req).performAs(Richard)
                      .then(() => expect(true).toBeFalsy(`should throw an error on wrong base url, but it doesnt`))
                      .catch((result) => expect(result.statusCode).toEqual(404))
        });

        it(`when using the POST request
        - (test case id: 5279a3f9-ee89-4ba9-9533-69273c992aa2)`, async (): Promise<boolean | void> => {
            const req = request(On.resource(`/`))
                .using(wrongBaseUrl);

            return Post.to(req).performAs(Richard)
                       .then(() => expect(true).toBeFalsy(`should throw an error on wrong base url, but it doesnt`))
                       .catch((result) => expect(result.statusCode).toEqual(404))
        });

        it(`when using the POST method and setting it on the Activity
        - (test case id: 47fc1292-bb55-4de2-a7fc-313b47cf15f3)`, async (): Promise<boolean | void> => {
            const req = request(On.resource(`/`))
                .using(wrongBaseUrl);

            return Send.the(req).as(Method.post()).performAs(Richard)
                       .then(() => expect(true).toBeFalsy(`should throw an error on wrong base url, but it doesnt`))
                       .catch((result) => expect(result.statusCode).toEqual(404))

        });
    });

    describe(`it should not throw an error when the catchError parameter is set`, (): void => {
        const wrongBaseUrl = {
            baseUrl: `http://api.mathjs.org/v5`, // wrong base Url, should throw an error when used
            resolveWithFullResponse: true
        };

        it(`when using the GET request
        - (test case id: 78835b99-b4c2-47c0-a413-0ad4cb48135b)`, async (): Promise<boolean | void> => {
            const req = request(On.resource(`/`))
                .using(wrongBaseUrl);

            return Get.from(req).continueOnError().performAs(Richard)
                      .then((result) => expect(result?.statusCode).toEqual(404))
                      .catch((e: Error) => expect(false).toBeTruthy(`The Get Task should not throw an error, but it does! -> ${e}`))
        });

        it(`when using the POST request
        - (test case id: 2ea557d7-9967-4b7b-92da-8403aed440c4)`, async (): Promise<boolean | void> => {
            const req = request(On.resource(`/`))
                .using(wrongBaseUrl);

            return Post.to(req).continueOnError().performAs(Richard)
                       .then((result) => expect(result?.statusCode).toEqual(404))
                       .catch((e: Error) => expect(false).toBeTruthy(`The Post Task should not throw an error, but it does! -> ${e}`))
        });

    });

    describe(`it should not return the full response `, (): void => {

        it(`when using the GET request
        - (test case id: 7127c2c9-7167-49c8-850f-287a05d49880)`, async (): Promise<void> => {
            const opts = {
                resolveWithFullResponse: false,
                json: true
            };

            const req = request(On.resource(`/?expr=${a}%2B${b}`))
                .using(opts);

            const result = await Get.from(req).performAs(Richard) as unknown as number;

            expect(result).toEqual(2);
        });

        it(`when using the POST request passing an expression array
        - (test case id: ab7b185d-08f9-4277-969b-dc21dfd8091a)`, async (): Promise<void> => {
            const opts: RequestOptions = {
                resolveWithFullResponse: false,
                json: true,
                body: {
                    "expr": [
                        `${a} + ${b}`
                    ],
                    "precision": 2
                }
            };

            const req = request(On.resource(`/`))
                .using(opts);

            const result: RestRequestResult = await Post.to(req).performAs(Richard);
            expect(result.result[0]).toEqual(`2`);
        });
    });

    describe(`when using the Response question`, (): void => {

        it(`it should be possible to check the result 
        - (test case id: 7f4b74f0-048f-43b0-81a6-614299229d6f)`, (): Promise<void> => {

            const req = request(On.resource(`/?expr=${a}%2B${b}`))
                .using({resolveWithFullResponse: true});

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const containing = curry((cResult: string, stCode: number, respone: any): void => {
                expect(respone.statusCode).toEqual(stCode);
                expect(respone.body).toEqual(cResult);
            });

            return Richard.attemptsTo(
                See.if(Response.of(req).as(Method.get()))
                   .is(fp.compose((): boolean => true, (containing(`${calculationResult}`)(200))))
                   .repeatFor(5, 1000)
            );
        });
    });
});