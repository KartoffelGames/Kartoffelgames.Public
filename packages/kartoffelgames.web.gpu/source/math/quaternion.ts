import { Matrix } from './matrix';
import { Vector } from './vector';

export class Quaternion {
    /**
     * Create new quaternion from euler rotation.
     * @param pRoll - Roll in degree.
     * @param pPitch - Pitch in degree.
     * @param pYaw - Yaw in degree.
     */
    public static fromEuler(pRoll: number, pPitch: number, pYaw: number): Quaternion {
        // Conversion to radian.
        const lRollRadian: number = pRoll * Math.PI / 180;
        const lPitchRadian: number = pPitch * Math.PI / 180;
        const lYawRadian: number = pYaw * Math.PI / 180;

        // Pre calculate.
        const lCosRoll = Math.cos(lRollRadian * 0.5);
        const lSinRoll = Math.sin(lRollRadian * 0.5);
        const lCosPitch = Math.cos(lPitchRadian * 0.5);
        const lSinPitch = Math.sin(lPitchRadian * 0.5);
        const lCosyaw = Math.cos(lYawRadian * 0.5);
        const lSinYaw = Math.sin(lYawRadian * 0.5);

        // Create quaternion.
        const lQuaternion = Quaternion.identity();
        lQuaternion.w = lCosRoll * lCosPitch * lCosyaw + lSinRoll * lSinPitch * lSinYaw;
        lQuaternion.x = lSinRoll * lCosPitch * lCosyaw - lCosRoll * lSinPitch * lSinYaw;
        lQuaternion.y = lCosRoll * lSinPitch * lCosyaw + lSinRoll * lCosPitch * lSinYaw;
        lQuaternion.z = lCosRoll * lCosPitch * lSinYaw - lSinRoll * lSinPitch * lCosyaw;

        return lQuaternion;
    }

    /**
     * Create identity quaternion.
     */
    public static identity(): Quaternion {
        return new Quaternion(1, 0, 0, 0);
    }

    public mW: number;
    public mX: number;
    public mY: number;
    public mZ: number;

    /**
     * Rotation forward vector.
     */
    public get vectorForward(): Vector {
        // Products.
        const lSquareX: number = 2 * Math.pow(this.mX, 2);
        const lSquareY: number = 2 * Math.pow(this.mY, 2);
        const lProductXz: number = 2 * this.mX * this.mZ;
        const lProductYw: number = 2 * this.mY * this.mW;
        const lProductYz: number = 2 * this.mY * this.mZ;
        const lProductXw: number = 2 * this.mX * this.mW;

        const lX: number = lProductXz + lProductYw;
        const lY: number = lProductYz - lProductXw;
        const lZ: number = 1 - lSquareX - lSquareY;

        return new Vector([lX, lY, lZ]);
    }

    /**
     * Rotation vector right.
     */
    public get vectorRight(): Vector {
        // Products.
        const lSquareY: number = 2 * Math.pow(this.mY, 2);
        const lSquareZ: number = 2 * Math.pow(this.mZ, 2);
        const lProductXy: number = 2 * this.mX * this.mY;
        const lProductZw: number = 2 * this.mZ * this.mW;
        const lProductYz: number = 2 * this.mY * this.mZ;
        const lProductXw: number = 2 * this.mX * this.mW;

        const lX: number = 1 - lSquareY - lSquareZ;
        const lY: number = lProductXy + lProductZw;
        const lZ: number = lProductYz + lProductXw;

        return new Vector([lX, lY, lZ]);
    }

    /**
     * Rotation up vector.
     */
    public get vectorUp(): Vector {
        // Products.
        const lSquareX: number = 2 * Math.pow(this.mX, 2);
        const lSquareZ: number = 2 * Math.pow(this.mZ, 2);
        const lProductXy: number = 2 * this.mX * this.mY;
        const lProductZw: number = 2 * this.mZ * this.mW;

        const lProductYz: number = 2 * this.mY * this.mZ;
        const lProductXw: number = 2 * this.mX * this.mW;

        const lX: number = lProductXy - lProductZw;
        const lY: number = 1 - lSquareX - lSquareZ;
        const lZ: number = lProductYz + lProductXw;

        return new Vector([lX, lY, lZ]);
    }

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

    /**
     * Convert quaternion to a 4x4 rotation matrix.
     */
    public asMatrix(): Matrix {
        /*
            1 - 2*qy² - 2*qz²	2*qx*qy - 2*qz*qw	2*qx*qz + 2*qy*qw
            2*qx*qy + 2*qz*qw	1 - 2*qx² - 2*qz²	2*qy*qz - 2*qx*qw
            2*qx*qz - 2*qy*qw	2*qy*qz + 2*qx*qw	1 - 2*qx² - 2*qy²
        */
        // Sqares
        const lSquareX: number = 2 * Math.pow(this.mX, 2);
        const lSquareY: number = 2 * Math.pow(this.mY, 2);
        const lSquareZ: number = 2 * Math.pow(this.mZ, 2);

        // Products.
        const lProductXy: number = 2 * this.mX * this.mY;
        const lProductZw: number = 2 * this.mZ * this.mW;
        const lProductXz: number = 2 * this.mX * this.mZ;
        const lProductYw: number = 2 * this.mY * this.mW;
        const lProductYz: number = 2 * this.mY * this.mZ;
        const lProductXw: number = 2 * this.mX * this.mW;

        // Fill matrix
        const lMatrix: Matrix = Matrix.identity(4);
        lMatrix.data[0][0] = 1 - lSquareY - lSquareZ;
        lMatrix.data[0][1] = lProductXy - lProductZw;
        lMatrix.data[0][2] = lProductXz + lProductYw;

        lMatrix.data[1][0] = lProductXy + lProductZw;
        lMatrix.data[1][1] = 1 - lSquareX - lSquareZ;
        lMatrix.data[1][2] = lProductYz - lProductXw;

        lMatrix.data[2][0] = lProductXz - lProductYw;
        lMatrix.data[2][1] = lProductYz + lProductXw;
        lMatrix.data[2][2] = 1 - lSquareX - lSquareY;

        return lMatrix;
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
        const lLength = Math.hypot(Math.pow(this.mW, 2), Math.pow(this.mX, 2), Math.pow(this.mY, 2), Math.pow(this.mZ, 2));

        // Create new quaternion by dividing each dimension by length.
        return new Quaternion(this.mW / lLength, this.mX / lLength, this.mY / lLength, this.mZ / lLength);
    }
}