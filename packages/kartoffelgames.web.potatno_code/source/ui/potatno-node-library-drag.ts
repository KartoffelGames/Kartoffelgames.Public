/**
 * Data emitted when a node drag starts from the left library.
 */
export type PotatnoNodeLibraryDragStartDetail = {
    readonly clientX: number;
    readonly clientY: number;
    readonly definitionId: string;
    readonly label: string;
};

/**
 * Data emitted when the library requests click insertion for a node.
 */
export type PotatnoNodeLibraryInsertDetail = {
    readonly definitionId: string;
    readonly label: string;
};

type PotatnoNodeLibraryDragListener = (pDetail: PotatnoNodeLibraryDragStartDetail) => void;
type PotatnoNodeLibraryInsertListener = (pDetail: PotatnoNodeLibraryInsertDetail) => void;

/**
 * Small typed event bus used by the node library to hand drag starts to the
 * graph component without routing graph insertion behavior through the editor.
 */
export class PotatnoNodeLibraryDragBus {
    private static readonly mListeners: Set<PotatnoNodeLibraryDragListener> = new Set<PotatnoNodeLibraryDragListener>();
    private static readonly mInsertListeners: Set<PotatnoNodeLibraryInsertListener> = new Set<PotatnoNodeLibraryInsertListener>();

    /**
     * Notify all graph listeners that the library requested click insertion.
     *
     * @param pDetail - Insert request data from the node library.
     */
    public static requestInsert(pDetail: PotatnoNodeLibraryInsertDetail): void {
        for (const lListener of PotatnoNodeLibraryDragBus.mInsertListeners) {
            lListener(pDetail);
        }
    }

    /**
     * Notify all graph listeners that a library drag has started.
     *
     * @param pDetail - Drag start data from the node library.
     */
    public static startDrag(pDetail: PotatnoNodeLibraryDragStartDetail): void {
        for (const lListener of PotatnoNodeLibraryDragBus.mListeners) {
            lListener(pDetail);
        }
    }

    /**
     * Register a listener for library drag starts.
     *
     * @param pListener - Callback invoked whenever the library starts a drag.
     *
     * @returns Cleanup callback that removes the listener.
     */
    public static subscribe(pListener: PotatnoNodeLibraryDragListener): () => void {
        PotatnoNodeLibraryDragBus.mListeners.add(pListener);
        return () => {
            PotatnoNodeLibraryDragBus.mListeners.delete(pListener);
        };
    }

    /**
     * Register a listener for library click insertion requests.
     *
     * @param pListener - Callback invoked whenever the library requests insertion.
     *
     * @returns Cleanup callback that removes the listener.
     */
    public static subscribeInsert(pListener: PotatnoNodeLibraryInsertListener): () => void {
        PotatnoNodeLibraryDragBus.mInsertListeners.add(pListener);
        return () => {
            PotatnoNodeLibraryDragBus.mInsertListeners.delete(pListener);
        };
    }
}
