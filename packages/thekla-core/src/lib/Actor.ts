/**
 * Actor implements the following relationships
 *
 * QUESTIONS
 *   ↑
 * answers
 *   |
 * ACTOR -- performs --> TASK
 *   |
 *  uses
 *   ↓
 * ABILITIES
 *
 * each relationship has its own interface
 */
import {ActivityLog}                       from "@thekla/activity-log";
import {Ability, AbilityClass, AbilitySet} from "./abilities/Ability";
import {Activity}                          from "./actions/Activities";
import {DoesNotHave}                       from "./errors/DoesNotHave";
import {Question}                          from "./questions/Question";

type A<P, R> = Activity<P, R>

export interface LogsActivity {
    readonly name: string;
    readonly activityLog: ActivityLog;
}

export interface AnswersQuestions extends LogsActivity {
    toAnswer<PT, RT>(question: Question<PT, RT>, activityResult?: PT): Promise<RT>;
}

export interface PerformsTask extends LogsActivity {
    attemptsTo<P, R1>(a1?: A<P, R1>): Promise<R1>;
    attemptsTo<P, R1, R2>(a1: A<P, R1>, a2: A<R1, R2>): Promise<R2>;
    attemptsTo<P, R1, R2, R3>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>): Promise<R3>;
    attemptsTo<P, R1, R2, R3, R4>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>,): Promise<R4>;
    attemptsTo<P, R1, R2, R3, R4, R5>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>): Promise<R5>;
    attemptsTo<P, R1, R2, R3, R4, R5, R6>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>): Promise<R6>;
    attemptsTo<P, R1, R2, R3, R4, R5, R6, R7>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>): Promise<R7>;
    attemptsTo<P, R1, R2, R3, R4, R5, R6, R7, R8>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>): Promise<R8>;
    attemptsTo<P, R1, R2, R3, R4, R5, R6, R7, R8, R9>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>): Promise<R9>;
    attemptsTo<P, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>, a10: A<R9, R10>): Promise<R10>;
    attemptsTo<P, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>, a10: A<R9, R10>, ...activities: A<any, any>[]): Promise<any>;
    attemptsTo<PT, RT>(...activities: Activity<PT, RT>[]): Promise<RT>;

    attemptsTo_<P, R1>(a1?: A<P, R1>): (param: P) => Promise<R1>;
    attemptsTo_<P, R1, R2>(a1: A<P, R1>, a2: A<R1, R2>): (param: P) => Promise<R2>;
    attemptsTo_<P, R1, R2, R3>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>): (param: P) => Promise<R3>;
    attemptsTo_<P, R1, R2, R3, R4>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>,): (param: P) => Promise<R4>;
    attemptsTo_<P, R1, R2, R3, R4, R5>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>): (param: P) => Promise<R5>;
    attemptsTo_<P, R1, R2, R3, R4, R5, R6>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>): (param: P) => Promise<R6>;
    attemptsTo_<P, R1, R2, R3, R4, R5, R6, R7>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>): (param: P) => Promise<R7>;
    attemptsTo_<P, R1, R2, R3, R4, R5, R6, R7, R8>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>): (param: P) => Promise<R8>;
    attemptsTo_<P, R1, R2, R3, R4, R5, R6, R7, R8, R9>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>): (param: P) => Promise<R9>;
    attemptsTo_<P, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>, a10: A<R9, R10>): (param: P) => Promise<R10>;
    attemptsTo_<P, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>, a10: A<R9, R10>, ...activities: A<any, any>[]): (param: P) => Promise<any>;
    attemptsTo_<PT, RT>(...activities: Activity<PT, RT>[]): (param: PT) => Promise<RT>;
}

export interface UsesAbilities extends LogsActivity {
    // abilityTo(Ability: AbilityClass): Ability;
    withAbilityTo(Ability: AbilityClass): Ability;

    can(ability: Ability): void;
}

export class Actor implements AnswersQuestions, PerformsTask, UsesAbilities {
    public activityLog: ActivityLog = new ActivityLog(this.name);
    private abilityMap: Map<string, Ability> = new Map();

    private constructor(public readonly name: string) {

    }

    public static named(name: string): Actor {
        return new Actor(name)
    }

    /**
     * assigns an ability to the actor, like Browser, SFT-Client, HTTP-Client ... you name it.
     * @param abilities the ability the actor is able to use
     */
    public whoCan(...abilities: Ability[] | AbilitySet[]): Actor {
        for (const element of abilities) {
            if (element.isAbilityList()) {
                this.whoCan(...element.getAbilities());
            } else {
                this.abilityMap.set(element.constructor.name, element);
            }
        }
        return this;
    }

