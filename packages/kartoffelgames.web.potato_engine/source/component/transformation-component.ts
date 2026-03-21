import { Matrix, Quaternion } from '@kartoffelgames/core';
import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { GameComponent } from '../core/component/game-component.ts';

// TODO: Use Math.Vector3 for pivot, scale and translation and add a PropertyMeta.object(Vector) or something.

/**
 * Component that manages transformation state including translation, rotation, scale and pivot.
 * Values are decoupled from the matrix representation. The transformation matrix is lazily
 * recalculated from the individual components only when accessed after a change.
 */
@FileSystem.fileClass('7b8a6001-7a15-45cc-a7e5-a47274359545', FileSystemReferenceType.Instanced)
export class TransformationComponent extends GameComponent {
    private mMatrix: Matrix | null;
    private mPivotX: number;
    private mPivotY: number;
    private mPivotZ: number;
    private mRotation: Quaternion;
    private mScaleDepth: number;
    private mScaleHeight: number;
    private mScaleWidth: number;
    private mTranslationX: number;
    private mTranslationY: number;
    private mTranslationZ: number;

    /**
     * Get the combined transformation matrix.
     * Recalculates the matrix if any transformation values have changed since the last access.
     */
    public get matrix(): Matrix {
        // Recalculate matrix when dirty.
        if (this.mMatrix === null) {
            this.mMatrix = this.recalculateMatrix();
        }

        return this.mMatrix;
    }

