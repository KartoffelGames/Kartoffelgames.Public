import { TransformationComponent } from '../../source/component/transformation-component.ts';
import { MeshRenderComponent } from '../../source/component/mesh-render-component.ts';
import { GlbConverter } from '../../source/component_item/mesh/glb-converter.ts';
import { GameEnvironment } from '../../source/core/environment/game-environment.ts';
import { GameScene } from '../../source/core/game-scene.ts';
import { GameEntity } from '../../source/core/hierarchy/game-entity.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';
import { ShitSystem } from './shit-system.ts';
import type { Mesh } from '../../source/component_item/mesh/mesh.ts';

// Load cube mesh from GLB file.
const lGlbData: ArrayBuffer = await fetch('/mesh.glb').then((pResponse) => {
    return pResponse.arrayBuffer();
});
const lMeshes: Array<Mesh> = GlbConverter.convert(lGlbData);
const lBlockMesh: Mesh = lMeshes[0];

(() => {
    const lEnvironment = new GameEnvironment({
        //debugLog: true
    });

    // Add systems.
    lEnvironment.registerSystem(TransformationSystem);
    lEnvironment.registerSystem(ShitSystem);

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
