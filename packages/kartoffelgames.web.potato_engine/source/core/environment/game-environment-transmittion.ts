import type { GameComponent } from '../component/game-component.ts';
import type { GameEnvironment } from "./game-environment.ts";

/**
 * Transmits environment state changes from various sources to a registered event handler.
 * Acts as a relay for component lifecycle events including addition, removal, activation, deactivation and updates.
 */
export class GameEnvironmentTransmission {
    private readonly mComponentStateRecord: WeakMap<GameComponent, GameEnvironmentComponentState>;
    private readonly mEnvironment: GameEnvironment;
    private readonly mEventSubmitHandler: GameEnvironmentTransmissionEventSubmitHandler;

    /**
     * Creates a new environment transmission relay with the specified event handler.
     *
     * @param pEnvironment - The game environment this transmission belongs to.
     * @param pHandler - Function invoked whenever an environment state change occurs.
     */
    public constructor(pEnvironment: GameEnvironment, pHandler: GameEnvironmentTransmissionEventSubmitHandler) {
        this.mEnvironment = pEnvironment;
        this.mEventSubmitHandler = pHandler;
        this.mComponentStateRecord = new WeakMap<GameComponent, GameEnvironmentComponentState>();
    }

    /**
     * Transmits a component change event to the environment handler.
     *
     * @param pComponent - The component being changed.
     */
    public sendChangeEvent(pEventType: GameEnvironmentStateType, pComponent: GameComponent): void {
        // Submit only when the state change has priority.
        if (this.priorizeStateChange(pEventType, pComponent)) {
            this.mEventSubmitHandler(pEventType, pComponent);
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
     * @param pType - The type of the state change event to prioritize.
     * @param pComponent - The component associated with the state change event.
     * 
     * @returns Whether the state change should be submitted.
     */
    private priorizeStateChange(pType: GameEnvironmentStateType, pComponent: GameComponent): boolean {
        // Get existing record for this component. When no record exists or the stored tick is from a previous tick, always accept and record.
        const lExistingRecord: GameEnvironmentComponentState | undefined = this.mComponentStateRecord.get(pComponent);
        if (!lExistingRecord) {
            this.mComponentStateRecord.set(pComponent, {
                tick: this.mEnvironment.tick,
                type: pType
            });
            return true;
        }

        // When the stored tick is from a previous tick, reset the record and accept the new state change.
        if (lExistingRecord.tick < this.mEnvironment.tick) {
            lExistingRecord.tick = this.mEnvironment.tick;
            lExistingRecord.type = pType;
            return true;
        }

        // Block duplicate state change types within the same tick.
        if (lExistingRecord.type === pType) {
            return false;
        }

        // Apply priority rules based on the stored state type.
        const lStoredType: GameEnvironmentStateType = lExistingRecord.type;
        const lNewType: GameEnvironmentStateType = pType;

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

type GameEnvironmentTransmissionEventSubmitHandler = (pType: GameEnvironmentStateType, pComponent: GameComponent) => void;

export type GameEnvironmentStateType = 'activate' | 'deactivate' | 'add' | 'remove' | 'update';

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
    type: GameEnvironmentStateType;
};