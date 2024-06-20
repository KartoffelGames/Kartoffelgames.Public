import { InjectionConstructor, Injector } from '@kartoffelgames/core.dependency-injection';
import { UpdateMode } from '../../enum/update-mode.enum';
import { IPwbAttributeModuleProcessorConstructor } from '../module/attribute_module/attribute-module';
import { IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module';
import { IPwbInstructionModuleProcessorConstructor } from '../module/instruction_module/instruction-module';
import { Component, ComponentProcessorConstructor } from './component';
import { ComponentInformation } from './component-information';

/**
 * AtScript. PWB Component.
 * 
 * @param pParameter - Parameter defaults on creation.
 */
export function PwbComponent(pParameter: HtmlComponentParameter): any {
    // Needs constructor without argument.
    return (pComponentProcessorConstructor: ComponentProcessorConstructor) => {
        // Set component processor constructor to be injectable.
        Injector.Injectable(pComponentProcessorConstructor);

        // Register component constructor.
        ComponentInformation.registerConstructor(pComponentProcessorConstructor, pParameter.selector);

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
                this.mComponent = new Component({
                    processorConstructor: pComponentProcessorConstructor,
                    templateString: pParameter.template ?? null,
                    expressionModule: pParameter.expressionmodule,
                    htmlElement: this,
                    updateMode: pParameter.updateScope ?? UpdateMode.Default
                }

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
    updateScope?: UpdateMode;
};
