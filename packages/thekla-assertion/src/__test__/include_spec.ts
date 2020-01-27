import {Expected} from "..";

describe(`Expect`, () => {

    describe(`the standard include assertion`, () => {

        it(`to pass
        test id: 9771761b-64c5-4c6b-96bc-5accaf14aafe`, () => {
            expect(Expected.to.include(1)([1, 2, 3, 4])).toBeTruthy();
            expect(Expected.to.include(`1`)(`1234`)).toBeTruthy();

            const obj = {a: 1};
            expect(Expected.to.include(obj)([obj, {b: 2}])).toBeTruthy()
        });

        it(`to fail
        test id: 489a89b5-1e95-4615-a83d-3d5a67a5f6f2`, () => {
            expect(() => Expected.to.include(5)([1, 2, 3, 4]))
                .toThrowError(`does not strict include: expected [ 1, 2, 3, 4 ] to include 5`);

            expect(() => Expected.to.include(5, `myMessage`)([1, 2, 3, 4]))
                .toThrowError(`myMessage: expected [ 1, 2, 3, 4 ] to include 5`);

            expect(() => Expected.to.include(`5`)(`1234`))
                .toThrowError(`does not strict include: expected '1234' to include '5'`);

            expect(() => Expected.to.include({a: 1})([{a: 1}, {b: 2}]))
                .toThrowError(`does not strict include: expected [ { a: 1 }, { b: 2 } ] to include { a: 1 }`)
        });

        it(`to pass when negated
        test id: 2a9d95a5-9d95-43dc-9fb0-4f3353993bde`, () => {
            expect(Expected.not.to.include(5)([1, 2, 3, 4])).toBeTruthy();
            expect(Expected.not.to.include(`5`)(`1234`)).toBeTruthy();
        });

        it(`to fail when negated
        test id: 5dc0f818-b763-41cd-9e54-9ae24d25c7ab`, () => {
            expect(() => Expected.not.to.include(1)([1, 2, 3, 4]))
                .toThrowError(`does strict include: expected [ 1, 2, 3, 4 ] to not include 1`);

            expect(() => Expected.not.to.include(1,`myMessage`)([1, 2, 3, 4]))
                .toThrowError(`myMessage: expected [ 1, 2, 3, 4 ] to not include 1`);

            expect(() => Expected.not.to.include(`1`)(`1234`))
                .toThrowError(`does strict include: expected '1234' to not include '1'`);
        });
    });

    describe(`the deep include`, () => {

        it(`to pass
        test id: 4be2a729-0b56-4d13-850f-87b15f64918d`, () => {
            expect(Expected.to.deep.include({a: 1})([{a: 1}, {b: 2}])).toBeTruthy()
        });

        it(`to fail
        test id: f9855970-9713-4383-bd5d-cc5bfc6cecfe`, () => {
            expect(() => Expected.to.deep.include({a: 2})([{a: 1}, {b: 2}]))
                .toThrowError(`does not have deep include: expected [ { a: 1 }, { b: 2 } ] to deep include { a: 2 }`);

            expect(() => Expected.to.deep.include({a: 2},`myMessage`)([{a: 1}, {b: 2}]))
                .toThrowError(`myMessage: expected [ { a: 1 }, { b: 2 } ] to deep include { a: 2 }`)

        });

        it(`to pass when negated
        test id: a9f0ff2a-f1b6-430f-9084-bd4afe79b144`, () => {
            expect(Expected.not.to.deep.include({a: 2})([{a: 1}, {b: 2}]))
                .toBeTruthy();
        });

        it(`to fail when negated
        test id: 5e913e3c-93e0-4d8f-ba07-9c18e124a13d`, () => {
            expect(() => Expected.not.to.deep.include({a: 1})([{a: 1}, {b: 2}]))
                .toThrowError(`does have deep include: expected [ { a: 1 }, { b: 2 } ] to not deep include { a: 1 }`);

            expect(() => Expected.not.to.deep.include({a: 1},`myMessage`)([{a: 1}, {b: 2}]))
                .toThrowError(`myMessage: expected [ { a: 1 }, { b: 2 } ] to not deep include { a: 1 }`)

        });
    });

    describe(`the own include`, () => {
        const func = (): void => {
            return
        };

        class Person extends Object {
            type: string;

            task = func;

            constructor(type: string) {
                super();
                this.type = type
            }
        }

        class Hero extends Person {
            name: string;

            constructor(name: string) {
                super(`Hero`);
                this.name = name
            }
        }

        const Batman = new Hero(`Batman`);

        it(`to pass
        test id: 0e684028-86ff-4707-aa6a-d69c74ef966e`, () => {
            expect(Expected.to.own.include({name: `Batman`})(Batman))
                .toBeTruthy()
        });

        it(`to fail
        test id: 8cfa3cf4-2d2e-48fe-9a76-c05f42a22829`, () => {
            expect(() => Expected.to.own.include({canFly: true})(Batman))
                .toThrowError(`does not have own include: expected { Object (task, type, ...) } to have own property 'canFly'`);

            expect(() => Expected.to.own.include({canFly: true},`myMessage`)(Batman))
                .toThrowError(`myMessage: expected { Object (task, type, ...) } to have own property 'canFly'`)

        });

        it(`to pass when negated
        test id: d80044b4-f504-4d45-83ea-02bcbff55db6`, () => {
            expect(Expected.not.to.own.include({canFly: true})(Batman))
                .toBeTruthy()
        });

        it(`to fail when negated
        test id: 00275f6b-2a84-4422-ba37-5273d3268cc2`, () => {
            expect(() => Expected.not.to.own.include({name: `Batman`})(Batman))
                .toThrowError(`does have own include: expected { Object (task, type, ...) } to not have own property 'name' of 'Batman'`);

            expect(() => Expected.not.to.own.include({name: `Batman`},`myMessage`)(Batman))
                .toThrowError(`myMessage: expected { Object (task, type, ...) } to not have own property 'name' of 'Batman'`)

        });
    });

    describe(`the deep own include`, () => {

        it(`to pass
        test id: c370359a-a84f-4ca1-acc3-95b6eb7af12a`, () => {
            expect(Expected.to.deep.own.include(({a: {b: 2}}))({a: {b: 2}})).toBeTruthy()
        });

        it(`to pass when negated
        test id: 5d8f0bfd-620d-4dd0-aaa1-ea69ae225e3b`, () => {
            expect(Expected.not.to.deep.own.include(({a: {b: 2}}))({a: {c: 2}}))
                .toBeTruthy()
        });

        it(`to fail
        test id: 9faeeae3-3929-46b4-b80e-9116b7126742`, () => {
            expect(() => Expected.to.deep.own.include(({a: {b: 2}}))({a: {c: 2}}))
                .toThrowError(`does not have deep own include: expected { a: { c: 2 } } to have deep own property 'a' of { b: 2 }, but got { c: 2 }`);

            expect(() => Expected.to.deep.own.include(({a: {b: 2}}),`myMessage`)({a: {c: 2}}))
                .toThrowError(`myMessage: expected { a: { c: 2 } } to have deep own property 'a' of { b: 2 }, but got { c: 2 }`)

        });

        it(`to fail when negated
        test id: 188b46e8-e59a-4244-8fcc-715f55444f76`, () => {
            expect(() => Expected.not.to.deep.own.include(({a: {b: 2}}))({a: {b: 2}}))
                .toThrowError(`does have deep own include: expected { a: { b: 2 } } to not have deep own property 'a' of { b: 2 }`);

            expect(() => Expected.not.to.deep.own.include(({a: {b: 2}}),`myMessage`)({a: {b: 2}}))
                .toThrowError(`myMessage: expected { a: { b: 2 } } to not have deep own property 'a' of { b: 2 }`)

        });
    });

    describe(`the nested include`, () => {

        it(`to pass
        test id: 500b1f93-d036-4682-9b5c-d772b16d77f5`, () => {
            expect(Expected.to.have.nested.include({"a.b": 1})({a: {b: 1, c: 2}}))
                .toBeTruthy()
        });

        it(`to fail
        test id: 52023c11-7949-4ef4-a1fa-c7d1217cc5e6`, () => {
            expect(() => Expected.to.have.nested.include({"a.b": 1})({a: {c: 1}}))
                .toThrowError(`does not have nested include: expected { a: { c: 1 } } to have nested property 'a.b'`);

            expect(() => Expected.to.have.nested.include({"a.b": 1},`myMessage`)({a: {c: 1}}))
                .toThrowError(`myMessage: expected { a: { c: 1 } } to have nested property 'a.b'`);

            expect(() => Expected.to.have.nested.include({a:{b:`1`}})({a:{b:`1`}, b:1}))
                .toThrowError(`does not have nested include: expected { a: { b: '1' }, b: 1 } to have nested property 'a' of { b: '1' }, but got { b: '1' }`)
        });

        it(`to pass when negated
        test id: 2d810ba7-5971-4eb1-b86b-a865c74410a5`, () => {
            expect(Expected.not.to.have.nested.include({a: `1`})({b: `1`})).toBeTruthy()
        });

        it(`to fail when negated
        test id: ac43a94f-6ef6-41de-8ec1-3941e58bc75a`, () => {
            expect(() => Expected.not.to.have.nested.include({"a.b": 1})({a: {b: 1, c: 2}}))
                .toThrowError(`does have nested include: expected { a: { b: 1, c: 2 } } to not have nested property 'a.b' of 1`);

            expect(() => Expected.not.to.have.nested.include({"a.b": 1},`myMessage`)({a: {b: 1, c: 2}}))
                .toThrowError(`myMessage: expected { a: { b: 1, c: 2 } } to not have nested property 'a.b' of 1`)
        });
    });

    describe(`the deep nested include`, () => {

        it(`to pass
        test id: d23509ac-b8bc-41d9-ad85-584fb3784be3`, () => {
            expect(Expected.to.have.deep.nested.include({a:{b:`1`}})({a:{b:`1`}, b:1}))
                .toBeTruthy()
        });

        it(`to fail
        test id: 1b13be7f-eda2-4e3a-b757-cfdd8dc96128`, () => {
            expect(() => Expected.to.have.deep.nested.include({a:{b:`1`}})({a:{b:`2`}, b:1}))
                .toThrowError(`does not have deep nested include: expected { a: { b: '2' }, b: 1 } to have deep nested property 'a' of { b: '1' }, but got { b: '2' }`);

            expect(() => Expected.to.have.deep.nested.include({a:{b:`1`}}, `myMessage`)({a:{b:`2`}, b:1}))
                .toThrowError(`myMessage: expected { a: { b: '2' }, b: 1 } to have deep nested property 'a' of { b: '1' }, but got { b: '2' }`)

        });

        it(`to pass when negated
        test id: 59ab5c94-8eb1-4857-a585-0baee08f69c5`, () => {
            expect(Expected.not.to.have.deep.nested.include({a:{b:`1`}})({a:{b:`2`}, b:1}))
                .toBeTruthy()
        });

        it(`to fail when negated
        test id: 25b8ea2f-0022-4c11-a950-7c41b8baf2f1`, () => {
            expect(() => Expected.not.to.have.deep.nested.include({a:{b:`1`}})({a:{b:`1`}, b:1}))
                .toThrowError(`does have deep nested include: expected { a: { b: '1' }, b: 1 } to not have deep nested property 'a' of { b: '1' }`);

            expect(() => Expected.not.to.have.deep.nested.include({a:{b:`1`}},`myMessage`)({a:{b:`1`}, b:1}))
                .toThrowError(`myMessage: expected { a: { b: '1' }, b: 1 } to not have deep nested property 'a' of { b: '1' }`)
        });
    });

    describe(`the nested and own include chaining`, () => {

        it(`to fail
        test id: 4bc09831-ca1c-4617-966e-44d4b488c1c1`, () => {
            expect(() => Expected.to.nested.own.include(1)([1, 2]))
                .toThrowError(`Own and Nested can't be chained for include assertion`);

            expect(() => Expected.to.nested.own.include(1,`myMessage`)([1, 2]))
                .toThrowError(`Own and Nested can't be chained for include assertion`);

            expect(() => Expected.not.to.nested.own.include(1)([1, 2]))
                .toThrowError(`Own and Nested can't be chained for include assertion`);

            expect(() => Expected.to.deep.nested.own.include(1)([1, 2]))
                .toThrowError(`Own and Nested can't be chained for include assertion`);

            expect(() => Expected.not.to.deep.nested.own.include(1)([1, 2]))
                .toThrowError(`Own and Nested can't be chained for include assertion`)
        });
    });
});