    /**
     * Executes the given Tasks
     * @param a1
     */
    public attemptsTo<P, R1>(a1?: A<P, R1>): Promise<R1>;
    public attemptsTo<P, R1, R2>(a1: A<P, R1>, a2: A<R1, R2>): Promise<R2>;
    public attemptsTo<P, R1, R2, R3>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>): Promise<R3>;
    public attemptsTo<P, R1, R2, R3, R4>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>,): Promise<R4>;
    public attemptsTo<P, R1, R2, R3, R4, R5>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>): Promise<R5>;
    public attemptsTo<P, R1, R2, R3, R4, R5, R6>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>): Promise<R6>;
    public attemptsTo<P, R1, R2, R3, R4, R5, R6, R7>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>): Promise<R7>;
    public attemptsTo<P, R1, R2, R3, R4, R5, R6, R7, R8>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>): Promise<R8>;
    public attemptsTo<P, R1, R2, R3, R4, R5, R6, R7, R8, R9>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>): Promise<R9>;
    public attemptsTo<P, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>, a10: A<R9, R10>): Promise<R10>;
    public attemptsTo<P, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>, a10: A<R9, R10>, ...activities: A<any, any>[]): Promise<any>;
    public attemptsTo<PT, RT>(...activities: Activity<any, any>[]): Promise<RT> {
        return this.perform(activities, undefined);
    }

    public attemptsTo_<P, R1>(a1?: A<P, R1>): (param: P) => Promise<R1>;
    public attemptsTo_<P, R1, R2>(a1: A<P, R1>, a2: A<R1, R2>): (param: P) => Promise<R2>;
    public attemptsTo_<P, R1, R2, R3>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>): (param: P) => Promise<R3>
    public attemptsTo_<P, R1, R2, R3, R4>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>,): (param: P) => Promise<R4>;
    public attemptsTo_<P, R1, R2, R3, R4, R5>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>): (param: P) => Promise<R5>;
    public attemptsTo_<P, R1, R2, R3, R4, R5, R6>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>): (param: P) => Promise<R6>;
    public attemptsTo_<P, R1, R2, R3, R4, R5, R6, R7>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>): (param: P) => Promise<R7>;
    public attemptsTo_<P, R1, R2, R3, R4, R5, R6, R7, R8>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>): (param: P) => Promise<R8>;
    public attemptsTo_<P, R1, R2, R3, R4, R5, R6, R7, R8, R9>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>): (param: P) => Promise<R9>;
    public attemptsTo_<P, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>, a10: A<R9, R10>): (param: P) => Promise<R10>;
    public attemptsTo_<P, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(a1: A<P, R1>, a2: A<R1, R2>, a3: A<R2, R3>, a4: A<R3, R4>, a5: A<R4, R5>, a6: A<R5, R6>, a7: A<R6, R7>, a8: A<R7, R8>, a9: A<R8, R9>, a10: A<R9, R10>, ...activities: A<any, any>[]): (param: P) => Promise<any>;
    public attemptsTo_<PT, RT>(...activities: Activity<any, any>[]): (param: PT) => Promise<RT> {
        return param => this.perform(activities, param)
    }

    /**
     * Enables the Actor to do something ... Gives him the Ability
     * @param ability the ability to do something
     */
    public can(ability: Ability): Actor {
        return this.whoCan(ability)
    }

    /**
     *
     * @param ability provides the interactions the actor should be able to use
     */
    public withAbilityTo(ability: AbilityClass): Ability {

        if (!this.abilityMap.has(ability.name)) {
            throw DoesNotHave.theAbility(ability).usedBy(this);
        }
        return this.abilityMap.get(ability.name) as Ability;
    }

    public toAnswer<PT, RT>(question: Question<PT, RT>, activityResult: PT): Promise<RT> {
        return question.answeredBy(this, activityResult);
    }

    private perform<PT, RT>(activities: Activity<any, any>[], param: PT): Promise<RT> {

        const reducer = (chain: Promise<any>, activity: Activity<any, any>): Promise<any> => {
            return chain.then((result: PT): Promise<RT> => {
                return activity.performAs(this, result);
            })
        };

        return activities.reduce(reducer, Promise.resolve(param))
    }
}