import { Matrix } from "@kartoffelgames/core";
import { Serializer } from "@kartoffelgames/core-serializer";
import { GameComponentItem } from "../../../core/component/game-component-item.ts";
import { EditorPropertyNumberType } from "../../../editor_property/editor-property-register.ts";
import { EditorProperty } from "../../../editor_property/editor-property.ts";
import type { IProjection } from './i-projection.interface.ts';

/**
 * Orthographic projection implementation of IProjection.
 */
@Serializer.serializeableClass('a5f23afd-0cc9-40ce-a9be-34510f7b4066')
export class OrthographicProjection extends GameComponentItem implements IProjection {
    /**
     * System instance with default values that can be used by components to avoid creating multiple identical instances.
     * This instance is immutable and cannot be modified, as it is shared across all components that use it.
     * Modifying this instance will throw an exception to prevent unintended side effects on other components using the same instance.
     */
    public static readonly systemInstance: OrthographicProjection = (() => {
        // Create system instance with default values.
        const lInstance: OrthographicProjection = new OrthographicProjection();
        lInstance.mAspectRatio = 1;
        lInstance.mFar = 100;
        lInstance.mNear = 0.1;
        lInstance.mWidth = 1;
        lInstance.markAsSystem();

        return lInstance;
    })();

    private mAspectRatio: number;
    private mMatrix: Matrix | null;
    private mFar: number;
    private mNear: number;
    private mWidth: number;

    /**
     * Aspect ratio plane.
     */
    @Serializer.property()
    public get aspectRatio(): number {
        return this.mAspectRatio;
    } set aspectRatio(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        this.mAspectRatio = pValue;

        // Trigger update.
        this.triggerItemChange();
    }

    /**
     * Far plane.
     */
    @EditorProperty.range(0.01, 1000, EditorPropertyNumberType.Float)
    @Serializer.property()
    public get far(): number {
        return this.mFar;
    } set far(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        this.mFar = pValue;

        // Trigger update.
        this.triggerItemChange();
    }

    /**
     * Near plane.
     */
    @EditorProperty.range(0.01, 1000, EditorPropertyNumberType.Float)
    @Serializer.property()
    public get near(): number {
        return this.mNear;
    } set near(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        this.mNear = pValue;

        // Trigger update.
        this.triggerItemChange();
    }

    /**
     * Get projection matrix.
     */
    @Serializer.property()
    public get projectionMatrix(): Matrix {
        // Check cache or create new matrix.
        if (this.mMatrix === null) {
            this.mMatrix = this.createMatrix();
        }

        return this.mMatrix;
    }

    /**
     * Width of horizontal plane.
     */
    @Serializer.property()
    public get width(): number {
        return this.mWidth;
    } set width(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        this.mWidth = pValue;

        // Trigger update.
        this.triggerItemChange();
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Orthographic projection');

        this.mAspectRatio = 1;
        this.mFar = 100;
        this.mNear = 0.1;
        this.mWidth = 1;

        // Cache.
        this.mMatrix = null;
    }

    /**
     * Create projection matrix.
     */
    private createMatrix(): Matrix {
        // Calculate planes with centered camera on z-plane.
        const lFar: number = this.mFar;
        const lNear: number = this.mNear;

        // Left right half of width.
        const lRight: number = this.mWidth / 2;
        const lLeft: number = -lRight;

        // Top bottom calculated by width/height-aspect ratio.
        const lTop: number = lRight / this.mAspectRatio;
        const lBottom: number = -lTop;

        // Scale volume to match NDC X[-1. 1] , y[-1. 1], Z[0. 1]. Dividend is plane size.
        // SX => 2 / (Right - Left)
        // SY => 2 / (Top - Bottom)
        // SZ => 1 / (Far - Near)
        const lScaleX: number = 2 / (lRight - lLeft);
        const lScaleY: number = 2 / (lTop - lBottom);
        const lScaleZ: number = 1 / (lFar - lNear);

        // Center planes to webgl clip NDC with translation with near plane on Z=>0.
        // TX => -(Left + Right) / 2
        // TY => -(Top + Bottom) / 2
        // TZ => -Near

        // Multiplicate the transform and scale matrix.
        // ┌ SX  0   0  0 ┐   ┌ 1  0  0  TX ┐   ┌ SX 0  0  (SX * TX) ┐
        // | 0   SY  0  0 |   | 0  1  0  TY |   | 0  SY 0  (SY * TY) |
        // | 0   0   SZ 0 | x | 0  0  1  TZ | = | 0  0  SZ (SZ * TZ) |
        // └ 0   0   0  1 ┘   └ 0  0  0  1  ┘   └ 0  0  0      1     ┘

        // Shorten multiplications.
        // (SX * TX) => (2 / (Right - Left)) * (-(Left + Right) / 2) => -(Left + Right) / (Right - Left)
        // (SY * TY) => (2 / (Top - Bottom)) * (-(Top + Bottom) / 2) => -(Top + Bottom) / (Top - Bottom)
        // (SZ * TZ) => (1 / (Far - Near))   * -Near                 => -Near / (Far - Near)
        const lScaleTransformX: number = -(lLeft + lRight) / (lRight - lLeft);
        const lScaleTransformY: number = -(lTop + lBottom) / (lTop - lBottom);
        const lScaleTransformZ: number = -lNear / (lFar - lNear);

        // ┌ SX 0  0  -(Left + Right) / (Right - Left) ┐
        // | 0  SY 0  -(Top + Bottom) / (Top - Bottom) |
        // | 0  0  SZ           -Near / (Far - Near)   |
        // └ 0  0  0                  1                ┘

        // Build projection matrix.
        const lMatrix: Matrix = Matrix.identity(4);

        // Fill Scale.
        lMatrix.set(0, 0, lScaleX);
        lMatrix.set(1, 1, lScaleY);
        lMatrix.set(2, 2, lScaleZ);

        // Fill transform.
        lMatrix.set(3, 0, lScaleTransformX);
        lMatrix.set(3, 1, lScaleTransformY);
        lMatrix.set(3, 2, lScaleTransformZ);

        return lMatrix;
    }

    /**
     * Marks this component as dirty to trigger a matrix recalculation on the next access and signals the environment of the change.
     */
    private triggerItemChange(): void {
        this.mMatrix = null;

        // Signal environment of change for systems to react to.
        this.update();
    }
} 