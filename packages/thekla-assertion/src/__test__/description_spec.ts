import {Expected} from "..";

describe(`check description`, () => {

    describe(`of truthy`, () => {

        it(`with not flag should pass
        test id: 1aaa064a-0a79-4fff-8baf-61efb666fedb`, () => {
            expect(Expected.to.be.truthy(`test`).description).toEqual(`to be truthy`)
        });

        it(`with not flag should pass
        test id: 53f8f9de-4c36-4d37-b885-4918339596da`, () => {
            expect(Expected.not.to.be.truthy(`test`).description).toEqual(`not to be truthy`)
        });
    });

    describe(`of equal`, () => {

        it(`with not flag should pass
        test id: `, () => {
            expect(Expected.not.to.be.equal(1, `test`).description).toEqual(`not to be equal 1`)
        });

        it(`should pass
        test id: 9d6cf7a1-c8a8-48ff-8f27-d349a5e0e795`, () => {
            expect(Expected.to.deep.equal(1, `test`).description).toEqual(`to deep equal 1`)
        });
    });

    describe(`of match`, () => {

        it(`with not flag should pass
        test id: `, () => {
            expect(Expected.not.to.match(/1/, `test`).description).toEqual(`not to match /1/`)
        });

        it(`should pass
        test id: 9d6cf7a1-c8a8-48ff-8f27-d349a5e0e795`, () => {
            expect(Expected.to.match(/1/, `test`).description).toEqual(`to match /1/`)
        });
    });

    describe(`of include`, () => {

        it(`with not flag should pass
        test id: `, () => {
            expect(Expected.not.to.have.deep.include({a: `test`}, `test`).description).toEqual(`not to have deep include {"a":"test"}`)
        });

        it(`should pass
        test id: 9d6cf7a1-c8a8-48ff-8f27-d349a5e0e795`, () => {
            expect(Expected.to.have.nested.include({}, `test`).description).toEqual(`to have nested include {}`)
        });
    });
});