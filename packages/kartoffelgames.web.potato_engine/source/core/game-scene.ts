import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { GameNode } from './hierarchy/game-node.ts';

/**
 * A Scene is the root game node of a scene graph.
 * Its used to load and deload all game objects in the scene.
 */
@FileSystem.fileClass('ab6f365a-c777-4df7-b781-74bd8d5eed4c', FileSystemReferenceType.Instanced)
export class GameScene extends GameNode {
    /**
     * Constructor of the scene.
     */
    public constructor() {
        super('Scene');
    }
}