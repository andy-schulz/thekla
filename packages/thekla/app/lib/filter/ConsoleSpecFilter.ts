
export class ConsoleSpecFilter {
    public filterString: any;
    public filterPattern: any;
    constructor(private options: any) {
        this.filterString = options && options.filterString;
        this. filterPattern = new RegExp(this.filterString);

    }

    matches(specName: string) {
        return this.filterPattern.test(specName);
    };
}