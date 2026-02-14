import { TransformationComponent } from '../../source/component/transformation-component.ts';
import { GameEnvironment } from '../../source/core/environment/game-environment.ts';
import { GameScene } from '../../source/core/game-scene.ts';
import { GameEntity } from '../../source/core/hierarchy/game-entity.ts';
import { TransformationSystem } from '../../source/system/transformation-system.ts';

(() => {
    const lEnvironment = new GameEnvironment();

    // Add Transformation system.
    lEnvironment.registerSystem(TransformationSystem);

    // Start the environment.
    lEnvironment.start().then(() => {
        console.log('Environment closed.');
    });

    // Generate some object.
    {
        const lScene: GameScene = new GameScene('Test Scene');

        // GameEntity 1
        const lEntiy1: GameEntity = new GameEntity('Test Entity 1');
        lEntiy1.addComponent(TransformationComponent);
        lScene.addObject(lEntiy1);

        // GameEntity 2
        const lEntiy2: GameEntity = new GameEntity('Test Entity 2');
        lEntiy2.addComponent(TransformationComponent);
        lScene.addObject(lEntiy2);
    }
})();
