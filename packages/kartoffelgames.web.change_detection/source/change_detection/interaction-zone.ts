import { Dictionary, Stack } from '@kartoffelgames/core.data';
import { Patcher } from './asynchron_tracker/patcher/patcher';
import { InteractionResponseType } from './enum/interaction-response-type.enum';
import { ErrorAllocation } from './error-allocation';
import { InteractionReason } from './interaction-reason';
import { InteractionDetectionProxy } from './synchron_tracker/interaction-detection-proxy';

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
        const lErrorHandler = (pErrorEvent: Event, pError: any, pInteractionZoneStack?: InteractionZoneStack | null) => {
            // Skip any error without allocated zone stack.
            if (!pInteractionZoneStack) {
                return;
            }

            // Dispatch error to the complete zone stack.
            for (const lZone of pInteractionZoneStack.entries()) {
                // Suppress console error message if error should be suppressed.
                if (lZone.callErrorListener(pError)) {
                    pErrorEvent.preventDefault();
                    break;
                }
            }
        };

        // Create and register error and rejection listener.
        window.addEventListener('error', (pEvent: ErrorEvent) => {
            // Skip none object errors.
            if (typeof pEvent.error !== 'object' || pEvent.error === null) {
                return;
            }

            // Get syncron error allocation.
            lErrorHandler(pEvent, pEvent.error, ErrorAllocation.getSyncronErrorZoneStack(pEvent.error));
        });
        window.addEventListener('unhandledrejection', (pEvent: PromiseRejectionEvent) => {
            // Get zone of the promise where the unhandled rejection occurred
            lErrorHandler(pEvent, pEvent.reason, ErrorAllocation.getAsyncronErrorZoneStack(pEvent.promise));
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
     * 
     * @returns false when any zone in the current stack dont has trigger for {@link pInteractionReason}
     */
    public static dispatchInteractionEvent(pInteractionReason: InteractionReason): boolean {
        pInteractionReason.setOrigin(InteractionZone.save());

        // Dispatch reason to the complete zone stack.
        for (const lZone of InteractionZone.mZoneStack.entries()) {
            // Skip reason bubbling when the zone has no active triggers for this reason.
            if (!lZone.callInteractionListener(pInteractionReason)) {
                return false;
            }
        }

        return true;
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
        } catch (pError) {
            throw ErrorAllocation.allocateSyncronError(pError, pZoneStack);
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

    private readonly mChangeListener: Dictionary<ChangeListener, InteractionZoneStack>;
    private readonly mErrorListener: Dictionary<ErrorListener, InteractionZoneStack>;
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
        this.mChangeListener = new Dictionary<ChangeListener, InteractionZoneStack>();
        this.mErrorListener = new Dictionary<ErrorListener, InteractionZoneStack>();

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
        this.mErrorListener.add(pListener, InteractionZone.save());
    }

    /**
     * Add listener for change events.
     * Ignores adding the same listener multiple times.
     * 
     * @param pListener - Listener.
     */
    public addInteractionListener(pListener: ChangeListener): void {
        this.mChangeListener.add(pListener, InteractionZone.save());
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
            throw ErrorAllocation.allocateSyncronError(pError, InteractionZone.save());
        } finally {
            // Reset to last zone.
            InteractionZone.mZoneStack.pop();

            // Does nothing when current zone is not isolated.
            InteractionZone.mZoneStack = lLastZoneStack;
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
        // Attach event handler for events that usually trigger direct changes on object.
        if (pObject instanceof Element) {
            // Get current stack and push this zone.
            const lCurrentZoneStack: InteractionZoneStack = InteractionZone.save();
            lCurrentZoneStack.push(this);

            Patcher.attachZoneStack(pObject, lCurrentZoneStack);
        }

        // Create interaction proxy and attach current zone.
        return new InteractionDetectionProxy(pObject, this).proxy;
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
        for (const [lListener, lZoneStack] of this.mErrorListener.entries()) {
            // Call listener in same zone where it was initialized.
            if (InteractionZone.restore(lZoneStack, lListener, pError) === false) {
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

        // Set zone of reason.
        if (!pInteractionReason.addDispatchedZone(this)) {
            // Call all local listener.
            for (const [lListener, lZoneStack] of this.mChangeListener.entries()) {
                InteractionZone.restore(lZoneStack, lListener, pInteractionReason);
            }
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