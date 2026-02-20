import { Euler } from './euler.ts';
import { Matrix } from './matrix.ts';
import { Vector } from './vector.ts';

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
        const lQuaternion = new Quaternion();
        lQuaternion.w = lCosPitch * lCosYaw * lCosRoll + lSinPitch * lSinYaw * lSinRoll;
        lQuaternion.x = lSinPitch * lCosYaw * lCosRoll - lCosPitch * lSinYaw * lSinRoll;
        lQuaternion.y = lCosPitch * lSinYaw * lCosRoll + lSinPitch * lCosYaw * lSinRoll;
        lQuaternion.z = lCosPitch * lCosYaw * lSinRoll - lSinPitch * lSinYaw * lCosRoll;

        return lQuaternion;
    }

    private mData: [number, number, number, number];

    /**
     * Get quaternion data.
     */
    public get data(): ReadonlyArray<number> {
        return this.mData;
    }

    /**
     * Rotation forward vector.
     */
    public get vectorForward(): Vector {
        // Products.
        const lSquareX: number = 2 * Math.pow(this.mData[1], 2);
        const lSquareY: number = 2 * Math.pow(this.mData[2], 2);
        const lProductXz: number = 2 * this.mData[1] * this.mData[3];
        const lProductYw: number = 2 * this.mData[2] * this.mData[0];
        const lProductYz: number = 2 * this.mData[2] * this.mData[3];
        const lProductXw: number = 2 * this.mData[1] * this.mData[0];

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
        const lSquareY: number = 2 * Math.pow(this.mData[2], 2);
        const lSquareZ: number = 2 * Math.pow(this.mData[3], 2);
        const lProductXy: number = 2 * this.mData[1] * this.mData[2];
        const lProductZw: number = 2 * this.mData[3] * this.mData[0];
        const lProductXz: number = 2 * this.mData[1] * this.mData[3];
        const lProductYw: number = 2 * this.mData[2] * this.mData[0];

        const lX: number = 1 - lSquareY - lSquareZ;
        const lY: number = lProductXy + lProductZw;
        const lZ: number = lProductXz - lProductYw;

        return new Vector([lX, lY, lZ]);
    }

    /**
     * Rotation up vector.
     */
    public get vectorUp(): Vector {
        // Products.
        const lSquareX: number = 2 * Math.pow(this.mData[1], 2);
        const lSquareZ: number = 2 * Math.pow(this.mData[3], 2);
        const lProductXy: number = 2 * this.mData[1] * this.mData[2];
        const lProductZw: number = 2 * this.mData[3] * this.mData[0];

        const lProductYz: number = 2 * this.mData[2] * this.mData[3];
        const lProductXw: number = 2 * this.mData[1] * this.mData[0];

        const lX: number = lProductXy - lProductZw;
        const lY: number = 1 - lSquareX - lSquareZ;
        const lZ: number = lProductYz + lProductXw;

        return new Vector([lX, lY, lZ]);
    }

    /**
     * Get w value.
     */
    public get w(): number {
        return this.mData[0];
    } set w(pValue: number) {
        this.mData[0] = pValue;
    }

    /**
     * Get x value.
     */
    public get x(): number {
        return this.mData[1];
    } set x(pValue: number) {
        this.mData[1] = pValue;
    }

    /**
     * Get y value.
     */
    public get y(): number {
        return this.mData[2];
    } set y(pValue: number) {
        this.mData[2] = pValue;
    }

    /**
     * Get z value.
     */
    public get z(): number {
        return this.mData[3];
    } set z(pValue: number) {
        this.mData[3] = pValue;
    }

    /**
     * Constructor.
     * @param pW - W.
     * @param pX - X.
     * @param pY - Y.
     * @param pZ - Z.
     */
    public constructor() {
        this.mData = [1, 0, 0, 0];
    }

    /**
     * Add angles to current euler rotation.
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     * @param pRoll - Roll degree.
     * @param pApplyToSelf - Apply calculation to this object instead of creating a new one.
     */
    public addEulerRotation(pPitch: number, pYaw: number, pRoll: number, pApplyToSelf: boolean = false): Quaternion {
        // Apply current rotation after setting new rotation to apply rotation as absolute euler rotation and not as relative quaternion.
        return this.mult(Quaternion.fromRotation(pPitch, pYaw, pRoll), pApplyToSelf);
    }

    /**
     * Quaternion rotation as euler rotation
     */
    public asEuler(): Euler {
        const lEuler: Euler = new Euler();

        // Pitch (x-axis rotation)
        const lSinPitchCosYaw = 2 * (this.mData[0] * this.mData[1] + this.mData[2] * this.mData[3]);
        const lCosPitchCosYaw = 1 - 2 * (this.mData[1] * this.mData[1] + this.mData[2] * this.mData[2]);
        const lPitchRadian = Math.atan2(lSinPitchCosYaw, lCosPitchCosYaw);
        const lPitchDegree = (lPitchRadian * 180 / Math.PI) % 360;
        lEuler.x = (lPitchDegree < 0) ? lPitchDegree + 360 : lPitchDegree;

        // Yaw (y-axis rotation)
        const lSinYaw = Math.sqrt(1 + 2 * (this.mData[0] * this.mData[2] - this.mData[1] * this.mData[3]));
        const lCosYaw = Math.sqrt(1 - 2 * (this.mData[0] * this.mData[2] - this.mData[1] * this.mData[3]));
        const lYawRadian = 2 * Math.atan2(lSinYaw, lCosYaw) - Math.PI / 2;
        const lYawDegree = (lYawRadian * 180 / Math.PI) % 360;
        lEuler.y = (lYawDegree < 0) ? lYawDegree + 360 : lYawDegree;

        // Roll (z-axis rotation)
        const lSinRollCosYaw = 2 * (this.mData[0] * this.mData[3] + this.mData[1] * this.mData[2]);
        const lCosRollCosYaw = 1 - 2 * (this.mData[2] * this.mData[2] + this.mData[3] * this.mData[3]);
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
        const lSquareX: number = 2 * Math.pow(this.mData[1], 2);
        const lSquareY: number = 2 * Math.pow(this.mData[2], 2);
        const lSquareZ: number = 2 * Math.pow(this.mData[3], 2);

        // Products.
        const lProductXy: number = 2 * this.mData[1] * this.mData[2];
        const lProductZw: number = 2 * this.mData[3] * this.mData[0];
        const lProductXz: number = 2 * this.mData[1] * this.mData[3];
        const lProductYw: number = 2 * this.mData[2] * this.mData[0];
        const lProductYz: number = 2 * this.mData[2] * this.mData[3];
        const lProductXw: number = 2 * this.mData[1] * this.mData[0];

        // Fill matrix.
        const lMatrix: Matrix = Matrix.identity(4);
        lMatrix.set(0, 0, 1 - lSquareY - lSquareZ);
        lMatrix.set(0, 1, lProductXy - lProductZw);
        lMatrix.set(0, 2, lProductXz + lProductYw);

        lMatrix.set(1, 0, lProductXy + lProductZw);
        lMatrix.set(1, 1, 1 - lSquareX - lSquareZ);
        lMatrix.set(1, 2, lProductYz - lProductXw);

        lMatrix.set(2, 0, lProductXz - lProductYw);
        lMatrix.set(2, 1, lProductYz + lProductXw);
        lMatrix.set(2, 2, 1 - lSquareX - lSquareY);

        return lMatrix;
    }

    /**
     * Multiplicate with quaternion.
     * 
     * @param pQuaternion - Quaterion source.
     * @param pApplyToSelf - Apply calculation to this object instead of creating a new one.
     */
    public mult(pQuaternion: Quaternion, pApplyToSelf: boolean = false): Quaternion {
        // Set target quaternion depending on apply to self or not.
        const lTargetQuaternion: Quaternion = pApplyToSelf ? this : new Quaternion();

        const lW: number = this.mData[0] * pQuaternion.w - this.mData[1] * pQuaternion.x - this.mData[2] * pQuaternion.y - this.mData[3] * pQuaternion.z;
        const lX: number = this.mData[0] * pQuaternion.x + this.mData[1] * pQuaternion.w + this.mData[2] * pQuaternion.z - this.mData[3] * pQuaternion.y;
        const lY: number = this.mData[0] * pQuaternion.y - this.mData[1] * pQuaternion.z + this.mData[2] * pQuaternion.w + this.mData[3] * pQuaternion.x;
        const lZ: number = this.mData[0] * pQuaternion.z + this.mData[1] * pQuaternion.y - this.mData[2] * pQuaternion.x + this.mData[3] * pQuaternion.w;
        
        lTargetQuaternion.mData[0] = lW;
        lTargetQuaternion.mData[1] = lX;
        lTargetQuaternion.mData[2] = lY;
        lTargetQuaternion.mData[3] = lZ;

        return lTargetQuaternion;
    }

    /**
     * Normalize quaternion.
     * 
     * @param pApplyToSelf - Apply calculation to this object instead of creating a new one.
     */
    public normalize(pApplyToSelf: boolean = false): Quaternion {
        // Set target quaternion depending on apply to self or not.
        const lTargetQuaternion: Quaternion = pApplyToSelf ? this : new Quaternion();

        // Calculate length.
        const lLength = Math.hypot(this.mData[0], this.mData[1], this.mData[2], this.mData[3]);

        // Create new quaternion by dividing each dimension by length.
        lTargetQuaternion.mData[0] = this.mData[0] / lLength;
        lTargetQuaternion.mData[1] = this.mData[1] / lLength;
        lTargetQuaternion.mData[2] = this.mData[2] / lLength;
        lTargetQuaternion.mData[3] = this.mData[3] / lLength;

        return lTargetQuaternion;
    }
}