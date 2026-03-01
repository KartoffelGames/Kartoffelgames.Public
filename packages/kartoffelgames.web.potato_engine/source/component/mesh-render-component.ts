import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { Material } from '../component_item/material.ts';
import type { Mesh } from '../component_item/mesh/mesh.ts';
import { GameComponent, type GameComponentConstructor } from '../core/component/game-component.ts';
import { TransformationComponent } from './transformation-component.ts';

/**
 * Component that holds information to render a mesh in any render pipeline.
 */
@FileSystem.fileClass('3301c7a4-b477-4c4c-9fbd-143a19ad5683', FileSystemReferenceType.Instanced)
export class MeshRenderComponent extends GameComponent {
    private mMaterial: Material | null;
    private mMesh: Mesh | null;

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
    public get material(): Material {
        return this.mMaterial ?? Material.SYSTEM_INSTANCE;
    } set material(pValue: Material) {
        // Unlink from previous material.
        if (this.mMaterial) {
            this.mMaterial.unlinkParent(this);
        }

        // Save and link to new material.
        this.mMaterial = pValue;
        this.mMaterial.linkParent(this);

        // Send update event to notify render pipelines that the material has changed.
        this.update();
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

    public constructor() {
        super('Mesh renderer');

        this.mMaterial = null;
        this.mMesh = null;
    }
}
