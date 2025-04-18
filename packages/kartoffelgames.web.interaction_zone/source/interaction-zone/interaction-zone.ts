import { Dictionary, Exception } from '@kartoffelgames/core';
import { InteractionZoneErrorAllocation } from './interaction-zone-error-allocation.ts';
import { InteractionZoneEvent, type InteractionZoneEventTriggerType } from './interaction-zone-event.ts';
import { InteractionZoneGlobalScope, type InteractionZoneGlobalScopeTarget } from './interaction-zone-global-scope.ts';

/**
 * Merges execution zone and proxy tracking.
 */
export class InteractionZone {
    // Needs to be isolated to prevent parent listener execution.
    private static mCurrentZone: InteractionZone = new InteractionZone('Default', null, true);

    /**
     * Current execution zone.
     */
    public static get current(): InteractionZone {
        return InteractionZone.mCurrentZone;
    }

    /**
     * Add global tracing error listener that can sends the error to the allocated {@link InteractionZone}
     * 
     * @param pTargetDefinition - Target scope definition.
     */
    public static enableGlobalTracing(pTargetDefinition: InteractionZoneGlobalDefinition): boolean {
        // Patch global scope return immediately when already patched.
        if (!InteractionZoneGlobalScope.enable(pTargetDefinition)) {
            return false;
        }

        // Skip global error handling when not enabled.
        if (!pTargetDefinition.errorHandling) {
            return true;
        }

        // Try to read global scope events handler.
        const lTargetGlobalScope = pTargetDefinition.target;
        if (!('addEventListener' in lTargetGlobalScope) || typeof lTargetGlobalScope.addEventListener !== 'function') {
            throw new Exception('Global scope does not support addEventListener', InteractionZone);
        }

        // Catch global error, check if allocated zone is child of this interaction zone and report the error. 
        const lErrorHandler = (pErrorEvent: Event, pError: any, pInteractionZone?: InteractionZone | null) => {
            // Skip any error without allocated zone stack.
            if (!pInteractionZone) {
                return;
            }

            // Suppress console error message if error should be suppressed.
            if (pInteractionZone.callErrorListener(pError)) {
                pErrorEvent.preventDefault();
            }
        };

        // Create and register error and rejection listener.
        lTargetGlobalScope.addEventListener('error', (pEvent: ErrorEvent) => {
            // Skip none object errors.
            if (typeof pEvent.error !== 'object' || pEvent.error === null) {
                return;
            }

            // Get syncron error allocation.
            lErrorHandler(pEvent, pEvent.error, InteractionZoneErrorAllocation.getSyncronErrorZone(pEvent.error));
        });
        lTargetGlobalScope.addEventListener('unhandledrejection', (pEvent: PromiseRejectionEvent) => {
            // Get zone of the promise where the unhandled rejection occurred
            lErrorHandler(pEvent, pEvent.reason, InteractionZoneErrorAllocation.getAsyncronErrorZone(pEvent.promise));
        });

        return true;
    }

    /**
     * Dispatch interaction event in current zone.
     * 
     * @param pType - Interaction type.
     * @param pTrigger - Interaction trigger.
     * @param pData - Data of event.
     * 
     * @returns false when any zone in the parent chain dont has trigger for {@link pTrigger} with {@link pType}
     */
    public static pushInteraction<TTrigger extends number, TData extends object>(pType: InteractionZoneEventTriggerType<TTrigger>, pTrigger: TTrigger, pData: TData): boolean {
        // Optimization to prevent InteractionReason creation.
        // Validate trigger type with current zones trigger mapping.
        const lTriggerMap: number = this.mCurrentZone.mTriggerMapping.get(pType) ?? ~0;
        if ((lTriggerMap & pTrigger) === 0) {
            return false;
        }

        // Create reason and save current zone as reason origin.
        const lReason: InteractionZoneEvent<TTrigger, TData> = new InteractionZoneEvent(pType, pTrigger, this.mCurrentZone, pData);

        // Start dispatch to current zone.
        return this.mCurrentZone.callInteractionListener(lReason);
    }

    private readonly mAttachments: Map<symbol, any>;
    private readonly mErrorListener: Dictionary<ErrorListener, InteractionZone>;
    private readonly mInteractionListener: Dictionary<InteractionZoneEventTriggerType<unknown>, Dictionary<InteractionListener<number, object>, InteractionZone>>;
    private readonly mIsolated: boolean;
    private readonly mName: string;
    private readonly mParent: InteractionZone | null;
    private readonly mTriggerMapping: Dictionary<InteractionZoneEventTriggerType<unknown>, number>;

