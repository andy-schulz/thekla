import {step}         from "../..";
import {PerformsTask} from "../Actor";
import {Task}         from "./Activities";

export class AndThen<PT, RT> extends Task<PT, RT> {
    private executor: (actor: PerformsTask, result?: PT) => Promise<RT>

    private constructor(executor: (actor: PerformsTask, result?: PT) => Promise<RT>) {
        super();
        this.executor = executor;
    }

    public static run<S_PT, S_RT>(func: (actor: PerformsTask, result: S_PT) => Promise<S_RT>): AndThen<S_PT, S_RT>;
    public static run<S_PT, S_RT>(func: (actor: PerformsTask, result?: S_PT) => Promise<S_RT>): AndThen<S_PT, S_RT> {
        return new AndThen(func)
    }

    @step<PerformsTask, PT, RT>(`run a task group`)
    performAs(actor: PerformsTask, result?: PT): Promise<RT> {
        return this.executor(actor, result);
    }
}