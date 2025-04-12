/**
 * Pwb configuration.
 * Allways return the same instance.
 */
class PwbConfigurationSingleton {
    private static mInstance: PwbConfigurationSingleton;

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
        if (PwbConfigurationSingleton.mInstance) {
            return PwbConfigurationSingleton.mInstance;
        }

        PwbConfigurationSingleton.mInstance = this;

        // Set default information.
        this.mConfiguration = {
            // Error handling.
            error: {
                ignore: false,
                print: true
            },

            // Debug logging.
            log: {
                filter: PwbDebugLogLevel.All,
                updatePerformance: false,
                updaterTrigger: false,
                updateReshedule: false
            },

            // Updating.
            updating: {
                frameTime: 100,
                stackCap: 10
            },
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
    error: {
        ignore: boolean;
        print: boolean;
    };

    // Logging.
    log: {
        filter: PwbDebugLogLevel;
        updatePerformance: boolean;
        updaterTrigger: boolean;
        updateReshedule: boolean
    };

    // Updating.
    updating: {
        frameTime: number;
        stackCap: number;
    };
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

/**
 * Pwb global configuration.
 */
export const PwbConfiguration: PwbConfigurationSingleton = new PwbConfigurationSingleton();