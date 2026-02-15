import { PrimitiveTopology } from '@kartoffelgames/web-gpu';
import { MeshComponent } from '../../source/component/mesh-component.ts';
import { TransformationComponent } from '../../source/component/transformation-component.ts';
import { GameEnvironment } from '../../source/core/environment/game-environment.ts';
import { GameScene } from '../../source/core/game-scene.ts';
import { GameEntity } from '../../source/core/hierarchy/game-entity.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';
import { ShitSystem } from './shit-system.ts';

/**
 * Cube vertex position data. Each vertex is a vec4 f32.
 */
const gCubeVertexPositionData: Array<number> = [
    // Back
    -0.5, 0.5, 0.5, 1.0,
    0.5, 0.5, 0.5, 1.0,
    0.5, -0.5, 0.5, 1.0,
    -0.5, -0.5, 0.5, 1.0,
    // Front
    -0.5, 0.5, -0.5, 1.0,
    0.5, 0.5, -0.5, 1.0,
    0.5, -0.5, -0.5, 1.0,
    -0.5, -0.5, -0.5, 1.0
];

/**
 * Cube vertex normal data per triangle vertex. Each normal is a vec4 f32.
 */
const gCubeVertexNormalData: Array<number> = [
    // Front
    0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0,
    0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0,
    // Back
    0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0,
    0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0,
    // Left
    -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0,
    -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0,
    // Right
    1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    // Top
    0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
    0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
    // Bottom
    0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0,
    0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0,
];

/**
 * Cube index data referencing vertex positions.
 */
const gCubeVertexIndices: Array<number> = [
    // Front
    4, 5, 6, 4, 6, 7,
    // Back
    1, 0, 3, 1, 3, 2,
    // Left
    0, 4, 7, 0, 7, 3,
    // Right
    5, 1, 2, 5, 2, 6,
    // Top
    0, 1, 5, 0, 5, 4,
    // Bottom
    7, 6, 2, 7, 2, 3
];

(() => {
    const lEnvironment = new GameEnvironment({
        //debugLog: true
    });

    // Add systems.
    lEnvironment.registerSystem(TransformationSystem);
    lEnvironment.registerSystem(ShitSystem);

    // Start the environment.
    console.log('Starting environment...');
    lEnvironment.start().then(() => {
        console.log('Environment closed.');
    });

    // Generate some object.
    {
        const lScene: GameScene = new GameScene('Test Scene');

        // Init arrays.
        const lBlockArray: Array<GameEntity> = new Array<GameEntity>();
        const lParentArray: Array<GameEntity> = new Array<GameEntity>();

        const lCreateNext = () => {
            // Read last parent.
            const lParent: GameEntity | null = lParentArray.at(-1) || null;

            // Create new parent.
            const lHierarchyEntity = new GameEntity(`Hierarchy Entity ${lParentArray.length + 1}`);
            const lHierarchyTransformation: TransformationComponent = lHierarchyEntity.addComponent(TransformationComponent);
            lHierarchyTransformation.translationX = 2;

            // Create new block.
            const lBlockEntiy: GameEntity = new GameEntity(`Block Entity ${lBlockArray.length + 1}`);
            const lBlockTransformation: TransformationComponent = lBlockEntiy.addComponent(TransformationComponent);
            lBlockTransformation.scaleHeight = 0.5;
            lBlockTransformation.scaleDepth = 0.5;
            lBlockTransformation.scaleWidth = 2;

            // Add cube mesh to block entity.
            const lBlockMesh: MeshComponent = lBlockEntiy.addComponent(MeshComponent);
            lBlockMesh.vertices = gCubeVertexPositionData;
            lBlockMesh.normals = gCubeVertexNormalData;
            lBlockMesh.addSubMesh(gCubeVertexIndices, PrimitiveTopology.TriangleList);

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
        }, 16);

        lEnvironment.loadScene(lScene);
    }
})();
