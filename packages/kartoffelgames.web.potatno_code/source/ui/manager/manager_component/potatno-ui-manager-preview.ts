import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from "../potatno-ui-manager.ts";

export class PotatnoUiManagerPreview {
    private readonly mManager: PotatnoUiManager;

    /**
     * Constructor.
     * 
     * @param pManager - Parents ui manager.
     */
    public constructor(pManager: PotatnoUiManager) {
        this.mManager = pManager;

        // OR chaining of preview code updates.
        const lSubscribedEvents: number = PotatnoCodeUiManagerChangeType.Document
            | PotatnoCodeUiManagerChangeType.Function
            | PotatnoCodeUiManagerChangeType.Node
            | PotatnoCodeUiManagerChangeType.Connection;

        // Register "all"-Listener and set dirtly. After a debounce validate automaticly.
        let lDebounce: number = 0;
        this.mManager.subscribe(lSubscribedEvents, null, () => {
            // Debounce: Clear and set a new timeout before updating drivers.
            globalThis.clearTimeout(lDebounce);
            lDebounce = globalThis.setTimeout(() => {
                this.updateDriver();
            }, 1000) as unknown as number;
        });
    }

    /**
     * Update the underlying code of all registered node- and main-preview driver.
     * Check graph integrity before to only update, when the code is runable.
     */
    private updateDriver() {

    }
}