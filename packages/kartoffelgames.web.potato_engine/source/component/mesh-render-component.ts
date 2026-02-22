import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import type { Mesh } from '../component_item/mesh/mesh.ts';
import { GameComponent, GameComponentConstructor } from '../core/component/game-component.ts';
import { TransformationComponent } from "./transformation-component.ts";

// TODO: Once materials are implemented, add a material slot for each sub mesh.

/**
 * Component that holds information to render a mesh in any render pipeline.
 */
@FileSystem.fileClass('3301c7a4-b477-4c4c-9fbd-143a19ad5683', FileSystemReferenceType.Instanced)
export class MeshRenderComponent extends GameComponent {
    private mMesh: Mesh | null;

    /**
     * Get the list of component types that this component depends on. Override this property in subclasses to specify dependencies for a component.
     * When this component is added to a game entity, all dependencies will be automatically added if not already present.
     */
    public override get dependencies(): GameComponentConstructor<GameComponent>[] {
        return [TransformationComponent];
    }

    /**
     * Gets or sets the mesh to render.
     */
    @FileSystem.fileProperty()
    public get mesh(): Mesh {
        if (!this.mMesh) {
            throw new Error('Mesh is not set.');
        }

        return this.mMesh;
    } set mesh(value: Mesh) {
        // Unlink from previous mesh.
        if (this.mMesh) {
            this.mMesh.unlinkParent(this);
        }

        // Save and link to new mesh.
        this.mMesh = value;
        this.mMesh.linkParent(this);

        // Send update event to notify render pipelines that the mesh has changed.
        this.update();
    }

    public constructor() {
        super('Mesh renderer');

        this.mMesh = null;
    }
}