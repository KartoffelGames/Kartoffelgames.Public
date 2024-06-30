export class PwbDebug {
    private static mInstance: PwbDebug;

    private readonly mConfiguration!: ComponentDebugConfiguration;
    private mLogLevelType!: PwbDebugLogLevel;

    /**
     * Debug configuration.
     */
    public get configuration(): ComponentDebugConfiguration {
        return this.mConfiguration;
    }

    /**
     * Log level.
     */
    public get logLevel(): PwbDebugLogLevel {
        return this.mLogLevelType;
    } set logLevel(pValue: PwbDebugLogLevel) {
        this.mLogLevelType = pValue;
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
            throwWhileUpdating: true,

            // Debug logging.
            logUpdatePerformance: false,
            logUpdaterTrigger: false,
        };
        this.mLogLevelType = PwbDebugLogLevel.None;
    }

    /**
     * Print debug information.
     * 
     * @param pArguments - Print arguments.
     */
    public print(pLogLevel: PwbDebugLogLevel, ...pArguments: Array<any>): void {
        if ((pLogLevel & this.logLevel) === 0) {
            return;
        }

        // eslint-disable-next-line no-console
        console.log(...pArguments);
    }
}

type ComponentDebugConfiguration = {
    throwWhileUpdating: boolean;
    logUpdatePerformance: boolean;
    logUpdaterTrigger: boolean;
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