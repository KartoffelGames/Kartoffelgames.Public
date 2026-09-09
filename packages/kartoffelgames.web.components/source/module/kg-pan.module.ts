import { Injection } from '@kartoffelgames/core-dependency-injection';
import { AccessMode, type IAttributeOnDeconstruct, ModuleTargetNode, PwbAttributeModule } from '@kartoffelgames/web-potato-web-builder';

/**
 * Attribute that turns its host into a pannable surface.
 *
 * Dispatches a single {@link KgPanModuleEvent}:
 *  - "kg-pan": pointer moved while the primary button is held down. Cancelable, call preventDefault() to abort the pan.
 */
@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^kg-pannable$/
})
export class KgPanModule implements IAttributeOnDeconstruct {
    private mActivePan: KgPanModuleActivePan | null;
    private readonly mPointerDownListener: (pEvent: PointerEvent) => void;
    private readonly mTarget: HTMLElement;

    /**
     * Constructor.
     *
     * @param pTarget - Target element.
     */
    public constructor(pTarget = Injection.use(ModuleTargetNode)) {
        this.mTarget = pTarget as unknown as HTMLElement;
        this.mActivePan = null;

        // Start a pan on any pointer down.
        this.mPointerDownListener = (pEvent: PointerEvent): void => {
            this.startPan(pEvent);
        };
        this.mTarget.addEventListener('pointerdown', this.mPointerDownListener);
    }

    /**
     * Remove the pointer down listener and cleanup any in flight pan.
     */
    public onDeconstruct(): void {
        this.mTarget.removeEventListener('pointerdown', this.mPointerDownListener);

        // Cleanup any current listener.
        this.stopPan();
    }

    /**
     * Handle a pointer move while panning and dispatch the "kg-pan" event.
     *
     * @param pEvent - Pointer move event.
     */
    private onPan(pEvent: PointerEvent): void {
        // Skip when no pan is active.
        if (!this.mActivePan) {
            return;
        }

        // Prevent default for any event effect.
        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Current position.
        const lCurrentPosition: KgPanModulePosition = { x: pEvent.clientX, y: pEvent.clientY };

        // Distance moved since the last pan event.
        const lMoveDistance: KgPanModulePosition = {
            x: lCurrentPosition.x - this.mActivePan.position.last.x,
            y: lCurrentPosition.y - this.mActivePan.position.last.y
        };

        const lPanEvent: KgPanModuleEvent = new KgPanModuleEvent(this.mActivePan.position.start, lCurrentPosition, lMoveDistance, this.mActivePan.data);

        // Stop panning on default prevented.
        if (!this.mTarget.dispatchEvent(lPanEvent)) {
            this.stopPan();
            return;
        }

        // Save the current position as the last position.
        this.mActivePan.position.last = lCurrentPosition;
        this.mActivePan.data = lPanEvent.getData();
    }

    /**
     * Start a pan and attach the temporary document listeners.
     *
     * @param pEvent - Pointer down event.
     */
    private startPan(pEvent: PointerEvent): void {
        // Prevent any button that is not left mouse.
        if (pEvent.button !== 0) {
            return;
        }

        // Only a single pan at a time.
        if (this.mActivePan) {
            return;
        }

        // Temporary document listeners for the pan duration.
        const lMoveListener = (pMoveEvent: PointerEvent): void => {
            this.onPan(pMoveEvent);
        };
        const lEndListener = (): void => {
            this.stopPan();
        };

        // Read starting pointer position.
        const lStartPosition: KgPanModulePosition = { x: pEvent.clientX, y: pEvent.clientY };

        // Save active pan state.
        this.mActivePan = {
            data: null,
            position: {
                start: lStartPosition,
                last: lStartPosition
            },
            listener: {
                move: lMoveListener,
                end: lEndListener
            }
        };

        // Pan magic listener (●'◡'●)つ━☆・*。
        document.addEventListener('pointermove', lMoveListener);
        document.addEventListener('pointerup', lEndListener);
        document.addEventListener('pointercancel', lEndListener);
    }

    /**
     * Detach the temporary document listeners of the current pan.
     */
    private stopPan(): void {
        // Skip when no pan is active.
        if (!this.mActivePan) {
            return;
        }

        // Remove temporary document listeners.
        document.removeEventListener('pointermove', this.mActivePan.listener.move);
        document.removeEventListener('pointerup', this.mActivePan.listener.end);
        document.removeEventListener('pointercancel', this.mActivePan.listener.end);

        this.mActivePan = null;
    }
}

/**
 * Pan event dispatched by the {@link KgPanModule}.
 */
export class KgPanModuleEvent extends Event {
    private mData: unknown | null;
    private readonly mMovedDistance: KgPanModulePosition;
    private readonly mPointerPosition: KgPanModulePosition;
    private readonly mStartPosition: KgPanModulePosition;

    /**
     * Distance moved since the last event.
     */
    public get moveDistance(): KgPanModulePosition {
        return this.mMovedDistance;
    }

    /**
     * Current pointer position.
     */
    public get pointerPosition(): KgPanModulePosition {
        return this.mPointerPosition;
    }

    /**
     * Pointer position where the pan started.
     */
    public get startPosition(): KgPanModulePosition {
        return this.mStartPosition;
    }

    /**
     * Constructor.
     *
     * @param pStartPosition - Pointer position where the pan started.
     * @param pPointerPosition - Current pointer position.
     * @param pMovedDistance - Distance moved since the last event.
     * @param pData - Data carried across the pan events.
     */
    public constructor(pStartPosition: KgPanModulePosition, pPointerPosition: KgPanModulePosition, pMovedDistance: KgPanModulePosition, pData: unknown | null) {
        super('kg-pan', { bubbles: true, cancelable: true });

        this.mStartPosition = pStartPosition;
        this.mPointerPosition = pPointerPosition;
        this.mMovedDistance = pMovedDistance;
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
     * Attach data to the current pan.
     * Data can be read from the following pan events.
     *
     * @param pData - Data to attach.
     */
    public setData<T>(pData: T): void {
        this.mData = pData;
    }
}

export type KgPanModulePosition = {
    readonly x: number;
    readonly y: number;
};

type KgPanModuleActivePan = {
    data: unknown | null;
    position: {
        start: KgPanModulePosition;
        last: KgPanModulePosition;
    };
    listener: {
        move: (pEvent: PointerEvent) => void;
        end: () => void;
    };
};

declare global {
    // Map the kg-pan event name to its event type, so addEventListener infers it without casting.
    /* eslint-disable @typescript-eslint/naming-convention */
    interface ElementEventMap {
        'kg-pan': KgPanModuleEvent;
    }
    /* eslint-enable @typescript-eslint/naming-convention */
}