    /**
     * X pivot point.
     */
    @FileSystem.fileProperty()
    public get pivotX(): number {
        return this.mPivotX;
    } set pivotX(pValue: number) {
        this.mPivotX = pValue;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Y pivot point.
     */
    @FileSystem.fileProperty()
    public get pivotY(): number {
        return this.mPivotY;
    } set pivotY(pValue: number) {
        this.mPivotY = pValue;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Z pivot point.
     */
    @FileSystem.fileProperty()
    public get pivotZ(): number {
        return this.mPivotZ;
    } set pivotZ(pValue: number) {
        this.mPivotZ = pValue;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Rotation quaternion.
     */
    @FileSystem.fileProperty()
    public get rotation(): Quaternion {
        return this.mRotation;
    } set rotation(pValue: Quaternion) {
        this.mRotation = pValue;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Rotation on X angle.
     * Pitch.
     */
    public get rotationPitch(): number {
        return this.mRotation.asEuler().x;
    }

    /**
     * Rotation on Z angle.
     * Roll.
     */
    public get rotationRoll(): number {
        return this.mRotation.asEuler().z;
    }

    /**
     * Rotation on Y angle.
     * Yaw.
     */
    public get rotationYaw(): number {
        return this.mRotation.asEuler().y;
    }

    /**
     * Depth scale.
     */
    @FileSystem.fileProperty()
    public get scaleDepth(): number {
        return this.mScaleDepth;
    } set scaleDepth(pValue: number) {
        this.mScaleDepth = pValue;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Height scale.
     */
    @FileSystem.fileProperty()
    public get scaleHeight(): number {
        return this.mScaleHeight;
    } set scaleHeight(pValue: number) {
        this.mScaleHeight = pValue;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Width scale.
     */
    @FileSystem.fileProperty()
    public get scaleWidth(): number {
        return this.mScaleWidth;
    } set scaleWidth(pValue: number) {
        this.mScaleWidth = pValue;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * X translation.
     */
    @FileSystem.fileProperty()
    public get translationX(): number {
        return this.mTranslationX;
    } set translationX(pValue: number) {
        this.mTranslationX = pValue;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Y translation.
     */
    @FileSystem.fileProperty()
    public get translationY(): number {
        return this.mTranslationY;
    } set translationY(pValue: number) {
        this.mTranslationY = pValue;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Z translation.
     */
    @FileSystem.fileProperty()
    public get translationZ(): number {
        return this.mTranslationZ;
    } set translationZ(pValue: number) {
        this.mTranslationZ = pValue;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Constructor.
     *
     * @param pLabel - Component label.
     */
    public constructor() {
        super('Transformation');

        // Initialize scale to identity (1, 1, 1).
        this.mScaleWidth = 1;
        this.mScaleHeight = 1;
        this.mScaleDepth = 1;

        // Initialize translation to origin.
        this.mTranslationX = 0;
        this.mTranslationY = 0;
        this.mTranslationZ = 0;

        // Initialize rotation to identity quaternion.
        this.mRotation = new Quaternion();

        // Initialize pivot to origin.
        this.mPivotX = 0;
        this.mPivotY = 0;
        this.mPivotZ = 0;

        // Initialize matrix and mark as dirty for first calculation.
        this.mMatrix = null;
    }

    /**
     * Add angles to current euler rotation angles.
     *
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     * @param pRoll - Roll degree.
     */
    public addEulerRotation(pPitch: number, pYaw: number, pRoll: number): void {
        // Apply rotation to current rotation.
        this.mRotation = this.mRotation.addEulerRotation(pPitch, pYaw, pRoll);

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Add rotation to already rotated object.
     *
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     * @param pRoll - Roll degree.
     */
    public addRotation(pPitch: number, pYaw: number, pRoll: number): void {
        // Apply rotation to current rotation.
        this.mRotation = Quaternion.fromRotation(pPitch, pYaw, pRoll).mult(this.mRotation);

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Add scale.
     *
     * @param pWidth - Width multiplier.
     * @param pHeight - Height multiplier.
     * @param pDepth - Depth multiplier.
     */
    public addScale(pWidth: number, pHeight: number, pDepth: number): void {
        this.mScaleWidth += pWidth;
        this.mScaleHeight += pHeight;
        this.mScaleDepth += pDepth;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Add translation.
     *
     * @param pX - Movement on worlds X axis.
     * @param pY - Movement on worlds Y axis.
     * @param pZ - Movement on worlds Z axis.
     */
    public addTranslation(pX: number, pY: number, pZ: number): void {
        this.mTranslationX += pX;
        this.mTranslationY += pY;
        this.mTranslationZ += pZ;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Reset current rotation and set new rotation.
     *
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     * @param pRoll - Roll degree.
     */
    public setRotation(pPitch: number | null, pYaw: number | null, pRoll: number | null): void {
        const lPitch: number = pPitch ?? this.rotationPitch;
        const lYaw: number = pYaw ?? this.rotationYaw;
        const lRoll: number = pRoll ?? this.rotationRoll;

        // Create new rotation.
        this.mRotation = Quaternion.fromRotation(lPitch, lYaw, lRoll);

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Set scale.
     *
     * @param pWidth - Width multiplier.
     * @param pHeight - Height multiplier.
     * @param pDepth - Depth multiplier.
     */
    public setScale(pWidth: number | null, pHeight: number | null, pDepth: number | null): void {
        this.mScaleWidth = pWidth ?? this.mScaleWidth;
        this.mScaleHeight = pHeight ?? this.mScaleHeight;
        this.mScaleDepth = pDepth ?? this.mScaleDepth;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Set translation.
     *
     * @param pX - Movement on worlds X axis.
     * @param pY - Movement on worlds Y axis.
     * @param pZ - Movement on worlds Z axis.
     */
    public setTranslation(pX: number | null, pY: number | null, pZ: number | null): void {
        this.mTranslationX = pX ?? this.mTranslationX;
        this.mTranslationY = pY ?? this.mTranslationY;
        this.mTranslationZ = pZ ?? this.mTranslationZ;

        // Trigger matrix recalculation on next access.
        this.triggerComponentChange();
    }

    /**
     * Translate into rotation direction.
     *
     * @param pForward - Forward movement.
     * @param pRight - Right movement.
     * @param pUp - Up movement.
     */
    public translateInDirection(pForward: number, pRight: number, pUp: number): void {
        // Calculate rotation matrix components from quaternion.
        const lQx: number = this.mRotation.x;
        const lQy: number = this.mRotation.y;
        const lQz: number = this.mRotation.z;
        const lQw: number = this.mRotation.w;

        const lSquareX: number = 2 * lQx * lQx;
        const lSquareY: number = 2 * lQy * lQy;
        const lSquareZ: number = 2 * lQz * lQz;
        const lProductXy: number = 2 * lQx * lQy;
        const lProductZw: number = 2 * lQz * lQw;
        const lProductXz: number = 2 * lQx * lQz;
        const lProductYw: number = 2 * lQy * lQw;
        const lProductYz: number = 2 * lQy * lQz;
        const lProductXw: number = 2 * lQx * lQw;

        // Multiply rotation matrix by direction vector [pRight, pUp, pForward, 1].
        const lDirX: number = (1 - lSquareY - lSquareZ) * pRight + (lProductXy - lProductZw) * pUp + (lProductXz + lProductYw) * pForward;
        const lDirY: number = (lProductXy + lProductZw) * pRight + (1 - lSquareX - lSquareZ) * pUp + (lProductYz - lProductXw) * pForward;
        const lDirZ: number = (lProductXz - lProductYw) * pRight + (lProductYz + lProductXw) * pUp + (1 - lSquareX - lSquareY) * pForward;

        // Add direction.
        this.addTranslation(lDirX, lDirY, lDirZ);
    }

    /**
     * Recalculate the combined 4x4 transformation matrix from individual components.
     * Computes T * P^-1 * R * P * S directly without creating intermediate matrices.
     *
     * The resulting column-major matrix represents: Translation * InversePivot * Rotation * Pivot * Scale.
     */
    private recalculateMatrix(): Matrix {
        // Read quaternion components.
        const lQx: number = this.mRotation.x;
        const lQy: number = this.mRotation.y;
        const lQz: number = this.mRotation.z;
        const lQw: number = this.mRotation.w;

        // Calculate rotation matrix components from quaternion.
        const lSquareX: number = 2 * lQx * lQx;
        const lSquareY: number = 2 * lQy * lQy;
        const lSquareZ: number = 2 * lQz * lQz;
        const lProductXy: number = 2 * lQx * lQy;
        const lProductZw: number = 2 * lQz * lQw;
        const lProductXz: number = 2 * lQx * lQz;
        const lProductYw: number = 2 * lQy * lQw;
        const lProductYz: number = 2 * lQy * lQz;
        const lProductXw: number = 2 * lQx * lQw;

        const lR00: number = 1 - lSquareY - lSquareZ;
        const lR01: number = lProductXy - lProductZw;
        const lR02: number = lProductXz + lProductYw;
        const lR10: number = lProductXy + lProductZw;
        const lR11: number = 1 - lSquareX - lSquareZ;
        const lR12: number = lProductYz - lProductXw;
        const lR20: number = lProductXz - lProductYw;
        const lR21: number = lProductYz + lProductXw;
        const lR22: number = 1 - lSquareX - lSquareY;

        // Read component values.
        const lSx: number = this.mScaleWidth;
        const lSy: number = this.mScaleHeight;
        const lSz: number = this.mScaleDepth;
        const lTx: number = this.mTranslationX;
        const lTy: number = this.mTranslationY;
        const lTz: number = this.mTranslationZ;
        const lPx: number = this.mPivotX;
        const lPy: number = this.mPivotY;
        const lPz: number = this.mPivotZ;

        // Calculate pivot contribution to translation column.
        // This is: R * pivot - pivot + translation, producing the last column of T * P^-1 * R * P * S.
        const lM03: number = lR00 * lPx + lR01 * lPy + lR02 * lPz - lPx + lTx;
        const lM13: number = lR10 * lPx + lR11 * lPy + lR12 * lPz - lPy + lTy;
        const lM23: number = lR20 * lPx + lR21 * lPy + lR22 * lPz - lPz + lTz;

        // Build column-major 4x4 matrix data: T * P^-1 * R * P * S.
        // Column 0: rotation row scaled by scaleWidth.
        // Column 1: rotation row scaled by scaleHeight.
        // Column 2: rotation row scaled by scaleDepth.
        // Column 3: combined pivot-rotation-translation.
        const lData: Array<number> = [
            lR00 * lSx, lR10 * lSx, lR20 * lSx, 0,
            lR01 * lSy, lR11 * lSy, lR21 * lSy, 0,
            lR02 * lSz, lR12 * lSz, lR22 * lSz, 0,
            lM03, lM13, lM23, 1
        ];

        // Update cached matrix.
        return new Matrix(lData, 4, 4);
    }

    /**
     * Marks this component as dirty to trigger a matrix recalculation on the next access and signals the environment of the change.
     */
    private triggerComponentChange(): void {
        this.mMatrix = null;

        // Signal environment of change for systems to react to.
        this.update('TransformationComponent_change');
    }
}