    /**
     * Get interaction detection name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Get parents of zone.
     * Return null when zone is isloated.
     */
    public get parent(): InteractionZone {
        return this.mParent!;
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
    private constructor(pName: string, pParent: InteractionZone | null, pIsolate: boolean) {
        // Initialize lists
        this.mAttachments = new Map<symbol, any>();
        this.mErrorListener = new Dictionary<ErrorListener, InteractionZone>();

        // Set name of zone. Used only for debugging and labeling.
        this.mName = pName;

        // Create Trigger and their listener list.
        this.mTriggerMapping = new Dictionary<InteractionZoneEventTriggerType<unknown>, number>();
        this.mInteractionListener = new Dictionary<InteractionZoneEventTriggerType<unknown>, Dictionary<InteractionListener<number, object>, InteractionZone>>();

        // Save parent when not isolated.
        this.mParent = pParent;

        // Save isolation state.
        this.mIsolated = pIsolate;
    }

    /**
     * Add listener for error events.
     * Prevent error bubble and defaults like print on console when {@link pListener} return the actual value false.
     * Ignores adding the same listener multiple times.
     * 
     * @param pListener - Listener.
     * 
     * @returns itself. 
     */
    public addErrorListener(pListener: ErrorListener): this {
        this.mErrorListener.set(pListener, InteractionZone.current);

        // Chainable.
        return this;
    }

    /**
     * Add listener for change events.
     * Ignores adding the same listener multiple times.
     * 
     * @param pListener - Listener.
     * 
     * @returns itself. 
     */
    public addInteractionListener<TTrigger extends number, TData extends object>(pType: InteractionZoneEventTriggerType<TTrigger>, pListener: InteractionListener<TTrigger, TData>): this {
        // Init interaction listener list when not already setup.
        if (!this.mInteractionListener.has(pType)) {
            this.mInteractionListener.set(pType, new Dictionary<InteractionListener<number, object>, InteractionZone>());
        }

        // Add listener to list
        this.mInteractionListener.get(pType)!.set(pListener as InteractionListener<number, object>, InteractionZone.current);

        // Chainable.
        return this;
    }

    /**
     * Add new or overwrite trigger of zone.
     * Listener are not executed when bitmap is set to zero.
     * 
     * @param pType - Trigger type. Usually the typeof T.
     * @param pAllowedTrigger - All allowed trigger bits as number.
     * 
     * @returns itself. 
     */
    public addTriggerRestriction<T extends number>(pType: InteractionZoneEventTriggerType<T>, pAllowedTrigger: T): this {
        // Add or override trigger bitmap.
        this.mTriggerMapping.set(pType, pAllowedTrigger);

        // Chainable.
        return this;
    }

    /**
     * Get or set attachment value.
     * Values are set to the current zone and when read, searched in any parent zone.
     * Isolated zones breaks the parent chain.
     * 
     * @param pSymbol - Key of attachment.
     * @param pValue - Value of attachment.
     * 
     * @returns the current value of the attachment or undefined when no value is set. 
     */
    public attachment(pSymbol: symbol, pValue?: any): any {
        // Sets the value of the attachment when pValue is set.
        if (typeof pValue !== 'undefined') {
            this.mAttachments.set(pSymbol, pValue);
            return pValue;
        }

        // Try to read the value of the attachment.
        const lAttachmentValue: any = this.mAttachments.get(pSymbol);
        if (typeof lAttachmentValue !== 'undefined') {
            return lAttachmentValue;
        }

        // Skip parent search when isolated.
        if (this.mIsolated) {
            return undefined;
        }

        // When the value was not found search in parent zones. Parent is allways set and the root zone is isolated.
        return this.mParent!.attachment(pSymbol);
    }

    /**
     * Create descendant of this zone.
     * 
     * @param pName - Name of new zone.
     * @param pOptions - Zone options..
     * 
     * @returns new {@link InteractionZone} with zone as parent.
     */
    public create(pName: string, pOptions?: InteractionZoneConstructorSettings): InteractionZone {
        return new InteractionZone(pName, this, pOptions?.isolate === true);
    }

    /**
     * Executes function in this execution zone.
     * 
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     * 
     * @returns result of execution.
     */
    public execute<T extends (...pArgs: Array<any>) => any>(pFunction: T, ...pArgs: Parameters<T>): ReturnType<T> {
        const lLastZone: InteractionZone = InteractionZone.mCurrentZone;

        // Set this zone as execution zone and execute function.
        InteractionZone.mCurrentZone = this;

        // Try to execute
        let lResult: any;
        try {
            lResult = pFunction(...pArgs);
        } catch (pError) {
            throw InteractionZoneErrorAllocation.allocateSyncronError(pError, InteractionZone.mCurrentZone);
        } finally {
            // Reset to last zone.
            InteractionZone.mCurrentZone = lLastZone;
        }

        return lResult;
    }

    /**
     * Remove listener for error events.
     * 
     * @param pListener - Listener.
     * 
     * @returns itself.
     */
    public removeErrorListener(pListener: ErrorListener): this {
        this.mErrorListener.delete(pListener);

        // Chainable.
        return this;
    }

    /**
     * Remove listener for change events.
     * When no listener is specified. All listener of the type are removed.
     * 
     * @param pListener - Listener.
     * 
     * @returns itself.
     */
    public removeInteractionListener(pType: InteractionZoneEventTriggerType<unknown>, pListener?: InteractionListener<number, object>): this {
        // Remove every listener of type.
        if (!pListener) {
            this.mInteractionListener.delete(pType);

            // Chainable.
            return this;
        }

        // Read current listener list of type. 
        const lListenerList: Dictionary<InteractionListener<number, object>, InteractionZone> | undefined = this.mInteractionListener.get(pType);
        if (!lListenerList) {
            return this;
        }

        // Remove single listener from type.
        lListenerList.delete(pListener);

        // Chainable.
        return this;
    }

    /**
     * Call all error listener.
     * When any of the listener has false as result this method returns true.
     * 
     * @returns true when any of the error listener returns false(prevent default), otherwise false.
     */
    private callErrorListener(pError: any): boolean {
        // Dispatch error event in current zone.
        const lErrorSuppressed: boolean = this.execute(() => {
            for (const [lListener, lZone] of this.mErrorListener.entries()) {
                if (lZone.execute(() => lListener.call(this, pError)) === false) {
                    return true;
                }
            }

            return false;
        });

        // Prevent parent execution when error was suppressed.
        if (lErrorSuppressed) {
            return true;
        }

        // Skip parent execution when isolated.
        if (this.mIsolated) {
            return false;
        }

        // Parent is allways not null. Root (Default.Zone) is isolated and therefore this line is not executed.
        return this.parent!.callErrorListener(pError);
    }

    /**
     * Call all interaction listener of this zone and bubble it to its parent zone.
     * Prevents the zone to trigger the same event more than once on the same zone.
     * 
     * @param pEvent - Interaction event.
     */
    private callInteractionListener(pEvent: InteractionZoneEvent<number, object>): boolean {
        // Read trigger. None set trigger are allways wildcards.
        const lTriggerBitmap: number = this.mTriggerMapping.get(pEvent.type) ?? ~0;

        // Block dispatch of reason when it does not match the response type bitmap.
        // Send it when it was passthrough from child zones.
        if ((lTriggerBitmap & pEvent.trigger) === 0) {
            return false;
        }

        // Skip dispatch when zone was already dispatched.  
        // Read interaction listener of interaction type.
        const lInteractionListenerList = this.mInteractionListener.get(pEvent.type);
        if (lInteractionListenerList && lInteractionListenerList.size > 0) {
            this.execute(() => {
                for (const [lListener, lZone] of lInteractionListenerList.entries()) {
                    lZone.execute(() => {
                        lListener.call(this, pEvent);
                    });
                }
            });
        }

        // Skip parent execution when isolated.
        if (this.mIsolated) {
            return true;
        }

        // Parent is allways not null. Root (Default.Zone) is isolated and therefore this line is not executed.
        return this.parent!.callInteractionListener(pEvent);
    }
}

export type InteractionZoneGlobalDefinition = InteractionZoneGlobalScopeTarget & {
    errorHandling?: boolean;
};
export type InteractionListener<TTrigger extends number, TData extends object> = (pReason: InteractionZoneEvent<TTrigger, TData>) => void;
export type ErrorListener = (pError: any) => void | boolean;

type InteractionZoneConstructorSettings = {
    isolate?: boolean;
};