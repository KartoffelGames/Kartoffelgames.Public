import { InjectionConstructor, Injector, Metadata } from '@kartoffelgames/core.dependency-injection';
import { IPwbExpressionModuleProcessorConstructor, IPwbInstructionModuleProcessorConstructor, IPwbAttributeModuleProcessorConstructor } from '../interface/module.interface';
import { Component } from '../component/component';
import { UpdateScope } from '../enum/update-scope.enum';
import { ComponentProcessorConstructor } from '../interface/component.interface';

/**
 * AtScript. PWB Component.
 * @param pParameter - Parameter defaults on creation.
 */
export function PwbComponent(pParameter: HtmlComponentParameter): any {
    // Needs constructor without argument.
    return (pComponentProcessorConstructor: ComponentProcessorConstructor) => {
        // Set user class to be injectable.
        Injector.Injectable(pComponentProcessorConstructor);

        // Set element metadata.
        Metadata.get(pComponentProcessorConstructor).setMetadata(Component.METADATA_SELECTOR, pParameter.selector);

        // Create custom html element of parent type.
        const lPwbComponentConstructor = class extends HTMLElement {
            private readonly mComponent: Component;

            /**
             * Constructor.
             * Build custom html element thats build itself.
             */
            public constructor() {
                super();

                // Create component handler.
                this.mComponent = new Component(
                    pComponentProcessorConstructor,
                    pParameter.template ?? null,
                    pParameter.expressionmodule,
                    this,
                    pParameter.updateScope ?? UpdateScope.Global
                );

                // Append style if specified. Styles are scoped on components shadow root.
                if (pParameter.style) {
                    this.mComponent.addStyle(pParameter.style);
                }
            }

            /**
             * Lifecycle callback.
             * Callback when element get attached to dom.
             */
            public connectedCallback(): void {
                this.mComponent.connected();
            }

            /**
             * Lifecycle callback.
             * Callback when element get detached from dom.
             */
            public disconnectedCallback(): void {
                this.mComponent.disconnected();
            }
        };

        // Define current element as new custom html element.
        window.customElements.define(pParameter.selector, lPwbComponentConstructor);
    };
}

/**
 * Html component parameter.
 */
type HtmlComponentParameter = {
    expressionmodule?: IPwbExpressionModuleProcessorConstructor | any;
    style?: string,
    selector: string;
    template?: string;
    // Placeholder for listing modules that should be imported.
    modules?: Array<IPwbInstructionModuleProcessorConstructor | IPwbAttributeModuleProcessorConstructor | any>;
    // Placeholder for listing components that should be imported.
    components?: Array<InjectionConstructor>;
    updateScope?: UpdateScope;
};
