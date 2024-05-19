import { List } from '@kartoffelgames/core.data';
import { InteractionResponseType } from './enum/interaction-response-type.enum';
import { ErrorAllocation } from './execution_zone/error-allocation';
import { Patcher } from './execution_zone/patcher/patcher';
import { InteractionReason } from './interaction-reason';
import { InteractionDetectionProxy } from './synchron_tracker/interaction-detection-proxy';

/**
 * Merges execution zone and proxy tracking.
 */
export class InteractionZone {
    private static mCurrentZone: InteractionZone | null = null;

    /**
     * Add global error listener that can sends the error to the allocated {@link InteractionZone}
     */
    static {
        // Catch global error, check if allocated zone is child of this change detection and report the error. 
        const lErrorHandler = (pErrorEvent: Event, pError: any) => {
            // Get allocated interaction zone.
            const lInteractionZone: InteractionZone | null = ErrorAllocation.getInteractionZone(pError);
            if (lInteractionZone) {
                // Suppress console error message if error should be suppressed
                const lExecuteDefault: boolean = lInteractionZone.callErrorListener(pError);
                if (!lExecuteDefault) {
                    pErrorEvent.preventDefault();
                }
            }
        };

        // Create and register error and rejection listener. // TODO: How to prevent recursion.
        window.addEventListener('error', (pEvent: ErrorEvent) => {
            lErrorHandler(pEvent, pEvent.error);
        });
        window.addEventListener('unhandledrejection', (pEvent: PromiseRejectionEvent) => {
            const lPromise: Promise<any> = pEvent.promise;
            const lPromiseZone: InteractionZone = Reflect.get(lPromise, Patcher.PATCHED_PROMISE_ZONE_KEY);
            ErrorAllocation.allocateError(pEvent.reason, lPromiseZone);

            lErrorHandler(pEvent, pEvent.reason);
        });
    }

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

    /**
     * Register an object for interaction detection.
     * Returns proxy object that should be used to track changes.
     * 
     * @param pObject - Object or function.
     */
    public static registerObject<T extends object>(pObject: T): T {
        // Create interaction proxy.
        return new InteractionDetectionProxy(pObject).proxy;
    }

    private readonly mAllreadySendReasons: WeakSet<InteractionReason>;
    private readonly mChangeListenerList: List<ChangeListener>;
    private readonly mErrorListenerList: List<ErrorListener>;
    private readonly mName: string;
    private readonly mParent: InteractionZone | null;
    private readonly mResponseType: InteractionResponseType;

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
        // Patch for execution zone.
        Patcher.patch(globalThis);

        // Initialize lists
        this.mChangeListenerList = new List<ChangeListener>();
        this.mErrorListenerList = new List<ErrorListener>();
        this.mAllreadySendReasons = new WeakSet<InteractionReason>();

        // Save parent.
        if (pSettings?.isolate === true || InteractionZone.mCurrentZone === null) {
            this.mParent = null;
        } else {
            this.mParent = InteractionZone.current;
        }

        // Create new execution zone or use old one.#
        this.mName = pName;

        // Create bitmap of response triggers. Zone should only dispatch events when reason matches response type.
        this.mResponseType = pSettings?.trigger ?? InteractionResponseType.Any;
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
     * Call all error listener.
     * When any of the listener has false as result this method returns also false.
     * 
     * @returns false when any of the listener returns false, otherwise true.
     */
    private callErrorListener(pError: any): boolean {
        // Get current interactio zone.
        const lCurrentInteractionZone: InteractionZone = InteractionZone.current;

        // Execute all listener in event target zone.
        const lErrorSuppressed: boolean = lCurrentInteractionZone.execute(() => {
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
        if (lErrorSuppressed === false || !this.mParent) {
            return lErrorSuppressed;
        }

        // Bubble error by calling parent error listener.
        return this.mParent?.callErrorListener(pError);
    }

    private callInteractionListener(pInteractionReason: InteractionReason): void {
        // Restrict zone to trigger the same reason more than once.
        if (this.mAllreadySendReasons.has(pInteractionReason)) {
            return;
        }

        // Block dispatch of reason when it does not match the response type bitmap. 
        if ((this.mResponseType & pInteractionReason.interactionType) === 0) {
            return;
        }

        this.mAllreadySendReasons.add(pInteractionReason);

        // Call all local listener.
        for (const lListener of this.mChangeListenerList) {
            lListener(pInteractionReason);
        }

        // Call listener from parent to send changes.
        this.mParent?.callInteractionListener(pInteractionReason);
    }
}

export type ChangeListener = (pReason: InteractionReason) => void;
export type ErrorListener = (pError: any) => void | boolean;

type InteractionZoneConstructorSettings = {
    trigger?: InteractionResponseType,
    isolate?: boolean;
};