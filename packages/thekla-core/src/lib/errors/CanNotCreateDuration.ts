export class CanNotCreateDuration extends Error {

    public static withValueSmallerThanZero(durationValue: number): CanNotCreateDuration {
        return new CanNotCreateDuration(`Can't create a duration of '${durationValue}' ms, as it is smaller than 0.`);
    }

    private constructor(message: string) {
        super(message);
        this.name = CanNotCreateDuration.name
    }
}