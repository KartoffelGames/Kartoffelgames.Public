import { PrimitiveTopology } from '../../../kartoffelgames.web.gpu/source/constant/primitive-topology.enum.ts';
import { CameraComponent } from '../../source/component/camera/camera-component.ts';
import { CameraComponentProjection } from '../../source/component/camera/projection/camera-projection.enum.ts';
import type { PerspectiveProjection } from '../../source/component/camera/projection/perspective-projection.ts';
import { LightComponent, LightComponentLightType } from '../../source/component/light/light-component.ts';
import type { PointLight } from '../../source/component/light/type/point-light.ts';
import type { SpotLight } from '../../source/component/light/type/spot-light.ts';
import { MeshRenderComponent } from '../../source/component/mesh-render-component.ts';
import { TransformationComponent } from '../../source/component/transformation-component.ts';
import { Mesh } from '../../source/component_item/mesh/mesh.ts';
import { GameScene } from '../../source/core/game-scene.ts';
import { GameEntity } from '../../source/core/hierarchy/game-entity.ts';

/**
 * Central place for scene content creation.
 * Creates a camera scene (always loaded) and multiple numbered scenes toggleable via keyboard.
 */
export class SceneSetup {
    private readonly mBlockMesh: Mesh;
    private readonly mCameraEntity: GameEntity;
    private readonly mCameraScene: GameScene;
    private readonly mPlaneMesh: Mesh;
    private readonly mScenes: Map<number, GameScene>;

    // Scene 1 animation entities.
    private readonly mScene1HierarchyEntities: Array<GameEntity>;
    private readonly mScene1BlockEntities: Array<GameEntity>;

    /**
     * The camera scene (always loaded).
     */
    public get cameraScene(): GameScene {
        return this.mCameraScene;
    }

    /**
     * The camera entity.
     */
    public get cameraEntity(): GameEntity {
        return this.mCameraEntity;
    }

    /**
     * All numbered scenes.
     */
    public get scenes(): ReadonlyMap<number, GameScene> {
        return this.mScenes;
    }

    /**
     * Constructor. Builds the camera scene and all numbered scenes.
     *
     * @param pBlockMesh - The mesh to use for block entities.
     */
    public constructor(pBlockMesh: Mesh) {
        this.mBlockMesh = pBlockMesh;
        this.mPlaneMesh = SceneSetup.createPlaneMesh();
        this.mScenes = new Map<number, GameScene>();
        this.mScene1HierarchyEntities = new Array<GameEntity>();
        this.mScene1BlockEntities = new Array<GameEntity>();

        // Create always-loaded camera scene.
        this.mCameraScene = new GameScene();
        this.mCameraScene.label = 'Camera Scene';
        this.mCameraEntity = this.createPerspectiveCamera();
        this.mCameraScene.addObject(this.mCameraEntity);

        // Create numbered scenes.
        this.mScenes.set(1, this.createScene1());
        this.mScenes.set(2, this.createScene2());
        this.mScenes.set(3, this.createScene3());
        this.mScenes.set(4, this.createScene4());
        this.mScenes.set(5, this.createScene5());
        this.mScenes.set(6, this.createScene6());
        this.mScenes.set(7, this.createScene7());
    }

    /**
     * Called every animation frame to animate scene 1 objects.
     */
    public animateObjects(): void {
        for (const lEntity of this.mScene1HierarchyEntities) {
            const lTransformation: TransformationComponent = lEntity.getComponent(TransformationComponent);
            lTransformation.addEulerRotation(0, 0, 0.3);
        }

        for (const lEntity of this.mScene1BlockEntities) {
            const lTransformation: TransformationComponent = lEntity.getComponent(TransformationComponent);
            lTransformation.addEulerRotation(0, 0.3, 0);
        }
    }

    /**
     * Create a programmatic plane mesh (unit quad facing +Z, centered at origin).
     */
    private static createPlaneMesh(): Mesh {
        const lMesh: Mesh = new Mesh();

        // Unit quad vertices (-0.5 to 0.5) facing +Z.
        lMesh.verticesData = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            0.5, 0.5, 0,
            -0.5, 0.5, 0,
        ];

