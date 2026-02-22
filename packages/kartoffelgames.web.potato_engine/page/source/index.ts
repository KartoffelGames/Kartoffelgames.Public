import { CameraComponent } from '../../source/component/camera/camera-component.ts';
import { CameraComponentProjection } from '../../source/component/camera/projection/camera-projection.enum.ts';
import type { PerspectiveProjection } from '../../source/component/camera/projection/perspective-projection.ts';
import { LightComponent, LightComponentLightType } from '../../source/component/light/light-component.ts';
import { MeshRenderComponent } from '../../source/component/mesh-render-component.ts';
import { TransformationComponent } from '../../source/component/transformation-component.ts';
import { GlbConverter } from '../../source/component_item/mesh/glb-converter.ts';
import type { Mesh } from '../../source/component_item/mesh/mesh.ts';
import { GameEnvironment } from '../../source/core/environment/game-environment.ts';
import { GameScene } from '../../source/core/game-scene.ts';
import { GameEntity } from '../../source/core/hierarchy/game-entity.ts';
import { CullSystem } from '../../source/system/cull-system.ts';
import { LightSystem } from '../../source/system/light-system.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';
import { ShitSystem } from './shit-system.ts';

// Load cube mesh from GLB file.
const lGlbData: ArrayBuffer = await fetch('/mesh.glb').then(async (pResponse) => {
    return pResponse.arrayBuffer();
});
const lMeshes: Array<Mesh> = GlbConverter.convert(lGlbData);
const lBlockMesh: Mesh = lMeshes[0];

console.log(lBlockMesh.verticlesCount);
console.log(lBlockMesh.bounds);

