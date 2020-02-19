import {Activity, PerformsTask, Task} from "../..";

type PerformFunction<T> = (result?: T) => void

class DebugWrapper<PT, RT> extends Task<PT, RT> {
    private func: PerformFunction<PT> = x => x;

    public performAs(actor: PerformsTask, result: PT): Promise<RT> {
        this.func(result);

        return this.activity.performAs(actor, result);
    }

    public static by<U, R>(activity: Activity<U, R>): DebugWrapper<U, R> {
        return new DebugWrapper(activity)
    }

    public debug(func: PerformFunction<PT>): DebugWrapper<PT, RT> {
        this.func = func;
        return this;
    }

    constructor(private activity: Activity<PT, RT>) {
        super();
    }
}

export const Dbg = <PT, RT>(a: Activity<PT, RT>): DebugWrapper<PT, RT> => {
    return DebugWrapper.by(a)
};

export class Debug<PT> extends Task<PT, PT> {

    public performAs(actor: PerformsTask, result: PT): Promise<PT> {
        this.func(result);
        return Promise.resolve(result)
    }

    public static by<U>(func: PerformFunction<U>): Debug<U> {
        return new Debug(func)
    }

    constructor(private func: PerformFunction<PT>) {
        super();
    }
}