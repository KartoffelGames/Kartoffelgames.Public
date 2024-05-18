import { List, IDeconstructable } from '@kartoffelgames/core.data';
import { ErrorAllocation } from './execution_zone/error-allocation';
import { Patcher } from './execution_zone/patcher/patcher';
import { InteractionDetectionProxy } from './synchron_tracker/interaction-detection-proxy';
import { ChangeDetectionReason } from './change-detection-reason';
import { DetectionCatchType } from './enum/detection-catch-type.enum';

/**
 * Merges execution zone and proxy tracking.
 */
export class ChangeDetection implements IDeconstructable {
    private static mCurrentZone: ChangeDetection | null = null;

    /**
     * Current execution zone.
     */
    public static get current(): ChangeDetection {
        if (ChangeDetection.mCurrentZone === null) {
            ChangeDetection.mCurrentZone = new ChangeDetection('Default');
        }

        return ChangeDetection.mCurrentZone;
    }

    /**
     * Dispatch interaction event in current zone.
     * 
     * @param pChangeReason - Interaction reason.
     */
    public static dispatchInteractionEvent(pChangeReason: ChangeDetectionReason): void {
        for (const lListener of ChangeDetection.current.mChangeListenerList) {
            lListener(pChangeReason);
        }

        // TODO. call listener from parent.
    }

    private readonly mChangeListenerList: List<ChangeListener>;
    private readonly mErrorListenerList: List<ErrorListener>;
    private readonly mName: string;
    private readonly mParent: ChangeDetection | null;
    private readonly mWindowErrorListener: (pEvent: ErrorEvent) => void;
    private readonly mWindowRejectionListener: (pEvent: PromiseRejectionEvent) => void;

    /**
     * Get change detection name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Get change detection parent.
     */
    public get parent(): ChangeDetection | null {
        return this.mParent;
    }

    /**
     * Constructor.
     * Creates new change detection. Detects all asynchron executions inside execution zone.
     * Except IndexDB calls.
     * Listens on changes and function calls on registered objects.
     * Child changes triggers parent change detection but parent doesn't trigger child.
     * 
     * @param pName - Name of change detection or the change detection.
     * @param pSettings - Change detection settings.
     */
    public constructor(pName: string, pSettings?: ChangeDetectionConstructorSettings) {
        // Patch for execution zone.
        Patcher.patch(globalThis);

        // Initialize lists
        this.mChangeListenerList = new List<ChangeListener>();
        this.mErrorListenerList = new List<ErrorListener>();

        // Save parent.
        if (pSettings?.isolate === true || ChangeDetection.mCurrentZone === null) {
            this.mParent = null;
        } else {
            this.mParent = ChangeDetection.current;
        }

        // Create new execution zone or use old one.#
        this.mName = pName;

        // TODO: Create set with cd-type and only dispatch event when reason is included in cd-type set.

        // Catch global error, check if allocated zone is child of this change detection and report the error.
        const lErrorHandler = (pErrorEvent: Event, pError: any) => {
            // Get change detection
            const lChangeDetection: ChangeDetection | null = ErrorAllocation.getChangeDetectionOfError(pError);
            if (lChangeDetection) {
                // Check if error change detection is child of the change detection.
                if (lChangeDetection.isChildOf(this)) {
                    // Suppress console error message if error should be suppressed
                    const lExecuteDefault: boolean = this.dispatchErrorEvent(pError);
                    if (!lExecuteDefault) {
                        pErrorEvent.preventDefault();
                    }
                }
            }
        };

        // Create error and rejection listener.
        this.mWindowErrorListener = (pEvent: ErrorEvent) => {
            lErrorHandler(pEvent, pEvent.error);
        };
        this.mWindowRejectionListener = (pEvent: PromiseRejectionEvent) => {
            const lPromise: Promise<any> = pEvent.promise;
            const lPromiseZone: ChangeDetection = Reflect.get(lPromise, Patcher.PATCHED_PROMISE_ZONE_KEY);
            ErrorAllocation.allocateError(pEvent.reason, lPromiseZone);

            lErrorHandler(pEvent, pEvent.reason);
        };

        // Register global error listener. // TODO: Lazy init event handler to prevent loop with Patcher.
        // window.addEventListener('error', this.mWindowErrorListener);
        // window.addEventListener('unhandledrejection', this.mWindowRejectionListener);
    }

