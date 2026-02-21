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
    private mGameEntity: GameEntity | null;

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
        return this.mGameEntity!; // lets assume this is always set, as components should only be added to game entities and the parent should be set in the addComponent method of GameEntity.
    }

    /**
     * Constructor.
     * 
     * @param pLabel - Component label.
     * @param pGameEntity - The game entity this component is attached to.
     */
    public constructor(pLabel: string) {
        super(pLabel);

        // Initialy not set.
        this.mGameEntity = null;
    }

    /**
     * Connect this component to the environment and signal the addition.
     * 
     * @internal
     */
    public override connect(): void {
        super.connect();

        this.gameEntity.sendComponentChangeEvent('add', this);
    }

    /**
     * Disconnect this component from the environment and signal the removal.
     * 
     * @internal
     */
    public override disconnect(): void {
        super.disconnect();
        this.gameEntity.sendComponentChangeEvent('remove', this);
    }

    /**
     * Set the parent of this component to the given game entity.
     * 
     * @param pParent - Parent game entity.
     */
    public setParent(pParent: GameEntity): void {
        this.mGameEntity = pParent;
    }

    /**
     * Transmits a component update event to the environment handler.
     *
     * @internal
     */
    public update(): void {
        this.gameEntity.sendComponentChangeEvent('update', this);
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

        if (lStateChanged) {
            if (this.enabled) {
                this.gameEntity.sendComponentChangeEvent('activate', this);
            } else {
                this.gameEntity.sendComponentChangeEvent('deactivate', this);
            }
        }

        return lStateChanged;
    }
}

export type GameComponentConstructor<TComponent extends GameComponent = GameComponent> = IVoidParameterConstructor<TComponent>;