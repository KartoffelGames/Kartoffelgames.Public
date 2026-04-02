import { PwbApplicationDebugLoggingType } from "./pwb-application-debug-logging-type.enum.ts";

/**
 * Pwb applications configuration object.
 * Used to configure the application behavior and settings.
 */
export class PwbApplicationConfiguration {
    /**
     * Get default application configuration.
     */
    public static readonly DEFAULT: PwbApplicationConfiguration = (() => {
        const lDefaultApplicationConfiguration: PwbApplicationConfiguration = new PwbApplicationConfiguration();

        // Set default configurations.

        lDefaultApplicationConfiguration.mLoggingConfiguration.filter = PwbApplicationDebugLoggingType.All;
        lDefaultApplicationConfiguration.mLoggingConfiguration.updatePerformance = false;
        lDefaultApplicationConfiguration.mLoggingConfiguration.updaterTrigger = false;
        lDefaultApplicationConfiguration.mLoggingConfiguration.updateReshedule = false;

        lDefaultApplicationConfiguration.mUpdatingConfiguration.frameTime = 100;
        lDefaultApplicationConfiguration.mUpdatingConfiguration.stackCap = 10;

        return lDefaultApplicationConfiguration;
    })();

    private readonly mLoggingConfiguration: PwbApplicationLoggingConfiguration;
    private readonly mUpdatingConfiguration: PwbApplicationUpdatingConfiguration;

    /**
     * Get application logginh configuration.
     */
    public get logging(): PwbApplicationLoggingConfiguration {
        return this.mLoggingConfiguration;
    }

    /**
     * Get application updating configuration.
     */
    public get updating(): PwbApplicationUpdatingConfiguration {
        return this.mUpdatingConfiguration;
    }

    /**
     * Create a new application configuration.
     */
    public constructor() {
        this.mLoggingConfiguration = {
            filter: PwbApplicationConfiguration.DEFAULT?.mLoggingConfiguration.filter,
            updatePerformance: PwbApplicationConfiguration.DEFAULT?.mLoggingConfiguration.updatePerformance,
            updaterTrigger: PwbApplicationConfiguration.DEFAULT?.mLoggingConfiguration.updaterTrigger,
            updateReshedule: PwbApplicationConfiguration.DEFAULT?.mLoggingConfiguration.updateReshedule,
        };

        this.mUpdatingConfiguration = {
            frameTime: PwbApplicationConfiguration.DEFAULT?.mUpdatingConfiguration.frameTime,
            stackCap: PwbApplicationConfiguration.DEFAULT?.mUpdatingConfiguration.stackCap
        };
    }

    /**
     * Print debug information.
     * 
     * @param pArguments - Print arguments.
     */
    public print(pLogLevel: PwbApplicationDebugLoggingType, ...pArguments: Array<any>): void {
        if ((pLogLevel & this.mLoggingConfiguration.filter) === 0) {
            return;
        }

        // eslint-disable-next-line no-console
        console.log(...pArguments);
    }
}

export type PwbApplicationLoggingConfiguration = {
    filter: PwbApplicationDebugLoggingType;
    updatePerformance: boolean;
    updaterTrigger: boolean;
    updateReshedule: boolean;
};

export type PwbApplicationUpdatingConfiguration = {
    frameTime: number;
    stackCap: number;
};

