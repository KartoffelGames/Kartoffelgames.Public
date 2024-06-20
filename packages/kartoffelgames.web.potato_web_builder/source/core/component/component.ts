import { Dictionary } from '@kartoffelgames/core.data';
import { InteractionReason, InteractionResponseType } from '@kartoffelgames/web.change-detection';
import { UpdateMode } from '../../enum/update-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { CoreEntityExtendable } from '../core_entity/core-entity-extendable';
import { ComponentConstructorReference } from '../injection-reference/component/component-constructor-reference';
import { ComponentElementReference } from '../injection-reference/component/component-element-reference';
import { ComponentLayerValuesReference } from '../injection-reference/component/component-layer-values-reference';
import { ComponentReference } from '../injection-reference/component/component-reference';
import { IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module';
import { StaticBuilder } from './builder/static-builder';
import { ComponentInformation } from './component-information';
import { ComponentModules } from './component-modules';
import { ElementCreator } from './element-creator';
import { ElementHandler } from './handler/element-handler';
import { PwbTemplate } from './template/nodes/pwb-template';
import { PwbTemplateXmlNode } from './template/nodes/pwb-template-xml-node';
import { TemplateParser } from './template/template-parser';
import { LayerValues } from './values/layer-values';

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class Component extends CoreEntityExtendable<ComponentProcessor> {
    private static readonly mTemplateCache: Dictionary<ComponentProcessorConstructor, PwbTemplate> = new Dictionary<ComponentProcessorConstructor, PwbTemplate>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();
    private readonly mElementHandler: ElementHandler;
    private readonly mRootBuilder: StaticBuilder;

    /**
     * Constructor.
     * 
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ComponentConstructorParameter) {
        // Init injection history with updatehandler.
        super({
            processorConstructor: pParameter.processorConstructor,
            parent: null,
            interactionTrigger: UpdateTrigger.Default,
            isolateInteraction: pParameter.updateMode % UpdateMode.Isolated !== 0
        });

        // Add register component element.
        ComponentInformation.registerComponent(this, pParameter.htmlElement);

        // Load cached or create new module handler and template.
        let lTemplate: PwbTemplate | undefined = Component.mTemplateCache.get(pParameter.processorConstructor);
        if (!lTemplate) {
            lTemplate = Component.mXmlParser.parse(pParameter.templateString ?? '');
            Component.mTemplateCache.set(pParameter.processorConstructor, lTemplate);
        } else {
            lTemplate = lTemplate.clone();
        }

        // Create element handler.
        this.mElementHandler = new ElementHandler(pParameter.htmlElement);

        // Create component builder.
        this.mRootBuilder = new StaticBuilder(lTemplate, new ComponentModules(this, pParameter.expressionModule), new LayerValues(this), 'ROOT');
        this.mElementHandler.shadowRoot.appendChild(this.mRootBuilder.anchor);

        // Initialize user object injections.
        this.setProcessorAttributes(ComponentConstructorReference, pParameter.processorConstructor);
        this.setProcessorAttributes(ComponentElementReference, pParameter.htmlElement);
        this.setProcessorAttributes(ComponentLayerValuesReference, this.mRootBuilder.values);
        this.setProcessorAttributes(ComponentReference, this);

        // Attach automatic update listener to handler when this entity is not set to be manual.
        if (pParameter.updateMode % UpdateMode.Manual !== 0) {
            this.updateHandler.addUpdateListener(() => {
                this.update();
            });
        }
    }

    /**
     * Create style element and prepend it to this component.
     * 
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        const lStyleTemplate: PwbTemplateXmlNode = new PwbTemplateXmlNode();
        lStyleTemplate.tagName = 'style';

        const lStyleElement: Element = ElementCreator.createElement(lStyleTemplate);
        lStyleElement.innerHTML = pStyle;
        this.mElementHandler.shadowRoot.prepend(lStyleElement);
    }

    /**
     * Called when component get attached to DOM.
     */
    public connected(): void {
        this.updateHandler.enabled = true;

        // Call processor event after enabling updates.
        this.call<IComponentOnConnect, 'onConnect'>('onConnect', false);

        // Trigger light update use self as source to prevent early processor creation.
        if (this.processorCreated) {
            this.updateHandler.requestUpdate(new InteractionReason(InteractionResponseType.Custom, this.processor));
        } else {
            this.updateHandler.requestUpdate(new InteractionReason(InteractionResponseType.Custom, this));
        }
    }

    /**
     * Deconstruct element.
     */
    public override deconstruct(): void {
        // Disable updates.
        this.updateHandler.enabled = false;

        // User callback.
        this.call<IComponentOnDeconstruct, 'onDeconstruct'>('onDeconstruct', false);

        // Deconstruct history parent / extensions.
        super.deconstruct();

        // Deconstruct all child element.
        this.mRootBuilder.deconstruct();
    }

    /**
     * Called when component gets detached from DOM.
     */
    public disconnected(): void {
        this.updateHandler.enabled = false;

        // Call processor event after disabling update event..
        this.call<IComponentOnDisconnect, 'onDisconnect'>('onDisconnect', false);
    }

    /**
     * Register processor on creation.
     * 
     * @param pProcessor - Created processor.
     */
    protected override onCreation(pProcessor: ComponentProcessor): ComponentProcessor {
        const lProcessor: ComponentProcessor = super.onCreation(pProcessor);
        ComponentInformation.registerComponent(this, this.mElementHandler.htmlElement, lProcessor);

        return lProcessor;
    }

    /**
     * Update component.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    private update(): boolean {
        // Update and callback after update.
        if (this.mRootBuilder.update()) {
            // Call component processor on update function.
            this.call<IComponentOnUpdate, 'onUpdate'>('onUpdate', false);

            return true;
        }

        // No update where made.
        return false;
    }
}

type ComponentConstructorParameter = {
    /**
     * Component processor constructor.
     */
    processorConstructor: ComponentProcessorConstructor;

    /**
     * Template as xml string.
     */
    templateString: string | null;

    /**
     * Expression module constructor.
     */
    expressionModule: IPwbExpressionModuleProcessorConstructor;

    /**
     * HTMLElement of component.
     */
    htmlElement: HTMLElement;

    /**
     * Update mode of component.
     */
    updateMode: UpdateMode;
};

/**
 * Interfaces.
 */
export interface IComponentOnDeconstruct {
    onDeconstruct(): void;
}
export interface IComponentOnUpdate {
    onUpdate(): void;
}
export interface IComponentOnUpdate {
    onUpdate(): void;
}
export interface IComponentOnAttributeChange {
    onAttributeChange(pAttributeName: string): void;
}
export interface IComponentOnConnect {
    onConnect(): void;
}
export interface IComponentOnDisconnect {
    onDisconnect(): void;
}
export interface ComponentProcessor extends Partial<IComponentOnDeconstruct>, Partial<IComponentOnUpdate>, Partial<IComponentOnAttributeChange>, Partial<IComponentOnConnect>, Partial<IComponentOnDisconnect> { }

export type ComponentProcessorConstructor = {
    new(...pParameter: Array<any>): ComponentProcessor;
};

export interface ComponentElement extends HTMLElement { }