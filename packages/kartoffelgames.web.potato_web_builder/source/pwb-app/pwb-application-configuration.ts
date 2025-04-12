export class PwbApplicationConfiguration {
    /**
     * Get default application configuration.
     */
    private static readonly default: PwbApplicationConfiguration = (() => {
        const lDefaultApplicationConfiguration: PwbApplicationConfiguration = new PwbApplicationConfiguration();

        // Set default configurations.
        lDefaultApplicationConfiguration.mSpashscreenConfiguration.background = 'blue';
        lDefaultApplicationConfiguration.mSpashscreenConfiguration.content = '';
        lDefaultApplicationConfiguration.mSpashscreenConfiguration.manual = false;
        lDefaultApplicationConfiguration.mSpashscreenConfiguration.animationTime = 1000;

        lDefaultApplicationConfiguration.mErrorConfiguration.ignore = false;
        lDefaultApplicationConfiguration.mErrorConfiguration.print = true;

        lDefaultApplicationConfiguration.mLoggingConfiguration.filter = PwbDebugLogLevel.All;
        lDefaultApplicationConfiguration.mLoggingConfiguration.updatePerformance = false;
        lDefaultApplicationConfiguration.mLoggingConfiguration.updaterTrigger = false;
        lDefaultApplicationConfiguration.mLoggingConfiguration.updateReshedule = false;

        lDefaultApplicationConfiguration.mUpdatingConfiguration.frameTime = 100;
        lDefaultApplicationConfiguration.mUpdatingConfiguration.stackCap = 10;

        return lDefaultApplicationConfiguration;
    })();

    private readonly mSpashscreenConfiguration: PwbApplicationSplashscreenConfiguration;
    private readonly mLoggingConfiguration: PwbApplicationLoggingConfiguration;
    private readonly mUpdatingConfiguration: PwbApplicationUpdatingConfiguration;
    private readonly mErrorConfiguration: PwbApplicationErrorConfiguration;

    /**
     * Get application splashscreen configuration.
     */
    public get splashscreen(): PwbApplicationSplashscreenConfiguration {
        return this.mSpashscreenConfiguration;
    }

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
     * Get application error configuration.
     */
    public get error(): PwbApplicationErrorConfiguration {
        return this.mErrorConfiguration;
    }

    /**
     * Create a new application configuration.
     */
    public constructor() {
        this.mSpashscreenConfiguration = {
            background: PwbApplicationConfiguration.default.mSpashscreenConfiguration.background,
            content: PwbApplicationConfiguration.default.mSpashscreenConfiguration.content,
            manual: PwbApplicationConfiguration.default.mSpashscreenConfiguration.manual,
            animationTime: PwbApplicationConfiguration.default.mSpashscreenConfiguration.animationTime
        };

        this.mErrorConfiguration = {
            ignore: PwbApplicationConfiguration.default.mErrorConfiguration.ignore,
            print: PwbApplicationConfiguration.default.mErrorConfiguration.print
        };

        this.mLoggingConfiguration = {
            filter: PwbApplicationConfiguration.default.mLoggingConfiguration.filter,
            updatePerformance: PwbApplicationConfiguration.default.mLoggingConfiguration.updatePerformance,
            updaterTrigger: PwbApplicationConfiguration.default.mLoggingConfiguration.updaterTrigger,
            updateReshedule: PwbApplicationConfiguration.default.mLoggingConfiguration.updateReshedule,
        };

        this.mUpdatingConfiguration = {
            frameTime: PwbApplicationConfiguration.default.mUpdatingConfiguration.frameTime,
            stackCap: PwbApplicationConfiguration.default.mUpdatingConfiguration.stackCap
        };
    }
}

export type PwbApplicationSplashscreenConfiguration = {
    background: string,
    content: string;
    manual: boolean;
    animationTime: number;
};

export type PwbApplicationErrorConfiguration = {
    ignore: boolean;
    print: boolean;
};

export type PwbApplicationLoggingConfiguration = {
    filter: PwbDebugLogLevel;
    updatePerformance: boolean;
    updaterTrigger: boolean;
    updateReshedule: boolean;
};

export type PwbApplicationUpdatingConfiguration = {
    frameTime: number;
    stackCap: number;
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