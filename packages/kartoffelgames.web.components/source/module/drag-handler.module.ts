import { Injection } from '@kartoffelgames/core-dependency-injection';
import { AccessMode, type IAttributeOnDeconstruct, ModuleTargetNode, PwbAttributeModule } from '@kartoffelgames/web-potato-web-builder';

/**
 * Attribute that adds drag events to its host.
 *
 * All events dispatches a {@link DragHandlerEvent}:
 *  - "drop-start" ({@link DropHandlerStartEvent}): pointer went down. Cancelable, call preventDefault() to abort the drag before it begins.
 *  - "drop-move" ({@link DragHandlerEvent}): pointer moved while dragging.
 *  - "drop-end" ({@link DropHandlerEndEvent}): pointer was released or the drag was canceled.
 */
@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^drop-handler$/
})
export class DragHandlerModule implements IAttributeOnDeconstruct {
    private static readonly ACTIVATION_DISTANCE_TRESHOLD: number = 5;

    private mActiveDrag: DragHandlerModuleActiveDrag | null;
    private readonly mPointerDownListener: (pEvent: PointerEvent) => void;
    private readonly mTarget: HTMLElement;

    /**
     * Constructor.
     *
     * @param pTarget - Target element.
     */
    public constructor(pTarget = Injection.use(ModuleTargetNode)) {
        this.mTarget = pTarget as unknown as HTMLElement;
        this.mActiveDrag = null;

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
        if (!this.mActiveDrag) {
            return;
        }

        // Save active state before removing everything altogether in "stopDrag."
        const lDragState: DragHandlerModuleActiveDrag = this.mActiveDrag;

        // Detach listeners before dispatching, so a consumer can start a new drag synchronously.
        this.stopDrag();

        // When the listener are attached but the drag was not active, dont dispatch a drag end event.
        if (!lDragState.active) {
            return;
        }

        const lStartPosition: DragHandlerPosition = lDragState.position.start;
        const lCurrentPosition: DragHandlerPosition = {
            x: pEvent.clientX,
            y: pEvent.clientY
        };

        // Dispatch end event with nulled move distance.
        this.mTarget.dispatchEvent(new DragHandlerEvent(DragHandlerEventName.DragEnd, lStartPosition, lCurrentPosition, { x: 0, y: 0 }, lDragState.data));
    }

    /**
     * Handle a pointer move while dragging and dispatch the "drop-move" event.
     *
     * @param pEvent - Pointer move event.
     */
    private onDragMove(pEvent: PointerEvent): void {
        // Skip when no drag is active.
        if (!this.mActiveDrag) {
            return;
        }

        // Prevent default for any event effect.
        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Current position.
        const lCurrentPosition: DragHandlerPosition = { x: pEvent.clientX, y: pEvent.clientY };

        // When the drag is not active, check for a activation distance.
        if (!this.mActiveDrag.active) {
            // Calculate distance since start.
            const lDistanceX: number = Math.abs(this.mActiveDrag.position.start.x - lCurrentPosition.x);
            const lDistanceY: number = Math.abs(this.mActiveDrag.position.start.y - lCurrentPosition.y);
            const lDistance: number = Math.sqrt(Math.pow(lDistanceX, 2) + Math.pow(lDistanceY, 2));

            // When the activation trashold is reached, dispatch drag start event.
            if (lDistance > DragHandlerModule.ACTIVATION_DISTANCE_TRESHOLD) {
                // Create a new drag event, both start and current position is set the same.
                const lDragStartEvent: DragHandlerEvent = new DragHandlerEvent(DragHandlerEventName.DragStart, this.mActiveDrag.position.start, this.mActiveDrag.position.start, { x: 0, y: 0 }, this.mActiveDrag.data);

                // Stop dragging on default prevented.
                if (!this.mTarget.dispatchEvent(lDragStartEvent)) {
                    this.stopDrag();
                    return;
                }

                // When the start event isnt prevented, activate the drag.
                this.mActiveDrag.active = true;
                this.mActiveDrag.data = lDragStartEvent.getData();
            }
        }

        // Distance moved since the last move event.
        const lMoveDistance: DragHandlerPosition = {
            x: lCurrentPosition.x - this.mActiveDrag.position.last.x,
            y: lCurrentPosition.y - this.mActiveDrag.position.last.y
        };

        const lDragEvent: DragHandlerEvent = new DragHandlerEvent(DragHandlerEventName.DragMove, this.mActiveDrag.position.start, lCurrentPosition, lMoveDistance, this.mActiveDrag.data);

        // Stop dragging on default prevented.
        if (!this.mTarget.dispatchEvent(lDragEvent)) {
            this.stopDrag();
            return;
        }

        // Save the current position as the last position.
        this.mActiveDrag.position.last = lCurrentPosition;
        this.mActiveDrag.data = lDragEvent.getData();
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
        if (this.mActiveDrag) {
            return;
        }

        // Temporary document listeners for the drag duration.
        const lMoveListener = (pMoveEvent: PointerEvent): void => {
            this.onDragMove(pMoveEvent);
        };
        const lEndListener = (pEndEvent: PointerEvent): void => {
            this.onDragEnd(pEndEvent);
        };

        // Read starting pointer position.
        const lStartPosition: DragHandlerPosition = { x: pEvent.clientX, y: pEvent.clientY };

        // Save active drag state.
        this.mActiveDrag = {
            active: false,
            data: null,
            position: {
                start: lStartPosition,
                last: lStartPosition,
            },
            listener: {
                move: lMoveListener,
                end: lEndListener
            }
        };

        // Drag magic listener (●'◡'●)つ━☆・*。
        document.addEventListener('pointermove', lMoveListener);
        document.addEventListener('pointerup', lEndListener);
        document.addEventListener('pointercancel', lEndListener);
    }

