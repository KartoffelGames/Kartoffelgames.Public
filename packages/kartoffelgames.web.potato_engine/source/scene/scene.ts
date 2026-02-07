import { GameObject } from "./game-object.ts";

export class Scene {
    private readonly mGameObjects: Array<GameObject>;
    private readonly mLabel: string;

    /**
     * List of all game objects in this scene.
     */
    public get gameObjects(): ReadonlyArray<GameObject> {
        return this.mGameObjects;
    }

    /**
     * Label of this scene.
     */
    public get label(): string {
        return this.mLabel;
    }

    public constructor(pLabel: string) {
        this.mLabel = pLabel;
        this.mGameObjects = new Array<GameObject>();
    }
}