/**
 * A GameObject is an ecs object in the game world.
 * It can be enabled or disabled.
 */
export abstract class GameObject {
    private readonly mEnableState: GameObjectEnableState;
    private mLabel: string;
    

    /**
     * Whether this game object is enabled.
     * A game object is enabled when it is enabled itself and all its parents are enabled.
     */
    public get enabled(): boolean {
        return this.mEnableState.enabled;
    }

    /**
     * Label of this game object.
     */
    public get label(): string {
        return this.mLabel;
    } set label(pLabel: string) {
        this.mLabel = pLabel;
    }

    /**
     * Constructor.
     * 
     * @param pLabel - Describing label of this object.
     */
    public constructor(pLabel: string) {
        this.mLabel = pLabel;

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
        if(this.mEnableState.selfState) {
            return;
        }

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
        if(!this.mEnableState.selfState) {
            return;
        }

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
     * @param pEnabled - Whether this game object should be enabled.
     * @param pInherited - Whether this change is from an inherited state (from parent) or from itself.
     * 
     * @returns whether the enable state of this game object changed.
     */
    protected changeEnableState(pEnabled: boolean, pInherited: boolean): boolean {
        // Last state of this game object
        const lLastState: boolean = this.mEnableState.enabled;

        // Update inherited state when this change is from parent, otherwise keep the inherited state.
        // Update self state when this change is from itself, otherwise keep the self state.
        if (pInherited) {
            this.mEnableState.inheritedState = pEnabled;
        } else {
            this.mEnableState.selfState = pEnabled;
        }

        // When the current inherited state is disabled, this game object is also disabled.
        // When the current inherited state is enabled, this game object is enabled when it is enabled itself.
        this.mEnableState.enabled = this.mEnableState.inheritedState ? this.mEnableState.selfState : false;

        return this.mEnableState.enabled !== lLastState;
    }
}

type GameObjectEnableState = {
    enabled: boolean;
    inheritedState: boolean;
    selfState: boolean;
};