export class Euler {
    private mX: number;
    private mY: number;
    private mZ: number;

    /**
     * X axis degree.
     */
    public get x(): number {
        return this.mX;
    } set x(pValue: number) {
        this.mX = pValue;
    }

    /**
     * Y axis degree.
     */
    public get y(): number {
        return this.mY;
    } set y(pValue: number) {
        this.mY = pValue;
    }

    /**
     * Z axis degree.
     */
    public get z(): number {
        return this.mZ;
    } set z(pValue: number) {
        this.mZ = pValue;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mX = 0;
        this.mY = 0;
        this.mZ = 0;
    }
}