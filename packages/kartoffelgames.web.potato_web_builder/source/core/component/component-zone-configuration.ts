import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';

/**
 * Contains configuration and injection values that are used by the component processors.
 */
export class ComponentZoneConfiguration {
    /**
     * Attachment key used to read a {@link ComponentZoneConfiguration} from an interaction zones hierarchy.
     */
    public static readonly ATTACHMENT_KEY: symbol = Symbol('ComponentZoneConfiguration');

    private mFrameTime: number;
    private readonly mInjection: Map<InjectionConstructor, any>;

    /**
     * "Guaranteed" frame time for every update created within this configurations zone hierarchy.
     * An updater uses this value instead of its default frame time. Value in milliseconds.
     * Defaults to {@link Number.MAX_SAFE_INTEGER}.
     */
    public get guaranteedFrameTime(): number {
        return this.mFrameTime;
    } set guaranteedFrameTime(pValue: number) {
        this.mFrameTime = pValue;
    }

    /**
     * All configured injections mapped by their injection type.
     */
    public get injections(): ReadonlyMap<InjectionConstructor, any> {
        return this.mInjection;
    }

    /**
     * Constructor.
     * Create a new empty component zone configuration.
     */
    public constructor() {
        // Init empty injection map.
        this.mInjection = new Map<InjectionConstructor, any>();

        // Default the guaranteed frame time to the maximum.
        this.mFrameTime = Number.MAX_SAFE_INTEGER;
    }

    /**
     * Set an injection value that should be provided to a components processor.
     *
     * @param pInjectionTarget - Injection type.
     * @param pInjectionValue - Actual injected value in replacement for {@link pInjectionTarget}.
     */
    public setInjection(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void {
        this.mInjection.set(pInjectionTarget, pInjectionValue);
    }
}
