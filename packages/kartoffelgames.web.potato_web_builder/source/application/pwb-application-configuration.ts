import { PwbApplicationDebugLoggingType } from './pwb-application-debug-logging-type.enum.ts';

export class PwbApplicationConfiguration {
    /**
     * Get default application configuration.
     */
    public static readonly DEFAULT: PwbApplicationConfiguration = (() => {
        const lDefaultApplicationConfiguration: PwbApplicationConfiguration = new PwbApplicationConfiguration();

        // Set default configurations.
        lDefaultApplicationConfiguration.mSpashscreenConfiguration.background = 'blue';
        lDefaultApplicationConfiguration.mSpashscreenConfiguration.content = '';
        lDefaultApplicationConfiguration.mSpashscreenConfiguration.manual = false;
        lDefaultApplicationConfiguration.mSpashscreenConfiguration.animationTime = 1000;

        lDefaultApplicationConfiguration.mErrorConfiguration.ignore = false;
        lDefaultApplicationConfiguration.mErrorConfiguration.print = true;

        lDefaultApplicationConfiguration.mLoggingConfiguration.filter = PwbApplicationDebugLoggingType.All;
        lDefaultApplicationConfiguration.mLoggingConfiguration.updatePerformance = false;
        lDefaultApplicationConfiguration.mLoggingConfiguration.updaterTrigger = false;
        lDefaultApplicationConfiguration.mLoggingConfiguration.updateReshedule = false;

        lDefaultApplicationConfiguration.mUpdatingConfiguration.frameTime = 100;
        lDefaultApplicationConfiguration.mUpdatingConfiguration.stackCap = 10;

        return lDefaultApplicationConfiguration;
    })();

    private readonly mErrorConfiguration: PwbApplicationErrorConfiguration;
    private readonly mLoggingConfiguration: PwbApplicationLoggingConfiguration;
    private readonly mSpashscreenConfiguration: PwbApplicationSplashscreenConfiguration;
    private readonly mUpdatingConfiguration: PwbApplicationUpdatingConfiguration;

    /**
     * Get application error configuration.
     */
    public get error(): PwbApplicationErrorConfiguration {
        return this.mErrorConfiguration;
    }

    /**
     * Get application logginh configuration.
     */
    public get logging(): PwbApplicationLoggingConfiguration {
        return this.mLoggingConfiguration;
    }

    /**
     * Get application splashscreen configuration.
     */
    public get splashscreen(): PwbApplicationSplashscreenConfiguration {
        return this.mSpashscreenConfiguration;
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
        this.mSpashscreenConfiguration = {
            background: PwbApplicationConfiguration.DEFAULT?.mSpashscreenConfiguration.background,
            content: PwbApplicationConfiguration.DEFAULT?.mSpashscreenConfiguration.content,
            manual: PwbApplicationConfiguration.DEFAULT?.mSpashscreenConfiguration.manual,
            animationTime: PwbApplicationConfiguration.DEFAULT?.mSpashscreenConfiguration.animationTime
        };

        this.mErrorConfiguration = {
            ignore: PwbApplicationConfiguration.DEFAULT?.mErrorConfiguration.ignore,
            print: PwbApplicationConfiguration.DEFAULT?.mErrorConfiguration.print
        };

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
    filter: PwbApplicationDebugLoggingType;
    updatePerformance: boolean;
    updaterTrigger: boolean;
    updateReshedule: boolean;
};

export type PwbApplicationUpdatingConfiguration = {
    frameTime: number;
    stackCap: number;
};

