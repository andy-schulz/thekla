import {getLogger}      from "@log4js-node/log4js-api"
import {UsesAbilities}  from "../Actor";
import {stepDetails}    from "../decorators/step_decorators";
import {DurationResult} from "../utils/Duration";
import {wait}           from "../utils/utils";
import {Interaction}    from "./Activities";

export class Sleep implements Interaction<void, void> {
    private logger = getLogger(`Sleep`);
    public sleepReason = ``;
    private sleepTimeInMs: number;

    @stepDetails<UsesAbilities, void, void>(`stop all actions for '<<sleepTimeInMs>>' ms<<sleepReason>>`)
    // parameter is needed for stepDetails typing
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public performAs(actor: UsesAbilities): Promise<void> {
        return wait(this.sleepTimeInMs).then((): void => {
            return this.logger.trace(`Slept for ${this.sleepTimeInMs}`);
        });
    }

    public static for(sleepTime: number | DurationResult): Sleep {
        return new Sleep(sleepTime);
    }

    public because(sleepReason: string): Sleep {
        this.sleepReason = ` because ${sleepReason}`;
        return this;
    }

    private constructor(sleepTime: number | DurationResult) {
        this.sleepTimeInMs = typeof sleepTime === `number` ? sleepTime : sleepTime.inMs
    }

}