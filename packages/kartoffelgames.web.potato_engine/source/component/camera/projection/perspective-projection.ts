import { Matrix } from '@kartoffelgames/core';
import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { GameComponentItem } from '../../../core/component/game-component-item.ts';
import { EditorPropertyNumberType } from '../../../editor_property/editor-property-register.ts';
import { EditorProperty } from '../../../editor_property/editor-property.ts';
import type { IProjection } from './i-projection.interface.ts';

/**
 * Perspective projection implementation of IProjection.
 */
@FileSystem.fileClass('5b59c0d1-3027-46d7-b47f-8e3d80ff0319', FileSystemReferenceType.Instanced)
export class PerspectiveProjection extends GameComponentItem implements IProjection {
    /**
     * System instance with default values that can be used by components to avoid creating multiple identical instances.
     * This instance is immutable and cannot be modified, as it is shared across all components that use it.
     * Modifying this instance will throw an exception to prevent unintended side effects on other components using the same instance.
     */
    public static readonly SYSTEM_INSTANCE: PerspectiveProjection = (() => {
        // Create system instance with default values.
        const lInstance: PerspectiveProjection = new PerspectiveProjection();
        lInstance.mAngleOfView = 45;
        lInstance.mAspectRatio = 1;
        lInstance.mNear = 0.1;
        lInstance.mFar = 100;
        lInstance.markAsSystem();

        return lInstance;
    })();

    private mAngleOfView: number;
    private mAspectRatio: number;
    private mFar: number;
    private mMatrix: Matrix | null;
    private mNear: number;

    /**
     * Angle of view.
     */
    @FileSystem.fileProperty()
    @EditorProperty.rangeControl(1, 200, EditorPropertyNumberType.Float)
    public get angleOfView(): number {
        return this.mAngleOfView;
    } set angleOfView(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        this.mAngleOfView = pValue;

        // Trigger update.
        this.triggerItemChange('PerspectiveProjection_angleOfView');
    }

    /**
     * Aspect ratio.
     */
    @FileSystem.fileProperty()
    public get aspectRatio(): number {
        return this.mAspectRatio;
    } set aspectRatio(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        this.mAspectRatio = pValue;

        // Trigger update.
        this.triggerItemChange('PerspectiveProjection_aspectRatio');
    }

    /**
     * Far plane.
     */
    @EditorProperty.rangeControl(0.01, 1000, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get far(): number {
        return this.mFar;
    } set far(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        this.mFar = pValue;

        // Trigger update.
        this.triggerItemChange('PerspectiveProjection_far');
    }

    /**
     * Near plane.
     */
    @EditorProperty.rangeControl(0.01, 1000, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get near(): number {
        return this.mNear;
    } set near(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        this.mNear = pValue;

        // Trigger update.
        this.triggerItemChange('PerspectiveProjection_near');
    }

    /**
     * Projection matrix.
     */
    public get projectionMatrix(): Matrix {
        if (this.mMatrix === null) {
            this.mMatrix = this.createMatrix();
        }

        return this.mMatrix;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Perspective projection');

        this.mAngleOfView = 45;
        this.mAspectRatio = 1;
        this.mNear = 0.1;
        this.mFar = 100;

        // Cache.
        this.mMatrix = null;
    }

    /**
     * Create projection matrix.
     */
    private createMatrix(): Matrix {
        const lMatrix: Matrix = Matrix.identity(4);

        // Reset identity.
        lMatrix.set(0, 0, 0);
        lMatrix.set(1, 1, 0);
        lMatrix.set(2, 2, 0);
        lMatrix.set(3, 3, 0);

        // Calculate planes with centered camera on z-plane.
        const lFar: number = this.mFar;
        const lNear: number = this.mNear;

        // Top bottom calculated by get height from vertical angle of view.
        // Half angle is from y=>0 to top plane, as the angle descripes the distance between top and bottom plane.
        // Tan(angleOfView / 2) = Top / Near => Near * Tan(angleOfView / 2) = Top
        const lTop: number = this.mNear * Math.tan((this.angleOfView * Math.PI / 180) / 2);
        const lBottom: number = -lTop;

        // Left right calculated from aspect ratio.
        const lRight: number = lTop * this.aspectRatio;
        const lLeft: number = -lRight;

        // We need to set VectorZ to VectorW to devide VectorX and VectorY by the VectorZ.
        // So planes are smaller the further ways they are.
        // And scale VectorX and VectorY with the near plane to start the projection not on Z=0 but on Z=Near.
        // ┌ N  0  0   0  ┐   ┌ 1 ┐   ┌ 1 ┐
        // | 0  N  0   0  |   | 2 |   | 2 |
        // | 0  0  M1  M2 | x | 3 | = | 3 |
        // └ 0  0  1   0  ┘   └ 1 ┘   └ 3 ┘

        // Problem is: The VectorZ get also divided by VectorX and VectorW.
        // To fix the problem set VectorZ to VectorZ² with only M1 and M2 available.
        // As as M1 is the Scaling(M1 * Z) and M2 is Translating(M2 + Z) we get:
        // M1*Z + M2 = Z² => Quadratic means two solutions. But we need one.
        // So we constrains the equation to be only valid between Near and Far. So we set Z=Near or Z=Far.
        // All other Z Values are calculated quadratic ranging from Near to Far.
        // So we get:
        // M1*Near + M2 = Near²  => M1 = Far + Near
        // M1*Far  + M2 = Far²   => M2 = -(Far * Near)
        // ┌ N  0      0         0     ┐
        // | 0  N      0         0     |
        // | 0  0    F + N   -(F * N)  |
        // └ 0  0      1         0     ┘

        // Multiplicate this perspectiv matrix with the orthigraphic to center the camera.
        // ┌  2/(R-L)    0         0    -(R+L)/(R-L) ┐   ┌ N  0      0         0     ┐
        // |     0     2/(T-B)     0    -(T+B)/(T-B) |   | 0  N      0         0     |
        // |     0        0     1/(F-N)   -N/(F-N)   | x | 0  0    F + N   -(F * N)  |
        // └     0        0        0          1      ┘   └ 0  0      1         0     ┘

        // And we get.
        // ┌  2N/(R-L)    0        -(R+L)/(R-L)           0      ┐
        // |     0     2N/(T-B)    -(T+B)/(T-B)           0      |
        // |     0        0          F/(F-N)       -(F*N)/(F-N) |
        // └     0        0             1                0      ┘


        // Set matrix data. Row 1:
        lMatrix.set(0, 0, (2 * lNear) / (lRight - lLeft));
        lMatrix.set(0, 2, -(lRight + lLeft) / (lRight - lLeft));

        // Set matrix data. Row 2:
        lMatrix.set(1, 1, (2 * lNear) / (lTop - lBottom));
        lMatrix.set(1, 2, -(lTop + lBottom) / (lTop - lBottom));

        // Set matrix data. Row 3:
        lMatrix.set(2, 2, lFar / (lFar - lNear));
        lMatrix.set(2, 3, -(lFar * lNear) / (lFar - lNear));

        // Set matrix data. Row 4:
        lMatrix.set(3, 2, 1);

        return lMatrix;
    }

    /**
     * Marks this component as dirty to trigger a matrix recalculation on the next access and signals the environment of the change.
     */
    private triggerItemChange(pUpdateName: string): void {
        this.mMatrix = null;

        // Signal environment of change for systems to react to.
        this.update(pUpdateName);
    }
}