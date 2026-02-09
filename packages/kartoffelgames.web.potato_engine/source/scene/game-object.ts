import { EnvironmentTransmission } from "./environment-transmittion.ts";

/**
 * A GameObject is an ecs object in the game world.
 * It can be enabled or disabled.
 */
export abstract class GameObject {
    private mEnableState: GameObjectEnableState;
    private readonly mLabel: string;
    private mParent: GameObject | null;

    /**
     * Whether this game object is enabled.
     * A game object is enabled when it is enabled itself and all its parents are enabled.
     */
    public get enabled(): boolean {
        return this.mEnableState.enabled;
    }

    /**
     * Environment this game object is in.
     * A game object is in the same environment as its parent, so this gets bubbled up to the parent until it reaches the scene, which has the environment connection.
     */
    public get environment(): EnvironmentTransmission | null {
        if (!this.mParent) {
            return null;
        }
        return this.mParent.environment;
    }

    /**
     * Label of this game object.
     */
    public get label(): string {
        return this.mLabel;
    }

    /**
     * Parent of this object.
     */
    public get parent(): GameObject | null {
        return this.mParent;
    }

    /**
     * Constructor.
     * 
     * @param pLabel - Describing label of this object.
     */
    public constructor(pLabel: string) {
        this.mLabel = pLabel;
        this.mParent = null;

        // A game object is enabled by default and inherits the enabled state from its parent.
        this.mEnableState = {
            enabled: true,
            inheritedState: true,
            selfState: true
        };
    }

    /**
     * Activate this game object.
     */
    public activate(): void {
        this.changeEnableState(true, false);
    }

    /**
     * Connect this game object to the environment connection of this game object, if it exists.
     * This gets bubbled up to every child game object, so that they can also signal the environment connection.
     * When this game object is not in an environment, this does nothing.
     * 
     * @internal
     */
    public connect(): void {
        // Does nothing on game object level, but gets bubbled up to environment connection.
    }

    /**
     * Deactivates this game object.
     */
    public deactivate(): void {
        this.changeEnableState(false, false);
    }

    /**
     * Disconnect this game object from the environment connection of this game object, if it exists.
     * This gets bubbled up to every child game object, so that they can also signal the environment connection.
     * When this game object is not in an environment, this does nothing.
     * 
     * @internal
     */
    public disconnect(): void {
        // Does nothing on game object level, but gets bubbled up to environment connection.
    }

    /**
     * Changes the enable state of this game object.
     * When the enable state changes, the change gets bubbled up to the environment and down to all children.
     *
     * @param enabled - Whether this game object should be enabled.
     * @param inherited - Whether this change is from an inherited state (from parent) or from itself.
     * 
     * @returns whether the enable state of this game object changed.
     */
    protected changeEnableState(enabled: boolean, inherited: boolean): boolean {
        // Last state of this game object
        const lLastState: boolean = this.mEnableState.enabled;

        // Update inherited state when this change is from parent, otherwise keep the inherited state.
        // Update self state when this change is from itself, otherwise keep the self state.
        if (inherited) {
            this.mEnableState.inheritedState = enabled;
        } else {
            this.mEnableState.selfState = enabled;
        }

        // When the current inherited state is disabled, this game object is also disabled.
        // When the current inherited state is enabled, this game object is enabled when it is enabled itself.
        this.mEnableState.enabled = this.mEnableState.inheritedState ? this.mEnableState.selfState : false;

        return this.mEnableState.enabled !== lLastState;
    }

    /**
     * Set the parent of this game object.
     * 
     * @param pParent - Parent object.
     */
    protected setParent(pParent: GameObject | null): void {
        this.mParent = pParent;
    }
}


type GameObjectEnableState = {
    enabled: boolean;
    inheritedState: boolean;
    selfState: boolean;
};