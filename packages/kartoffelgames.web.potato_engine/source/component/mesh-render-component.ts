import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import type { Material } from '../component_item/material.ts';
import { Mesh } from '../component_item/mesh.ts';
import { GameComponent, type GameComponentConstructor } from '../core/component/game-component.ts';
import { TransformationComponent } from './transformation-component.ts';

/**
 * Component that holds information to render a mesh in any render pipeline.
 */
@FileSystem.fileClass('3301c7a4-b477-4c4c-9fbd-143a19ad5683', FileSystemReferenceType.Instanced)
export class MeshRenderComponent extends GameComponent {
    private mMaterials: Array<Material>;
    private mMesh: Mesh;

    /**
     * Get the list of component types that this component depends on. Override this property in subclasses to specify dependencies for a component.
     * When this component is added to a game entity, all dependencies will be automatically added if not already present.
     */
    public override get dependencies(): Array<GameComponentConstructor<GameComponent>> {
        return [TransformationComponent];
    }

    /**
     * Gets or sets the material for rendering.
     * Returns the system default material if none has been set.
     */
    @FileSystem.fileProperty()
    public get materials(): ReadonlyArray<Material> {
        return this.mMaterials;
    } set materials(pValue: Array<Material>) {
        // Unlink from previous materials.
        for (const material of this.mMaterials) {
            material.unlinkParent(this);
        }

        // Save and link to new material.
        this.mMaterials = pValue;
        for (const material of this.mMaterials) {
            material.linkParent(this);
        }

        // Send update event to notify render pipelines that the material has changed.
        this.update();
    }

    /**
     * Gets or sets the mesh to render.
     */
    @FileSystem.fileProperty()
    public get mesh(): Mesh {
        return this.mMesh;
    } set mesh(pValue: Mesh) {
        // Unlink from previous mesh.
        if (this.mMesh) {
            this.mMesh.unlinkParent(this);
        }

        // Save and link to new mesh.
        this.mMesh = pValue;
        this.mMesh.linkParent(this);

        // Send update event to notify render pipelines that the mesh has changed.
        this.update();
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Mesh renderer');

        this.mMaterials = new Array<Material>();
        this.mMesh = Mesh.SYSTEM_INSTANCE;
    }
}
