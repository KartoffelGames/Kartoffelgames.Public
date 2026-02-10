import { Exception } from '@kartoffelgames/core';
import type { IAnyParameterConstructor } from '../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { ComponentConstructor } from './component.ts';
import type { EnvironmentStateChange } from './environment-transmittion.ts';

// TODO: InitComponent() - Initializes components data somehow. Maybe with a init method of the component itself?

export abstract class System {
    private readonly mDependendSystems: Map<SystemConstructor<System>, System>;

    /**
     * Define which systems this system depends on.
     * Override this method to return an array of system types this system depends on.
     */
    public abstract readonly dependentSystemTypes: Array<SystemConstructor<System>>;

    /**
     * Define which component types this system is interested in.
     * Override this method to return an array of component types this system handles.
     */
    public abstract readonly handledComponentTypes: Array<ComponentConstructor>;

    /**
     * Constructor of the system.
     */
    public constructor() {
        this.mDependendSystems = new Map<SystemConstructor<System>, System>();
    }

    /**
     * Call the frame hook.
     * This is called by the environment.
     *
     * @internal
     */
    public executeFrame(): void {
        this.onFrame();
    }

    /**
     * Call the tick hook.
     * This is called by the environment.
     *
     * @internal
     */
    public executeTick(): void {
        this.onTick();
    }

    /**
     * Call the update hook.
     * This is called by the environment.
     *
     * @internal
     */
    public executeUpdate(pStateChanges: Map<ComponentConstructor, ReadonlyArray<EnvironmentStateChange>>): void {
        this.onUpdate(pStateChanges);
    }

    /**
     * Initialize the system with the interested component types.
     * This is called by the environment during registration.
     *
     * @internal
     */
    public initialize(pDependendSystems: Array<System>): void {
        // Store dependent systems in a map.
        for (const lSystem of pDependendSystems) {
            this.mDependendSystems.set(lSystem.constructor as SystemConstructor<System>, lSystem);
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
    protected getDependency<T extends System>(pSystemType: SystemConstructor<T>): T {
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
    protected abstract onFrame(): void;

    /**
     * Called once per tick (physics tick).
     */
    protected abstract onTick(): void;

    /**
     * Called once per update cycle.
     * Used for resource managements based on component state changes.
     */
    protected abstract onUpdate(pStateChanges: Map<ComponentConstructor, ReadonlyArray<EnvironmentStateChange>>): void;
}

type SystemConstructor<T extends System> = IAnyParameterConstructor<T>;