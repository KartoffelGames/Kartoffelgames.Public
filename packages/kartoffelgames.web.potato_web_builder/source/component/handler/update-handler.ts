import { List } from '@kartoffelgames/core.data';
import { ChangeDetection, ChangeDetectionReason } from '@kartoffelgames/web.change-detection';
import { UpdateScope } from '../../enum/update-scope.enum';
import { LoopDetectionHandler } from './loop-detection-handler';

/**
 * Component update handler. Handles automatic and manual updates.
 * Integrates with {@link LoopDetectionHandler} to detect update loops.
 * 
 * @internal
 */
export class UpdateHandler {
    private readonly mChangeDetection: ChangeDetection;
    private readonly mChangeDetectionListener: (pReason: ChangeDetectionReason) => void;
    private mEnabled: boolean;
    private readonly mLoopDetectionHandler: LoopDetectionHandler;
    private readonly mUpdateListener: List<UpdateListener>;
    private readonly mUpdateScope: UpdateScope;
    private readonly mUpdateWaiter: List<UpdateWaiter>;

    /**
     * Get change detection of update handler.
     */
    public get changeDetection(): ChangeDetection {
        return this.mChangeDetection;
    }

    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    public get enabled(): boolean {
        return this.mEnabled;
    }

    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    public set enabled(pEnabled: boolean) {
        this.mEnabled = pEnabled;
    }

    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    public constructor(pUpdateScope: UpdateScope) {
        this.mUpdateScope = pUpdateScope;
        this.mUpdateListener = new List<UpdateListener>();
        this.mEnabled = false;
        this.mUpdateWaiter = new List<UpdateWaiter>();
        this.mLoopDetectionHandler = new LoopDetectionHandler(10);

        // Create new change detection if component is not inside change detection or mode is capsuled.
        switch (this.mUpdateScope) {
            case UpdateScope.Manual: {
                // Manual zone outside every other zone.
                this.mChangeDetection = new ChangeDetection('Manual Zone', ChangeDetection.current, true, true);

                // Empty change listener.
                this.mChangeDetectionListener = () => {/* Empty */ };

                break;
            }

            case UpdateScope.Capsuled: {
                // New zone exclusive for this component.
                this.mChangeDetection = new ChangeDetection('DefaultComponentZone', ChangeDetection.current, true);

                // Shedule an update on change detection.
                this.mChangeDetectionListener = (pReason: ChangeDetectionReason) => { this.sheduleUpdateTask(pReason); };

                break;
            }

            case UpdateScope.Global: {
                // Reuse current zone
                this.mChangeDetection = ChangeDetection.currentNoneSilent;

                // Shedule an update on change detection.
                this.mChangeDetectionListener = (pReason: ChangeDetectionReason) => { this.sheduleUpdateTask(pReason); };

                break;
            }
        }

        // Add listener for changes inside change detection.
        this.mChangeDetection.addChangeListener(this.mChangeDetectionListener);

        // Define error handler.
        this.mLoopDetectionHandler.onError = (pError: any) => {
            // Supress error of any waiter were waiting.
            // Error should be handled by the async waiter.
            this.releaseWaiter(pError);
        };
    }

    /**
     * Listen for updates.
     * @param pListener - Listener.
     */
    public addUpdateListener(pListener: UpdateListener): void {
        this.mUpdateListener.push(pListener);
    }

    /**
     * Deconstruct update handler. 
     */
    public deconstruct(): void {
        // Disconnect from change listener. Does nothing if listener is not defined.
        this.mChangeDetection.removeChangeListener(this.mChangeDetectionListener);

        // Remove all update listener.
        this.mUpdateListener.clear();

        // Deconstruct change detection when it was only used by this component.
        if (this.mUpdateScope !== UpdateScope.Global) {
            this.mChangeDetection.deconstruct();
        }

        // Disable handling.
        this.enabled = false;
    }

