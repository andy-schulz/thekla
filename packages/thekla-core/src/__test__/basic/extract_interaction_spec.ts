import {Actor, Extract, Result} from "../..";

describe(`Extract`, function () {

    const Emma = Actor.named(`Emma`);

    describe(`a value`, function () {

        it(`should add the value to the array
        test id: 734a6687-78c8-4da7-a654-cd8086ae4388`, async () => {
            const field: string[] = [];

            await Emma.attemptsTo(
                Extract.the(Result.of(`Extract Test`))
                       .by((text: string) => field.push(text))
            );

            expect(field).toEqual([`Extract Test`]);

        });
    });
});