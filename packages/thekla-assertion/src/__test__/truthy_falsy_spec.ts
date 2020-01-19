import {Expected} from "../lib/Assert";

describe(`Expect`, () => {
    describe(`truthy assertion`, () => {
        it(`should pass when checked for true/false
        test id: c8c96f46-f3e5-4b8e-871c-a7ffdfa78e7e`, () => {
            expect(Expected.to.be.truthy()(true)).toBeTruthy();
            expect(Expected.to.not.be.truthy()(false)).toBeTruthy();
            expect(Expected.not.to.be.truthy()(false)).toBeTruthy();
        });

        it(`should fail when negated and checked for true/false
        test id: bb7da326-16d4-457b-816c-e2a865c63ef6`, () => {
            expect(() => Expected.to.not.be.truthy()(true))
                .toThrowError(`missed not truthy assertion: expected true to not equal true`);

            expect(() => Expected.to.be.truthy()(false))
                .toThrowError(`missed truthy assertion: expected false to be true`);
        });

        it(`should throw a custom message in case of an error
        test id: 28e0ae8a-5be1-4b16-b556-02c50f73f59d`, () => {
            expect(() =>
                       Expected.to.be.falsy(`I would expect it to be true`)(true))
                .toThrowError(/I would expect it to be true/)
        });
    });

    describe(`falsy assertion`, () => {
        it(`should pass when checked for true/false
        test id: c8c96f46-f3e5-4b8e-871c-a7ffdfa78e7e`, () => {
            expect(Expected.to.be.falsy()(false)).toBeTruthy();
            expect(Expected.to.not.be.falsy()(true)).toBeTruthy();
            expect(Expected.not.to.be.falsy()(true)).toBeTruthy();
        });

        it(`should fail when negated and checked for true/false
        test id: bb7da326-16d4-457b-816c-e2a865c63ef6`, () => {
            expect(() => Expected.to.not.be.falsy()(false))
                .toThrowError(`missed not falsy assertion: expected false to not equal false`);

            expect(() => Expected.to.be.falsy()(true))
                .toThrowError(`missed falsy assertion: expected true to be false`);
        });
    });
});