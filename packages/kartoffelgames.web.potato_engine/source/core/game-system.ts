import { Exception } from '@kartoffelgames/core';
import type { IAnyParameterConstructor } from '../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { GameComponentConstructor } from './component/game-component.ts';
import type { GameEnvironmentStateChange } from './environment/game-environment-transmittion.ts';

/**
 * Base class for all systems in the environment.
 * Systems are responsible for processing game logic based on the state of components in the environment.
 * They can define dependencies on other systems and specify which component types they are interested in.
 * 
 * On the update cycle, systems receive a list of component state changes that they can use to manage resources and optimize their processing.
 */
export abstract class GameSystem {
    private readonly mDependendSystems: Map<GameSystemConstructor<GameSystem>, GameSystem>;

    /**
     * Define which systems this system depends on.
     * Override this method to return an array of system types this system depends on.
     */
    public abstract readonly dependentSystemTypes: Array<GameSystemConstructor<GameSystem>>;

    /**
     * Define which component types this system is interested in.
     * Override this method to return an array of component types this system handles.
     */
    public abstract readonly handledComponentTypes: Array<GameComponentConstructor>;

    /**
     * Constructor of the system.
     */
    public constructor() {
        this.mDependendSystems = new Map<GameSystemConstructor<GameSystem>, GameSystem>();
    }

    /**
     * Call the frame hook.
     * This is called by the environment.
     *
     * @internal
     */
    public async executeFrame(): Promise<void> {
        await this.onFrame();
    }

    /**
     * Call the tick hook.
     * This is called by the environment.
     *
     * @internal
     */
    public async executeTick(): Promise<void> {
        await this.onTick();
    }

    /**
     * Call the update hook.
     * This is called by the environment.
     *
     * @internal
     */
    public async executeUpdate(pStateChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>): Promise<void> {
        await this.onUpdate(pStateChanges);
    }

    /**
     * Initialize the system with the interested component types.
     * This is called by the environment during registration.
     *
     * @internal
     */
    public initialize(pDependendSystems: Array<GameSystem>): void {
        // Store dependent systems in a map.
        for (const lSystem of pDependendSystems) {
            this.mDependendSystems.set(lSystem.constructor as GameSystemConstructor<GameSystem>, lSystem);
        }

        // Call onCreate hook.
        this.onCreate();
    }

    /**
     * Get a dependency system by its type.
     * The requested system must be registered as a dependency of this system, otherwise an exception is thrown.
     * 
     * @param pSystemType - Type of the system marked as dependency.
     * 
     * @returns The instance of the requested system.
     */
    protected getDependency<T extends GameSystem>(pSystemType: GameSystemConstructor<T>): T {
        // Check if the requested system is registered as a dependency of this system.
        const lSystem = this.mDependendSystems.get(pSystemType);
        if (!lSystem) {
            throw new Exception(`System of type ${pSystemType.name} is not registered as a dependency.`, this);
        }

        return lSystem as T;
    }

    /**
     * Called when the system is created and registered to the environment.
     */
    protected abstract onCreate(): void;

    /**
     * Called once per frame.
     */
    protected abstract onFrame(): Promise<void>;

    /**
     * Called once per tick (physics tick).
     */
    protected abstract onTick(): Promise<void>;

    /**
     * Called once per update cycle.
     * Used for resource managements based on component state changes.
     */
    protected abstract onUpdate(pStateChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>): Promise<void>;
}

type GameSystemConstructor<T extends GameSystem = GameSystem> = IAnyParameterConstructor<T>;