    /**
     * Add listener for error events.
     * Prevent error defaults like print on console when {@link pListener} return the actual value false.
     * 
     * @param pListener - Listener.
     */
    public addErrorListener(pListener: ErrorListener): void {
        this.mErrorListenerList.push(pListener);
    }

    /**
     * Add listener for change events.
     * @param pListener - Listener.
     */
    public addInteractionListener(pListener: ChangeListener): void {
        this.mChangeListenerList.push(pListener);
    }

    /**
     * Deconstruct change detection.
     */
    public deconstruct(): void {
        // Register global error listener.
        window.removeEventListener('error', this.mWindowErrorListener);
        window.removeEventListener('unhandledrejection', this.mWindowRejectionListener);
    }

    /**
     * Executes function in this execution zone.
     * 
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    public execute<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T {
        // Save current executing zone.
        const lLastZone: ChangeDetection = ChangeDetection.current;

        // Set this zone as execution zone and execute function.
        ChangeDetection.mCurrentZone = this;
        let lResult: any;

        // Try to execute
        try {
            lResult = pFunction(...pArgs);
        } catch (pError) {
            ErrorAllocation.allocateError(pError, this);
            throw pError;
        } finally {
            // Reset to last zone.
            ChangeDetection.mCurrentZone = lLastZone;
        }

        return lResult;
    }

    /**
     * Register an object for change detection.
     * Returns proxy object that should be used to track changes.
     * @param pObject - Object or function.
     */
    public registerObject<T extends object>(pObject: T): T {
        // Get change trigger on all events.
        if (pObject instanceof EventTarget) {
            Patcher.patchObject(pObject, this);
        }

        // Create interaction proxy.
        return new InteractionDetectionProxy(pObject).proxy;
    }

    /**
     * Remove change event listener from change detection.
     * @param pListener - Listener.
     */
    public removeChangeListener(pListener: ChangeListener): void {
        this.mChangeListenerList.remove(pListener);
    }

    /**
     * Remove error event listener from error detection.
     * @param pListener - Listener.
     */
    public removeErrorListener(pListener: ErrorListener): void {
        this.mErrorListenerList.remove(pListener);
    }

    /**
     * Call all registered error listener.
     * Prevent defaults like print on console when any of the callbacks return the actual value false.
     */
    private callErrorListener(pError: any): boolean {
        let lExecuteDefault: boolean = true;

        // Dispatch error event.
        for (const lListener of this.mErrorListenerList) {
            if (lListener(pError) === false) {
                lExecuteDefault = false;
            }
        }

        return lExecuteDefault;
    }

    /**
     * Trigger all change event.
     */
    private dispatchErrorEvent(pError: any): boolean {
        // Get current executing zone.
        const lCurrentChangeDetection: ChangeDetection = ChangeDetection.current;

        // Execute all listener in event target zone.
        return lCurrentChangeDetection.execute(() => {
            return this.callErrorListener(pError);
        });
    }

    /**
     * Check if this change detection is a child of another change detection.
     * @param pChangeDetection - Possible parent change detection.
     */
    private isChildOf(pChangeDetection: ChangeDetection): boolean {
        if (pChangeDetection === this) {
            return true;
        }

        return !!this.parent?.isChildOf(pChangeDetection);
    }
}

export type ChangeListener = (pReason: ChangeDetectionReason) => void;
export type ErrorListener = (pError: any) => void | boolean;

type ChangeDetectionConstructorSettings = {
    trigger: DetectionCatchType,
    isolate: boolean;
};