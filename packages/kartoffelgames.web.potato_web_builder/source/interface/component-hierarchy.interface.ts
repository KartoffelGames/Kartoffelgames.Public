import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';

export interface IComponentHierarchyParent {
    /**
     * All injections of processor.
     */
    readonly injections: Array<ComponentHierarchyInjection>;

    /**
     * Set injection parameter for the module processor class construction. 
     * 
     * @param pInjectionTarget - Injection type that should be provided to processor.
     * @param pInjectionValue - Actual injected value in replacement for {@link pInjectionTarget}.
     */
    setProcessorAttributes(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void;
}

export type ComponentHierarchyInjection = {
    target: InjectionConstructor,
    value: any;
};