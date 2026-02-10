import type { EnvironmentTransmission } from './environment-transmittion.ts';
import { GameNode } from './game-node.ts';

export class Scene extends GameNode {
    private mTransmission: EnvironmentTransmission | null;

    /**
     * The environment connection of this scene.
     */
    public override get environment(): EnvironmentTransmission | null {
        return this.mTransmission;
    }

    /**
     * Constructor of the scene.
     * 
     * @param pLabel - Label of scene.
     */
    public constructor(pLabel: string) {
        super(pLabel);
        this.mTransmission = null;
    }

    /**
     * Loads the scene into the given environment.
     * This call handles the signaling to the environment itself.
     * This call gets bubbled down to all child game objects, so that they can also signal the environment.
     * 
     * @param pEnvironment 
     */
    public setEnvironmentConnection(pConnection: EnvironmentTransmission | null): void {
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