import {On, request} from "..";

describe(`Using the request`, () => {

    describe(`with only a resource`, () => {

        it(`should return the full description of a request
        test id: 42ae98a7-763d-4b80-b910-f2491cb69238`, async () => {
            const req = request(On.resource(`/myRequest`));
            expect(req.toString()).toEqual(`resource: /myRequest with options: {}`);
        });
    });
});