import { Exception } from '@kartoffelgames/core';
import type { FileSystem } from '@kartoffelgames/web-file-system';
import type { GameComponent, GameComponentConstructor } from '../component/game-component.ts';
import type { GameSystem, GameSystemConstructor, GameSystemUpdateStateChanges } from '../game-system.ts';
import { GameObject } from '../hierarchy/game-object.ts';
import { type GameEnvironmentStateType, GameEnvironmentEventTransmission } from './game-environment-event-transmittion.ts';

/**
 * Main hub for managing the game environment, including loaded scenes, registered systems, and processing component state changes.
 */
export class GameEnvironment extends GameObject {
    private static readonly TIMING_HISTORY_SIZE: number = 200;

    private mCurrentTick: number;
    private readonly mDebugData: GameEnvironmentDebugData;
    private readonly mDebugOptions: Required<GameEnvironmentDebugOptions>;
    private readonly mEventTransmission: GameEnvironmentEventTransmission;
    private readonly mFileSystem: FileSystem;
    private readonly mStateChangeQueue: GameEnvironmentStateChangeQueue;
    private readonly mSystems: Array<GameSystem>;

    /**
     * Debug data for the environment, including timing snapshots. Only filled when debugSystemTime is enabled.
     */
    public get debugData(): GameEnvironmentDebugData {
        return this.mDebugData;
    }

    /**
     * The environment connection of this scene.
     */
    public override get environment(): GameEnvironment | null {
        return this;
    }

    public get events(): GameEnvironmentEventTransmission {
        return this.mEventTransmission;
    }

    /**
     * File system for loading assets and resources.
     */
    public get fileSystem(): FileSystem {
        return this.mFileSystem;
    }

    /**
     * All registered systems in this environment.
     */
    public get systems(): ReadonlyArray<GameSystem> {
        return this.mSystems;
    }

    /**
     * Current tick of the environment, updated on each frame and provided to the transmission tick handler.
     */
    public get tick(): number {
        return this.mCurrentTick;
    }

    /**
     * Constructor.
     */
    public constructor(pFileSystem: FileSystem) {
        super();

        this.mSystems = new Array<GameSystem>();
        this.mCurrentTick = 0;
        this.mStateChangeQueue = {
            component: new Array<GameEnvironmentStateChange>()
        };

        // Set environment file system.
        // This is used for loading assets and can be accessed by systems and components through the environment.
        this.mFileSystem = pFileSystem;

        // Create debug options with disabled defaults.
        this.mDebugOptions = {
            debugSystemTime: false,
            debugStateChanges: false
        };

        // Setup debug data. Even when debug options are disabled.
        this.mDebugData = new GameEnvironmentDebugData();

        // Setup event transmission.
        this.mEventTransmission = new GameEnvironmentEventTransmission(this, (pType: GameEnvironmentStateType, pComponent: GameComponent) => {
            this.queueComponentStateChange(pType, pComponent);
        });
    }

    /**
     * Enable a debug option at runtime.
     * This allows for toggling certain debug features on and off.
     * 
     * @param pOption - Debug options name.
     */
    public enableDebugOption(pOption: keyof GameEnvironmentDebugOptions, pState: boolean = true): void {
        this.mDebugOptions[pOption] = pState;
    }

    /**
     * Execute the frame cycle for all systems.
     * This should be called once per frame.
     *
     * @param pSnapshot - Optional timing snapshot. When provided, each system's frame time is measured and recorded.
     *
     * @internal
     */
    public async executeFrame(pSnapshot: GameEnvironmentTimingSnapshot | null): Promise<void> {
        // Timed loop. Kept separate from the untimed loop below
        // for performance reasons: avoids a debug check per system iteration.
        if (pSnapshot) {
            for (const lSystem of this.mSystems) {
                // Start timer, execute frame, and record duration.
                const lStart: number = performance.now();

                // Skipping disabled systems.
                if (lSystem.enabled) {
                    await lSystem.executeFrame();
                }

                // Record duration even for disabled systems to provide insight into how long they would take if enabled.
                const lDuration: number = performance.now() - lStart;

                // Read system name from label.
                const lSystemName: string = lSystem.label;

                // Get existing entry for this system or create a new one if it doesn't exist.
                const lEntry: GameEnvironmentTimingEntry = pSnapshot.systems.get(lSystemName) ?? { update: 0, frame: 0, tick: 0 };
                lEntry.frame = lDuration;

                // Save entry back to snapshot.
                pSnapshot.systems.set(lSystemName, lEntry);
            }
        } else {
            for (const lSystem of this.mSystems) {
                // Skipping disabled systems.
                if (!lSystem.enabled) {
                    continue;
                }

                await lSystem.executeFrame();
            }
        }
    }