    /**
     * Detach the temporary document listeners of the current drag.
     */
    private stopDrag(): void {
        // Skip when no drag is active.
        if (!this.mActiveDrag) {
            return;
        }

        // Remove temporary document listeners.
        document.removeEventListener('pointermove', this.mActiveDrag.listener.move);
        document.removeEventListener('pointerup', this.mActiveDrag.listener.end);
        document.removeEventListener('pointercancel', this.mActiveDrag.listener.end);

        this.mActiveDrag = null;
    }
}

/**
 * General drag handler event. Used for all drag handler events.
 */
export class DragHandlerEvent extends Event {
    private mData: unknown | null;
    private readonly mPointerPosition: DragHandlerPosition;
    private readonly mStartPosition: DragHandlerPosition;
    private readonly mMovedDistance: DragHandlerPosition;

    /**
     * Current pointer position.
     */
    public get pointerPosition(): DragHandlerPosition {
        return this.mPointerPosition;
    }

    /**
     * Pointer position where the drag started.
     */
    public get startPosition(): DragHandlerPosition {
        return this.mStartPosition;
    }

    /**
     * Distance moved since the last event.
     */
    public get moveDistance(): DragHandlerPosition {
        return this.mMovedDistance;
    }

    /**
     * Constructor.
     *
     * @param pEventType - Event type.
     * @param pStartPosition - Pointer position where the drag started.
     * @param pPointerPosition - Current pointer position.
     * @param pMovedDistance - Distance moved since the last event.
     */
    public constructor(pEventType: DragHandlerEventName, pStartPosition: DragHandlerPosition, pPointerPosition: DragHandlerPosition, pMovedDistance: DragHandlerPosition, pData: unknown | null) {
        super(pEventType, { bubbles: true, cancelable: true });

        this.mStartPosition = pStartPosition;
        this.mPointerPosition = pPointerPosition;
        this.mMovedDistance = pMovedDistance;
        this.mData = pData;
    }

    /**
     * Attach data to the current drag.
     * Data can be read from other drag events.
     * 
     * @param pData 
     */
    public setData<T>(pData: T): void {
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
}

export type DragHandlerPosition = {
    readonly x: number;
    readonly y: number;
};

// Event name enum.
const DragHandlerEventName = {
    DragStart: 'drag-start',
    DragMove: 'drag-move',
    DragEnd: 'drag-end',
} as const;
type DragHandlerEventName = typeof DragHandlerEventName[keyof typeof DragHandlerEventName];

type DragHandlerModuleActiveDrag = {
    active: boolean;
    data: unknown | null;
    position: {
        start: DragHandlerPosition;
        last: DragHandlerPosition;
    };
    listener: {
        move: (pEvent: PointerEvent) => void;
        end: (pEvent: PointerEvent) => void;
    };
};
