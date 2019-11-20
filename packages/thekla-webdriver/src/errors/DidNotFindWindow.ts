export class DidNotFindWindow extends Error {

    public  constructor(private _title: string, private _foundWindowTitles: string[]) {
        super(`
    Did not find the Window with title: ${_title}.
    But found windows having the following titles: ${_foundWindowTitles}
        `);
        this.name = `${DidNotFindWindow.name}`;
        Error.captureStackTrace(this, DidNotFindWindow)
    }

    get title() {
        return this._title;
    }

    get foundWindowTitles() {
        return this._foundWindowTitles;
    }
}