    /**
     * Execute the tick cycle for all systems.
     * This should be called at a fixed timestep for physics.
     *
     * @param pSnapshot - Optional timing snapshot. When provided, each system's tick time is measured and recorded.
     *
     * @internal
     */
    public async executeTick(pSnapshot: GameEnvironmentTimingSnapshot | null): Promise<void> {
        // Timed loop. Kept separate from the untimed loop below
        // for performance reasons: avoids a debug check per system iteration.
        if (pSnapshot) {
            for (const lSystem of this.mSystems) {
                // Start timer, execute tick, and record duration.
                const lStart: number = performance.now();

                // Skipping disabled systems.
                if (lSystem.enabled) {
                    await lSystem.executeTick();
                }

                // Record duration even for disabled systems to provide insight into how long they would take if enabled.
                const lDuration: number = performance.now() - lStart;

                // Read system name from label.
                const lSystemName: string = lSystem.label;

                // Get existing entry for this system or create a new one if it doesn't exist.
                const lEntry: GameEnvironmentTimingEntry = pSnapshot.systems.get(lSystemName) ?? { update: 0, frame: 0, tick: 0 };
                lEntry.tick = lDuration;

                // Save entry back to snapshot.
                pSnapshot.systems.set(lSystemName, lEntry);
            }
        } else {
            for (const lSystem of this.mSystems) {
                // Skipping disabled systems.
                if (!lSystem.enabled) {
                    continue;
                }

                await lSystem.executeTick();
            }
        }
    }

    /**
     * Execute the update cycle for all systems.
     * This should be called once per frame.
     *
     * @param pSnapshot - Optional timing snapshot. When provided, each system's update time is measured and recorded.
     *
     * @internal
     */
    public async executeUpdate(pSnapshot: GameEnvironmentTimingSnapshot | null): Promise<void> {
        // Optimize and order the state change queue
        const lChangeState: GameSystemUpdateStateChanges = {
            componentChanges: this.optimizeStateChangeQueue()
        };

        // Clear the original queue. Creating a new array is the fastest way to clear an array in JavaScript.
        this.mStateChangeQueue.component = new Array<GameEnvironmentStateChange>();

        // "Convert" component changes into a writable map.
        const lComponentChanges: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>> = lChangeState.componentChanges as Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>;

        // Timed loop. Kept separate from the untimed loop below
        // for performance reasons: avoids a debug check per system iteration.
        if (pSnapshot) {
            for (const lSystem of this.mSystems) {
                // Start timer, execute update, and record duration.
                const lStart: number = performance.now();

                // Skipping disabled systems.
                if (lSystem.enabled) {
                    // Checking for handled component types is an optional optimization for systems that don't care about state changes.
                    if (lSystem.handledComponentTypes) {
                        // Extend state change queue with empty arrays for all handled component types to avoid undefined checks in systems.
                        for (const lComponentType of lSystem.handledComponentTypes) {
                            if (!lComponentChanges.has(lComponentType)) {
                                lComponentChanges.set(lComponentType, []);
                            }
                        }
                    }

                    await lSystem.executeUpdate(lChangeState);
                }

                // Record duration even for disabled systems to provide insight into how long they would take if enabled.
                const lDuration: number = performance.now() - lStart;

                // Read system name from label.
                const lSystemName: string = lSystem.label;

                // Get existing entry for this system or create a new one if it doesn't exist.
                const lEntry: GameEnvironmentTimingEntry = pSnapshot.systems.get(lSystemName) ?? { update: 0, frame: 0, tick: 0 };
                lEntry.update = lDuration;

                // Save entry back to snapshot.
                pSnapshot.systems.set(lSystemName, lEntry);
            }
        } else {
            for (const lSystem of this.mSystems) {
                // Skipping disabled systems.
                if (!lSystem.enabled) {
                    continue;
                }

                // Checking for handled component types is an optional optimization for systems that don't care about state changes.
                if (lSystem.handledComponentTypes) {
                    // Extend state change queue with empty arrays for all handled component types to avoid undefined checks in systems.
                    for (const lComponentType of lSystem.handledComponentTypes) {
                        if (!lComponentChanges.has(lComponentType)) {
                            lComponentChanges.set(lComponentType, []);
                        }
                    }
                }

                await lSystem.executeUpdate(lChangeState);
            }
        }
    }

