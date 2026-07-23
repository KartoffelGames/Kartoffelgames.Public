import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';

/**
 * Holds injection values that should be provided to a components processor.
 * Attach an instance to an interaction zone so every component created within that zones hierarchy reads
 * and applies the configured injections.
 */
export class ComponentZoneInjection {
    private readonly mInjection: Map<InjectionConstructor, any>;

    /**
     * All configured injections mapped by their injection type.
     */
    public get injections(): ReadonlyMap<InjectionConstructor, any> {
        return this.mInjection;
    }

    /**
     * Constructor.
     * Create a new empty component injection.
     */
    public constructor() {
        // Init empty injection map.
        this.mInjection = new Map<InjectionConstructor, any>();
    }

    /**
     * Set an injection value that should be provided to a components processor.
     *
     * @param pInjectionTarget - Injection type.
     * @param pInjectionValue - Actual injected value in replacement for {@link pInjectionTarget}.
     */
    public setInjection(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void {
        // Store injection value by its type.
        this.mInjection.set(pInjectionTarget, pInjectionValue);
    }
}
