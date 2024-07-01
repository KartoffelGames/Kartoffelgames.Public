import { CoreEntityProcessorProxy } from './interaction-tracker/core-entity-processor-proxy';

/**
 * Core processor for all modules, extentions and components.
 */
export class Processor {
    private static mEnableTrackingOnConstruction: boolean = false;

    /**
     * Enable tracking on construction for all processors created in execution context.
     */
    public static enableTrackingOnConstruction<T>(pContext: () => T): T {
        const lLastProcessorTrackingState: boolean = Processor.mEnableTrackingOnConstruction;

        Processor.mEnableTrackingOnConstruction = true;
        try {
            return pContext();
        } finally {
            Processor.mEnableTrackingOnConstruction = lLastProcessorTrackingState;
        }
    }

    /**
     * Constructor.
     */
    public constructor() {
        if (Processor.mEnableTrackingOnConstruction) {
            return new CoreEntityProcessorProxy(this).proxy;
        }
    }
}