    /**
     * Execute function outside update detection scope.
     * 
     * @param pFunction - Function.
     * 
     * @remarks 
     * Nesting {@link disableChangeDetectionFor} and {@link enableChangeDetectionFor} is allowed.
     */
    public disableChangeDetectionFor<T>(pFunction: () => T): T {
        return this.mChangeDetection.silentExecution(pFunction);
    }

    /**
     * Execute function inside update detection scope.
     * 
     * @param pFunction - Function.
     * 
     * @remarks 
     * Nesting {@link disableChangeDetectionFor} and {@link enableChangeDetectionFor} is allowed.
     */
    public enableChangeDetectionFor<T>(pFunction: () => T): T {
        return this.mChangeDetection.execute(pFunction);
    }

    /**
     * Register object and pass on update events.
     * 
     * @param pObject - Object.
     */
    public registerObject<T extends object>(pObject: T): T {
        return this.mChangeDetection.registerObject(pObject);
    }

    /**
     * Request update by sending an update request to the change detection system.
     * Does nothing when the component is set to be {@link UpdateScope.Manual}
     * 
     * @param pReason - Update reason. Description of changed state.
     */
    public requestUpdate(pReason: ChangeDetectionReason): void {
        this.mChangeDetection.dispatchChangeEvent(pReason);
    }

    /**
     * Manual update component.
     * 
     * @public
     */
    public update(): void {
        const lReason: ChangeDetectionReason = {
            source: this,
            property: Symbol('ManualUpdate'),
            stacktrace: 'ManualUpdate'
        };

        // Request update to dispatch change events on other components.
        this.requestUpdate(lReason);

        // Shedule an update task.
        this.sheduleUpdateTask(lReason);
    }

    /**
     * Wait for the component update.
     * Returns Promise<false> if there is currently no update cycle.
     */
    public async waitForUpdate(): Promise<boolean> {
        if (!this.mLoopDetectionHandler.hasActiveTask) {
            return false;
        }

        // Add new callback to waiter line.
        return new Promise<boolean>((pResolve: (pValue: boolean) => void, pReject: (pError: any) => void) => {
            this.mUpdateWaiter.push((pError: any) => {
                if (pError) {
                    // Reject if any error exist.
                    pReject(pError);
                } else {
                    // Is resolved when all data were updated.
                    pResolve(true);
                }
            });
        });
    }

    /**
     * Execute all update listener.
     */
    private dispatchUpdateListener(pReason: ChangeDetectionReason): void {
        // Trigger all update listener.
        for (const lListener of this.mUpdateListener) {
            lListener.call(this, pReason);
        }
    }

    /**
     * Release all update waiter.
     * Pass on any thrown error to all waiter callbacks.
     * 
     * @param pError - Error object.
     * @returns if any waiter were waiting.
     */
    private releaseWaiter(pError?: any): boolean {
        const lWaiterExist: boolean = this.mUpdateWaiter.length > 0;

        // Release all waiter.
        for (const lUpdateWaiter of this.mUpdateWaiter) {
            lUpdateWaiter(pError);
        }

        // Clear waiter list.
        this.mUpdateWaiter.clear();

        return lWaiterExist;
    }

    /**
     * Shedule asyncron update.
     * Triggers update handler asynchron.
     */
    private sheduleUpdateTask(pReason: ChangeDetectionReason): void {
        // Skip task shedule when update handler is disabled but release update waiter.
        if (!this.enabled) {
            this.releaseWaiter();
            return;
        }

        // Shedule new asynchron update task.
        this.mLoopDetectionHandler.sheduleTask(() => {
            // Call every update listener inside change detection scope.
            this.mChangeDetection.execute(() => {
                this.dispatchUpdateListener(pReason);
            });

            // Check if all changes where made during the listener calls and release all waiter when all updates where finished. 
            // When a new changes where made, the loop detection has another sheduled update.
            if (!this.mLoopDetectionHandler.hasActiveTask) {
                this.releaseWaiter();
            }
        }, pReason);
    }
}

type UpdateWaiter = (pError?: any) => void;
export type UpdateListener = (pReason: ChangeDetectionReason) => void;
