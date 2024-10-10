import { Euler } from './euler';
import { Matrix } from './matrix';
import { Vector } from './vector';

export class Quaternion {
    /**
     * Create new quaternion from degree rotation.
     * Rotate order XYZ (Pitch, Yaw, Roll)
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     * @param pRoll - Roll degree.
     */
    public static fromRotation(pPitch: number, pYaw: number, pRoll: number): Quaternion {
        // Conversion to radian.
        const lPitchRadian: number = (pPitch % 360) * Math.PI / 180;
        const lYawRadian: number = (pYaw % 360) * Math.PI / 180;
        const lRollRadian: number = (pRoll % 360) * Math.PI / 180;

        // Pre calculate.
        const lCosPitch = Math.cos(lPitchRadian * 0.5);
        const lSinPitch = Math.sin(lPitchRadian * 0.5);
        const lCosYaw = Math.cos(lYawRadian * 0.5);
        const lSinYaw = Math.sin(lYawRadian * 0.5);
        const lCosRoll = Math.cos(lRollRadian * 0.5);
        const lSinRoll = Math.sin(lRollRadian * 0.5);

        // Create quaternion.
        const lQuaternion = Quaternion.identity();
        lQuaternion.w = lCosPitch * lCosYaw * lCosRoll + lSinPitch * lSinYaw * lSinRoll;
        lQuaternion.x = lSinPitch * lCosYaw * lCosRoll - lCosPitch * lSinYaw * lSinRoll;
        lQuaternion.y = lCosPitch * lSinYaw * lCosRoll + lSinPitch * lCosYaw * lSinRoll;
        lQuaternion.z = lCosPitch * lCosYaw * lSinRoll - lSinPitch * lSinYaw * lCosRoll;

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
     * Add angles to current euler rotation.
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     * @param pRoll - Roll degree.
     */
    public addEulerRotation(pPitch: number, pYaw: number, pRoll: number): Quaternion {
        // Apply current rotation after setting new rotation to apply rotation as absolute euler rotation and not as relative quaternion.
        return this.mult(Quaternion.fromRotation(pPitch, pYaw, pRoll));
    }

    /**
     * Quaternion rotation as euler rotation
     */
    public asEuler(): Euler {
        const lEuler: Euler = new Euler();

        // Pitch (x-axis rotation)
        const lSinPitchCosYaw = 2 * (this.mW * this.mX + this.mY * this.mZ);
        const lCosPitchCosYaw = 1 - 2 * (this.mX * this.mX + this.mY * this.mY);
        const lPitchRadian = Math.atan2(lSinPitchCosYaw, lCosPitchCosYaw);
        const lPitchDegree = (lPitchRadian * 180 / Math.PI) % 360;
        lEuler.x = (lPitchDegree < 0) ? lPitchDegree + 360 : lPitchDegree;

        // Yaw (y-axis rotation)
        const lSinYaw = Math.sqrt(1 + 2 * (this.mW * this.mY - this.mX * this.mZ));
        const lCosYaw = Math.sqrt(1 - 2 * (this.mW * this.mY - this.mX * this.mZ));
        const lYawRadian = 2 * Math.atan2(lSinYaw, lCosYaw) - Math.PI / 2;
        const lYawDegree = (lYawRadian * 180 / Math.PI) % 360;
        lEuler.y = (lYawDegree < 0) ? lYawDegree + 360 : lYawDegree;

        // Roll (z-axis rotation)
        const lSinRollCosYaw = 2 * (this.mW * this.mZ + this.mX * this.mY);
        const lCosRollCosYaw = 1 - 2 * (this.mY * this.mY + this.mZ * this.mZ);
        const lRollRadian = Math.atan2(lSinRollCosYaw, lCosRollCosYaw);
        const lRollDegree = (lRollRadian * 180 / Math.PI) % 360;
        lEuler.z = (lRollDegree < 0) ? lRollDegree + 360 : lRollDegree;

        return lEuler;
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