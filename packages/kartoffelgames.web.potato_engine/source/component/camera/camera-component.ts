import { Exception, type Matrix } from '@kartoffelgames/core';
import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { GameComponent, type GameComponentConstructor } from '../../core/component/game-component.ts';
import { EditorProperty } from '../../editor_property/editor-property.ts';
import { CameraComponentProjection } from './projection/camera-projection.enum.ts';
import type { IProjection } from './projection/i-projection.interface.ts';
import { OrthographicProjection } from './projection/orthographic-projection.ts';
import { PerspectiveProjection } from './projection/perspective-projection.ts';
import { TransformationComponent } from '../transformation-component.ts';

/**
 * Component that holds information about a camera, such as projection.
 */
@FileSystem.fileClass('ae32b6c9-803b-4250-8510-f2f1dfdd74ec', FileSystemReferenceType.Instanced)
export class CameraComponent extends GameComponent {
    private mProjection: IProjection;

    /**
     * Get the list of component types that this component depends on. Override this property in subclasses to specify dependencies for a component. When this component is added to a game entity, all dependencies will be automatically added if not already present.
     *
     * @returns - List of component constructor types this component depends on.
     */
    public override get dependencies(): Array<GameComponentConstructor<GameComponent>> {
        return [TransformationComponent];
    }

    /**
     * Camera projection matrix.
     */
    public get matrix(): Matrix {
        return this.projection.projectionMatrix;
    }

    /**
     * Camera projection.
     */
    @EditorProperty.objectControl()
    @FileSystem.fileProperty()
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
                return;
            }
            case CameraComponentProjection.Orthographic: {
                this.projection = new OrthographicProjection();
                return;
            }
            default: {
                throw new Exception('Unknown projection type.', this);
            }
        }
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Camera');

        // Link default system projection.
        this.mProjection = PerspectiveProjection.SYSTEM_INSTANCE;
        this.mProjection.linkParent(this);
    }
}

