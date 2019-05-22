export {TheklaGlobal} from "./lib/globals/TheklaGlobal";
export {TheklaConfig} from "./lib/config/TheklaConfig";

/**
 *  exports from thekla-core
 */

export {SeleniumConfig, RestClientConfig, DesiredCapabilities} from "thekla-core";


/**
 * WebDriver Wrapper
 */

export {Browser}                          from "thekla-core";
export {BrowserScreenshotData}            from "thekla-core";
export {WebElementFinder}                 from "thekla-core";

export {RunningBrowser} from "thekla-core";
export {BrowserHelper}  from "thekla-core";
export {By}             from "thekla-core";
export {Key}            from "thekla-core";
export {until}          from "thekla-core";
export {UntilElement}   from "thekla-core";

export {Utils}                                                       from "thekla-core";

/**
 *
 * Request Wrapper
 *
 */
export {Get}                                                         from "thekla-core";
export {Post}                                                        from "thekla-core";
export {Delete}                                                      from "thekla-core";
export {Send}                                                        from "thekla-core";

export {On}                                                          from "thekla-core";
export {Method}                                                      from "thekla-core";
export {ExecutingRestClient}                                         from "thekla-core";

/**
 * screenplay Elements
 */
export {element, all, frame}                                         from "thekla-core";
export {SppWebElementFinder, SppWebElementListFinder}                from "thekla-core";
export {Actor}                                                       from "thekla-core";
export {request, SppRestRequest}                                     from "thekla-core";


// Abilities
export {Ability}                                                from "thekla-core";
export {BrowseTheWeb}                                           from "thekla-core";
export {Authenticate, AuthenticationInfo}                       from "thekla-core";
export {UseTheRestApi}                                          from "thekla-core";

// Tasks
export {PerformsTask} from "thekla-core";

// Activities
export {Activity, Task, Interaction}     from "thekla-core";
export {Click}                           from "thekla-core";
export {Hover}                           from "thekla-core";
export {Enter}                           from "thekla-core";
export {Navigate}                        from "thekla-core";
export {Wait}                            from "thekla-core";
export {Sleep}                           from "thekla-core";


// Oracle
export {See}     from "thekla-core";
export {Extract} from "thekla-core";

// Questions
export {Text}                                 from "thekla-core";
export {Value}                                from "thekla-core";
export {Attribute}                            from "thekla-core";
export {Count}                                from "thekla-core";
export {TheSites}                             from "thekla-core";
export {Status}                               from "thekla-core";
export {Response}                             from "thekla-core";

// Custom Errors
export {DoesNotHave, DidNotFind} from "thekla-core";

//Function Matcher
export {Expected} from "thekla-core";

// Decorators
export {stepDetails, step} from "thekla-core";
