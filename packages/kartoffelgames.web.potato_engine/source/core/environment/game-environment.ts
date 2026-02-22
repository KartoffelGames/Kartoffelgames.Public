import { Exception } from '@kartoffelgames/core';
import type { GameComponent, GameComponentConstructor } from '../component/game-component.ts';
import type { GameScene } from '../game-scene.ts';
import type { GameSystem, GameSystemConstructor } from '../game-system.ts';
import { type GameEnvironmentStateType, GameEnvironmentTransmission } from './game-environment-transmittion.ts';

/**
 * Main hub for managing the game environment, including loaded scenes, registered systems, and processing component state changes.
 */
export class GameEnvironment {
    private static readonly TIMING_HISTORY_SIZE: number = 200;

    private mCurrentTick: number;
    private readonly mDebugData: GameEnvironmentDebugData;
    private readonly mDebugOptions: Required<GameEnvironmentDebugOptions>;
    private readonly mLoadedScenes: Set<GameScene>;
    private mStateChangeQueue: Array<GameEnvironmentStateChange>;
    private readonly mSystems: Array<GameSystem>;
    
    /**
     * Debug data for the environment, including timing snapshots. Only filled when debugSystemTime is enabled.
     */
    public get debugData(): GameEnvironmentDebugData {
        return this.mDebugData;
    }

