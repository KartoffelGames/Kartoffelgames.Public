import { CameraComponent } from '../../source/component/camera/camera-component.ts';
import { CameraComponentProjection } from '../../source/component/camera/projection/camera-projection.enum.ts';
import type { OrthographicProjection } from '../../source/component/camera/projection/orthographic-projection.ts';
import type { PerspectiveProjection } from '../../source/component/camera/projection/perspective-projection.ts';
import { LightComponent, LightComponentLightType } from '../../source/component/light/light-component.ts';
import { MeshRenderComponent } from '../../source/component/mesh-render-component.ts';
import { TransformationComponent } from '../../source/component/transformation-component.ts';
import type { Mesh } from '../../source/component_item/mesh/mesh.ts';
import { GameScene } from '../../source/core/game-scene.ts';
import { GameEntity } from '../../source/core/hierarchy/game-entity.ts';

/**
 * Central place for scene content creation.
 * Holds references to all scene objects so they can be modified later in development.
 */
export class SceneSetup {
    private readonly mScene: GameScene;
    private readonly mCameras: Array<GameEntity>;
    private readonly mLights: Array<GameEntity>;
    private readonly mHierarchyEntities: Array<GameEntity>;
    private readonly mBlockEntities: Array<GameEntity>;

    /**
     * The scene created by this setup.
     */
    public get scene(): GameScene {
        return this.mScene;
    }

    /**
     * All camera entities in the scene.
     */
    public get cameras(): ReadonlyArray<GameEntity> {
        return this.mCameras;
    }

    /**
     * All light entities in the scene.
     */
    public get lights(): ReadonlyArray<GameEntity> {
        return this.mLights;
    }

    /**
     * All hierarchy parent entities (used for nested cube chain).
     */
    public get hierarchyEntities(): ReadonlyArray<GameEntity> {
        return this.mHierarchyEntities;
    }

    /**
     * All block/cube entities in the scene.
     */
    public get blockEntities(): ReadonlyArray<GameEntity> {
        return this.mBlockEntities;
    }

    /**
     * Constructor. Builds the full scene with cameras, lights, and objects.
     *
     * @param pBlockMesh - The mesh to use for block entities.
     */
    public constructor(pBlockMesh: Mesh) {
        this.mScene = new GameScene();
        this.mScene.label = 'Test Scene';
        this.mCameras = new Array<GameEntity>();
        this.mLights = new Array<GameEntity>();
        this.mHierarchyEntities = new Array<GameEntity>();
        this.mBlockEntities = new Array<GameEntity>();

        this.createCameras();
        this.createLights();
        this.createCubeChain(pBlockMesh, 19);
    }

    /**
     * Called every input tick to animate scene objects.
     */
    public animateObjects(): void {
        for (const lEntity of this.mHierarchyEntities) {
            const lTransformation: TransformationComponent = lEntity.getComponent(TransformationComponent);
            lTransformation.addEulerRotation(0, 0, 0.3);
        }

        for (const lEntity of this.mBlockEntities) {
            const lTransformation: TransformationComponent = lEntity.getComponent(TransformationComponent);
            lTransformation.addEulerRotation(0, 0.3, 0);
        }
    }

    /**
     * Create camera entities and add them to the scene.
     */
    private createCameras(): void {
        // Perspective camera.
        const lCameraEntity: GameEntity = new GameEntity();
        lCameraEntity.label = 'Camera Entity';
        const lCameraTransformation: TransformationComponent = lCameraEntity.addComponent(TransformationComponent);
        lCameraTransformation.translationZ = -5;
        const lCameraComponent: CameraComponent = lCameraEntity.addComponent(CameraComponent);
        lCameraComponent.projectionType = CameraComponentProjection.Perspective;

        const lPerspectiveProjection: PerspectiveProjection = lCameraComponent.projection as PerspectiveProjection;
        lPerspectiveProjection.angleOfView = 72;
        lPerspectiveProjection.near = 0.1;
        lPerspectiveProjection.far = Number.MAX_SAFE_INTEGER;

        this.mScene.addObject(lCameraEntity);
        this.mCameras.push(lCameraEntity);

        // Orthographic camera.
        const lCameraEntity2: GameEntity = new GameEntity();
        lCameraEntity2.label = 'Camera Entity 2';
        const lCameraTransformation2: TransformationComponent = lCameraEntity2.addComponent(TransformationComponent);
        lCameraTransformation2.translationZ = -5;
        const lCameraComponent2: CameraComponent = lCameraEntity2.addComponent(CameraComponent);
        lCameraComponent2.projectionType = CameraComponentProjection.Orthographic;

        const lOrthographicProjection: OrthographicProjection = lCameraComponent2.projection as OrthographicProjection;
        lOrthographicProjection.near = 0.1;
        lOrthographicProjection.far = Number.MAX_SAFE_INTEGER;
        lOrthographicProjection.width = 10;

        this.mScene.addObject(lCameraEntity2);
        this.mCameras.push(lCameraEntity2);
    }

