import { Dictionary } from '@kartoffelgames/core.data';
import { ErrorAllocation } from './error-allocation';
import { InteractionReason } from './interaction-reason';

// TODO: Remove any interaction detection from patcher. Only maintain zones.
// TODO: Zones handles universal trigger. No more fixed enum.
// TODO: Rename project into. Interaction zone. Only Zone files remain. Proxy (and IgnoreInteractionDetection) moves out into pwb.
// TODO: Rename KartoffelGames.Core.Data into Kartoffelgames.Core. Move comparison objects in it.

/**
 * Merges execution zone and proxy tracking.
 */
export class InteractionZone {
    // Needs to be isolated to prevent parent listener execution.
    private static mCurrentZone: InteractionZone = new InteractionZone('Default', { trigger: 0, isolate: true });

    /**
     * Add global error listener that can sends the error to the allocated {@link InteractionZone}
     */
    static {
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
        window.addEventListener('error', (pEvent: ErrorEvent) => {
            // Skip none object errors.
            if (typeof pEvent.error !== 'object' || pEvent.error === null) {
                return;
            }

            // Get syncron error allocation.
            lErrorHandler(pEvent, pEvent.error, ErrorAllocation.getSyncronErrorZone(pEvent.error));
        });
        window.addEventListener('unhandledrejection', (pEvent: PromiseRejectionEvent) => {
            // Get zone of the promise where the unhandled rejection occurred
            lErrorHandler(pEvent, pEvent.reason, ErrorAllocation.getAsyncronErrorZone(pEvent.promise));
        });
    }

    /**
     * Current execution zone.
     */
    public static get current(): InteractionZone {
        return InteractionZone.mCurrentZone;
    }

    /**
     * Dispatch interaction event in current zone.
     * 
     * @param pType - Interaction reason.
     * 
     * @returns false when any zone in the parent chain dont has trigger for {@link pInteractionReason}
     */
    public static dispatchInteractionEvent(pType: number, pSource: object, pProperty?: PropertyKey): boolean {
        // Optimization to prevent InteractionReason creation.
        // Validate trigger type with current zones trigger mapping.
        if ((this.mCurrentZone.mTriggerMapping & pType) === 0) {
            return false;
        }

        // Create reason and save current zone as reason origin.
        const lReason: InteractionReason = new InteractionReason(pType, pSource, pProperty, this.mCurrentZone);

        // Start dispatch to current zone.
        return this.mCurrentZone.callInteractionListener(lReason);
    }

    private readonly mChangeListener: Dictionary<ChangeListener, InteractionZone>;
    private readonly mErrorListener: Dictionary<ErrorListener, InteractionZone>;
    private readonly mIsolated: boolean;
    private readonly mName: string;
    private readonly mParent: InteractionZone | null;
    private readonly mTriggerMapping: number;


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
        // Initialize listener lists
        this.mChangeListener = new Dictionary<ChangeListener, InteractionZone>();
        this.mErrorListener = new Dictionary<ErrorListener, InteractionZone>();

        // Set name of zone. Used only for debugging and labeling.
        this.mName = pName;

        // Create bitmap of response triggers.
        this.mTriggerMapping = pSettings?.trigger ?? ~0; // Negated 0 results in -1 wich is all bits flipped to 1.

        // Save parent when not isolated.
        this.mParent = InteractionZone.mCurrentZone ?? null;

        // Save isolation state.
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
    public execute<T extends (...pArgs: Array<any>) => any>(pFunction: T, ...pArgs: Parameters<T>): ReturnType<T> {
        const lLastZone: InteractionZone = InteractionZone.mCurrentZone;

        // Set this zone as execution zone and execute function.
        InteractionZone.mCurrentZone = this;

        // Try to execute
        let lResult: any;
        try {
            lResult = pFunction(...pArgs);
        } catch (pError) {
            throw ErrorAllocation.allocateSyncronError(pError, InteractionZone.mCurrentZone);
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
     * Call all interaction listener of this zone and bubble it to its paren zone.
     * Prevents the zone to trigger the same reason more than once
     * 
     * @param pInteractionReason - Interaction reason.
     */
    private callInteractionListener(pInteractionReason: InteractionReason): boolean {
        // Block dispatch of reason when it does not match the response type bitmap.
        // Send it when it was passthrough from child zones.
        if ((this.mTriggerMapping & pInteractionReason.triggerType) === 0) {
            return false;
        }

        // Set zone of reason and skip dispatch when zone was already dispatched.
        if (!pInteractionReason.addDispatchedZone(this)) {
            // Call all local listener in current zone.
            this.execute(() => {
                for (const [lListener, lZone] of this.mChangeListener.entries()) {
                    lZone.execute(() => {
                        lListener.call(this, pInteractionReason);
                    });
                }
            });
        }

        // Skip parent execution when isolated.
        if (this.mIsolated) {
            return true;
        }

        // Parent is allways not null. Root (Default.Zone) is isolated and therefore this line is not executed.
        return this.parent!.callInteractionListener(pInteractionReason);
    }
}

export type ChangeListener = (pReason: InteractionReason) => void;
export type ErrorListener = (pError: any) => void | boolean;

type InteractionZoneConstructorSettings = {
    trigger?: number,
    isolate?: boolean;
};