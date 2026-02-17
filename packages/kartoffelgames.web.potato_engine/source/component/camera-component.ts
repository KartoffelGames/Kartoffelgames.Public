import { Serializer } from "@kartoffelgames/core-serializer";
import { IProjection } from "../component_item/projection/i-projection.interface.ts";
import { Matrix } from "../math/matrix.ts";
import { GameComponent } from "../core/component/game-component.ts";
import { PerspectiveProjection } from "../component_item/projection/perspective-projection.ts";

/**
 * Component that holds information about a camera, such as projection.
 */
@Serializer.serializeableClass('ae32b6c9-803b-4250-8510-f2f1dfdd74ec')
export class CameraComponent extends GameComponent {
    private mProjection: IProjection | null;

    /**
     * Camera projection matrix.
     */
    public get matrix(): Matrix {
        return this.projection.projectionMatrix;
    }

    /**
     * Camera projection.
     */
    @Serializer.property()
    public get projection(): IProjection {
        if (!this.mProjection) {
            this.mProjection = this.initProjection();
        }

        return this.mProjection;
    } set projection(pValue: IProjection) {
        this.mProjection = pValue;

        // Trigger update.
        this.update();
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Camera');

        this.mProjection = null;
    }

    /** 
     * Creates default projection.
     */
    private initProjection(): IProjection {
        const projection = new PerspectiveProjection();
        projection.angleOfView = 45;
        projection.aspectRatio = 1;
        projection.near = 0.1;
        projection.far = 100;

        return projection;
    }
}