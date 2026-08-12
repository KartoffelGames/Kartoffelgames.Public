import { Exception } from '@kartoffelgames/core';
import type { GameComponentConstructor } from './component/game-component.ts';
import type { GameEnvironment, GameEnvironmentStateChange } from './environment/game-environment.ts';

// TODO: Add a typed setting object to each system. The user can setup a system for example a AO system.
//       { AoMethod: 'SSAO' | 'HBAO' | 'SAO' }
//       Depending on that the system renders something different.
//       Other systems can request that resource, depending on if it requested by anything, it can be skipped.
//       That enables a render graph and dependency tree.

// TODO: A system should hardcoded state which resources are exposed and a condition for wich setting must be set and have which values.
//       Find a way to support numbers as well. Maybe a more general solution with states like "equal", "greaterThan"...
//       { AoTexture: condition: { AoMethod: ['SSAO', 'HBAO', 'SAO'] } }

// TODO: Find a way to use systems that support running on the same render pass. For a post pass its not necessary to open a new pass for every post stage (AO, Blur, TAA...)
//       That might be feasible with "subsystems": A system can accept subsystems that require some parameter to run (maybe the current pass, a texture or whatever).
//       So a subsystem must match some pattern. A subsystem lives inside a system and can not export resources to other system except the parent system.
//       A subsystem is append the same way as a normal system but is assigned on setup time.

/**
 * Base class for all systems in the environment.
 * Systems are responsible for processing game logic based on the state of components in the environment.
 * They can define dependencies on other systems and specify which component types they are interested in.
 *
 * On the update cycle, systems receive a list of component state changes that they can use to manage resources and optimize their processing.
 */
export abstract class GameSystem {
    private mEnabled: boolean;
    private readonly mEnvironment: GameEnvironment;
    private mInitialized: boolean;
    private readonly mLabel: string;

    /**
     * Define which systems this system depends on.
     * Override this method to return an array of system types this system depends on.
     */
    public get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [];
    }

    /**
     * Whether this system is enabled and should be executed during the frame, tick, and update cycles.
     */
    public get enabled(): boolean {
        return this.mEnabled;
    } set enabled(pValue: boolean) {
        this.mEnabled = pValue;
    }

    /**
     * Get the parent environment of this system.
     */
    public get environment(): GameEnvironment {
        return this.mEnvironment;
    }

    /**
     * Define which component types this system is interested in.
     * Override this method to return an array of component types this system handles.
     */
    public get handledComponentTypes(): Array<GameComponentConstructor> {
        return [];
    }

    /**
     * Human-readable label for this system.
     */
    public get label(): string {
        return this.mLabel;
    }

    /**
     * Constructor of the system.
     * 
     * @param pLabel - The human-readable label for this system.
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pLabel: string, pEnvironment: GameEnvironment) {
        this.mLabel = pLabel;
        this.mEnvironment = pEnvironment;

        // Default to not initialized.
        this.mInitialized = false;

        // Default to enabled.
        this.mEnabled = true;
    }

    /**
     * Call the frame hook.
     * This is called by the environment.
     *
     * @internal
     */
    public async executeFrame(): Promise<void> {
        this.lockGate();

        await this.onFrame();
    }

    /**
     * Call the tick hook.
     * This is called by the environment.
     *
     * @internal
     */
    public async executeTick(): Promise<void> {
        this.lockGate();

        await this.onTick();
    }

    /**
     * Call the update hook.
     * This is called by the environment.
     *
     * @internal
     */
    public async executeUpdate(pStateChanges: GameSystemUpdateStateChanges): Promise<void> {
        this.lockGate();

        await this.onUpdate(pStateChanges);
    }

    /**
     * Initialize the system.
     * This is called by the environment during startup.
     *
     * @internal
     */
    public async initialize(): Promise<void> {
        if (this.mInitialized) {
            throw new Exception(`System ${this.constructor.name} is already initialized.`, this);
        }

        // Set initialized flag to true.
        this.mInitialized = true;

        // Call onCreate hook.
        await this.onCreate();
    }

    /**
     * Lock the system to prevent access to dependency systems before initialization.
     */
    protected lockGate(): void {
        if (!this.mInitialized) {
            throw new Exception(`System ${this.constructor.name} is not initialized yet.`, this);
        }
    }

    /**
     * Called when the system is created and registered to the environment.
     */
    protected async onCreate(): Promise<void> {
        // Default implementation does nothing.
    }

    /**
     * Called once per frame.
     */
    protected async onFrame(): Promise<void> {
        // Default implementation does nothing.
    }

    /**
     * Called once per tick (physics tick).
     */
    protected async onTick(): Promise<void> {
        // Default implementation does nothing.
    }

    /**
     * Called once per update cycle.
     * Used for resource managements based on component state changes.
     * 
     * @param _pStateChanges - Map of component types to arrays of state changes that occurred since the last update.
     */
    protected async onUpdate(_pStateChanges: GameSystemUpdateStateChanges): Promise<void> {
        // Default implementation does nothing.
    }
}

/**
 * Type definition for the state changes passed to systems during the update cycle.
 */
export type GameSystemUpdateStateChanges = {
    /**
     * Map of component types to arrays of state changes that occurred since the last update.
     */
    componentChanges: ReadonlyMap<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>;
};

export type GameSystemConstructor<T extends GameSystem = GameSystem> = new (pEnvironment: GameEnvironment) => T;


