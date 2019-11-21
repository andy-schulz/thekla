import {Expected} from "../..";

describe(`Matcher`, () => {
    describe(`toBeVisible`, () => {
        it(`should return true if status visible is true
        test id: 9aaaa1bd-8bda-4d25-895d-4edf15503faf`, () => {
            const actual = {
                visible: true,
                enabled: true
            };
            expect(Expected.toBeVisible()(actual)).toEqual(true);
        });

        it(`should throw an error if status visible is false
        test id: aa78c055-4a9e-41c9-b1f3-98024e10fc90`, () => {
            const actual = {
                visible: false,
                enabled: true
            };
            expect(() => Expected.toBeVisible()(actual)).toThrow();
        });
    });

    describe(`notToBeVisible`, () => {
        it(`should throw an error if status visible is true
        test id: c985da12-79a6-4efd-88d0-d32378a68bb9`, () => {
            const actual = {
                visible: true,
                enabled: true
            };

            expect(() => Expected.notToBeVisible()(actual)).toThrow();
        });

        it(`should return true if status visible is false
        test id: 482205d4-e209-410c-9e84-89f51faf8b6d`, () => {
            const actual = {
                visible: false,
                enabled: true
            };

            expect(Expected.notToBeVisible()(actual)).toEqual(true);
        });
    });
});