import {Ability, Actor, UsesAbilities} from "../..";

describe(`The Actor`, () => {

    class DoNothing implements Ability {

        public isAbilityList(): boolean {
            return false;
        }

        public getAbilities(): Ability[] {
            return [this];
        }

        public static using(name: string): DoNothing {
            return new DoNothing(name);
        }

        public static as(actor: UsesAbilities): DoNothing {
            return actor.withAbilityTo(DoNothing) as DoNothing;
        }

        public constructor(private name: string) {

        }

        public returnsAbilityName(): Promise<string> {
            return Promise.resolve(this.name);
        }
    }

    it(`should be able to use an ability
        test id: 47e98ac3-ed95-456f-b85c-affee90bd062`, async () => {
        const actor = Actor.named(`The Actor`);
        actor.can(DoNothing.using(`The Dummy Name`));
        const theName = await (actor.withAbilityTo(DoNothing) as DoNothing).returnsAbilityName();

        expect(theName).toEqual(`The Dummy Name`)
    });

    it(`should fail when the ability does not exist
    test id: 0ad26a24-70ea-4c26-811e-048db54746b2`, () => {
        const actor = Actor.named(`The Actor`);

        expect(() => actor.withAbilityTo(DoNothing))
            .toThrowError()
    });

});