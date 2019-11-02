export const funcToString = (func: Function | string): string => {
    return `return (${func}).apply(null, arguments);`
};

export const tkDebug = (message: string): (pr: Promise<any>) => Promise<any> => {
    return (pr: Promise<any>): any => {
        return pr.then((value: any) => {
            console.debug(`DEBUG: ${message}: value: ${value}`);
            debugger;
            return value;
        })
    }
};