import {UsesAbilities, Interaction, stepDetails} from "@thekla/core";
import {FindElements}                            from "../abilities/FindElements";
import {SppElement}                              from "../SppWebElements";
import {getLogger, Logger}                       from "@log4js-node/log4js-api";

export class Enter implements Interaction<void, void> {
    private inputField: SppElement;
    private clearField = false;
    private logger: Logger = getLogger(`Enter`);

    public static value(inputString: string | undefined): Enter {
        return new Enter(inputString);
    }

    private intoFunc: EnterHelper;

    @stepDetails<UsesAbilities, void, void>(`enter the value '<<keySequence>>' into field: <<inputField>>`)
    public performAs(actor: UsesAbilities): Promise<void> {
        // if undefined do nothing,
        // it makes it possible to work with data structures on forms
        if (this.keySequence === undefined) {
            this.logger.debug(`KeySequence is undefined so nothing is entered into ${this.inputField.toString()}`);
            return Promise.resolve();
        }
        return Promise.resolve()
                      .then((): Promise<void> | void => {
                          if (this.clearField)
                              return FindElements.as(actor).findElement(this.inputField).clear();
                      })
                      .then((): Promise<void> => FindElements.as(actor).findElement(this.inputField).sendKeys(this.keySequence as string));
    }

    get into(): EnterHelper {
        return this.intoFunc;
    }

    /**
     * @deprecated sinse version 3.x - use Enter.value().into.empty() instead
     * @param {boolean} clear
     * @returns {Enter}
     */
    public butClearsTheFieldBefore(clear = true): Enter {
        this.clearField = clear;
        return this;
    }

    private constructor(private keySequence: string | undefined) {
        // build the helper function so that
        // Enter.value().into() and
        // Enter.value().into.empty() works
        const intoFunc = (inputField: SppElement): Enter => {
            this.inputField = inputField;
            return this;
        };

        const emptyFunc = (inputField: SppElement): Enter => {
            this.inputField = inputField;
            this.clearField = true;
            return this;
        };

        intoFunc.empty = emptyFunc;

        this.intoFunc = intoFunc;
    }
}

export interface EnterHelper extends Function {
    (element: SppElement): Enter;
    empty: (element: SppElement) => Enter;
}