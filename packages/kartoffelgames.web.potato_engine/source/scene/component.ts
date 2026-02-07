import { IAnyParameterConstructor } from "../../../kartoffelgames.core/source/interface/i-constructor.ts";

export class Component {
    private readonly mLabel: string;
    private readonly mEnableState: ComponentEnableState;
    // TODO: Should contain a reference to the game object it is attached to

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

    public constructor(pLabel: string) {
        this.mLabel = pLabel;

        // By default, a component is enabled and inherits the enable state from its game object.
        this.mEnableState = {
            enabled: true,
            inheritedState: true,
            selfState: true
        };
    }

    public changeEnableState(enabled: boolean, inherited: boolean): void {
        enabled;
        inherited;
    }

}

type ComponentEnableState = {
    enabled: boolean;
    inheritedState: boolean;
    selfState: boolean;
};

export type GameComponentConstructor = IAnyParameterConstructor<Component>;