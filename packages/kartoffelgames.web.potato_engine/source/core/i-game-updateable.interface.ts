export interface IGameUpdateable<TUpdateStateChanges extends string> {
    /**
     * Trigger an update response for this object.
     */
    update(pStateChanges?: TUpdateStateChanges): void;

    /**
     * Adds a listener function that will be called whenever this object is updated.
     * 
     * @param pListener - The listener function to add.
     */
    addUpdateListener(pListener: GameUpdateableUpdateListener<TUpdateStateChanges>): void;

    /**
     * Removes a previously added update listener function.
     * 
     * @param pListener - The listener function to remove.
     */
    removeUpdateListener(pListener: GameUpdateableUpdateListener<TUpdateStateChanges>): void;
}

export type GameUpdateableUpdateListener<TUpdateStateChanges extends string> = (pStateChanges?: TUpdateStateChanges) => void;