    /**
     * Get a registered system by its type.
     * This should not be called on lifecycle-critical paths since it performs a search through the registered systems.
     *
     * @param pSystemType - The constructor of the system type to retrieve.
     * 
     * @return The instance of the requested system type.
     */
    public getSystem<T extends GameSystem>(pSystemType: GameSystemConstructor<T>): T {
        // Find the instance of the system type.
        for (const lSystem of this.mSystems) {
            if (lSystem.constructor === pSystemType) {
                return lSystem as T;
            }
        }

        throw new Exception(`System ${pSystemType.name} is not registered.`, this);
    }

    /**
     * Queue a component state change to be processed in the next update cycle.
     *
     * @param pType - The type of state change.
     * @param pComponent - The component involved in the state change.
     */
    public queueComponentStateChange(pType: GameEnvironmentStateType, pComponent: GameComponent): void {
        const lStateChange: GameEnvironmentStateChange = {
            type: pType,
            component: pComponent,
            tick: this.mCurrentTick
        };

        this.mStateChangeQueue.component.push(lStateChange);

        // Call debug sniffer if set.
        if (this.mDebugOptions.debugStateChanges) {
            this.mDebugData.executeStateChangeListeners(lStateChange);
        }
    }

    /**
     * Register a system with the environment.
     * The system will be initialized and notified of component state changes.
     *
     * @param pSystem - The system to register
     */
    public registerSystem<T extends GameSystem>(pSystem: GameSystemConstructor<T>): T {
        // Create an instance of the system
        const lSystem = new pSystem(this);

        // Read dependencies of system and find the instance of each dependent system type.
        for (const lSystemType of lSystem.dependentSystemTypes) {
            // Find the instance of the dependent system type.
            const lHasDependentSystem: boolean = !!this.mSystems.find((pSystemInstance) => {
                return pSystemInstance.constructor === lSystemType;
            });

            // If the dependent system is found, continue to the next dependency.
            if (lHasDependentSystem) {
                continue;
            }

            // If the dependent system is not found, create an instance of the dependent system type and register it.
            this.registerSystem(lSystemType);
        }

        // Add system to list
        this.mSystems.push(lSystem);

        // Return the instance of the system
        return lSystem;
    }

    /**
     * Start the game environment, beginning the main loop and processing ticks and updates.
     */
    public async start(): Promise<void> {
        // Initialize all systems before starting the main loop.
        for (const lSystem of this.mSystems) {
            // Initialize system.
            await lSystem.initialize();
        }

        while (true) {
            // Calculate delta time
            // const lDeltaTime = lTick - this.mCurrentTick;

            // Update tick.
            this.mCurrentTick = Date.now();

            // Timed execution: measure each system's update/frame/tick time.
            let lSnapshot: GameEnvironmentTimingSnapshot | null = null;
            if (this.mDebugOptions.debugSystemTime) {
                lSnapshot = {
                    totalFrameTime: 0,
                    systems: new Map<string, GameEnvironmentTimingEntry>(),
                    timestamp: performance.now()
                };
            }

            // Execute update with state changes from the last frame.
            await this.executeUpdate(lSnapshot);

            // Execute frame after update to ensure systems have the latest component state changes.
            await this.executeFrame(lSnapshot);

            // Execute fixed. // TODO: Maybe use another shit to do this...
            await this.executeTick(lSnapshot);

            // Save the possible snapshot.
            if (lSnapshot) {
                lSnapshot.totalFrameTime = performance.now() - lSnapshot.timestamp;

                // Add snapshot to rolling history.
                this.mDebugData.timingHistory.push(lSnapshot);
                if (this.mDebugData.timingHistory.length > GameEnvironment.TIMING_HISTORY_SIZE) {
                    this.mDebugData.timingHistory.shift();
                }
            }

            // Wait for the next frame to complete.
            await new Promise(pResolve => requestAnimationFrame(pResolve));
        }
    }

