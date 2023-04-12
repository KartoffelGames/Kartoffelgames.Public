import { Matrix } from './matrix';

export class Quaternion {
    /**
     * Create new quaternion from euler rotation.
     * Uses radian.
     * @param pRoll - Roll. 
     * @param pPitch - Pitch.
     * @param pYaw - Yaw.
     */
    public static fromEuler(pRoll: number, pPitch: number, pYaw: number): Quaternion {
        // Cached calculations.
        const lCosRoll = Math.cos(pRoll * 0.5);
        const lSinRoll = Math.sin(pRoll * 0.5);
        const lCosPitch = Math.cos(pPitch * 0.5);
        const lSinPitch = Math.sin(pPitch * 0.5);
        const lCosYaw = Math.cos(pYaw * 0.5);
        const lSinYaw = Math.sin(pYaw * 0.5);

        const lQuaternion: Quaternion = new Quaternion(0, 0, 0, 0);
        lQuaternion.w = lCosRoll * lCosPitch * lCosYaw + lSinRoll * lSinPitch * lSinYaw;
        lQuaternion.x = lSinRoll * lCosPitch * lCosYaw - lCosRoll * lSinPitch * lSinYaw;
        lQuaternion.y = lCosRoll * lSinPitch * lCosYaw + lSinRoll * lCosPitch * lSinYaw;
        lQuaternion.z = lCosRoll * lCosPitch * lSinYaw - lSinRoll * lSinPitch * lCosYaw;

        return lQuaternion;
    }

    public mW: number;
    public mX: number;
    public mY: number;
    public mZ: number;

    /**
     * Get w value.
     */
    public get w(): number {
        return this.mW;
    } set w(pValue: number) {
        this.mW = pValue;
    }

    /**
     * Get x value.
     */
    public get x(): number {
        return this.mX;
    } set x(pValue: number) {
        this.mX = pValue;
    }

    /**
     * Get y value.
     */
    public get y(): number {
        return this.mY;
    } set y(pValue: number) {
        this.mY = pValue;
    }

    /**
     * Get z value.
     */
    public get z(): number {
        return this.mZ;
    } set z(pValue: number) {
        this.mZ = pValue;
    }

    /**
     * Constructor.
     * @param pW - W.
     * @param pX - X.
     * @param pY - Y.
     * @param pZ - Z.
     */
    public constructor(pW: number, pX: number, pY: number, pZ: number) {
        this.mX = pX;
        this.mY = pY;
        this.mZ = pZ;
        this.mW = pW;
    }

    public asMatrix(): Matrix {
        const lIdentRow: number = 2 * (Math.pow(this.mW, 2) + Math.pow(this.mX, 2)) - 1;
        const lTwoXy = 2 * this.mX * this.mY;
        const lTwoWz = 2 * this.mW * this.mZ;
        const lTwoWy = 2 * this.mW * this.mY;
        const lTwoYz = 2 * this.mY * this.mZ;
        const lTwoXz = 2 * this.mX * this.mZ;
        const lTwoWx = 2 * this.mW * this.mX;

        return new Matrix([
            [lIdentRow, lTwoXy - lTwoWz, lTwoWy + lTwoXz, 0],
            [lTwoXy + lTwoWz, lIdentRow, lTwoYz - lTwoWx, 0],
            [lTwoXz - lTwoWy, lTwoWx + lTwoYz, lIdentRow, 0],
            [0, 0, 0, 1],
        ]);
    }

    /**
     * Multiplicate with quaternion.
     * @param pQuaternion - Quaterion source.
     */
    public mult(pQuaternion: Quaternion): Quaternion {
        const lW: number = this.mW * pQuaternion.w - this.mX * pQuaternion.x - this.mY * pQuaternion.y - this.mZ * pQuaternion.z;
        const lX: number = this.mW * pQuaternion.x + this.mX * pQuaternion.w + this.mY * pQuaternion.z - this.mZ * pQuaternion.y;
        const lY: number = this.mW * pQuaternion.y - this.mX * pQuaternion.z + this.mY * pQuaternion.w + this.mZ * pQuaternion.x;
        const lZ: number = this.mW * pQuaternion.z + this.mX * pQuaternion.y - this.mY * pQuaternion.x + this.mZ * pQuaternion.w;

        return new Quaternion(lW, lX, lY, lZ);
    }

    /**
     * Normalize quaternion.
     */
    public normalize(): Quaternion {
        // Calculate length.
        const lLength = Math.sqrt(Math.pow(this.mW, 2) + Math.pow(this.mX, 2) + Math.pow(this.mY, 2) + Math.pow(this.mZ, 2));

        // Create new quaternion by dividing each dimension by length.
        return new Quaternion(this.mW / lLength, this.mX / lLength, this.mY / lLength, this.mZ / lLength);
    }
}