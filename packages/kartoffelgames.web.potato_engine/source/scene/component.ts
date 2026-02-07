import { IAnyParameterConstructor } from "../../../kartoffelgames.core/source/interface/i-constructor.ts";
import { GameObject } from "./game-object.ts";

export class Component {
    private readonly mLabel: string;
    private readonly mEnableState: ComponentEnableState;
    private readonly mGameObject: GameObject;

    /**     
     * Whether this component is enabled.
     * A component is enabled when it is enabled itself and all its parents game objects are enabled.
     */
    public get enabled(): boolean {
        return this.mEnableState.enabled;
    }

    /**
     * Label of this component.
     */
    public get label(): string {
        return this.mLabel;
    }

    public constructor(pLabel: string, pGameObject: GameObject) {
        this.mLabel = pLabel;
        this.mGameObject = pGameObject;

        // By default, a component is enabled and inherits the enable state from its game object.
        this.mEnableState = {
            enabled: true,
            inheritedState: true,
            selfState: true
        };
    }

    /**
     * Changes the enable state of this component.
     * When the enable state changes, it gets updated based on inherited and self state.
     *
     * @param pEnabled - Whether this component should be enabled.
     * @param pInherited - Whether this change is from an inherited state (from parent) or from itself.
     */
    public changeEnableState(pEnabled: boolean, pInherited: boolean): void {
        // Last state of this component
        const lLastState: boolean = this.mEnableState.enabled;

        // Update inherited state when this change is from parent, otherwise keep the inherited state.
        // Update self state when this change is from itself, otherwise keep the self state.
        if (pInherited) {
            this.mEnableState.inheritedState = pEnabled;
        } else {
            this.mEnableState.selfState = pEnabled;
        }

        // When the current inherited state is disabled, this component is also disabled.
        // When the current inherited state is enabled, this component is enabled when it is enabled itself.
        this.mEnableState.enabled = this.mEnableState.inheritedState ? this.mEnableState.selfState : false;

        // If the enable state has changed, push the change to the game object.
        if (lLastState !== this.mEnableState.enabled) {
            this.mGameObject.pushChangeState(this, this.mEnableState.enabled ? 'activate' : 'deactivate');
        }
    }

}

type ComponentEnableState = {
    enabled: boolean;
    inheritedState: boolean;
    selfState: boolean;
};

export type GameComponentConstructor = IAnyParameterConstructor<Component>;