    /**
     * All loaded scenes in this environment.
     */
    public get loadedScenes(): ReadonlySet<GameScene> {
        return this.mLoadedScenes;
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
    public constructor(pParameters?: GameEnvironmentDebugOptions) {
        this.mLoadedScenes = new Set<GameScene>();
        this.mStateChangeQueue = new Array<GameEnvironmentStateChange>();
        this.mSystems = new Array<GameSystem>();
        this.mCurrentTick = 0;

        // Save debug options with defaults.
        this.mDebugOptions = {
            debugLog: pParameters?.debugLog ?? false,
            debugSystemTime: pParameters?.debugSystemTime ?? false
        };

        // Setup debug data. Even when debug options are disabled.
        this.mDebugData = {
            timingHistory: new Array<GameEnvironmentTimingSnapshot>(),
            onStateChange: null
        };
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
        if (pSnapshot) {
            // Timed loop. Kept separate from the untimed loop below
            // for performance reasons: avoids a debug check per system iteration.
            for (const lSystem of this.mSystems) {
                const lSystemName: string = lSystem.label;
                const lStart: number = performance.now();

                await lSystem.executeFrame();

                const lDuration: number = performance.now() - lStart;
                const lEntry: GameEnvironmentTimingEntry = pSnapshot.systems.get(lSystemName) ?? { update: 0, frame: 0, tick: 0 };
                lEntry.frame = lDuration;
                pSnapshot.systems.set(lSystemName, lEntry);
            }
        } else {
            for (const lSystem of this.mSystems) {
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
        if (pSnapshot) {
            // Timed loop. Kept separate from the untimed loop below
            // for performance reasons: avoids a debug check per system iteration.
            for (const lSystem of this.mSystems) {
                const lSystemName: string = lSystem.label;
                const lStart: number = performance.now();

                await lSystem.executeTick();

                const lDuration: number = performance.now() - lStart;
                const lEntry: GameEnvironmentTimingEntry = pSnapshot.systems.get(lSystemName) ?? { update: 0, frame: 0, tick: 0 };
                lEntry.tick = lDuration;
                pSnapshot.systems.set(lSystemName, lEntry);
            }
        } else {
            for (const lSystem of this.mSystems) {
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
        const lConstructorChangeStateQueue: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>> = this.optimizeStateChangeQueue();

        // Clear the original queue. Splice is half as fast as setting length to 0.
        this.mStateChangeQueue = new Array<GameEnvironmentStateChange>();

        if (pSnapshot) {
            // Timed loop. Kept separate from the untimed loop below
            // for performance reasons: avoids a debug check per system iteration.
            for (const lSystem of this.mSystems) {
                const lHandledChanges = new Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>();

                if (lSystem.handledComponentTypes) {
                    for (const lComponentType of lSystem.handledComponentTypes) {
                        lHandledChanges.set(lComponentType, lConstructorChangeStateQueue.get(lComponentType) ?? []);
                    }
                }

                const lSystemName: string = lSystem.label;
                const lStart: number = performance.now();

                await lSystem.executeUpdate(lHandledChanges);

                const lDuration: number = performance.now() - lStart;
                const lEntry: GameEnvironmentTimingEntry = pSnapshot.systems.get(lSystemName) ?? { update: 0, frame: 0, tick: 0 };
                lEntry.update = lDuration;
                pSnapshot.systems.set(lSystemName, lEntry);
            }
        } else {
            for (const lSystem of this.mSystems) {
                const lHandledChanges = new Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>();

                if (lSystem.handledComponentTypes) {
                    for (const lComponentType of lSystem.handledComponentTypes) {
                        lHandledChanges.set(lComponentType, lConstructorChangeStateQueue.get(lComponentType) ?? []);
                    }
                }

                await lSystem.executeUpdate(lHandledChanges);
            }
        }
    }

    /**
     * Get a registered system by its type.
     *
     * @param pSystemType - The constructor of the system type to retrieve.
     * 
     * @return The instance of the requested system type.
     */
    public getSystem<T extends GameSystem>(pSystemType: GameSystemConstructor<T>): T {
        const lSystem = this.mSystems.find((pSystemInstance) => {
            return pSystemInstance.constructor === pSystemType;
        });

        if (!lSystem) {
            throw new Exception(`System ${pSystemType.name} is not registered.`, this);
        }

        return lSystem as T;
    }

    /**
     * Load a scene into the environment.
     * This establishes the environment connection for all game objects in the scene,
     * allowing them to transmit component state changes.
     *
     * @param pScene - The scene to load
     */
    public loadScene(pScene: GameScene): void {
        // Mark scene as loaded
        this.mLoadedScenes.add(pScene);

        // Create a transmission object that queues state changes
        const lTransmission = new GameEnvironmentTransmission(this, (pType: GameEnvironmentStateType, pComponent: GameComponent) => {
            this.queueStateChange(pType, pComponent);
        });

        // Establish environment connection for all root game objects in the scene
        pScene.setEnvironmentConnection(lTransmission);
    }

    /**
     * Queue a component state change to be processed in the next update cycle.
     *
     * @param pType - The type of state change.
     * @param pComponent - The component involved in the state change.
     */
    public queueStateChange(pType: GameEnvironmentStateType, pComponent: GameComponent): void {
        const lStateChange: GameEnvironmentStateChange = {
            type: pType,
            component: pComponent,
            tick: this.mCurrentTick
        };

        this.mStateChangeQueue.push(lStateChange);

        // Call debug sniffer callback if set.
        if (this.mDebugData.onStateChange) {
            this.mDebugData.onStateChange(pType, pComponent);
        }

        if (this.mDebugOptions.debugLog) {
            const lEntityLabel: string = pComponent.gameEntity?.label ?? 'standalone';

            // eslint-disable-next-line no-console
            console.log(`Queued state change: "${pType}" for component "${pComponent.label}" of "${lEntityLabel}"`);
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

            // TODO: Needs some testing.
            // Wait for the next frame to complete.
            await new Promise(pResolve => requestAnimationFrame(pResolve));
        }
    }

    /**
     * Unload a scene from the environment.
     * All components from the scene will be removed from tracking by systems.
     *
     * @param pScene - The scene to unload
     */
    public unloadScene(pScene: GameScene): void {
        // Disconnect environment connection for all root game objects in the scene
        pScene.setEnvironmentConnection(null);

        // Mark scene as unloaded
        this.mLoadedScenes.delete(pScene);
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
        for (const lStateChange of this.mStateChangeQueue) {
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
    debugLog?: boolean;
    debugSystemTime?: boolean;
};

export type GameEnvironmentDebugData = {
    readonly timingHistory: Array<GameEnvironmentTimingSnapshot>;
    onStateChange: ((pType: GameEnvironmentStateType, pComponent: GameComponent) => void) | null;
};