import { Exception } from '@kartoffelgames/core';
import type { GameComponentConstructor } from '../component/game-component.ts';
import { type EnvironmentStateChange, GameEnvironmentTransmission } from './game-environment-transmittion.ts';
import type { GameScene } from '../game-scene.ts';
import type { GameSystem } from '../game-system.ts';

/**
 * Main hub for managing the game environment, including loaded scenes, registered systems, and processing component state changes.
 */
export class GameEnvironment {
    private readonly mLoadedScenes: Set<GameScene> = new Set();
    private readonly mStateChangeQueue: Array<EnvironmentStateChange> = new Array<EnvironmentStateChange>();
    private readonly mSystems: Array<GameSystem> = new Array<GameSystem>();

    /**
     * Execute the tick cycle for all systems.
     * This should be called at a fixed timestep for physics.
     *
     * @internal
     */
    public executeTick(): void {
        // Call tick on all systems
        for (const lSystem of this.mSystems) {
            lSystem.executeTick();
        }
    }

    /**
     * Execute the update cycle for all systems.
     * This should be called once per frame.
     *
     * @internal
     */
    public executeUpdate(): void {
        // Optimize and order the state change queue
        const lConstructorChangeStateQueue: Map<GameComponentConstructor, ReadonlyArray<EnvironmentStateChange>> = this.optimizeStateChangeQueue();

        // Clear the original queue. Splice is half as fast as setting length to 0.
        this.mStateChangeQueue.length = 0;

        // Call update on all systems
        for (const lSystem of this.mSystems) {
            const lHandledChanges = new Map<GameComponentConstructor, ReadonlyArray<EnvironmentStateChange>>();

            // If the system has defined handled component types, filter the state changes for those types and pass them to the system.
            if (lSystem.handledComponentTypes) {
                for (const lComponentType of lSystem.handledComponentTypes) {
                    lHandledChanges.set(lComponentType, lConstructorChangeStateQueue.get(lComponentType) ?? []);
                }
            }

            lSystem.executeUpdate(lHandledChanges);
        }
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
        const lTransmission = new GameEnvironmentTransmission(pScene, (pStateChange: EnvironmentStateChange) => {
            this.mStateChangeQueue.push(pStateChange);
        });

        // Establish environment connection for all root game objects in the scene
        pScene.setEnvironmentConnection(lTransmission);
    }

    /**
     * Register a system with the environment.
     * The system will be initialized and notified of component state changes.
     *
     * @param pSystem - The system to register
     */
    public registerSystem(pSystem: GameSystem): void {
        const lDependentSystemList: Array<GameSystem> = new Array<GameSystem>();

        // Read dependencies of system and find the instance of each dependent system type.
        for (const lSystemType of pSystem.dependentSystemTypes) {
            // Find the instance of the dependent system type.
            const lDependentSystem = this.mSystems.find((pSystemInstance) => {
                return pSystemInstance.constructor === lSystemType;
            });

            // If the dependent system is not found, throw an exception.
            if (!lDependentSystem) {
                throw new Exception(`Dependent system of type ${lSystemType.name} not found for system ${pSystem.constructor.name}`, this);
            }

            lDependentSystemList.push(lDependentSystem);
        }

        // Add system to list
        this.mSystems.push(pSystem);

        // Initialize system with dependent systems
        pSystem.initialize(lDependentSystemList);
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
     * Reduces event notifications based on the following rules: // TODO:
     * - add + activate = send only add
     * - deactivate + remove = send only remove
     * - activate + deactivate = send no events
     * - deactivate + activate = send no events
     *
     * Update events are always included unless the component is being removed.
     *
     * @returns Optimized array of state changes to process.
     *
     * @internal
     */
    private optimizeStateChangeQueue(): Map<GameComponentConstructor, ReadonlyArray<EnvironmentStateChange>> {
        // Track final lifecycle state and update status for each component
        const lComponentStates: Map<GameComponentConstructor, Array<EnvironmentStateChange>> = new Map<GameComponentConstructor, Array<EnvironmentStateChange>>();

        // Process each state change in order to determine final state
        for (const lStateChange of this.mStateChangeQueue) {
            const lComponent = lStateChange.component;
            const lComponentType = lComponent.constructor as GameComponentConstructor;

            // Initialize tracking state if needed
            if (!lComponentStates.has(lComponentType)) {
                lComponentStates.set(lComponentType, new Array<EnvironmentStateChange>());
            }

            const lComponentStateList: Array<EnvironmentStateChange> = lComponentStates.get(lComponentType)!;

            // Add the new state change to the list for this component type
            lComponentStateList.push(lStateChange);
        }

        return lComponentStates;
    }
}

