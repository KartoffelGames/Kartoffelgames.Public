import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';

export interface IComponentHierarchyParent {
    /**
     * All injections of processor.
     */
    readonly injections: Array<ComponentHierarchyInjection>;
}

export type ComponentHierarchyInjection = {
    target: InjectionConstructor,
    value: any;
};