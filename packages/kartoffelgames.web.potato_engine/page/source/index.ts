import { TransformationComponent } from '../../source/component/transformation-component.ts';
import { GameEnvironment } from '../../source/core/environment/game-environment.ts';
import { GameScene } from '../../source/core/game-scene.ts';
import { GameEntity } from '../../source/core/hierarchy/game-entity.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';
import { ShitSystem } from './shit-system.ts';

(() => {
    const lEnvironment = new GameEnvironment({
        debugLog: true
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

        // GameEntity 1
        const lEntiy1: GameEntity = new GameEntity('Test Entity 1');
        lEntiy1.addComponent(TransformationComponent).translationY = 2;
        lScene.addObject(lEntiy1);

        // GameEntity 2
        const lEntiy2: GameEntity = new GameEntity('Test Entity 2');
        lEntiy2.addComponent(TransformationComponent);
        lScene.addObject(lEntiy2);

        // Load scene into environment.
        console.log('Loading scene into environment...');
        lEnvironment.loadScene(lScene);

        // Periodically change the transformation of the first entity.
        globalThis.setInterval(() => {
            const lTransformation: TransformationComponent = lEntiy1.getComponent(TransformationComponent);
            lTransformation.translationX += Math.random() * 10 - 5; // Random translation between -5 and 5

            // Limit translation to a certain range for better visualization.
            lTransformation.translationX = Math.max(-4, Math.min(4, lTransformation.translationX));
        }, 1000);

        // Periodically add or delete nested game entities.
        const lAddedRootEntities: Array<GameEntity> = [];
        globalThis.setInterval(() => {
            // Randomly decide to add or delete.
            let lAddObject: boolean = Math.random() > 0.5;
            lAddObject = lAddObject && lAddedRootEntities.length < 20 || lAddedRootEntities.length === 0;

            if (lAddObject) {
                // Create nested entity structure (2-5 levels deep).
                const lDepth: number = Math.floor(Math.random() * 4) + 2; // 2-5

                // Create root entity for this structure.
                const lRootEntity: GameEntity = new GameEntity(`Root`);
                const lRootComponent: TransformationComponent = lRootEntity.addComponent(TransformationComponent);
                lRootComponent.translationX = Math.max(-5, Math.min(5, Math.random() * 10 - 5));
                lRootComponent.translationY = Math.max(-5, Math.min(5, Math.random() * 10 - 5));
                lRootComponent.translationZ = Math.max(-5, Math.min(5, Math.random() * 10 - 5));

                let lCurrentEntity: GameEntity = lRootEntity;
                for (let lDepthLevel = 1; lDepthLevel < lDepth; lDepthLevel++) {
                    const lNewEntity: GameEntity = new GameEntity(`Level ${lDepthLevel}`);
                    const lNewComponent: TransformationComponent = lNewEntity.addComponent(TransformationComponent);
                    lNewComponent.translationX = Math.max(-5, Math.min(5, Math.random() * 10 - 5));
                    lNewComponent.translationY = Math.max(-5, Math.min(5, Math.random() * 10 - 5));
                    lNewComponent.translationZ = Math.max(-5, Math.min(5, Math.random() * 10 - 5));

                    // Add new entity as child of current entity and update current entity reference.
                    lCurrentEntity.addObject(lNewEntity);
                    lCurrentEntity = lNewEntity;
                }

                // Add root entity to scene and track it.
                lScene.addObject(lRootEntity);
                lAddedRootEntities.push(lRootEntity);
            }

            if (!lAddObject) {
                // Delete a random root entity.
                const lRandomIndex: number = Math.floor(Math.random() * lAddedRootEntities.length);
                const lEntityToDelete: GameEntity = lAddedRootEntities.splice(lRandomIndex, 1)[0];
                lEntityToDelete.remove();
            }
        }, 5000);
    }
})();
