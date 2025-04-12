import { Injection, type InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { Processor } from "../core_entity/processor.ts";
import { UpdateMode } from '../enum/update-mode.enum.ts';
import type { IPwbAttributeModuleProcessorConstructor } from '../module/attribute_module/attribute-module.ts';
import type { IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module.ts';
import type { IPwbInstructionModuleProcessorConstructor } from '../module/instruction_module/instruction-module.ts';
import { ComponentRegister } from './component-register.ts';
import { Component } from './component.ts';

/**
 * AtScript. PWB Component.
 * 
 * @param pParameter - Parameter defaults on creation.
 */
export function PwbComponent(pParameter: HtmlComponentParameter) {
    // Needs constructor without argument.
    return (pComponentProcessorConstructor: typeof Processor, pContext: ClassDecoratorContext) => {
        // Set component processor constructor to be injectable.
        Injection.registerInjectable(pComponentProcessorConstructor, pContext.metadata, 'instanced');

        // Register component constructor.
        ComponentRegister.registerConstructor(pComponentProcessorConstructor, pParameter.selector);

        // Create custom html element of parent type.
        const lPwbComponentConstructor = class extends HTMLElement {
            private readonly mComponent: Component;

            /**
             * Constructor.
             * Build custom html element thats build itself.
             */
            public constructor() {
                super();

                // Create new component.
                this.mComponent = new Component({
                    processorConstructor: pComponentProcessorConstructor,
                    templateString: pParameter.template ?? null,
                    expressionModule: pParameter.expressionmodule,
                    htmlElement: this,
                    updateMode: pParameter.updateScope ?? UpdateMode.Default
                }).setup();

                // Append style if specified. Styles are scoped on components shadow root.
                if (pParameter.style) {
                    this.mComponent.addStyle(pParameter.style);
                }

                // Trigger sync update on construction to prevent poping when using as standalone component.
                // Trigger even on Manual.
                this.mComponent.update();
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
        globalThis.customElements.define(pParameter.selector, lPwbComponentConstructor);
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
