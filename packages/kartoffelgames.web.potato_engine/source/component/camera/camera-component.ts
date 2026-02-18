import { Exception, Matrix } from "@kartoffelgames/core";
import { Serializer } from "@kartoffelgames/core-serializer";
import { GameComponent } from "../../core/component/game-component.ts";
import { EditorProperty } from "../../editor_property/editor-property.ts";
import { IProjection } from "./projection/i-projection.interface.ts";
import { OrthographicProjection } from "./projection/orthographic -projection.ts";
import { PerspectiveProjection } from "./projection/perspective-projection.ts";

/**
 * Component that holds information about a camera, such as projection.
 */
@Serializer.serializeableClass('ae32b6c9-803b-4250-8510-f2f1dfdd74ec')
export class CameraComponent extends GameComponent {
    private mProjection: IProjection;

    /**
     * Camera projection matrix.
     */
    public get matrix(): Matrix {
        return this.projection.projectionMatrix;
    }

    /**
     * Camera projection type. Setting this will create a new projection of the given type.
     */
    @EditorProperty.enumControl(CameraComponentProjection)
    public get projectionType(): CameraComponentProjection {
        switch (true) {
            case this.projection instanceof PerspectiveProjection: return CameraComponentProjection.Perspective;
            case this.projection instanceof OrthographicProjection: return CameraComponentProjection.Orthographic;
        }

        throw new Exception('Unknown projection type.', this);
    } set projectionType(pValue: CameraComponentProjection) {
        switch (pValue) {
            case CameraComponentProjection.Perspective: {
                this.projection = new PerspectiveProjection();
                break;
            }
            case CameraComponentProjection.Orthographic: {
                this.projection = new OrthographicProjection();
                break;
            }
        }

        throw new Exception('Unknown projection type.', this);
    }

    /**
     * Camera projection.
     */
    @EditorProperty.objectControl()
    @Serializer.property()
    public get projection(): IProjection {
        return this.mProjection;
    } set projection(pValue: IProjection) {
        // Unlink old projection.
        this.mProjection.unlinkParent(this);

        // Link and set new projection.
        this.mProjection = pValue;
        pValue.linkParent(this);

        // Trigger update.
        this.update();
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Camera');

        // Link default system projection.
        this.mProjection = PerspectiveProjection.systemInstance;
        this.mProjection.linkParent(this);
    }
}

/**
 * Camera component projection enum.
 */
const CameraComponentProjection = {
    Perspective: 'Perspective',
    Orthographic: 'Orthographic'
} as const;
export type CameraComponentProjection = typeof CameraComponentProjection[keyof typeof CameraComponentProjection];