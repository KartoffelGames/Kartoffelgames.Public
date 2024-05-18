import { List, IDeconstructable } from '@kartoffelgames/core.data';
import { ErrorAllocation } from './execution_zone/error-allocation';
import { ExecutionZone } from './execution_zone/execution-zone';
import { Patcher } from './execution_zone/patcher/patcher';
import { InteractionDetectionProxy } from './synchron_tracker/interaction-detection-proxy';
import { ChangeDetectionReason } from './change-detection-reason';
import { DetectionCatchType } from './enum/detection-catch-type.enum';

/**
 * Merges execution zone and proxy tracking. // TODO: Integrate Zone into change detection.
 */
export class ChangeDetection implements IDeconstructable {
    private static readonly mZoneConnectedChangeDetections: WeakMap<ExecutionZone, ChangeDetection> = new WeakMap<ExecutionZone, ChangeDetection>();

    /**
     * Get current change detection.
     */
    public static get current(): ChangeDetection {
        const lCurrentZone: ExecutionZone = ExecutionZone.current;
        let lCurrentChangeDetection: ChangeDetection | undefined = ChangeDetection.mZoneConnectedChangeDetections.get(lCurrentZone);

        // Initialize new change detection
        if (!lCurrentChangeDetection) {
            lCurrentChangeDetection = new ChangeDetection(lCurrentZone);
        }

        return lCurrentChangeDetection;
    }

    private readonly mChangeListenerList: List<ChangeListener>;
    private readonly mErrorListenerList: List<ErrorListener>;
    private readonly mExecutionZone: ExecutionZone;
    private readonly mParent: ChangeDetection | null;
    private readonly mWindowErrorListener: (pEvent: ErrorEvent) => void;
    private readonly mWindowRejectionListener: (pEvent: PromiseRejectionEvent) => void;

    /**
     * Get change detection name.
     */
    public get name(): string {
        return this.mExecutionZone.name;
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
        if (pSettings?.isolate === true) {
            this.mParent = null;
        } else {
            this.mParent = ChangeDetection.current;
        }

        // Create new execution zone or use old one.
        this.mExecutionZone = new ExecutionZone(pName);

        // Register interaction event and connect execution zone with change detection.
        this.mExecutionZone.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
            this.dispatchChangeEvent(pChangeReason);
        });
        ChangeDetection.mZoneConnectedChangeDetections.set(this.mExecutionZone, this);

        // Catch global error, check if allocated zone is child of this change detection and report the error.
        const lErrorHandler = (pErrorEvent: Event, pError: any) => {
            // Get change detection
            const lErrorZone: ExecutionZone | null = ErrorAllocation.getExecutionZoneOfError(pError);
            if (lErrorZone) {
                // Zone error has allways a ChangeDetection.
                const lChangeDetection: ChangeDetection = <ChangeDetection>ChangeDetection.mZoneConnectedChangeDetections.get(lErrorZone);

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
            const lPromiseZone: ExecutionZone = Reflect.get(lPromise, Patcher.PATCHED_PROMISE_ZONE_KEY);
            ErrorAllocation.allocateError(pEvent.reason, lPromiseZone);

            lErrorHandler(pEvent, pEvent.reason);
        };

        // Register global error listener.
        window.addEventListener('error', this.mWindowErrorListener);
        window.addEventListener('unhandledrejection', this.mWindowRejectionListener);
    }

    /**
     * Add listener for change events.
     * @param pListener - Listener.
     */
    public addChangeListener(pListener: ChangeListener): void {
        this.mChangeListenerList.push(pListener);
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
     * Deconstruct change detection.
     */
    public deconstruct(): void {
        // Register global error listener.
        window.removeEventListener('error', this.mWindowErrorListener);
        window.removeEventListener('unhandledrejection', this.mWindowRejectionListener);
    }

    /**
     * Trigger all change event.
     */
    public dispatchChangeEvent(pReason: ChangeDetectionReason): void {
        // One trigger if change detection is not silent.
        if (!this.mSilent) {
            // Get current executing zone.
            const lCurrentChangeDetection: ChangeDetection = ChangeDetection.current;

            // Execute all listener in event target zone.
            lCurrentChangeDetection.execute(() => {
                this.callChangeListener(pReason);

                // Pass through change event to parent.
                this.mParent?.dispatchChangeEvent(pReason);
            });
        }
    }

    /**
     * Executes function in change detections execution zone.
     * Asynchron calls can only be detected if they are sheduled inside this zone.
     * Does not call change callback.
     * 
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    public execute<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T {
        return this.mExecutionZone.executeInZone(pFunction, ...pArgs);
    }

    /**
     * Register an object for change detection.
     * Returns proxy object that should be used to track changes.
     * @param pObject - Object or function.
     */
    public registerObject<T extends object>(pObject: T): T {
        // Get change trigger on all events.
        if (pObject instanceof EventTarget) {
            Patcher.patchObject(pObject, this.mExecutionZone);
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
     * Creates new silent zone and executes function.
     * Does not call change callback.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    public silentExecution<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T {
        const lChangeDetection: ChangeDetection = new ChangeDetection(`${this.name}-SilentCD`, this, false, true);

        let lExecutionResult: any;
        try {
            lExecutionResult = lChangeDetection.execute(pFunction, ...pArgs);
        } finally {
            // Deconstruct change detection. Error events are not needed on temporary change detections.
            lChangeDetection.deconstruct();
        }

        return lExecutionResult;
    }

    /**
     * Call all registered change listener.
     */
    private callChangeListener(pReason: ChangeDetectionReason): void {
        // Dispatch change event.
        for (const lListener of this.mChangeListenerList) {
            lListener(pReason);
        }
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