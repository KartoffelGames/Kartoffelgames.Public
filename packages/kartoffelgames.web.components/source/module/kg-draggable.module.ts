import { Injection } from '@kartoffelgames/core-dependency-injection';
import { AccessMode, type IAttributeOnDeconstruct, ModuleTargetNode, PwbAttributeModule } from '@kartoffelgames/web-potato-web-builder';
import { Exception } from "@kartoffelgames/core";

/**
 * Attribute that adds drag events to its host.
 *
 * All events dispatches a {@link KgDraggableModuleEvent}:
 *  - "kg-drag-start" ({@link KgDraggableModuleEvent}): pointer went down. Cancelable, call preventDefault() to abort the drag before it begins.
 *  - "kg-drag-end" ({@link KgDraggableModuleEvent}): pointer was released or the drag was canceled.
 *  - "kg-dragging" ({@link KgDraggableModuleEvent}): pointer moved while dragging. Also triggered on any element that are hovered.
 *  - "kg-drop" ({@link KgDraggableModuleEvent}): on drag end triggered on a target element that is currently hovered.
 */
@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^kg-draggable$/
})
export class KgDraggableModule implements IAttributeOnDeconstruct {
    private static readonly ACTIVATION_DISTANCE_TRESHOLD: number = 5;
    private static mActiveDrag: KgDraggableModuleActiveDrag | null = null;

    private readonly mPointerDownListener: (pEvent: PointerEvent) => void;
    private readonly mTarget: HTMLElement;
    private mListeners: KgDraggableModuleListeners | null;

    /**
     * Constructor.
     *
     * @param pTarget - Target element.
     */
    public constructor(pTarget = Injection.use(ModuleTargetNode)) {
        this.mTarget = pTarget as unknown as HTMLElement;
        this.mListeners = null;

        // Start a drag on any pointer down.
        this.mPointerDownListener = (pEvent: PointerEvent): void => {
            this.startDrag(pEvent);
        };
        this.mTarget.addEventListener('pointerdown', this.mPointerDownListener);
    }

    /**
     * Remove the pointer down listener and cleanup any in flight drag.
     */
    public onDeconstruct(): void {
        this.mTarget.removeEventListener('pointerdown', this.mPointerDownListener);

        // Cleanup and current listener.
        this.stopDrag();
    }

    /**
     * Handle the drag end event.
     * Dispatches the end event on an active drag.
     *
     * @param pEvent - Pointer up or cancel event.
     */
    private onDragEnd(pEvent: PointerEvent): void {
        // Skip when no drag is active.
        if (!KgDraggableModule.mActiveDrag) {
            return;
        }

        // Save active state before removing everything altogether in "stopDrag."
        const lDragState: KgDraggableModuleActiveDrag = KgDraggableModule.mActiveDrag;

        // Detach listeners before dispatching, so a consumer can start a new drag synchronously.
        this.stopDrag();

        // When the listener are attached but the drag was not active, dont dispatch a drag end event.
        if (!lDragState.active) {
            return;
        }

        const lCurrentPosition: KgDraggableModulePosition = {
            x: pEvent.clientX,
            y: pEvent.clientY
        };

        // Before ending the drag, dispatch a kg-drop event on the dragged element.
        if(pEvent.target && pEvent.target instanceof Element){
            pEvent.target.dispatchEvent(new KgDraggableModuleEvent(KgDraggableModuleEventName.Drop, lCurrentPosition, lDragState.data))
        }

        // Dispatch end event with nulled move distance.
        this.mTarget.dispatchEvent(new KgDraggableModuleEvent(KgDraggableModuleEventName.DragEnd, lCurrentPosition, lDragState.data));
    }

    /**
     * Handle a pointer move while dragging and dispatch the "drop-move" event.
     *
     * @param pEvent - Pointer move event.
     */
    private onDragMove(pEvent: PointerEvent): void {
        // Skip when no drag is active.
        if (!KgDraggableModule.mActiveDrag) {
            return;
        }

        // Prevent default for any event effect.
        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Current position.
        const lCurrentPosition: KgDraggableModulePosition = { x: pEvent.clientX, y: pEvent.clientY };

        // When the drag is not active, check for a activation distance.
        if (!KgDraggableModule.mActiveDrag.active) {
            // Calculate distance since start.
            const lDistanceX: number = Math.abs(KgDraggableModule.mActiveDrag.startPosition.x - lCurrentPosition.x);
            const lDistanceY: number = Math.abs(KgDraggableModule.mActiveDrag.startPosition.y - lCurrentPosition.y);
            const lDistance: number = Math.sqrt(Math.pow(lDistanceX, 2) + Math.pow(lDistanceY, 2));

            // When the activation trashold is reached, dispatch drag start event.
            if (lDistance > KgDraggableModule.ACTIVATION_DISTANCE_TRESHOLD) {
                // Create a new drag event, both start and current position is set the same.
                const lDragStartEvent: KgDraggableModuleEvent = new KgDraggableModuleEvent(KgDraggableModuleEventName.DragStart, KgDraggableModule.mActiveDrag.startPosition, KgDraggableModule.mActiveDrag);

                // Stop dragging on default prevented.
                if (!this.mTarget.dispatchEvent(lDragStartEvent)) {
                    this.stopDrag();
                    return;
                }

                // When the start event isnt prevented, activate the drag.
                KgDraggableModule.mActiveDrag.active = true;
                KgDraggableModule.mActiveDrag.data = lDragStartEvent.getData();
            }
        }

        const lDragEvent: KgDraggableModuleEvent = new KgDraggableModuleEvent(KgDraggableModuleEventName.DragMove, lCurrentPosition, KgDraggableModule.mActiveDrag.data);

        // Stop dragging on default prevented.
        if (!this.mTarget.dispatchEvent(lDragEvent)) {
            this.stopDrag();
            return;
        }

        // Also trigger the same event on hovered items.
        if(pEvent.target && pEvent.target instanceof Element){
            pEvent.target.dispatchEvent(lDragEvent)
        }
    }

