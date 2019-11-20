import {Client}     from "webdriver"
import {curry}      from "lodash"
import {DidNotFind} from "..";

export function executeFnOnClient<T>(getClient: Function, func: string, params: any[] = []): Promise<T> {
    return new Promise((resolve, reject): void => {
        getClient()
            .then((driver: any): void => {
                driver[func](...params)
                    .then((param: any) => {
                        resolve(param)
                    }, (e: Error) => {
                        reject(e)
                    })
            })
            .catch(reject)
    })
}

export const switchToMasterFrame = async (client: Client): Promise<Client> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore is* Methods are not part of the typings
    if (client.isMobile || client.isAndroid || client.isIOS) {
        const context = await client.getContext();

        if (context == `NATIVE_APP`)
            return Promise.resolve(client);
    }

    return (client.switchToFrame(null) as unknown as Promise<void>)
        .then((): Client => client)
};

export const switchToWindowMatchingTheTitle =
    curry((title: string, client: Client, handles: string[]): Promise<boolean> => {
        const titles: string[] = [];
        return handles.reduce((handleFound: Promise<boolean>, handleToCheck: string): Promise<boolean> => {

            return handleFound.then((found: boolean) => {
                if (found)
                    return found;

                return (client.switchToWindow(handleToCheck) as unknown as Promise<void>)
                    .then(() => {
                        return (client.getTitle() as unknown as Promise<string>)
                            .then((currentTitle: string) => {
                                titles.push(currentTitle);
                                return currentTitle.includes(title);
                            })
                    })
            });

        }, Promise.resolve(false))
                      .then((found: boolean) => {
                          if (!found)
                              return Promise.reject(DidNotFind.theWindowWithTitle(title, titles));

                          return Promise.resolve(found)
                      })
    });