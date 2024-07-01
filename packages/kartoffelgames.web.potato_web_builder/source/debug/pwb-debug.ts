export class PwbDebug {
    private static mInstance: PwbDebug;

    private readonly mConfiguration!: ComponentDebugConfiguration;

    /**
     * Debug configuration.
     */
    public get configuration(): ComponentDebugConfiguration {
        return this.mConfiguration;
    }

    /**
     * Constructor.
     * 
     * Reuses single instance.
     */
    public constructor() {
        if (PwbDebug.mInstance) {
            return PwbDebug.mInstance;
        }

        PwbDebug.mInstance = this;

        // Set default information.
        this.mConfiguration = {
            // Error handling.
            error: {
                ignore: false
            },

            // Debug logging.
            log: {
                filter: PwbDebugLogLevel.All,
                updatePerformance: false,
                updaterTrigger: false
            }
        };
    }

    /**
     * Print debug information.
     * 
     * @param pArguments - Print arguments.
     */
    public print(pLogLevel: PwbDebugLogLevel, ...pArguments: Array<any>): void {
        if ((pLogLevel & this.mConfiguration.log.filter) === 0) {
            return;
        }

        // eslint-disable-next-line no-console
        console.log(...pArguments);
    }
}

type ComponentDebugConfiguration = {
    // Error handling.
    error : {
        ignore: boolean;
    }

    // Logging.
    log: {
        filter: PwbDebugLogLevel;
        updatePerformance: boolean;
        updaterTrigger: boolean;
    }
};

export enum PwbDebugLogLevel {
    None = 0,

    Component = 1,
    Module = 2,
    Extention = 4,

    /**
     * All.
     */
    All = 7
}