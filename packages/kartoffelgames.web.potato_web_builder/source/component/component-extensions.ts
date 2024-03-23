import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentExtension } from '../extension/component-extension';
import { GlobalExtensionsStorage } from '../extension/global-extensions-storage';
import { Component } from './component';

export class ComponentExtensions {
    private readonly mExtensionList: Array<ComponentExtension>;

    /**
     * Constructor.
     */
    public constructor() {
        // Create all extensions.
        this.mExtensionList = new Array<ComponentExtension>();
    }

    /**
     * Deconstruct all extensions.
     */
    public deconstruct(): void {
        for (const lExtension of this.mExtensionList) {
            lExtension.deconstruct();
        }
    }

    /**
     * Execute patcher extensions.
     * @param pParameter - Parameter.
     */
    public executeInjectorExtensions(pParameter: ComponentExtensionsExecuteInjectorExtensionsParameter): Array<object | null> {
        const lInjectionTypeList: Array<object | null> = new Array<object | null>();

        for (const lExtensionClass of GlobalExtensionsStorage.componentInjectorExtensions) {
            // Create extension and add to extension list.
            const lExtension: ComponentExtension = new ComponentExtension({
                constructor: lExtensionClass,
                parent: pParameter.component
            });
            this.mExtensionList.push(lExtension);

            // Collect extensions.
            lInjectionTypeList.push(...lExtension.collectInjections());
        }

        return lInjectionTypeList;
    }

    /**
     * Execute patcher extensions.
     * @param pParameter - Parameter.
     */
    public executePatcherExtensions(pParameter: ComponentExtensionsExecutePatcherExtensionsParameter): void {
        for (const lExtensionClass of GlobalExtensionsStorage.componentPatcherExtensions) {
            this.mExtensionList.push(new ComponentExtension({
                extensionClass: lExtensionClass,
                parent: pParameter.component,
            }));
        }
    }
}

type ComponentExtensionsExecutePatcherExtensionsParameter = {
    component: Component;
    targetClass: InjectionConstructor;
    targetObject: object;
    componentElement: HTMLElement;
};

type ComponentExtensionsExecuteInjectorExtensionsParameter = {
    component: Component;
    targetClass: InjectionConstructor;
    componentElement: HTMLElement;
};