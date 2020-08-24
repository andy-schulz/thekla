/**
 * Wait until a condition is met on a given element
 */
import {UsesAbilities, Interaction, stepDetails, AnswersQuestions, Question} from "@thekla/core";
import {Oracle}                                                              from "@thekla/core/dist/lib/actions/Activities";
import {UntilElementCondition}                                               from "@thekla/webdriver";
import {WaitOnElements}                                                      from "../abilities/WaitOnElements";
import {SppElement}                                                          from "../SppWebElements";
import {getLogger}                                                           from "@log4js-node/log4js-api"

export interface NamedMatcherFunction<MPT> extends Function {
    (actual: MPT): boolean | Promise<boolean>;
    description?: string;
}

class WaitUntil<PT, MPT> implements Oracle<PT, boolean> {

    private matcher: NamedMatcherFunction<MPT>;
    private timeout = 5000;

    public performAs(actor: AnswersQuestions, result: PT): Promise<boolean> {

        return new Promise((resolve, reject) => {
            const start = Date.now();

            const loop = (): void => {
                const now = Date.now();
                if(now - start > this.timeout)
                    return reject(
`Waiting until 
${this.question.toString()} 
which was expected ${this.matcher?.description} 
timed out after ${this.timeout} ms.`);

                actor.toAnswer(this.question, result)
                     .then((answer: MPT) => {
                         return this.matcher(answer)
                     })
                    .then(resolve)
                    .catch(() => setTimeout(loop, 300))
            };

            setTimeout(loop, 0);

        });
    }

    public is(matcher: (param: MPT) => boolean | Promise<boolean>): WaitUntil<PT, MPT> {
        this.matcher = matcher;
        return this;
    }

    public forAsLongAs(timeout: number): WaitUntil<PT, MPT> {
        this.timeout = timeout;
        return this;
    }

    public constructor(private question: Question<PT, MPT>) {
    }
}

export class Wait implements Interaction<void, void> {
    private logger = getLogger(`Wait`);
    private condition: UntilElementCondition;
    private ignoreError = false;
    private ignoreReason = ``;

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`wait for '<<awaitingElement>>' and check '<<condition>>'.`)
    public performAs(actor: UsesAbilities): Promise<void> {

        return new Promise((resolve, reject): void => {
            WaitOnElements.as(actor).wait(this.condition, this.awaitingElement)
                          .then((message: string): void => {
                              this.logger.debug(message);
                              resolve();
                          })
                          .catch(this.ignoreError ? resolve : reject)
        });
    }

    /**
     * wait until a condition is met for the given element
     * @param awaitingElement the elements to wait for
     */
    public static for(awaitingElement: SppElement): Wait {
        // if waiting for an element disable the implicit waiting
        // if you wait until it appears waiting two times does not make sense
        // if you wait for an element to disappear will fail because right when it's gone
        //      the implicit wait kicks in so its waiting to appear again
        return new Wait(awaitingElement.shallNotImplicitlyWait());
    }

    public static until<PT, MPT>(question: Question<PT, MPT>): WaitUntil<PT, MPT> {
        return new WaitUntil(question)
    }

    /**
     * specify the condition to wait for of the given element
     * @param condition the condition to be waiting for
     */
    public andCheck(condition: UntilElementCondition): Wait {
        this.condition = condition;
        return this;
    }

    public butContinueInCaseOfError(reason: string) {
        this.ignoreReason = reason;
        this.ignoreError = true;
        return this;
    }

    /**
     * @ignore
     */
    private constructor(private awaitingElement: SppElement) {
    }

}