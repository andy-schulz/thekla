import {Expected} from "..";

describe(`Expect`, () => {

    describe(`matching a RegExp`, () => {

        it(`should pass when string is matched
        test id: e7e4750b-78fb-4009-af28-ab3e4abdaf21`, () => {
            expect(
                Expected.to.match(/the match/)(`check the matching capability`))
                .toBeTruthy()
        });

        it(`should pass when string is not matched
        test id: 502e0f17-37d6-4897-9612-5da817863e28`, () => {
            expect(
                Expected.not.to.match(/does not match/)(`the string`))
                .toBeTruthy()
        });

        it(`should fail when the regex does not match the string
        test id: 6a5190ea-f7bb-4af7-8d17-7541471a9738`, () => {
            expect(() =>
                Expected.to.match(/does not match/)(`the string`)
            ).toThrowError(`does not match RegEx: expected 'the string' to match /does not match/`)
        });

        it(`should fail with a custom message
        test id: 59055146-3564-4991-9cdf-41c8596dae61`, () => {
            expect(() =>
                Expected.to.match(/does not match/, `with a custom message`)(`the string`)
            ).toThrowError(`with a custom message: expected 'the string' to match /does not match/`)
        });
    });
});