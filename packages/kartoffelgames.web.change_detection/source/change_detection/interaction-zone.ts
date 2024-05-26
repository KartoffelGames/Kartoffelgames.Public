import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { InteractionResponseType } from './enum/interaction-response-type.enum';
import { ErrorAllocation } from './asynchron_tracker/error-allocation';
import { Patcher } from './asynchron_tracker/patcher/patcher';
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
        // Catch global error, check if allocated zone is child of this interaction zone and report the error. 
        const lErrorHandler = (pErrorEvent: Event, pError: any) => {
            // Get allocated interaction zone.
            const lInteractionZone: InteractionZone | null = ErrorAllocation.getInteractionZone(pError);
            if (lInteractionZone) {
                // Suppress console error message if error should be suppressed
                const lPreventDefault: boolean = lInteractionZone.callErrorListener(pError);
                if (lPreventDefault) {
                    pErrorEvent.preventDefault();
                }
            }
        };

        // Create and register error and rejection listener.
        window.addEventListener('error', (pEvent: ErrorEvent) => {
            lErrorHandler(pEvent, pEvent.error);
        });
        window.addEventListener('unhandledrejection', (pEvent: PromiseRejectionEvent) => {
            // Get zone of the promise where the unhandled rejection occurred
            const lPromiseZone: InteractionZone | undefined = Patcher.promiseZone(pEvent.promise);
            if (!lPromiseZone) {
                return;
            }

            // And allocate these zone to the current error.
            ErrorAllocation.allocateError(pEvent.reason, lPromiseZone);

            lErrorHandler(pEvent, pEvent.reason);
        });
    }

    /**
     * Current execution zone.
     */
    public static get current(): InteractionZone {
        if (InteractionZone.mCurrentZone === null) {
            InteractionZone.mCurrentZone = new InteractionZone('Default', { trigger: InteractionResponseType.Any, isolate: true });
        }

        return InteractionZone.mCurrentZone;
    }

    /**
     * Dispatch interaction event in current zone.
     * 
     * @param pInteractionReason - Interaction reason.
     */
    public static dispatchInteractionEvent(pInteractionReason: InteractionReason): void {
        // Set zone of reason.
        pInteractionReason.setZone(InteractionZone.current);

        // Dispatch reason.
        InteractionZone.current.callInteractionListener(pInteractionReason);
    }

    /**
     * Register an object for interaction detection.
     * Returns proxy object that should be used to track changes.
     * 
     * @param pObject - Object or function.
     */
    public static registerObject<T extends object>(pObject: T): T {
        // Attach event handler for events that usually trigger direct changes on object.
        if (pObject instanceof Element) {
            Patcher.attachZoneEvent(pObject, InteractionZone.current);
        }

        // Create interaction proxy.
        return new InteractionDetectionProxy(pObject).proxy;
    }

    private readonly mChangeListener: Dictionary<ChangeListener, InteractionZone>;
    private readonly mErrorListener: Dictionary<ErrorListener, InteractionZone>;
    private readonly mName: string;
    private readonly mParent: InteractionZone | null;
    private readonly mResponseType: InteractionResponseType;

    /**
     * Get interaction detection name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Get interaction zone parent.
     */
    public get parent(): InteractionZone | null {
        return this.mParent;
    }

    /**
     * Constructor.
     * Creates new interaction zone. Detects all asynchron executions inside execution zone.
     * Except IndexDB calls.
     * Listens on changes and function calls on registered objects.
     * Child changes triggers parent interaction zone but parent doesn't trigger child.
     * 
     * @param pName - Name of interaction zone.
     * @param pSettings - Interaction zone settings.
     */
    public constructor(pName: string, pSettings?: InteractionZoneConstructorSettings) {
        // Patch for execution zone.
        Patcher.patch(globalThis);

        // Initialize lists
        this.mChangeListener = new Dictionary<ChangeListener, InteractionZone>();
        this.mErrorListener = new Dictionary<ErrorListener, InteractionZone>();

        // Create new execution zone or use old one.#
        this.mName = pName;

        // Save parent.
        if (pSettings?.isolate === true) {
            this.mParent = null;

            // Any parentless zone needs own trigger.
            if (typeof pSettings?.trigger !== 'number') {
                throw new Exception('Interactions zones without a zone needs to set trigger.', this);
            }

            // Create bitmap of response triggers. Zone should only dispatch events when reason matches response type.
            this.mResponseType = pSettings?.trigger;
        } else {
            this.mParent = InteractionZone.current;

            // Create bitmap of response triggers. Zone should only dispatch events when reason matches response type.
            this.mResponseType = pSettings?.trigger ?? this.mParent.mResponseType;
        }
    }

    /**
     * Add listener for error events.
     * Prevent error defaults like print on console when {@link pListener} return the actual value false.
     * Ignores adding the same listener multiple times.
     * 
     * @param pListener - Listener.
     */
    public addErrorListener(pListener: ErrorListener): void {
        this.mErrorListener.add(pListener, InteractionZone.current);
    }

    /**
     * Add listener for change events.
     * Ignores adding the same listener multiple times.
     * 
     * @param pListener - Listener.
     */
    public addInteractionListener(pListener: ChangeListener): void {
        this.mChangeListener.add(pListener, InteractionZone.current);
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

        // Try to execute
        let lResult: any;
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
     * Remove listener for error events.
     * Prevent error defaults like print on console when {@link pListener} return the actual value false.
     * 
     * @param pListener - Listener.
     */
    public removeErrorListener(pListener: ErrorListener): void {
        this.mErrorListener.delete(pListener);
    }

    /**
     * Remove listener for change events.
     * @param pListener - Listener.
     */
    public removeInteractionListener(pListener: ChangeListener): void {
        this.mChangeListener.delete(pListener);
    }

    /**
     * Call all error listener.
     * When any of the listener has false as result this method returns true.
     * 
     * @returns true when any of the error listener returns false(prevent default), otherwise false.
     */
    private callErrorListener(pError: any): boolean {
        // Execute all listener in event target zone.
        let lErrorSuppressed: boolean = false;

        // Dispatch error event.
        for (const [lListener, lZone] of this.mErrorListener.entries()) {
            // Call listener in same zone where it was initialized.
            if (lZone.execute(lListener, pError) === false) {
                lErrorSuppressed = true;
            }
        }

        // Skip execution of parent when error is suppressed or zone has no parent. 
        if (lErrorSuppressed || !this.mParent) {
            return lErrorSuppressed;
        }

        // Bubble error by calling parent error listener.
        return this.mParent?.callErrorListener(pError);
    }

    /**
     * Call all interaction listener of this zone and bubble it to its paren zone.
     * Prevents the zone to trigger the same reason more than once
     * 
     * @param pInteractionReason - Interaction reason.
     */
    private callInteractionListener(pInteractionReason: InteractionReason): void {
        // Block dispatch of reason when it does not match the response type bitmap.
        // Send it when it was passthrough from child zones.
        if (pInteractionReason.zone === this && (this.mResponseType & pInteractionReason.interactionType) === 0) {
            return;
        }

        // Call all local listener.
        for (const [lListener, lZone] of this.mChangeListener.entries()) {
            lZone.execute(lListener, pInteractionReason);
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