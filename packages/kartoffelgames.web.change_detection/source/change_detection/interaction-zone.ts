import { List, IDeconstructable } from '@kartoffelgames/core.data';
import { ErrorAllocation } from './execution_zone/error-allocation';
import { Patcher } from './execution_zone/patcher/patcher';
import { InteractionDetectionProxy } from './synchron_tracker/interaction-detection-proxy';
import { InteractionReason } from './interaction-reason';
import { InteractionResponseType } from './enum/interaction-response-type.enum';

/**
 * Merges execution zone and proxy tracking.
 */
export class InteractionZone implements IDeconstructable {
    private static mCurrentZone: InteractionZone | null = null;

    /**
     * Current execution zone.
     */
    public static get current(): InteractionZone {
        if (InteractionZone.mCurrentZone === null) {
            InteractionZone.mCurrentZone = new InteractionZone('Default');
        }

        return InteractionZone.mCurrentZone;
    }

    /**
     * Dispatch interaction event in current zone.
     * 
     * @param pInteractionReason - Interaction reason.
     */
    public static dispatchInteractionEvent(pInteractionReason: InteractionReason): void {
        InteractionZone.current.callInteractionListener(pInteractionReason);
    }

    private readonly mChangeListenerList: List<ChangeListener>;
    private readonly mErrorListenerList: List<ErrorListener>;
    private readonly mName: string;
    private readonly mParent: InteractionZone | null;
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
    public get parent(): InteractionZone | null {
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
    public constructor(pName: string, pSettings?: InteractionZoneConstructorSettings) {
        // Initialize lists
        this.mChangeListenerList = new List<ChangeListener>();
        this.mErrorListenerList = new List<ErrorListener>();

        // Save parent.
        if (pSettings?.isolate === true || InteractionZone.mCurrentZone === null) {
            this.mParent = null;
        } else {
            this.mParent = InteractionZone.current;
        }

        // Create new execution zone or use old one.#
        this.mName = pName;

        // TODO: Create set with cd-type and only dispatch event when reason is included in cd-type set.

        // Catch global error, check if allocated zone is child of this change detection and report the error. 
        // TODO: Globalise error handler and call callErrorListener on assigned zone.
        const lErrorHandler = (pErrorEvent: Event, pError: any) => {
            // Get change detection
            const lInteractionZone: InteractionZone | null = ErrorAllocation.getInteractionZone(pError);
            if (lInteractionZone) {
                // Check if error change detection is child of the change detection.
                if (lInteractionZone.isChildOf(this)) {
                    // Suppress console error message if error should be suppressed
                    const lExecuteDefault: boolean = this.callErrorListener(pError);
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
            const lPromiseZone: InteractionZone = Reflect.get(lPromise, Patcher.PATCHED_PROMISE_ZONE_KEY);
            ErrorAllocation.allocateError(pEvent.reason, lPromiseZone);

            lErrorHandler(pEvent, pEvent.reason);
        };

        // Register global error listener. // TODO: How to prevent recursion.
        // window.addEventListener('error', this.mWindowErrorListener);
        // window.addEventListener('unhandledrejection', this.mWindowRejectionListener);

        // Patch for execution zone.
        Patcher.patch(globalThis);
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
        const lLastZone: InteractionZone = InteractionZone.current;

        // Set this zone as execution zone and execute function.
        InteractionZone.mCurrentZone = this;
        let lResult: any;

        // Try to execute
        try {
            lResult = pFunction(...pArgs);
        } catch (pError) {
            ErrorAllocation.allocateError(pError, this);
            throw pError;
        } finally {
            // Reset to last zone.
            InteractionZone.mCurrentZone = lLastZone;
        }

        return lResult;
    }

    /**
     * Register an object for interaction detection.
     * Returns proxy object that should be used to track changes.
     * 
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
     * Call all error listener.
     * When any of the listener has false as result this method returns also false.
     * 
     * @returns false when any of the listener returns false, otherwise true.
     */
    private callErrorListener(pError: any): boolean {
        // Get current interactio zone.
        const lCurrentInteractionZone: InteractionZone = InteractionZone.current;

        // Execute all listener in event target zone.
        const lErrorSuppressed: boolean =  lCurrentInteractionZone.execute(() => {
            let lExecuteDefault: boolean = true;

            // Dispatch error event.
            for (const lListener of this.mErrorListenerList) {
                if (lListener(pError) === false) {
                    lExecuteDefault = false;
                }
            }

            return lExecuteDefault;
        });

        // Skip execution of parent when error is suppressed or zone has no parent. 
        if(lErrorSuppressed === false || !this.mParent) {
            return lErrorSuppressed;
        }

        // Bubble error by calling parent error listener.
        return this.mParent?.callErrorListener(pError);
    }

    private callInteractionListener(pInteractionReason: InteractionReason): void {
        // TODO: Only call listener when response-types matches reason.

        // TODO: Prevent double interaction by adding reason to weakset and check existence. 

        // Call all local listener.
        for (const lListener of this.mChangeListenerList) {
            lListener(pInteractionReason);
        }

        // Call listener from parent to send changes.
        this.mParent?.callInteractionListener(pInteractionReason);
    }

    /**
     * Check if this change detection is a child of another change detection.
     * @param pInteractionZone - Possible parent interaction zone.
     */
    private isChildOf(pInteractionZone: InteractionZone): boolean {
        if (pInteractionZone === this) {
            return true;
        }

        return !!this.parent?.isChildOf(pInteractionZone);
    }
}

export type ChangeListener = (pReason: InteractionReason) => void;
export type ErrorListener = (pError: any) => void | boolean;

type InteractionZoneConstructorSettings = {
    trigger?: InteractionResponseType,
    isolate?: boolean;
};