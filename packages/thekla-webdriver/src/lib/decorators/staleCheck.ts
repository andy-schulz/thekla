export const staleCheck = <RT>() => {
    return function checkError(
        target: Record<string, any>,
        propertyName: string,
        propertyDescriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<RT>>): PropertyDescriptor {

        const method = propertyDescriptor.value;

        propertyDescriptor.value = function (...args: any[]) {

            return new Promise((resolve, reject) => {
                if (!method)
                    return reject(`stale check decorator error: passed property descriptor value is undefined`);

                let counter = 0;
                const applyMethod = (): void => {
                    counter = counter + 1;
                    method.apply(this, args)
                                 .then(resolve)
                                 .catch((e: Error) => {
                                     // for now i will just retry for 3 times
                                     // this should be externalized
                                     if(counter > 3)
                                         return reject(e);

                                     const eString: string = e.toString().toLowerCase();

                                     if (eString.includes(`stale`) && eString.includes(`reference`)) {
                                         return setTimeout(applyMethod,500)
                                     }

                                     // if its not a stale element error then just reject
                                     reject(e);
                                 });
                };
                applyMethod()
            });
        };
        return propertyDescriptor;
    }
};