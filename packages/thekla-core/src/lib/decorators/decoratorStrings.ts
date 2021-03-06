export const stringReplace = function (output: string): () => string {
    return function (): string {
        const replacer = (match: string): string => {
            const newMatch = match.replace(`<<`, ``).replace(`>>`, ``);
            // @ts-ignore : this is of type any in this case
            return this[newMatch] !== undefined && this[newMatch] !== null ? (this[newMatch].constructor.name === `Object` ? JSON.stringify(this[newMatch]) : this[newMatch].toString()) : `<<not found>>`
        };

        // /(/(?<=<<)([a-z]*[A-Z]*)*(?=>>)/g
        return output.replace(/<<([a-z]*[A-Z]*)*>>/g, replacer);
    }
};