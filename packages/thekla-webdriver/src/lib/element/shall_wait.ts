import {UntilElementCondition} from "./ElementConditions";
import {WebElementListFinder}  from "../../interface/WebElements";

export const waitForConditionRefactored = (
    elementList: WebElementListFinder
) => {

    return (condition: UntilElementCondition): Promise<void> => {
        return condition.waitFor(elementList)
    }
};