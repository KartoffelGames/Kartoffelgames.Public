import type { IVoidParameterConstructor } from '../../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { GameEntity } from '../hierarchy/game-entity.ts';
import { GameObject } from '../hierarchy/game-object.ts';

// TODO: Define some decorators to allow easy saving and loading of components in binary or json files.

/**
 * Base class for all components in the environment.
 * Components are used to store data and state for game objects in the environment.
 * They can be enabled or disabled, which signals the environment to activate or deactivate them.
 */
export class GameComponent extends GameObject {
    /**
     * Get the list of component types that this component depends on.
     * Override this property in subclasses to specify dependencies for a component.
     * When this component is added to a game entity, all dependencies will be automatically added if not already present.
     * 
     * @returns List of component constructor types this component depends on.
     */
    public get dependencies(): Array<GameComponentConstructor> {
        return [];
    }

    /**
     * Get the game entity that this component is attached to.
     * Alias for parent property, as components should only be added to game entities.
     * 
     * @returns The game entity that this component is attached to.
     */
    public get gameEntity(): GameEntity { 
        // We assume that the parent of a component is always a game entity, as components should only be added to game entities.
        return this.parent as GameEntity;
    }

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

    /**
     * Transmits a component activation event to the environment handler.
     *
     * @internal
     */
    protected submitUpdateRequest(): void {
        this.environment?.update(this);
    }
}

export type GameComponentConstructor<TComponent extends GameComponent = GameComponent> = IVoidParameterConstructor<TComponent>;