    /**
     * Create light entities and add them to the scene.
     */
    private createLights(): void {
        // White point light above the scene.
        const lWhiteLightEntity: GameEntity = new GameEntity();
        lWhiteLightEntity.label = 'White Light';
        const lWhiteLightTransform: TransformationComponent = lWhiteLightEntity.addComponent(TransformationComponent);
        lWhiteLightTransform.translationX = 5;
        lWhiteLightTransform.translationY = 10;
        lWhiteLightTransform.translationZ = -5;
        const lWhiteLight: LightComponent = lWhiteLightEntity.addComponent(LightComponent);
        lWhiteLight.lightType = LightComponentLightType.Point;
        lWhiteLight.light.color.r = 1;
        lWhiteLight.light.color.g = 1;
        lWhiteLight.light.color.b = 1;
        lWhiteLight.light.intensity = 1;
        this.mScene.addObject(lWhiteLightEntity);
        this.mLights.push(lWhiteLightEntity);

        // Red point light to the left.
        const lRedLightEntity: GameEntity = new GameEntity();
        lRedLightEntity.label = 'Red Light';
        const lRedLightTransform: TransformationComponent = lRedLightEntity.addComponent(TransformationComponent);
        lRedLightTransform.translationX = -5;
        lRedLightTransform.translationY = 3;
        lRedLightTransform.translationZ = 0;
        const lRedLight: LightComponent = lRedLightEntity.addComponent(LightComponent);
        lRedLight.lightType = LightComponentLightType.Point;
        lRedLight.light.color.r = 1;
        lRedLight.light.color.g = 0.2;
        lRedLight.light.color.b = 0.2;
        lRedLight.light.intensity = 0.8;
        this.mScene.addObject(lRedLightEntity);
        this.mLights.push(lRedLightEntity);

        // Blue point light to the right.
        const lBlueLightEntity: GameEntity = new GameEntity();
        lBlueLightEntity.label = 'Blue Light';
        const lBlueLightTransform: TransformationComponent = lBlueLightEntity.addComponent(TransformationComponent);
        lBlueLightTransform.translationX = 10;
        lBlueLightTransform.translationY = 3;
        lBlueLightTransform.translationZ = 5;
        const lBlueLight: LightComponent = lBlueLightEntity.addComponent(LightComponent);
        lBlueLight.lightType = LightComponentLightType.Point;
        lBlueLight.light.color.r = 0.2;
        lBlueLight.light.color.g = 0.2;
        lBlueLight.light.color.b = 1;
        lBlueLight.light.intensity = 0.8;
        this.mScene.addObject(lBlueLightEntity);
        this.mLights.push(lBlueLightEntity);
    }

    /**
     * Create a chain of nested cube entities.
     *
     * @param pMesh - The mesh to use for blocks.
     * @param pCount - Number of cubes in the chain.
     */
    private createCubeChain(pMesh: Mesh, pCount: number): void {
        for (let lIndex = 0; lIndex < pCount; lIndex++) {
            // Read last parent.
            const lParent: GameEntity | null = this.mHierarchyEntities.at(-1) ?? null;

            // Create hierarchy entity (offset node).
            const lHierarchyEntity = new GameEntity();
            lHierarchyEntity.label = `Hierarchy Entity ${this.mHierarchyEntities.length + 1}`;
            const lHierarchyTransformation: TransformationComponent = lHierarchyEntity.addComponent(TransformationComponent);
            lHierarchyTransformation.translationX = 2;

            // Create block entity with mesh.
            const lBlockEntity: GameEntity = new GameEntity();
            lBlockEntity.label = `Block Entity ${this.mBlockEntities.length + 1}`;

            const lBlockTransformation: TransformationComponent = lBlockEntity.addComponent(TransformationComponent);
            lBlockTransformation.scaleHeight = 0.5;
            lBlockTransformation.scaleDepth = 0.5;
            lBlockTransformation.scaleWidth = 1;

            const lBlockMeshComponent = lBlockEntity.addComponent(MeshRenderComponent);
            lBlockMeshComponent.mesh = pMesh;

            lHierarchyEntity.addObject(lBlockEntity);

            this.mBlockEntities.push(lBlockEntity);
            this.mHierarchyEntities.push(lHierarchyEntity);

            // Add to parent or scene root.
            if (lParent) {
                lParent.addObject(lHierarchyEntity);
            } else {
                this.mScene.addObject(lHierarchyEntity);
            }
        }
    }
}
