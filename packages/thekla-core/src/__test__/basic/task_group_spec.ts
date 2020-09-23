import {Actor, PerformsTask, step, Task} from "../..";
import {AndThen}                         from "../../lib/actions/AndThen";

class Task1 extends Task<void, string> {

    private data: string;

    private constructor(private myData: string) {
        super();
        this.data = myData;
    }

    public static usesString(theData: string): Task1 {
        return new Task1(theData);
    }

    @step<PerformsTask, void, string>(`execute the empty task to test the log activity`)
    public performAs(actor: PerformsTask,): Promise<string> {
        return Promise.resolve(this.data);
    }

}

class AddToString extends Task<string, string> {
    char: string;

    private constructor(char: string) {
        super();
        this.char = char;
    }

    public static character(char: string): AddToString {
        return new AddToString(char);
    }

    @step<PerformsTask, string, string>(`execute the empty task to test the log activity`)
    public performAs(actor: PerformsTask, result = `none`): Promise<string> {
        return Promise.resolve(`${result}${this.char}`);
    }

}

describe(`group`, () => {

    const glen: Actor = Actor.named(`Glen`)

    describe(`a single task`, () => {

        it(`with starting parameter should pass
        test id: 9eed3c88-1fc9-4958-96d1-5838b17d8c69`, () => {
            return glen
                .attemptsTo(
                    Task1.usesString(`start task`),
                    AndThen.run((glen1: PerformsTask, data: string): Promise<string> => {
                        return glen1.attemptsTo(
                            Task1.usesString(data))
                    }))
                .then((data: string) => {
                    expect(data).toEqual(`start task`)
                })
        });

        it(`without starting parameter should pass
        test id: 9e807321-9859-425f-af97-9634cd918922`, () => {
            return glen
                .attemptsTo(
                    AndThen.run((glen1: PerformsTask, data = `without parameter`): Promise<string> => {
                        return glen1.attemptsTo(
                            Task1.usesString(data as string))
                    }))
                .then((data: string) => {
                    expect(data).toEqual(`without parameter`)
                })
        });
    });

    describe(`multiple tasks`, () => {

        it(`with starting parameter should pass
        test id: dc2d3966-1e68-41cd-b089-0378f59c23a1`, () => {
            return glen
                .attemptsTo(
                    Task1.usesString(`start task`),
                    AndThen.run((glen1: PerformsTask, data = `test`): Promise<string> => {
                        return glen1.attemptsTo(
                            Task1.usesString(data as string),
                            AddToString.character(`#`),
                            AddToString.character(`.`))
                    }))
                .then((data: string) => {
                    expect(data).toEqual(`start task#.`)
                })
        });
    });
});