import { Injection, type InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { InteractionZone, type InteractionZoneGlobalDefinition } from '@kartoffelgames/web-interaction-zone';
import { PwbApplicationConfiguration } from '../../application/pwb-application-configuration.ts';
import { PwbApplication } from '../../index.ts';
import type { Processor } from '../core_entity/processor.ts';
import { UpdateMode } from '../enum/update-mode.enum.ts';
import type { IPwbAttributeModuleProcessorConstructor } from '../module/attribute_module/attribute-module.ts';
import type { IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module.ts';
import type { IPwbInstructionModuleProcessorConstructor } from '../module/instruction_module/instruction-module.ts';
import { ComponentRegister } from './component-register.ts';
import { Component } from './component.ts';
import type { ClassDecorator } from '@kartoffelgames/core';

/**
 * AtScript. PWB Component.
 * 
 * @param pParameter - Parameter defaults on creation.
 */
export function PwbComponent(pParameter: HtmlComponentParameter): ClassDecorator<typeof Processor, void> {
    // Enable global tracing for the current context.
    InteractionZone.enableGlobalTracing(gGatherGlobalTracingTarget(globalThis));

    // Needs constructor without argument.
    return (pComponentProcessorConstructor: typeof Processor, pContext: ClassDecoratorContext): void => {
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

                // Read the application configuration context from current interaction zone.
                let lApplicationContext: PwbApplicationConfiguration | undefined = InteractionZone.current.attachment(PwbApplication.CONFIGURATION_ATTACHMENT);
                if (!lApplicationContext) {
                    // If no context is found, use the default application context.
                    lApplicationContext = PwbApplicationConfiguration.DEFAULT;
                }

                // Create new component.
                this.mComponent = new Component({
                    applicationContext: lApplicationContext,
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
 * Default target for global interaction zone tracing.
 * 
 * @param pGlobalThis - Global this object.
 * 
 * @returns Target definition for a global interaction zone tracing. 
 */
const gGatherGlobalTracingTarget = (pGlobalThis: typeof globalThis): InteractionZoneGlobalDefinition => {
    // Create default globalThis target.
    const lTarget = {
        target: pGlobalThis,
        patches: {
            requirements: {
                promise: pGlobalThis.Promise?.name,
                eventTarget: pGlobalThis.EventTarget?.name,
            },
            classes: {
                eventTargets: new Array<string>(),
                callback: new Array<string>()
            },
            functions: new Array<string>()
        },
        errorHandling: true
    } satisfies InteractionZoneGlobalDefinition;

    // Add all asyncron functions.
    const lAsyncFunctionNames: Array<string | undefined> = [
        pGlobalThis.requestAnimationFrame?.name,
        pGlobalThis.setInterval?.name,
        pGlobalThis.setTimeout?.name
    ];
    lTarget.patches.functions.push(...lAsyncFunctionNames.filter(pClass => !!pClass) as Array<string>);

    // Add all global classes with events.
    const lDomClassNames: Array<string | undefined> = [
        pGlobalThis.XMLHttpRequestEventTarget?.name,
        pGlobalThis.XMLHttpRequest?.name,
        pGlobalThis.Document?.name,
        pGlobalThis.SVGElement?.name,
        pGlobalThis.Element?.name,
        pGlobalThis.HTMLElement?.name,
        pGlobalThis.HTMLMediaElement?.name,
        pGlobalThis.HTMLFrameSetElement?.name,
        pGlobalThis.HTMLBodyElement?.name,
        pGlobalThis.HTMLFrameElement?.name,
        pGlobalThis.HTMLIFrameElement?.name,
        pGlobalThis.HTMLMarqueeElement?.name,
        pGlobalThis.Worker?.name,
        pGlobalThis.IDBRequest?.name,
        pGlobalThis.IDBOpenDBRequest?.name,
        pGlobalThis.IDBDatabase?.name,
        pGlobalThis.IDBTransaction?.name,
        pGlobalThis.WebSocket?.name,
        pGlobalThis.FileReader?.name,
        pGlobalThis.Notification?.name,
        pGlobalThis.RTCPeerConnection?.name
    ];
    lTarget.patches.classes.eventTargets.push(...lDomClassNames.filter(pClass => !!pClass) as Array<string>);

    // Add all global classes with async callbacks.
    const lObserverClassNames: Array<string | undefined> = [
        pGlobalThis.ResizeObserver?.name,
        pGlobalThis.MutationObserver?.name,
        pGlobalThis.IntersectionObserver?.name
    ];
    lTarget.patches.classes.callback.push(...lObserverClassNames.filter(pClass => !!pClass) as Array<string>);

    return lTarget;
};

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
