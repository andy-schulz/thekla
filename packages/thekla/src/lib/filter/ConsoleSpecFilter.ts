
export class ConsoleSpecFilter {
    public filterString: string;
    public filterPattern: RegExp;

    constructor(private options: any) {
        this.filterString = options && options.filterString;
        this. filterPattern = new RegExp(this.filterString);

    }

    matches(specName: string): boolean {
        return this.filterPattern.test(specName);
    };
}