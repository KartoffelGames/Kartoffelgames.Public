import { EnvironmentStateChange, EnvironmentTransmission } from "./environment-transmittion.ts";
import { Component } from "./component.ts";
import { Scene } from "./scene.ts";
import { System } from "./system.ts";

export class Environment {
    private readonly mSystems: Array<System> = new Array<System>();
    private readonly mStateChangeQueue: Array<EnvironmentStateChange> = new Array<EnvironmentStateChange>();
    private readonly mLoadedScenes: Set<Scene> = new Set();

    /**
     * Register a system with the environment.
     * The system will be initialized and notified of component state changes.
     *
     * @param system - The system to register
     */
    public registerSystem(system: System): void {
        // TODO: Check dependencies of system and provide the instance to the system.

        // TODO: Register system as a component initializer if it has set any.

        // Add system to list
        this.mSystems.push(system);
    }

    /**
     * Load a scene into the environment.
     * This establishes the environment connection for all game objects in the scene,
     * allowing them to transmit component state changes.
     *
     * @param pScene - The scene to load
     */
    public loadScene(pScene: Scene): void {
        // Mark scene as loaded
        this.mLoadedScenes.add(pScene);

        // Create a transmission object that queues state changes
        const lTransmission = new EnvironmentTransmission((pStateChange: EnvironmentStateChange) => {
            this.mStateChangeQueue.push(pStateChange);
        });

        // Establish environment connection for all root game objects in the scene
        for (const lGameObject of pScene.gameObjects) {
            lGameObject.establishEnvironmentConnection(lTransmission);
        }

        // TODO: Need to trigger an add event for all components. Somehow?
    }

    /**
     * Unload a scene from the environment.
     * All components from the scene will be removed from tracking by systems.
     *
     * @param pScene - The scene to unload
     */
    public unloadScene(pScene: Scene): void {
        // Mark scene as unloaded
        this.mLoadedScenes.delete(pScene);

        // TODO: Remove all game objects and components from this scene from system tracking
        // TODO: Maybe disable them first and then remove them in a unpriorized way: Different list, that gets processed some time later?
    }

    /**
     * Process all queued state changes and notify systems.
     * Call this once per update cycle before calling executeUpdate.
     *
     * @internal
     */
    public processStateChanges(): void {
        // Optimize and order the state change queue
        const lOptimizedQueue = this.optimizeStateChangeQueue();

        // Clear the original queue. Splice is half as fast as setting length to 0.
        this.mStateChangeQueue.length = 0;

        // Notify all systems about optimized state changes
        for (const lStateChange of lOptimizedQueue) {
            for (const lSystem of this.mSystems) {
                lSystem.handleStateChange(lStateChange);
            }
        }
    }

    /**
     * Optimizes the state change queue by consolidating redundant state changes.
     * Reduces event notifications based on the following rules:
     * - add + activate = send only add
     * - deactivate + remove = send only remove
     * - add + remove = send no events
     * - activate + deactivate = send no events
     * - deactivate + activate = send no events
     *
     * Update events are always included unless the component is being removed.
     *
     * @returns Optimized array of state changes to process.
     *
     * @internal
     */
    private optimizeStateChangeQueue(): Array<EnvironmentStateChange> {
        // Track final lifecycle state and update status for each component
        const lComponentStates = new Map<Component, {
            lifecycleState: 'add' | 'remove' | 'activate' | 'deactivate' | null;
            hasUpdate: boolean;
        }>();

        // Process each state change in order to determine final state
        for (const lStateChange of this.mStateChangeQueue) {
            const lComponent = lStateChange.component;

            // Initialize tracking state if needed
            if (!lComponentStates.has(lComponent)) {
                lComponentStates.set(lComponent, {
                    lifecycleState: null,
                    hasUpdate: false
                });
            }

            const lState = lComponentStates.get(lComponent)!;

            // Update state based on new event and current state
            switch (lStateChange.type) {
                case 'add': {
                    lState.lifecycleState = 'add';
                    break;
                }
                case 'remove': {
                    if (lState.lifecycleState === 'add') {
                        // Rule: add + remove = send no events
                        lState.lifecycleState = null;
                    } else {
                        // Rule: deactivate + remove = send only remove
                        lState.lifecycleState = 'remove';
                    }
                    break;
                }
                case 'activate': {
                    if (lState.lifecycleState === 'add') {
                        // Rule: add + activate = send only add, suppress activate
                        // State remains 'add'
                    } else if (lState.lifecycleState === 'deactivate') {
                        // Rule: deactivate + activate = send no events
                        lState.lifecycleState = null;
                    } else {
                        lState.lifecycleState = 'activate';
                    }
                    break;
                }
                case 'deactivate': {
                    if (lState.lifecycleState === 'activate') {
                        // Rule: activate + deactivate = send no events
                        lState.lifecycleState = null;
                    } else if (lState.lifecycleState !== 'add') {
                        // Only set deactivate if not just added
                        lState.lifecycleState = 'deactivate';
                    }
                    break;
                }
                case 'update': {
                    // Track that an update occurred
                    lState.hasUpdate = true;
                    break;
                }
            }
        }

        // Rebuild queue with only optimized state changes
        const lOptimizedQueue: Array<EnvironmentStateChange> = [];

        for (const [lComponent, lState] of lComponentStates) {
            // Add lifecycle state change if present
            if (lState.lifecycleState !== null) {
                lOptimizedQueue.push({
                    type: lState.lifecycleState,
                    component: lComponent
                });
            }

            // Add update event if there were updates and component is not being removed
            if (lState.hasUpdate && lState.lifecycleState !== 'remove') {
                lOptimizedQueue.push({
                    type: 'update',
                    component: lComponent
                });
            }
        }

        return lOptimizedQueue;
    }

    /**
     * Execute the update cycle for all systems.
     * This should be called once per frame.
     *
     * @internal
     */
    public executeUpdate(): void {
        // Process all queued state changes first
        this.processStateChanges();

        // Call update on all systems
        for (const lSystem of this.mSystems) {
            lSystem.executeUpdate();
        }
    }

    /**
     * Execute the tick cycle for all systems.
     * This should be called at a fixed timestep for physics.
     *
     * @internal
     */
    public executeTick(): void {
        // Process any state changes that occurred during the tick
        this.processStateChanges();

        // Call tick on all systems
        for (const lSystem of this.mSystems) {
            lSystem.executeTick();
        }
    }
}

