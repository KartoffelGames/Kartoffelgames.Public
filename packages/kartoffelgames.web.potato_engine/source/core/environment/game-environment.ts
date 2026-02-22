import { Exception } from '@kartoffelgames/core';
import type { GameComponent, GameComponentConstructor } from '../component/game-component.ts';
import type { GameScene } from '../game-scene.ts';
import type { GameSystem, GameSystemConstructor } from '../game-system.ts';
import { type GameEnvironmentStateType, GameEnvironmentTransmission } from './game-environment-transmittion.ts';

/**
 * Main hub for managing the game environment, including loaded scenes, registered systems, and processing component state changes.
 */
export class GameEnvironment {
    private readonly mConfigurationDebugLog: boolean;
    private mCurrentTick: number;
    private readonly mLoadedScenes: Set<GameScene>;
    private mStateChangeQueue: Array<GameEnvironmentStateChange>;
    private readonly mSystems: Array<GameSystem>;

    /**
     * Current tick of the environment, updated on each frame and provided to the transmission tick handler.
     */
    public get tick(): number {
        return this.mCurrentTick;
    }

    /**
     * Constructor.
     */
    public constructor(pParameters?: GameEnvironmentParameter) {
        this.mLoadedScenes = new Set<GameScene>();
        this.mStateChangeQueue = new Array<GameEnvironmentStateChange>();
        this.mSystems = new Array<GameSystem>();
        this.mCurrentTick = 0;

        // Save parameters
        this.mConfigurationDebugLog = pParameters?.debugLog ?? false;
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
        this.mStateChangeQueue = new Array<GameEnvironmentStateChange>();

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
        const lTransmission = new GameEnvironmentTransmission(this, (pType: GameEnvironmentStateType, pComponent: GameComponent) => {
            this.queueStateChange(pType, pComponent);
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

        if (this.mConfigurationDebugLog) {
            const lEntityLabel: string = pComponent.gameEntity?.label ?? 'standalone';

            // eslint-disable-next-line no-console
            console.log(`Queued state change: "${pType}" for component "${pComponent.label}" of "${lEntityLabel}"`);
        }
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

type GameEnvironmentParameter = {
    debugLog?: boolean;
};