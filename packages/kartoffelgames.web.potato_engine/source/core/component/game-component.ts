import type { IAnyParameterConstructor } from '../../../../kartoffelgames.core/source/interface/i-constructor.ts';
import { GameObject } from '../hierarchy/game-object.ts';

// TODO: Define some decorators to allow easy saving and loading of components in binary or json files.
// TODO: Add a user defineable way to trigger update status change on components, but only send the status change a single time per update loop.

/**
 * Base class for all components in the environment.
 * Components are used to store data and state for game objects in the environment.
 * They can be enabled or disabled, which signals the environment to activate or deactivate them.
 */
export class GameComponent extends GameObject {
    /**
     * Constructor.
     * 
     * @param pLabel - Component label.
     */
    public constructor(pLabel: string) {
        super(pLabel);
    }

    /**
     * Connect this component to the environment and signal the addition.
     * 
     * @internal
     */
    public override connect(): void {
        super.connect();
        this.environment?.add(this);
    }

    /**
     * Disconnect this component from the environment and signal the removal.
     * 
     * @internal
     */
    public override disconnect(): void {
        super.disconnect();
        this.environment?.remove(this);
    }

    /**
     * Changes the enable state of this component and signals the environment on state changes.
     *
     * @param pEnabled - Whether this component should be enabled.
     * @param pInherited - Whether this change is from an inherited state.
     * 
     * @returns Whether the enable state of this component changed.
     */
    protected override changeEnableState(pEnabled: boolean, pInherited: boolean): boolean {
        const lStateChanged: boolean = super.changeEnableState(pEnabled, pInherited);

        if (lStateChanged && this.environment) {
            if (this.enabled) {
                this.environment.activate(this);
            } else {
                this.environment.deactivate(this);
            }
        }

        return lStateChanged;
    }
}

export type GameComponentConstructor<TComponent extends GameComponent = GameComponent> = IAnyParameterConstructor<TComponent>;