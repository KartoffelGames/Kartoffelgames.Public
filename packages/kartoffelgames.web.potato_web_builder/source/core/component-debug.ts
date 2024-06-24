export class ComponentDebug {
    private static mInstance: ComponentDebug;

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
        if (ComponentDebug.mInstance) {
            return ComponentDebug.mInstance;
        }

        ComponentDebug.mInstance = this;

        // Set default information.
        this.mConfiguration = {
            throwWhileUpdating: true,

            // Debug logging.
            logUpdatePerformance: false,
            logUpdaterTrigger: false,
        };
    }

    /**
     * Print debug information.
     * 
     * @param pArguments - Print arguments.
     */
    public print(...pArguments: Array<any>): void {
        // eslint-disable-next-line no-console
        console.log(...pArguments);
    }
}

type ComponentDebugConfiguration = {
    throwWhileUpdating: boolean;
    logUpdatePerformance: boolean;
    logUpdaterTrigger: boolean;
};