    /**
     * Optimizes the state change queue by consolidating redundant state changes.
     * Update events are always included unless the component is being removed.
     *
     * @returns Optimized array of state changes to process.
     *
     * @internal
     */
    private optimizeStateChangeQueue(): Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>> {
        // Track final lifecycle state and update status for each component
        const lComponentStates: Map<GameComponentConstructor, Array<GameEnvironmentStateChange>> = new Map<GameComponentConstructor, Array<GameEnvironmentStateChange>>();

        // Process each state change in order to determine final state
        for (const lStateChange of this.mStateChangeQueue.component) {
            const lComponent = lStateChange.component;
            const lComponentType = lComponent.constructor as GameComponentConstructor;

            // Initialize tracking state if needed
            if (!lComponentStates.has(lComponentType)) {
                lComponentStates.set(lComponentType, new Array<GameEnvironmentStateChange>());
            }

            const lComponentStateList: Array<GameEnvironmentStateChange> = lComponentStates.get(lComponentType)!;

            // Add the new state change to the list for this component type
            lComponentStateList.push(lStateChange);
        }

        return lComponentStates;
    }
}

/**
 * Debug data and listeners for the game environment.
 */
class GameEnvironmentDebugData {
    private readonly mStateChangeListener: Array<GameEnvironmentDebugOptionsStateChangeListener>;
    private readonly mTimingHistory: Array<GameEnvironmentTimingSnapshot>;

    /**
     * History of timing snapshots for all systems in the environment. Only populated when debugSystemTime is enabled.
     */
    public get timingHistory(): Array<GameEnvironmentTimingSnapshot> {
        return this.mTimingHistory;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTimingHistory = new Array<GameEnvironmentTimingSnapshot>();
        this.mStateChangeListener = new Array<GameEnvironmentDebugOptionsStateChangeListener>();
    }

    /**
     * Registers a listener function to be called whenever a component state change occurs in the environment.
     * 
     * @param pListener - The function to call when a state change occurs. Receives the state change event as an argument. 
     */
    public addStateChangeListener(pListener: GameEnvironmentDebugOptionsStateChangeListener): void {
        this.mStateChangeListener.push(pListener);
    }

    /**
     * Executes all registered state change listeners with the provided event.
     *
     * @param pEvent - The state change event to pass to listeners.
     * 
     * @internal
     */
    public executeStateChangeListeners(pEvent: GameEnvironmentStateChange): void {
        for (const lListener of this.mStateChangeListener) {
            lListener(pEvent);
        }
    }
}

export type GameEnvironmentDebugOptionsStateChangeListener = (pEvent: GameEnvironmentStateChange) => void;

/**
 * Base structure for all environment state change events.
 */
export type GameEnvironmentStateChange = {
    /**
     * The type of state change that occurred.
     */
    type: GameEnvironmentStateType;

    /**
     * The component involved in the state change.
     */
    component: GameComponent;

    /**
     * The tick at which the state change occurred, provided by the tick handler.
     */
    tick: number;
};

type GameEnvironmentStateChangeQueue = {
    component: Array<GameEnvironmentStateChange>;
};

/**
 * Timing data for a single system, recording how long each phase took.
 */
export type GameEnvironmentTimingEntry = {
    update: number;
    frame: number;
    tick: number;
};

/**
 * Debug timing data for all systems in the environment.
 */
export type GameEnvironmentTimingSnapshot = {
    /** Total frame time (update + frame + tick combined) in ms. */
    totalFrameTime: number;
    /** Per-system timing data keyed by system constructor name. */
    systems: Map<string, GameEnvironmentTimingEntry>;
    /** Timestamp of this snapshot. */
    timestamp: number;
};

export type GameEnvironmentDebugOptions = {
    debugSystemTime?: boolean;
    debugStateChanges?: boolean;
};
