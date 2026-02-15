import { TransformationComponent } from '../../source/component/transformation-component.ts';
import { GameEnvironment } from '../../source/core/environment/game-environment.ts';
import { GameScene } from '../../source/core/game-scene.ts';
import { GameEntity } from '../../source/core/hierarchy/game-entity.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';
import { ShitSystem } from './shit-system.ts';

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
