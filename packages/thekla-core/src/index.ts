/**
 * Screenplay Elements
 */

export {Actor} from "./lib/Actor";

// AbilitySet
export {Ability, AbilitySet} from "./lib/abilities/Ability";

// Tasks
export {PerformsTask, LogsActivity, AnswersQuestions, UsesAbilities} from "./lib/Actor";
export {ReturnTaskValue}                                             from "./lib/actions/ReturnTaskValue";

// Activities
export {Activity, Task, Interaction} from "./lib/actions/Activities";

// Interactions
export {SkipTask} from "./lib/actions/SkipTask";
export {Sleep}    from "./lib/actions/Sleep";
export {See}      from "./lib/matcher/See";
export {Extract}  from "./lib/matcher/Extract";

/**
 * Questions
 */
// the interface
export {Question} from "./lib/questions/Question";

// Basic Questions
export {ReturnedResult} from "./lib/questions/ReturnedResult";
export {DelayedResult}  from "./lib/questions/DelayedResult";

// Errors
export {DoesNotHave}          from "./lib/errors/DoesNotHave";
export {CanNotCreateDuration} from "./lib/errors/CanNotCreateDuration";

/**
 * Matcher
 */
//Function Matcher
export {Expected}             from "./lib/matcher/FunctionMatcher/Expected"

// Decorators
export {stepDetails, step} from "./lib/decorators/step_decorators"
export {wait}              from "./lib/utils/utils"

// Utils
export {Duration} from "./lib/utils/Duration"