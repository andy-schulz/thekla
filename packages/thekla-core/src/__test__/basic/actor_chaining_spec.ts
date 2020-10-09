import {Actor, PerformsTask, Task} from "../.."
import {Dbg, Debug}                from "../../lib/utils/DebugActivity";

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

describe(`Chaining Activities`, function () {

    describe(`and passing values`, function () {

        it(`should propagate the the results
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

        it(`should propagate the the results by passing the first parameter as function param
        - (test case id: f89c3d05-faec-4db4-aa29-b9ee41ed561b)`, async (): Promise<void> => {
            const chris = Actor.named(`Chris`);

            const value = await chris.attemptsTo_(
                TaskStoS.use(),
                TaskStoN.use(),
                TaskNtoN.use(),
                TaskNtoS.use()
            )(`2`);

            expect(value).toEqual(`2`);
        });

        it(`should examine the values when debugged
        test id: f5c304c2-0417-4947-8b76-07b5af3b20bf`, async () => {
            const chris = Actor.named(`Chris`);

            const value = await chris.attemptsTo(
                Start.with(`2`),
                TaskStoS.use(),
                TaskStoN.use(),
                Debug.by(result => expect(result).toEqual(2)),
                Dbg(TaskNtoN.use()).debug(result => expect(result).toEqual(2)),
                TaskNtoS.use()
            );

            expect(value).toEqual(`2`);
        });

        it(`should examine the values when debugged by passing the first parameter as function param
        test id: f5c304c2-0417-4947-8b76-07b5af3b20bf`, async () => {
            const chris = Actor.named(`Chris`);

            const value = await chris.attemptsTo_(
                TaskStoS.use(),
                TaskStoN.use(),
                Debug.by(result => expect(result).toEqual(2)),
                Dbg(TaskNtoN.use()).debug(result => expect(result).toEqual(2)),
                TaskNtoS.use()
            )(`2`);

            expect(value).toEqual(`2`);
        });

        it(`should pass the values for the default debug function
        test id: f5c304c2-0417-4947-8b76-07b5af3b20bf`, async () => {
            const chris = Actor.named(`Chris`);

            const value = await chris.attemptsTo(
                Start.with(`2`),
                TaskStoS.use(),
                TaskStoN.use(),
                Dbg(TaskNtoN.use()),
                TaskNtoS.use()
            );

            expect(value).toEqual(`2`);
        });

        it(`should pass the values for the default debug function by passing the first parameter as function param
        test id: f5c304c2-0417-4947-8b76-07b5af3b20bf`, async () => {
            const chris = Actor.named(`Chris`);

            const value = await chris.attemptsTo_(
                TaskStoS.use(),
                TaskStoN.use(),
                Dbg(TaskNtoN.use()),
                TaskNtoS.use()
            )(`2`);

            expect(value).toEqual(`2`);
        });
    });
});