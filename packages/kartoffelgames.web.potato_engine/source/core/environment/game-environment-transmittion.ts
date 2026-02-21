import type { GameComponent } from '../component/game-component.ts';
import type { GameScene } from '../game-scene.ts';

/**
 * Transmits environment state changes from various sources to a registered event handler.
 * Acts as a relay for component lifecycle events including addition, removal, activation, deactivation and updates.
 */
export class GameEnvironmentTransmission {
    /**
     * Tracks the last submitted state change per component for priority filtering.
     */
    private readonly mComponentStateRecord: WeakMap<GameComponent, GameEnvironmentComponentState>;

    /**
     * Event handler function that processes environment state changes.
     */
    private readonly mEventSubmitHandler: GameEnvironmentTransmissionEventSubmitHandler;
    private readonly mScene: GameScene;
    private readonly mTickReceiveHandler: GameEnvironmentTransmissionTickHandler;

    /**
     * Current tick of the environment, provided by the tick handler.
     */
    public get tick(): number {
        return this.mTickReceiveHandler();
    }

    /**
     * Creates a new environment transmission relay with the specified event handler.
     *
     * @param pScene - The scene associated with this transmission.
     * @param pEventHandler - Function invoked whenever an environment state change occurs.
     */
    public constructor(pScene: GameScene, pHandler: GameEnvironmentTransmissionHandlerMap) {
        this.mComponentStateRecord = new WeakMap<GameComponent, GameEnvironmentComponentState>();
        this.mEventSubmitHandler = pHandler.eventSubmit;
        this.mScene = pScene;
        this.mTickReceiveHandler = pHandler.tickReceive;
    }

    /**
     * Transmits a component change event to the environment handler.
     *
     * @param pComponent - The component being changed.
     */
    public sendChangeEvent(pEventType: GameEnvironmentStateChangeType, pComponent: GameComponent): void {
        // Build state change event.
        const lStateChange: GameEnvironmentStateChange = {
            type: pEventType,
            component: pComponent,
            scene: this.mScene,
            tick: this.tick
        }

        // Submit only when the state change has priority.
        if (this.priorizeStateChange(lStateChange)) {
            this.mEventSubmitHandler(lStateChange);
        }
    }

    /**
     * Prioritizes a state change event before submitting it to the environment handler.
     * Reduces event notifications based on the following rules:
     * - "remove" is top priority and cancels all other events for the same component unless it is followed by "add"
     * - "add" is higher priority than "update" and "activate"
     * - "deactivate" is higher priority than "update"
     * - When same type events occur for the same component the new event is not submitted.
     *
     * @param pStateChange - The state change event to prioritize.
     * 
     * @returns Whether the state change should be submitted.
     */
    private priorizeStateChange(pStateChange: GameEnvironmentStateChange): boolean {
        // Get existing record for this component. When no record exists or the stored tick is from a previous tick, always accept and record.
        const lExistingRecord: GameEnvironmentComponentState | undefined = this.mComponentStateRecord.get(pStateChange.component);
        if (!lExistingRecord) {
            this.mComponentStateRecord.set(pStateChange.component, {
                tick: pStateChange.tick,
                type: pStateChange.type
            });
            return true;
        }

        // When the stored tick is from a previous tick, reset the record and accept the new state change.
        if (lExistingRecord.tick < pStateChange.tick) {
            lExistingRecord.tick = pStateChange.tick;
            lExistingRecord.type = pStateChange.type;
            return true;
        }

        // Block duplicate state change types within the same tick.
        if (lExistingRecord.type === pStateChange.type) {
            return false;
        }

        // Apply priority rules based on the stored state type.
        const lStoredType: GameEnvironmentStateChangeType = lExistingRecord.type;
        const lNewType: GameEnvironmentStateChangeType = pStateChange.type;

        const lGetPriority: boolean | undefined = ((): boolean => {
            switch (lStoredType) {
                case 'remove': {
                    switch (lNewType) {
                        case 'add': return true;
                    }
                }
                case 'add': {
                    switch (lNewType) {
                        case 'remove': return true;
                    }
                }
                case 'deactivate': {
                    switch (lNewType) {
                        case 'activate': return true;
                        case 'remove': return true;
                        case 'add': return true;
                    }
                }
                case 'activate': {
                    switch (lNewType) {
                        case 'deactivate': return true;
                        case 'remove': return true;
                        case 'add': return true;
                    }
                }
                case 'update': {
                    // "update" has lowest priority and can be overridden by any other type.
                    return true;
                }
            }
        })();

        // When the new state change has priority, update the record with the new type.
        if (lGetPriority) {
            lExistingRecord.type = lNewType;
        }

        return lGetPriority;
    }
}

type GameEnvironmentTransmissionEventSubmitHandler = (pEvent: GameEnvironmentStateChange) => void;
type GameEnvironmentTransmissionTickHandler = () => number;

type GameEnvironmentTransmissionHandlerMap = {
    eventSubmit: GameEnvironmentTransmissionEventSubmitHandler;
    tickReceive: GameEnvironmentTransmissionTickHandler;
};

/**
 * Union type representing all possible environment state changes.
 */
export type GameEnvironmentStateChange = GameEnvironmentStateChangeActivate | GameEnvironmentStateChangeDeactivate | GameEnvironmentStateChangeAdd | GameEnvironmentStateChangeRemove | GameEnvironmentStateChangeUpdate;
export type GameEnvironmentStateChangeType = 'activate' | 'deactivate' | 'add' | 'remove' | 'update';

/**
 * Base structure for all environment state change events.
 */
type GameEnvironmentStateChangeBase = {
    /**
     * The type of state change that occurred.
     */
    type: GameEnvironmentStateChangeType;

    /**
     * The component involved in the state change.
     */
    component: GameComponent;

    /**
     * The scene in which the state change occurred.
     */
    scene: GameScene;

    /**
     * The tick at which the state change occurred, provided by the tick handler.
     */
    tick: number;
};

/**
 * Event emitted when a component is activated in the environment.
 */
export type GameEnvironmentStateChangeActivate = {
    type: 'activate';
} & GameEnvironmentStateChangeBase;

/**
 * Event emitted when a component is deactivated in the environment.
 */
export type GameEnvironmentStateChangeDeactivate = {
    type: 'deactivate';
} & GameEnvironmentStateChangeBase;

/**
 * Event emitted when a component is added to the environment.
 */
export type GameEnvironmentStateChangeAdd = {
    type: 'add';
} & GameEnvironmentStateChangeBase;

/**
 * Event emitted when a component is removed from the environment.
 */
export type GameEnvironmentStateChangeRemove = {
    type: 'remove';
} & GameEnvironmentStateChangeBase;

/**
 * Event emitted when a component is updated outside of a system loop.
 */
export type GameEnvironmentStateChangeUpdate = {
    type: 'update';
} & GameEnvironmentStateChangeBase;

/**
 * Tracks the last submitted state change type and tick for a single component.
 * Used to filter redundant or lower-priority state changes within the same tick.
 */
type GameEnvironmentComponentState = {
    /**
     * The tick at which the last state change was recorded.
     */
    tick: number;

    /**
     * The type of the last recorded state change.
     */
    type: GameEnvironmentStateChangeType;
};