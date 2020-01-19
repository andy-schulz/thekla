import {Expected} from "../lib/Assert";

describe(`Expect`, function () {

    describe(`value equality`, function () {

        it(`should pass the strict equal assertion
        - (test case id: 110266bb-dc77-4f7e-9871-63fe2d64fd28)`, (): void => {
            expect(
                Expected.to.equal(`2`)(`2`)
            ).toBeTruthy()
        });

        it(`should pass the negated strict equal assertion
        - (test case id: c57d545a-c039-43b1-b7c1-89c20ff214ec)`, (): void => {
            expect(
                Expected.to.not.equal(`2`)(`3`)
            ).toBeTruthy()
        });

        it(`should fail the strict equal assertion
        - (test case id: fd484bac-6c2a-40f5-95bc-e5b50ae25a71)`, (): void => {
            expect(
                () => Expected.to.equal(`2`)(`3`)
            ).toThrow()
        });

        it(`should fail the strict equal assertion on objects
        - (test case id: 9ff5984a-2ffd-4b20-a620-4adf57d31c79)`, (): void => {
            expect(
                () => Expected.to.equal({a: 2})({a: 2})
            ).toThrow();
        });

        it(`should fail the strict equal assertion on objects with a message
        - (test case id: e62a9a03-b4c8-4b36-ad69-172910864ca6)`, (): void => {
            expect(
                () =>
                    Expected.to.equal({a: 2}, `myMessage`)({a: 3})
            ).toThrowError(/myMessage: {"a":3} (===|strictEqual) {"a":2}/);
        });

        it(`should pass the deep equal assertion on objects
        - (test case id: d4522506-39b8-4d3c-9557-8226bec8622b)`, (): void => {
            expect(
                Expected.to.deep.equal({a: 2})({a: 2})
            ).toBeTruthy()
        });

        it(`should fail the deep equal assertion on objects
        - (test case id: ce6d3494-016b-4dff-9573-fe49babae578)`, (): void => {
            expect(
                () => Expected.to.deep.equal({a: 2})({a: 3})
            ).toThrowError(`missed deep equality: {"a":3} deepStrictEqual {"a":2}`)
        });

        it(`should fail the deep equal assertion on objects with a message
        - (test case id: eae40e05-3809-4860-9041-3f729d426b27)`, (): void => {
            expect(
                () => Expected.to.deep.equal({a: 2}, `myMessage`)({a: 3})
            ).toThrowError(`myMessage: {"a":3} deepStrictEqual {"a":2}`)
        });

    });

    describe(`chained assertions`, function () {

        it(`should pass the chained strict equal assertion 
            - (test case id: 0ba8e85c-883f-4138-a2d7-694fc79b853b)`, (): void => {
            expect(
                Expected.to.equal(`2`)
                    .and.to.equal(`2`)(`2`)
            ).toBeTruthy()
        });

        it(`should fail the chained strict equal assertion 
            - (test case id: 1ab330c8-1ae3-40b2-9810-f7aced4187d7)`, (): void => {
            expect(
                () =>
                    Expected.to.equal(`3`)
                        .and.to.equal(`2`)(`3`)
            ).toThrowError(/missed strict equality: "3" (===|strictEqual) "2"/)
            // node < 12 uses === as assertion text
            // node >= 23 uses strictEqual as assertion text
        });

        it(`should fail the chained strict equal assertion with a message
            - (test case id: fc550f26-0d70-4785-8827-84db2550f871)`, (): void => {
            expect(
                () =>
                    Expected.to.equal(3)
                        .and.to.equal(2, `myMessage`)(3)
            ).toThrowError(/myMessage: 3 (===|strictEqual) 2/)
        });

        it(`should fail all chained strict equal assertion with a message
            - (test case id: 74545e5e-f105-4046-b0d4-f46f13807ffe)`, (): void => {
            expect(
                () =>
                    Expected.to.equal(1, `myFirstMessage`)
                        .and.to.equal(2, `mySecondMessage`)(3)
            ).toThrowError(/myFirstMessage: 3 (===|strictEqual) 1([\s\S]*?)mySecondMessage: 3 (===|strictEqual) 2/)
        });
    });

});