(() => {
    const lEnvironment = new GameEnvironment({
        // debugLog: true
    });

    // Add systems.
    lEnvironment.registerSystem(TransformationSystem);
    lEnvironment.registerSystem(LightSystem);
    lEnvironment.registerSystem(CullSystem);

    // Register the rendering system and set the canvas before start.
    // Dependencies (CullSystem, TransformationSystem, LightSystem, GpuSystem) are auto-registered.
    const lShitSystem: ShitSystem = lEnvironment.registerSystem(ShitSystem);
    const lCanvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    lShitSystem.canvas = lCanvas;

    // Handle canvas resize. THAT SHIT ONLY RESIZES BECAUSE CSS VALUES ARE SET. NEVER!!!! USE THAT IN REAL CODE!!!.
    const lCanvasWrapper: HTMLElement | null = document.querySelector('.canvas-wrapper');
    if (lCanvasWrapper) {
        new ResizeObserver(() => {
            lCanvas.width = Math.max(lCanvasWrapper.clientWidth - 20, 0);
            lCanvas.height = Math.max(0, lCanvasWrapper.clientHeight - 20);
        }).observe(lCanvasWrapper);
    }

    // Start the environment.
    // eslint-disable-next-line no-console
    console.log('Starting environment...');
    lEnvironment.start().then(() => {
        // eslint-disable-next-line no-console
        console.log('Environment closed.');
    });

    // Generate some object.
    {
        const lScene: GameScene = new GameScene();
        lScene.label = 'Test Scene';

        // Add a camera.
        const lCameraEntity: GameEntity = new GameEntity();
        lCameraEntity.label = 'Camera Entity';
        const lCameraTransformation: TransformationComponent = lCameraEntity.addComponent(TransformationComponent);
        lCameraTransformation.translationZ = -5;
        const lCameraComponent: CameraComponent = lCameraEntity.addComponent(CameraComponent);
        lCameraComponent.projectionType = CameraComponentProjection.Perspective;

        // Configure camera projection.
        const lProjection: PerspectiveProjection = lCameraComponent.projection as PerspectiveProjection;
        lProjection.angleOfView = 72;
        lProjection.near = 0.1;
        lProjection.far = Number.MAX_SAFE_INTEGER;

        lScene.addObject(lCameraEntity);

        // --- Lights --- //

        // White point light above the scene (replaces old hardcoded light position).
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
        lScene.addObject(lWhiteLightEntity);

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
        lScene.addObject(lRedLightEntity);

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
        lScene.addObject(lBlueLightEntity);

        // --- Camera controls --- //
        const lKeyState: Set<string> = new Set<string>();
        document.addEventListener('keydown', (pEvent: KeyboardEvent) => {
            lKeyState.add(pEvent.key.toLowerCase());
            // Prevent default for control keys used by the camera.
            if (['shift', 'control'].includes(pEvent.key.toLowerCase())) {
                pEvent.preventDefault();
            }
        });
        document.addEventListener('keyup', (pEvent: KeyboardEvent) => {
            lKeyState.delete(pEvent.key.toLowerCase());
        });

        // Mouse look: rotate camera on mouse drag.
        let lMouseDown: boolean = false;

        lCanvas.addEventListener('mousedown', () => {
            lMouseDown = true;
        });
        document.addEventListener('mouseup', () => {
            lMouseDown = false;
        });
        lCanvas.addEventListener('mousemove', (pEvent: MouseEvent) => {
            if (lMouseDown) {
                const lSensitivity: number = 0.3;
                lCameraTransformation.addEulerRotation(pEvent.movementY * lSensitivity, pEvent.movementX * lSensitivity, 0);
            }
        });

        // Init arrays.
        const lBlockArray: Array<GameEntity> = new Array<GameEntity>();
        const lParentArray: Array<GameEntity> = new Array<GameEntity>();

        const lCreateNext = () => {
            // Read last parent.
            const lParent: GameEntity | null = lParentArray.at(-1) || null;

            // Create new parent.
            const lHierarchyEntity = new GameEntity();
            lHierarchyEntity.label = `Hierarchy Entity ${lParentArray.length + 1}`;
            const lHierarchyTransformation: TransformationComponent = lHierarchyEntity.addComponent(TransformationComponent);
            lHierarchyTransformation.translationX = 2;

            // Create new block.
            const lBlockEntiy: GameEntity = new GameEntity();
            lBlockEntiy.label = `Block Entity ${lBlockArray.length + 1}`;

            const lBlockTransformation: TransformationComponent = lBlockEntiy.addComponent(TransformationComponent);
            lBlockTransformation.scaleHeight = 0.5;
            lBlockTransformation.scaleDepth = 0.5;
            lBlockTransformation.scaleWidth = 1;

            // Add cube mesh to block entity.
            const lBlockMeshComponent = lBlockEntiy.addComponent(MeshRenderComponent);
            lBlockMeshComponent.mesh = lBlockMesh;

            lHierarchyEntity.addObject(lBlockEntiy);

            // Add to arrays.
            lBlockArray.push(lBlockEntiy);
            lParentArray.push(lHierarchyEntity);

            // Add new hierarchy entity to parent if it exists, otherwise add it to the scene.
            if (lParent) {
                lParent.addObject(lHierarchyEntity);
            } else {
                lScene.addObject(lHierarchyEntity);
            }
        };

        for (let lCount = 1; lCount < 20; lCount++) {
            lCreateNext();
        }

        globalThis.setInterval(() => {
            // Camera movement.
            const lMoveSpeed: number = 0.1;
            const lRotateSpeed: number = 1.0;

            let lForward: number = 0;
            let lRight: number = 0;
            let lUp: number = 0;

            if (lKeyState.has('w')) { lForward += lMoveSpeed; }
            if (lKeyState.has('s')) { lForward -= lMoveSpeed; }
            if (lKeyState.has('a')) { lRight -= lMoveSpeed; }
            if (lKeyState.has('d')) { lRight += lMoveSpeed; }
            if (lKeyState.has('shift')) { lUp += lMoveSpeed; }
            if (lKeyState.has('control')) { lUp -= lMoveSpeed; }

            if (lForward !== 0 || lRight !== 0 || lUp !== 0) {
                lCameraTransformation.translateInDirection(lForward, lRight, lUp);
            }

            // Camera rotation (Q/E for yaw).
            let lRoll: number = 0;
            if (lKeyState.has('q')) { lRoll -= lRotateSpeed; }
            if (lKeyState.has('e')) { lRoll += lRotateSpeed; }

            if (lRoll !== 0) {
                lCameraTransformation.addEulerRotation(0, 0, lRoll);
            }

            // Object rotation.
            for (const lEntity of lParentArray) {
                const lTransformation: TransformationComponent = lEntity.getComponent(TransformationComponent);
                lTransformation.addEulerRotation(0, 0, 0.3);
            }

            for (const lEntity of lBlockArray) {
                const lTransformation: TransformationComponent = lEntity.getComponent(TransformationComponent);
                lTransformation.addEulerRotation(0, 0.3, 0);
            }
        }, 16);

        lEnvironment.loadScene(lScene);
    }
})();
