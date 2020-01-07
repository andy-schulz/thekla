import {Actor, PerformsTask, Task} from "../.."

class Start extends Task<void, string> {
    private constructor(private param: string) {
        super();
    }

    public static with(param: string): Start {
        return new Start(param)
    }

    performAs(): Promise<string> {
        return Promise.resolve(this.param);
    }
}

class TaskStoN extends Task<string, number> {
    public static use(): TaskStoN {
        return new TaskStoN()
    }

    performAs(actor: PerformsTask, result: string): Promise<number> {
        return Promise.resolve(parseInt(result));
    }
}

class TaskNtoS extends Task<number, string> {
    public static use(): TaskNtoS {
        return new TaskNtoS();
    }

    performAs(actor: PerformsTask, result: number): Promise<string> {
        return Promise.resolve(`${result}`);
    }
}

class TaskStoS extends Task<string, string> {
    public static use(): TaskStoS {
        return new TaskStoS();
    }

    performAs(actor: PerformsTask, result: string): Promise<string> {
        return Promise.resolve(result);
    }

}

class TaskNtoN extends Task<number, number> {
    public static use(): TaskNtoN {
        return new TaskNtoN()
    }

    performAs(actor: PerformsTask, result: number): Promise<number> {
        return Promise.resolve(result);
    }
}

describe(``, function () {

    describe(``, function () {

        it(`chains tasks
        - (test case id: f89c3d05-faec-4db4-aa29-b9ee41ed561b)`, async (): Promise<void> => {
            const chris = Actor.named(`Chris`);

            const value = await chris.attemptsTo(
                Start.with(`2`),
                TaskStoS.use(),
                TaskStoN.use(),
                TaskNtoN.use(),
                TaskNtoS.use()
            );

            expect(value).toEqual(`2`);
        });
    });
});