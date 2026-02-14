import { Exception } from '@kartoffelgames/core';
import type { GameComponentConstructor } from '../component/game-component.ts';
import { type GameEnvironmentStateChange, GameEnvironmentTransmission } from './game-environment-transmittion.ts';
import type { GameScene } from '../game-scene.ts';
import type { GameSystem, GameSystemConstructor } from '../game-system.ts';

/**
 * Main hub for managing the game environment, including loaded scenes, registered systems, and processing component state changes.
 */
export class GameEnvironment {
    private mCurrentTick: number;
    private readonly mLoadedScenes: Set<GameScene>;
    private readonly mStateChangeQueue: Array<GameEnvironmentStateChange>;
    private readonly mSystems: Array<GameSystem>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mLoadedScenes = new Set<GameScene>();
        this.mStateChangeQueue = new Array<GameEnvironmentStateChange>();
        this.mSystems = new Array<GameSystem>();
        this.mCurrentTick = 0;
    }

    /**
     * Execute the frame cycle for all systems.
     * This should be called once per frame.
     * 
     * @internal
     */
    public async executeFrame(): Promise<void> {
        // Call frame on all systems
        for (const lSystem of this.mSystems) {
            await lSystem.executeFrame();
        }
    }

    /**
     * Execute the tick cycle for all systems.
     * This should be called at a fixed timestep for physics.
     *
     * @internal
     */
    public async executeTick(): Promise<void> {
        // Call tick on all systems
        for (const lSystem of this.mSystems) {
            await lSystem.executeTick();
        }
    }

    /**
     * Execute the update cycle for all systems.
     * This should be called once per frame.
     *
     * @internal
     */
    public async executeUpdate(): Promise<void> {
        // Optimize and order the state change queue
        const lConstructorChangeStateQueue: Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>> = this.optimizeStateChangeQueue();

        // Clear the original queue. Splice is half as fast as setting length to 0.
        this.mStateChangeQueue.length = 0;

        // Call update on all systems
        for (const lSystem of this.mSystems) {
            const lHandledChanges = new Map<GameComponentConstructor, ReadonlyArray<GameEnvironmentStateChange>>();

            // If the system has defined handled component types, filter the state changes for those types and pass them to the system.
            if (lSystem.handledComponentTypes) {
                for (const lComponentType of lSystem.handledComponentTypes) {
                    lHandledChanges.set(lComponentType, lConstructorChangeStateQueue.get(lComponentType) ?? []);
                }
            }

            await lSystem.executeUpdate(lHandledChanges);
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
        const lTransmission = new GameEnvironmentTransmission(pScene, {
            eventSubmit: (pStateChange: GameEnvironmentStateChange) => {
                this.mStateChangeQueue.push(pStateChange);
            },
            tickReceive: () => {
                return this.mCurrentTick;
            }
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
    public async registerSystem(pSystem: GameSystem): Promise<void> {
        // Read dependencies of system and find the instance of each dependent system type.
        for (const lSystemType of pSystem.dependentSystemTypes) {
            // Find the instance of the dependent system type.
            const lHasDependentSystem: boolean = !!this.mSystems.find((pSystemInstance) => {
                return pSystemInstance.constructor === lSystemType;
            });

            // If the dependent system is found, continue to the next dependency.
            if (lHasDependentSystem) {
                continue;
            }

            // If the dependent system is not found, create an instance of the dependent system type and register it.
            const lDependentSystemInstance = new lSystemType();
            await this.registerSystem(lDependentSystemInstance);
        }

        // Add system to list
        this.mSystems.push(pSystem);
    }

    /**
     * Start the game environment, beginning the main loop and processing ticks and updates.
     */
    public async start(): Promise<void> {
        // Initialize all systems before starting the main loop.
        for (const lSystem of this.mSystems) {
            // Gather dependent systems for initialization
            const lDependentSystemList: Array<GameSystem> = new Array<GameSystem>();

            // Read dependencies of system and find the instance of each dependent system type.
            for (const lSystemType of lSystem.dependentSystemTypes) {
                // Find the instance of the dependent system type.
                const lDependentSystem = this.mSystems.find((pSystemInstance) => {
                    return pSystemInstance.constructor === lSystemType;
                });

                // If the dependent system is not found, throw an exception.
                // That should never happen, because systems should be registered in order of their dependencies, but we check just to be sure.
                if (!lDependentSystem) {
                    throw new Exception(`Dependent system of type ${lSystemType.name} not found for system ${lSystem.constructor.name}`, this);
                }

                lDependentSystemList.push(lDependentSystem);
            }

            // Initialize system with dependent systems
            await lSystem.initialize(lDependentSystemList);
        }

        // Create an async generator that yields on each animation frame.
        const lAnimationFrames = async function* () {
            let lRequestId: number = 0;

            try {
                while (true) {
                    yield await new Promise<number>(pResolve => {
                        lRequestId = globalThis.requestAnimationFrame(pResolve);
                    });
                }
            } finally {
                globalThis.cancelAnimationFrame(lRequestId);
            }
        };

        // eslint-disable-next-line @typescript-eslint/await-thenable
        for await (const lTick of lAnimationFrames()) {
            // Calculate delta time
            // const lDeltaTime = lTick - this.mCurrentTick;

            // Update tick.
            this.mCurrentTick = lTick;

            // Execute update with state changes from the last frame.
            await this.executeUpdate();

            // Execute frame after update to ensure systems have the latest component state changes.
            await this.executeFrame();

            // Execute fixed. // TODO: Maybe use another shit to do this...
            await this.executeTick();
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