        // All normals face +Z.
        lMesh.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];

        // Two triangles forming the quad.
        lMesh.addSubMesh([0, 1, 2, 0, 2, 3], PrimitiveTopology.TriangleList);

        // Set bounding box.
        lMesh.bounds.minX = -0.5;
        lMesh.bounds.minY = -0.5;
        lMesh.bounds.minZ = 0;
        lMesh.bounds.maxX = 0.5;
        lMesh.bounds.maxY = 0.5;
        lMesh.bounds.maxZ = 0;

        return lMesh;
    }

    /**
     * Create the perspective camera entity.
     */
    private createPerspectiveCamera(): GameEntity {
        const lCameraEntity: GameEntity = new GameEntity();
        lCameraEntity.label = 'Camera';
        const lCameraTransformation: TransformationComponent = lCameraEntity.addComponent(TransformationComponent);
        lCameraTransformation.translationZ = -5;
        const lCameraComponent: CameraComponent = lCameraEntity.addComponent(CameraComponent);
        lCameraComponent.projectionType = CameraComponentProjection.Perspective;

        const lPerspectiveProjection: PerspectiveProjection = lCameraComponent.projection as PerspectiveProjection;
        lPerspectiveProjection.angleOfView = 72;
        lPerspectiveProjection.near = 0.1;
        lPerspectiveProjection.far = Number.MAX_SAFE_INTEGER;

        return lCameraEntity;
    }

    /**
     * Create a mesh render entity at a given position with optional rotation and scale.
     */
    private createMeshEntity(pLabel: string, pMesh: Mesh, pPosition: { x: number; y: number; z: number; }, pRotation?: { pitch: number; yaw: number; roll: number; }, pScale?: { width: number; height: number; depth: number; }): GameEntity {
        const lEntity: GameEntity = new GameEntity();
        lEntity.label = pLabel;
        const lTransformation: TransformationComponent = lEntity.addComponent(TransformationComponent);
        lTransformation.translationX = pPosition.x;
        lTransformation.translationY = pPosition.y;
        lTransformation.translationZ = pPosition.z;

        if (pRotation) {
            lTransformation.addEulerRotation(pRotation.pitch, pRotation.yaw, pRotation.roll);
        }

        if (pScale) {
            lTransformation.scaleWidth = pScale.width;
            lTransformation.scaleHeight = pScale.height;
            lTransformation.scaleDepth = pScale.depth;
        }

        const lMeshComponent = lEntity.addComponent(MeshRenderComponent);
        lMeshComponent.mesh = pMesh;

        return lEntity;
    }

    /**
     * Create a light entity at a given position with the specified type and color.
     */
    private createLightEntity(pLabel: string, pType: LightComponentLightType, pPosition: { x: number; y: number; z: number; }, pColor: { r: number; g: number; b: number; }, pIntensity: number, pRotation?: { pitch: number; yaw: number; roll: number; }): GameEntity {
        const lEntity: GameEntity = new GameEntity();
        lEntity.label = pLabel;
        const lTransformation: TransformationComponent = lEntity.addComponent(TransformationComponent);
        lTransformation.translationX = pPosition.x;
        lTransformation.translationY = pPosition.y;
        lTransformation.translationZ = pPosition.z;

        if (pRotation) {
            lTransformation.addEulerRotation(pRotation.pitch, pRotation.yaw, pRotation.roll);
        }

        const lLightComponent: LightComponent = lEntity.addComponent(LightComponent);
        lLightComponent.lightType = pType;
        lLightComponent.light.color.r = pColor.r;
        lLightComponent.light.color.g = pColor.g;
        lLightComponent.light.color.b = pColor.b;
        lLightComponent.light.intensity = pIntensity;

        return lEntity;
    }

    /**
     * Create 4 planes arranged as an open box (floor + 3 walls) and add them to the scene.
     * The box is centered at the given position.
     */
    private addOpenBox(pScene: GameScene, pCenter: { x: number; y: number; z: number; }, pSize: number): void {
        const lHalf: number = pSize / 2;

        // Floor (facing up).
        pScene.addObject(this.createMeshEntity('Floor', this.mPlaneMesh,
            { x: pCenter.x, y: pCenter.y - lHalf, z: pCenter.z },
            { pitch: -90, yaw: 0, roll: 0 },
            { width: pSize, height: pSize, depth: 1 }
        ));

        // Back wall (facing forward, -Z toward camera).
        pScene.addObject(this.createMeshEntity('Back Wall', this.mPlaneMesh,
            { x: pCenter.x, y: pCenter.y, z: pCenter.z + lHalf },
            { pitch: 0, yaw: 180, roll: 0 },
            { width: pSize, height: pSize, depth: 1 }
        ));

        // Left wall (facing right).
        pScene.addObject(this.createMeshEntity('Left Wall', this.mPlaneMesh,
            { x: pCenter.x - lHalf, y: pCenter.y, z: pCenter.z },
            { pitch: 0, yaw: 90, roll: 0 },
            { width: pSize, height: pSize, depth: 1 }
        ));

        // Right wall (facing left).
        pScene.addObject(this.createMeshEntity('Right Wall', this.mPlaneMesh,
            { x: pCenter.x + lHalf, y: pCenter.y, z: pCenter.z },
            { pitch: 0, yaw: -90, roll: 0 },
            { width: pSize, height: pSize, depth: 1 }
        ));
    }

    // ── Scene 1: Cube chain with 3 colored point lights ─────────

    /**
     * Scene 1: Animated cube chain with 3 colored point lights.
     */
    private createScene1(): GameScene {
        const lScene: GameScene = new GameScene();
        lScene.label = 'Scene 1: Cube Chain';

        // Create 3 point lights.
        const lWhiteLight = this.createLightEntity('White Light', LightComponentLightType.Point,
            { x: 5, y: 10, z: -5 }, { r: 1, g: 1, b: 1 }, 1);
        lScene.addObject(lWhiteLight);

        const lRedLight = this.createLightEntity('Red Light', LightComponentLightType.Point,
            { x: -5, y: 3, z: 0 }, { r: 1, g: 0.2, b: 0.2 }, 0.8);
        lScene.addObject(lRedLight);

        const lBlueLight = this.createLightEntity('Blue Light', LightComponentLightType.Point,
            { x: 10, y: 3, z: 5 }, { r: 0.2, g: 0.2, b: 1 }, 0.8);
        lScene.addObject(lBlueLight);

        // Create cube chain.
        this.createCubeChain(lScene, this.mBlockMesh, 19);

        return lScene;
    }

    /**
     * Create a chain of nested cube entities within a scene.
     */
    private createCubeChain(pScene: GameScene, pMesh: Mesh, pCount: number): void {
        for (let lIndex = 0; lIndex < pCount; lIndex++) {
            const lParent: GameEntity | null = this.mScene1HierarchyEntities.at(-1) ?? null;

            const lHierarchyEntity = new GameEntity();
            lHierarchyEntity.label = `Hierarchy Entity ${this.mScene1HierarchyEntities.length + 1}`;
            const lHierarchyTransformation: TransformationComponent = lHierarchyEntity.addComponent(TransformationComponent);
            lHierarchyTransformation.translationX = 2;

            const lBlockEntity: GameEntity = new GameEntity();
            lBlockEntity.label = `Block Entity ${this.mScene1BlockEntities.length + 1}`;
            const lBlockTransformation: TransformationComponent = lBlockEntity.addComponent(TransformationComponent);
            lBlockTransformation.scaleHeight = 0.5;
            lBlockTransformation.scaleDepth = 0.5;
            lBlockTransformation.scaleWidth = 1;

            const lBlockMeshComponent = lBlockEntity.addComponent(MeshRenderComponent);
            lBlockMeshComponent.mesh = pMesh;

            lHierarchyEntity.addObject(lBlockEntity);

            this.mScene1BlockEntities.push(lBlockEntity);
            this.mScene1HierarchyEntities.push(lHierarchyEntity);

            if (lParent) {
                lParent.addObject(lHierarchyEntity);
            } else {
                pScene.addObject(lHierarchyEntity);
            }
        }
    }

    // ── Scene 2: Open box with 4 colored point lights ───────────

    /**
     * Scene 2: Open box (4 planes) with 4 colored point lights inside.
     */
    private createScene2(): GameScene {
        const lScene: GameScene = new GameScene();
        lScene.label = 'Scene 2: Point Lights';
        const lCenter = { x: 0, y: 2, z: 5 };

        this.addOpenBox(lScene, lCenter, 8);

        // 4 colored point lights inside the box.
        const lRedLight = this.createLightEntity('Red Point', LightComponentLightType.Point,
            { x: lCenter.x - 2, y: lCenter.y + 1, z: lCenter.z - 2 }, { r: 1, g: 0.1, b: 0.1 }, 0.8);
        (lRedLight.getComponent(LightComponent).light as PointLight).range = 15;
        lScene.addObject(lRedLight);

        const lGreenLight = this.createLightEntity('Green Point', LightComponentLightType.Point,
            { x: lCenter.x + 2, y: lCenter.y + 1, z: lCenter.z - 2 }, { r: 0.1, g: 1, b: 0.1 }, 0.8);
        (lGreenLight.getComponent(LightComponent).light as PointLight).range = 15;
        lScene.addObject(lGreenLight);

        const lBlueLight = this.createLightEntity('Blue Point', LightComponentLightType.Point,
            { x: lCenter.x - 2, y: lCenter.y + 1, z: lCenter.z + 2 }, { r: 0.1, g: 0.1, b: 1 }, 0.8);
        (lBlueLight.getComponent(LightComponent).light as PointLight).range = 15;
        lScene.addObject(lBlueLight);

        const lYellowLight = this.createLightEntity('Yellow Point', LightComponentLightType.Point,
            { x: lCenter.x + 2, y: lCenter.y + 1, z: lCenter.z + 2 }, { r: 1, g: 1, b: 0.1 }, 0.8);
        (lYellowLight.getComponent(LightComponent).light as PointLight).range = 15;
        lScene.addObject(lYellowLight);

        return lScene;
    }

    // ── Scene 3: Open box with area lights ──────────────────────

    /**
     * Scene 3: Open box with 4 colored area lights facing inward.
     */
    private createScene3(): GameScene {
        const lScene: GameScene = new GameScene();
        lScene.label = 'Scene 3: Area Lights';
        const lCenter = { x: 0, y: 2, z: 15 };

        this.addOpenBox(lScene, lCenter, 8);

        // Area lights on each wall, facing inward. Scale width/height defines the area size.
        // Back wall area light (facing forward, -Z).
        const lBackAreaLight = this.createLightEntity('Back Area Light', LightComponentLightType.Area,
            { x: lCenter.x, y: lCenter.y + 1, z: lCenter.z + 3.5 }, { r: 1, g: 0.3, b: 0.3 }, 0.8,
            { pitch: 0, yaw: 180, roll: 0 });
        const lBackTransform = lBackAreaLight.getComponent(TransformationComponent);
        lBackTransform.scaleWidth = 3;
        lBackTransform.scaleHeight = 2;
        lScene.addObject(lBackAreaLight);

        // Left wall area light (facing right, +X).
        const lLeftAreaLight = this.createLightEntity('Left Area Light', LightComponentLightType.Area,
            { x: lCenter.x - 3.5, y: lCenter.y + 1, z: lCenter.z }, { r: 0.3, g: 1, b: 0.3 }, 0.8,
            { pitch: 0, yaw: 90, roll: 0 });
        const lLeftTransform = lLeftAreaLight.getComponent(TransformationComponent);
        lLeftTransform.scaleWidth = 3;
        lLeftTransform.scaleHeight = 2;
        lScene.addObject(lLeftAreaLight);

        // Right wall area light (facing left, -X).
        const lRightAreaLight = this.createLightEntity('Right Area Light', LightComponentLightType.Area,
            { x: lCenter.x + 3.5, y: lCenter.y + 1, z: lCenter.z }, { r: 0.3, g: 0.3, b: 1 }, 0.8,
            { pitch: 0, yaw: -90, roll: 0 });
        const lRightTransform = lRightAreaLight.getComponent(TransformationComponent);
        lRightTransform.scaleWidth = 3;
        lRightTransform.scaleHeight = 2;
        lScene.addObject(lRightAreaLight);

        // Floor area light (facing up, +Y).
        const lFloorAreaLight = this.createLightEntity('Floor Area Light', LightComponentLightType.Area,
            { x: lCenter.x, y: lCenter.y - 3.5, z: lCenter.z }, { r: 1, g: 1, b: 0.5 }, 0.6,
            { pitch: -90, yaw: 0, roll: 0 });
        const lFloorTransform = lFloorAreaLight.getComponent(TransformationComponent);
        lFloorTransform.scaleWidth = 4;
        lFloorTransform.scaleHeight = 4;
        lScene.addObject(lFloorAreaLight);

        return lScene;
    }

    // ── Scene 4: Open box with spot lights ──────────────────────

    /**
     * Scene 4: Open box with spot lights in various colors and directions.
     */
    private createScene4(): GameScene {
        const lScene: GameScene = new GameScene();
        lScene.label = 'Scene 4: Spot Lights';
        const lCenter = { x: 0, y: 2, z: 25 };

        this.addOpenBox(lScene, lCenter, 8);

        // Spot light from top-left aiming at floor center.
        const lSpot1 = this.createLightEntity('Red Spot', LightComponentLightType.Spot,
            { x: lCenter.x - 3, y: lCenter.y + 3, z: lCenter.z - 2 }, { r: 1, g: 0.2, b: 0.2 }, 1,
            { pitch: 45, yaw: 30, roll: 0 });
        const lSpot1Light = lSpot1.getComponent(LightComponent).light as SpotLight;
        lSpot1Light.range = 15;
        lSpot1Light.innerAngle = 20;
        lSpot1Light.outerAngle = 35;
        lScene.addObject(lSpot1);

        // Spot light from top-right aiming at floor.
        const lSpot2 = this.createLightEntity('Green Spot', LightComponentLightType.Spot,
            { x: lCenter.x + 3, y: lCenter.y + 3, z: lCenter.z - 2 }, { r: 0.2, g: 1, b: 0.2 }, 1,
            { pitch: 45, yaw: -30, roll: 0 });
        const lSpot2Light = lSpot2.getComponent(LightComponent).light as SpotLight;
        lSpot2Light.range = 15;
        lSpot2Light.innerAngle = 15;
        lSpot2Light.outerAngle = 40;
        lScene.addObject(lSpot2);

        // Spot light from back aiming forward.
        const lSpot3 = this.createLightEntity('Blue Spot', LightComponentLightType.Spot,
            { x: lCenter.x, y: lCenter.y + 2, z: lCenter.z + 3 }, { r: 0.2, g: 0.2, b: 1 }, 1,
            { pitch: 10, yaw: 180, roll: 0 });
        const lSpot3Light = lSpot3.getComponent(LightComponent).light as SpotLight;
        lSpot3Light.range = 15;
        lSpot3Light.innerAngle = 25;
        lSpot3Light.outerAngle = 45;
        lScene.addObject(lSpot3);

        // Spot light from center aiming straight down.
        const lSpot4 = this.createLightEntity('White Spot', LightComponentLightType.Spot,
            { x: lCenter.x, y: lCenter.y + 3.5, z: lCenter.z }, { r: 1, g: 1, b: 1 }, 0.8,
            { pitch: 90, yaw: 0, roll: 0 });
        const lSpot4Light = lSpot4.getComponent(LightComponent).light as SpotLight;
        lSpot4Light.range = 10;
        lSpot4Light.innerAngle = 30;
        lSpot4Light.outerAngle = 50;
        lScene.addObject(lSpot4);

        return lScene;
    }

    // ── Scene 5: Random boxes with directional light ────────────

    /**
     * Scene 5: Random scattered boxes with a directional light from above.
     */
    private createScene5(): GameScene {
        const lScene: GameScene = new GameScene();
        lScene.label = 'Scene 5: Directional Light';

        // Directional light from upper-right, angled down.
        const lDirLight = this.createLightEntity('Sun Light', LightComponentLightType.Directional,
            { x: 0, y: 20, z: 35 }, { r: 1, g: 0.95, b: 0.8 }, 0.9,
            { pitch: 45, yaw: -30, roll: 0 });
        lScene.addObject(lDirLight);

        // Floor plane.
        lScene.addObject(this.createMeshEntity('Ground', this.mPlaneMesh,
            { x: 0, y: -2, z: 35 },
            { pitch: -90, yaw: 0, roll: 0 },
            { width: 20, height: 20, depth: 1 }
        ));

        // Scatter random boxes.
        const lPositions: Array<{ x: number; y: number; z: number; }> = [
            { x: -4, y: -0.5, z: 32 }, { x: 2, y: 0, z: 34 }, { x: -1, y: -1, z: 37 },
            { x: 5, y: -0.5, z: 33 }, { x: -3, y: 0.5, z: 36 }, { x: 3, y: -1.5, z: 38 },
            { x: 0, y: 0, z: 35 }, { x: -5, y: -1, z: 34 }, { x: 4, y: 0.5, z: 36 },
            { x: 1, y: -0.5, z: 33 }, { x: -2, y: 0, z: 38 }, { x: 6, y: -1, z: 35 },
        ];

        for (let lIndex = 0; lIndex < lPositions.length; lIndex++) {
            const lPos = lPositions[lIndex];
            const lScale = 0.4 + (lIndex % 3) * 0.3;
            lScene.addObject(this.createMeshEntity(`Box ${lIndex + 1}`, this.mBlockMesh,
                lPos,
                { pitch: lIndex * 15, yaw: lIndex * 25, roll: lIndex * 10 },
                { width: lScale, height: lScale, depth: lScale }
            ));
        }

        return lScene;
    }

    // ── Scene 6: Mixed light types ──────────────────────────────

    /**
     * Scene 6: Multiple light types in one scene.
     */
    private createScene6(): GameScene {
        const lScene: GameScene = new GameScene();
        lScene.label = 'Scene 6: Mixed Lights';
        const lCenter = { x: 0, y: 2, z: 45 };

        this.addOpenBox(lScene, lCenter, 10);

        // Point light at center.
        const lPointLight = this.createLightEntity('Center Point', LightComponentLightType.Point,
            { x: lCenter.x, y: lCenter.y + 2, z: lCenter.z }, { r: 1, g: 0.8, b: 0.6 }, 0.7);
        (lPointLight.getComponent(LightComponent).light as PointLight).range = 12;
        lScene.addObject(lPointLight);

        // Spot light from corner.
        const lSpotLight = this.createLightEntity('Corner Spot', LightComponentLightType.Spot,
            { x: lCenter.x + 4, y: lCenter.y + 4, z: lCenter.z - 4 }, { r: 0.5, g: 0.5, b: 1 }, 1,
            { pitch: 35, yaw: -35, roll: 0 });
        const lSpot = lSpotLight.getComponent(LightComponent).light as SpotLight;
        lSpot.range = 15;
        lSpot.innerAngle = 20;
        lSpot.outerAngle = 40;
        lScene.addObject(lSpotLight);

        // Directional fill light.
        const lDirLight = this.createLightEntity('Fill Light', LightComponentLightType.Directional,
            { x: lCenter.x, y: lCenter.y + 5, z: lCenter.z }, { r: 0.4, g: 0.4, b: 0.5 }, 0.3,
            { pitch: 60, yaw: 0, roll: 0 });
        lScene.addObject(lDirLight);

        // Area light on back wall.
        const lAreaLight = this.createLightEntity('Back Area', LightComponentLightType.Area,
            { x: lCenter.x, y: lCenter.y + 1, z: lCenter.z + 4.5 }, { r: 1, g: 0.3, b: 0.7 }, 0.6,
            { pitch: 0, yaw: 180, roll: 0 });
        const lAreaTransform = lAreaLight.getComponent(TransformationComponent);
        lAreaTransform.scaleWidth = 4;
        lAreaTransform.scaleHeight = 2;
        lScene.addObject(lAreaLight);

        // Some boxes inside.
        lScene.addObject(this.createMeshEntity('Box A', this.mBlockMesh,
            { x: lCenter.x - 2, y: lCenter.y - 1.5, z: lCenter.z + 1 }, undefined,
            { width: 1, height: 1, depth: 1 }));
        lScene.addObject(this.createMeshEntity('Box B', this.mBlockMesh,
            { x: lCenter.x + 1.5, y: lCenter.y - 1, z: lCenter.z - 1 },
            { pitch: 0, yaw: 45, roll: 0 },
            { width: 1.5, height: 2, depth: 0.8 }));

        return lScene;
    }

    // ── Scene 7: Light corridor ─────────────────────────────────

    /**
     * Scene 7: A corridor of boxes lit by a single bright point light to demonstrate falloff.
     */
    private createScene7(): GameScene {
        const lScene: GameScene = new GameScene();
        lScene.label = 'Scene 7: Light Corridor';
        const lBaseZ: number = 55;

        // Bright white point light at the start of the corridor.
        const lLight = this.createLightEntity('Corridor Light', LightComponentLightType.Point,
            { x: 0, y: 1, z: lBaseZ }, { r: 1, g: 0.95, b: 0.85 }, 1);
        (lLight.getComponent(LightComponent).light as PointLight).range = 30;
        (lLight.getComponent(LightComponent).light as PointLight).dropOff = 0.8;
        lScene.addObject(lLight);

        // Corridor walls (two rows of planes).
        for (let lStep = 0; lStep < 10; lStep++) {
            const lZ: number = lBaseZ + lStep * 3;

            // Left wall segment.
            lScene.addObject(this.createMeshEntity(`Left Wall ${lStep}`, this.mPlaneMesh,
                { x: -2, y: 0, z: lZ },
                { pitch: 0, yaw: 90, roll: 0 },
                { width: 3, height: 3, depth: 1 }
            ));

            // Right wall segment.
            lScene.addObject(this.createMeshEntity(`Right Wall ${lStep}`, this.mPlaneMesh,
                { x: 2, y: 0, z: lZ },
                { pitch: 0, yaw: -90, roll: 0 },
                { width: 3, height: 3, depth: 1 }
            ));

            // Floor segment.
            lScene.addObject(this.createMeshEntity(`Floor ${lStep}`, this.mPlaneMesh,
                { x: 0, y: -1.5, z: lZ },
                { pitch: -90, yaw: 0, roll: 0 },
                { width: 4, height: 3, depth: 1 }
            ));
        }

        // A few boxes along the corridor.
        for (let lStep = 1; lStep < 8; lStep += 2) {
            const lZ: number = lBaseZ + lStep * 3;
            const lSide: number = lStep % 4 === 1 ? -1 : 1;
            lScene.addObject(this.createMeshEntity(`Corridor Box ${lStep}`, this.mBlockMesh,
                { x: lSide * 0.8, y: -0.8, z: lZ },
                { pitch: 0, yaw: lStep * 20, roll: 0 },
                { width: 0.5, height: 0.7, depth: 0.5 }
            ));
        }

        return lScene;
    }
}
