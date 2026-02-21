import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import type { GameEnvironmentTransmission } from './environment/game-environment-transmittion.ts';
import { GameNode } from './hierarchy/game-node.ts';

/**
 * A Scene is the root game node of a scene graph.
 * Its used to load and deload all game objects in the scene.
 */
@FileSystem.fileClass('ab6f365a-c777-4df7-b781-74bd8d5eed4c', FileSystemReferenceType.Instanced)
export class GameScene extends GameNode {
    private mTransmission: GameEnvironmentTransmission | null;

    /**
     * The environment connection of this scene.
     */
    public override get environment(): GameEnvironmentTransmission | null {
        return this.mTransmission;
    }

    /**
     * Constructor of the scene.
     */
    public constructor() {
        super('Scene');
        this.mTransmission = null;
    }

    /**
     * Loads the scene into the given environment.
     * This call handles the signaling to the environment itself.
     * This call gets bubbled down to all child game objects, so that they can also signal the environment.
     * 
     * @param pEnvironment 
     */
    public setEnvironmentConnection(pConnection: GameEnvironmentTransmission | null): void {
        // Save environment connection for later use.
        this.mTransmission = pConnection;

        // Connect to environment connection.
        if (this.mTransmission) {
            this.connect();
        } else {
            this.disconnect();
        }
    }
}