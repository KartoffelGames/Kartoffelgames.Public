import { Dictionary, Stack } from '@kartoffelgames/core.data';
import { Patcher } from './asynchron_tracker/patcher/patcher';
import { InteractionResponseType } from './enum/interaction-response-type.enum';
import { ErrorAllocation } from './error-allocation';
import { InteractionReason } from './interaction-reason';
import { InteractionDetectionProxy } from './synchron_tracker/interaction-detection-proxy';

// TODO: Add save() and restore(...) method. 
// Save a zone stack that can be saved and restored.
// Zones dont have a fixed parent anymore.
// Restore => restore<T>(savedStackObject, ExecutorFunction): T
// Restore executes function with provided save and restores original after execution.
// AsyncPatcher needs to save current stack and execute in restored stack.
// Interactions are bubbled down the stack instead of parents. 
// Bubbling down on stack pop.

/**
 * Merges execution zone and proxy tracking.
 */
export class InteractionZone {
    private static mZoneStack: InteractionZoneStack = new Stack<InteractionZone>();

    /**
     * Add global error listener that can sends the error to the allocated {@link InteractionZone}
     */
    static {
        // Catch global error, check if allocated zone is child of this interaction zone and report the error. 
        const lErrorHandler = (pErrorEvent: Event, pError: any) => {
            // Get allocated interaction zone.
            const lInteractionZoneStack: InteractionZoneStack | null = ErrorAllocation.getZoneStack(pError);
            if (lInteractionZoneStack) {
                // 
                // Dispatch error to the complete zone stack.
                for (const lZone of InteractionZone.mZoneStack.entries()) {
                    // Suppress console error message if error should be suppressed.
                    if (lZone.callErrorListener(pError)) {
                        pErrorEvent.preventDefault();
                        break;
                    }
                }
            }
        };

        // Create and register error and rejection listener.
        window.addEventListener('error', (pEvent: ErrorEvent) => {
            lErrorHandler(pEvent, pEvent.error);
        });
        window.addEventListener('unhandledrejection', (pEvent: PromiseRejectionEvent) => {
            // Get zone of the promise where the unhandled rejection occurred
            const lPromiseZoneStack: InteractionZoneStack | undefined = Patcher.promiseZone(pEvent.promise);
            if (!lPromiseZoneStack) {
                return;
            }

            // And allocate these zone to the current error.
            ErrorAllocation.allocateError(pEvent.reason, lPromiseZoneStack);

            lErrorHandler(pEvent, pEvent.reason);
        });
    }

    /**
     * Current execution zone.
     */
    public static get current(): InteractionZone {
        // Add a default zone when stack is empty.
        if (!InteractionZone.mZoneStack.top) {
            InteractionZone.mZoneStack.push(new InteractionZone('Default', { trigger: InteractionResponseType.Any, isolate: true }));
        }

        return InteractionZone.mZoneStack.top!;
    }

    /**
     * Dispatch interaction event in current zone.
     * 
     * @param pInteractionReason - Interaction reason.
     */
    public static dispatchInteractionEvent(pInteractionReason: InteractionReason): void {
        // Set zone of reason.
        pInteractionReason.setZone(InteractionZone.current);

        // Dispatch reason to the complete zone stack.
        for (const lZone of InteractionZone.mZoneStack.entries()) {
            // Skip reason bubbling when the zone has no active triggers for this reason.
            if (!lZone.callInteractionListener(pInteractionReason)) {
                break;
            }
        }
    }

    /**
     * Register an object for interaction detection.
     * Returns proxy object that should be used to track changes.
     * 
     * @param pObject - Object or function.
     */
    public static registerObject<T extends object>(pObject: T): T {
        const lCurrentZoneStack: InteractionZoneStack = InteractionZone.save();

        // Attach event handler for events that usually trigger direct changes on object.
        if (pObject instanceof Element) {
            Patcher.attachZoneStack(pObject, lCurrentZoneStack);
        }

        // Create interaction proxy and attach current zone.
        const lProxy = new InteractionDetectionProxy(pObject);
        lProxy.attachZoneStack(lCurrentZoneStack);

        return lProxy.proxy;
    }

    /**
     * Restores zone stack and executes function for the restored stack.
     * 
     * @param pZoneStack - Zone stack that should be restored.
     * @param pFunction - Function that should be executed with the restored stack.
     * @param pArgs - Optional parameter for the function.
     * 
     * @returns result of {@link pFunction}.
     */
    public static restore<T>(pZoneStack: InteractionZoneStack, pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T {
        // Save current stack.
        const lLastZoneStack: InteractionZoneStack = InteractionZone.mZoneStack;

        // Restore stack.
        InteractionZone.mZoneStack = pZoneStack;

        // Try to execute
        let lResult: T;
        try {
            lResult = pFunction(...pArgs);
        } finally {
            // Restore originalstack.
            InteractionZone.mZoneStack = lLastZoneStack;
        }

        return lResult;
    }

    /**
     * Save current zone stack, containing current nested zone executions.
     * The {@link InteractionZoneStack} can be {@link restore}d at any given point.
     * 
     * @returns current zone stack.
     */
    public static save(): InteractionZoneStack {
        return InteractionZone.mZoneStack.clone();
    }

    private readonly mChangeListener: Dictionary<ChangeListener, InteractionZone>;
    private readonly mErrorListener: Dictionary<ErrorListener, InteractionZone>;
    private readonly mIsolated: boolean;
    private readonly mName: string;
    private readonly mResponseType: InteractionResponseType;

    /**
     * Get interaction detection name.
     */
    public get name(): string {
        return this.mName;
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

        // Create bitmap of response triggers.
        this.mResponseType = pSettings?.trigger ?? InteractionResponseType.Any;

        // Save isolated state.
        this.mIsolated = pSettings?.isolate === true;
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
        const lLastZoneStack: InteractionZoneStack = InteractionZone.mZoneStack;

        // On isloated zone. Create new stack.
        if (this.mIsolated) {
            InteractionZone.mZoneStack = new Stack<InteractionZone>();
        }

        // Set this zone as execution zone and execute function.
        InteractionZone.mZoneStack.push(this);

        // Try to execute
        let lResult: any;
        try {
            lResult = pFunction(...pArgs);
        } catch (pError) {
            ErrorAllocation.allocateError(pError, InteractionZone.save());
            throw pError;
        } finally {
            // Reset to last zone.
            InteractionZone.mZoneStack.pop();

            // Does nothing when current zone is not isolated.
            InteractionZone.mZoneStack = lLastZoneStack;
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

        return lErrorSuppressed;
    }

    /**
     * Call all interaction listener of this zone and bubble it to its paren zone.
     * Prevents the zone to trigger the same reason more than once
     * 
     * @param pInteractionReason - Interaction reason.
     */
    private callInteractionListener(pInteractionReason: InteractionReason): boolean {
        // Block dispatch of reason when it does not match the response type bitmap.
        // Send it when it was passthrough from child zones.
        if ((this.mResponseType & pInteractionReason.interactionType) === 0) {
            return false;
        }

        // Call all local listener.
        for (const [lListener, lZone] of this.mChangeListener.entries()) {
            lZone.execute(lListener, pInteractionReason);
        }

        return true;
    }
}

export type ChangeListener = (pReason: InteractionReason) => void;
export type ErrorListener = (pError: any) => void | boolean;

type InteractionZoneConstructorSettings = {
    trigger?: InteractionResponseType,
    isolate?: boolean;
};

export type InteractionZoneStack = Stack<InteractionZone>;