import {CucumberOptions} from "@thekla/config";
import {getLogger}       from "@log4js-node/log4js-api";
import JUnitFormatter    from "@thekla/cucumber-junit-formatter";
import {curry, flow}     from "lodash/fp";

const logger = getLogger(`CucumberUtils`);

const processOptions = curry((confOptions: undefined | string[], optsString: string, optionsList: string[]): string[] => {

    const optList = [...optionsList];

    const processOptions = (options: string[]): void => {
        for (const opt of options) {
            optList.push(optsString);
            optList.push(opt);
        }
    };

    if (confOptions) processOptions(confOptions);

    return optList;
});

const processWorldParameters = curry((worldParams: any, optionList: string[]): string[] => {
    if (!worldParams) return optionList;

    const optList = [...optionList];

    if (!(typeof worldParams === `object` && {}.constructor === worldParams.constructor)) {
        const message = `The World Parameters in the config file cant be parsed: ${worldParams}`;
        throw new Error(message);
    }

    optList.push(`--world-parameters`);
    optList.push(JSON.stringify(worldParams));

    return optList;
});

const setJUnitFormatterOptions = (formatOptions?: string[]): string[] | undefined => {
    if (!formatOptions)
        return formatOptions;

    return formatOptions.map((option: string) => {
        if (option.match(/^junit:/)) {
            return option.replace(/^junit:/, `${JUnitFormatter.formatterLocation()}:`);
        }

        return option
    })
};

export const processFrameworkOptions = curry((frameworkOptions: CucumberOptions): string[] => {
    logger.debug(`processing '--require' option with CONF: ${frameworkOptions.require}`);
    logger.debug(`processing '--format' option with CONF: ${frameworkOptions.format}`);
    logger.debug(`processing '--tags' option with CONF: ${frameworkOptions.tags}`);

    const parsedFormatOptions = setJUnitFormatterOptions(frameworkOptions.format);

    const optionsList: string[] = flow(
        processOptions(frameworkOptions.require)(`--require`),
        processOptions(parsedFormatOptions)(`--format`),
        processOptions(frameworkOptions.tags)(`--tags`),
        processWorldParameters(frameworkOptions.worldParameters)
    )([]);

    return optionsList
});