    /**
     * Announce a starting drag and, unless canceled, attach the temporary document listeners.
     *
     * @param pEvent - Pointer down event.
     */
    private startDrag(pEvent: PointerEvent): void {
        // Prevent any button that is not left mouse.
        if (pEvent.button !== 0) {
            return;
        }

        // Only a single drag at a time.
        if (KgDraggableModule.mActiveDrag) {
            return;
        }

        // Read starting pointer position.
        const lStartPosition: KgDraggableModulePosition = { x: pEvent.clientX, y: pEvent.clientY };

        // Initialize a new drag state.
        KgDraggableModule.mActiveDrag = {
            active: false,
            data: null,
            startPosition: lStartPosition
        };

        // Temporary document listeners for the drag duration.
        this.mListeners = {
            move: (pMoveEvent: PointerEvent): void => {
                this.onDragMove(pMoveEvent);
            },
            end: (pEndEvent: PointerEvent): void => {
                this.onDragEnd(pEndEvent);
            }
        };

        // Drag magic listener (●'◡'●)つ━☆・*。
        document.addEventListener('pointermove', this.mListeners.move);
        document.addEventListener('pointerup', this.mListeners.end);
        document.addEventListener('pointercancel', this.mListeners.end);
    }

    /**
     * Detach the temporary document listeners of the current drag.
     */
    private stopDrag(): void {
        // Reset drag.
        KgDraggableModule.mActiveDrag = null;

        // Skip when no listeners is active.
        if (!this.mListeners) {
            return;
        }

        // Remove temporary document listeners.
        document.removeEventListener('pointermove', this.mListeners.move);
        document.removeEventListener('pointerup', this.mListeners.end);
        document.removeEventListener('pointercancel', this.mListeners.end);
    }
}

/**
 * General drag handler event. Used for all drag handler events.
 */
export class KgDraggableModuleEvent extends Event {
    private mData: unknown | null;
    private readonly mPointerPosition: KgDraggableModulePosition;

    /**
     * Current pointer position.
     */
    public get pointerPosition(): KgDraggableModulePosition {
        return this.mPointerPosition;
    }

    /**
     * Constructor.
     *
     * @param pEventType - Event type.
     * @param pStartPosition - Pointer position where the drag started.
     * @param pPointerPosition - Current pointer position.
     * @param pMovedDistance - Distance moved since the last event.
     */
    public constructor(pEventType: KgDraggableModuleEventName, pPointerPosition: KgDraggableModulePosition, pData: unknown | null) {
        super(pEventType, { bubbles: true, cancelable: true });

        this.mPointerPosition = pPointerPosition;
        this.mData = pData;
    }

    /**
     * Get the attached data.
     * 
     * @returns the attached data.
     */
    public getData<T>(): T | null {
        return this.mData as T;
    }

    /**
     * Attach data to the current drag.
     * Data can be read from other drag events.
     * 
     * @param pData 
     */
    public setData<T>(pData: T): void {
        // Restrict data access on drag start.
        if (this.type !== KgDraggableModuleEventName.DragStart) {
            throw new Exception('Drag data can only be set on drag start.', this);
        }

        this.mData = pData;
    }
}

export type KgDraggableModulePosition = {
    readonly x: number;
    readonly y: number;
};

// Event name enum.
// eslint-disable-next-line @typescript-eslint/naming-convention
const KgDraggableModuleEventName = {
    DragStart: 'kg-drag-start',
    DragMove: 'kg-dragging',
    DragEnd: 'kg-drag-end',
    Drop: 'kg-drop'
} as const;
type KgDraggableModuleEventName = typeof KgDraggableModuleEventName[keyof typeof KgDraggableModuleEventName];

type KgDraggableModuleActiveDrag = {
    active: boolean;
    data: unknown | null;
    startPosition: KgDraggableModulePosition;
};

type KgDraggableModuleListeners = {
    move: (pEvent: PointerEvent) => void;
    end: (pEvent: PointerEvent) => void;
};
