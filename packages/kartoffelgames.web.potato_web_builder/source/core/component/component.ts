import { Dictionary } from '@kartoffelgames/core.data';
import { InteractionReason, InteractionResponseType } from '@kartoffelgames/web.change-detection';
import { UpdateMode } from '../../enum/update-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { CoreEntityExtendable } from '../core_entity/core-entity-extendable';
import { CoreEntityUpdateZone } from '../core_entity/core-entity-update-zone';
import { ComponentValuesReference } from '../injection-reference/component/component-values-reference';
import { IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module';
import { StaticBuilder } from './builder/static-builder';
import { ComponentModules } from './component-modules';
import { ComponentRegister } from './component-register';
import { ComponentElement } from './component-element';
import { PwbTemplate } from './template/nodes/pwb-template';
import { PwbTemplateXmlNode } from './template/nodes/pwb-template-xml-node';
import { TemplateParser } from './template/template-parser';
import { ScopedValues } from '../scoped-values';

/**
 * Component manager. 
 * Handles initialisation of the component element and serves as a proxy between builder and the outside world.
 */
export class Component extends CoreEntityExtendable<ComponentProcessor> {
    private static readonly mTemplateCache: Dictionary<ComponentProcessorConstructor, PwbTemplate> = new Dictionary<ComponentProcessorConstructor, PwbTemplate>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();
    private readonly mComponentElement: ComponentElement;
    private readonly mRootBuilder: StaticBuilder;

    /**
     * Component html element.
     */
    public get element(): HTMLElement {
        return this.mComponentElement.htmlElement;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ComponentConstructorParameter) {
        super({
            processorConstructor: pParameter.processorConstructor,
            interactionTrigger: ((pParameter.updateMode & UpdateMode.Manual) === 0) ? UpdateTrigger.Default : UpdateTrigger.None,
            isolateInteraction: (pParameter.updateMode & UpdateMode.Isolated) !== 0
        });

        // Register component and element.
        ComponentRegister.registerComponent(this, pParameter.htmlElement);

        // Register untracked processor, than track and register the tracked processor.
        this.addCreationHook((pProcessor: ComponentProcessor) => {
            ComponentRegister.registerComponent(this, this.mComponentElement.htmlElement, pProcessor);
        }).addCreationHook((pProcessor: ComponentProcessor) => {
            return this.updateZone.registerObject(pProcessor);
        }).addCreationHook((pProcessor: ComponentProcessor) => {
            ComponentRegister.registerComponent(this, this.mComponentElement.htmlElement, pProcessor);
        });

        // Load cached or parse new template.
        let lTemplate: PwbTemplate | undefined = Component.mTemplateCache.get(pParameter.processorConstructor);
        if (!lTemplate) {
            lTemplate = Component.mXmlParser.parse(pParameter.templateString ?? '');
            Component.mTemplateCache.set(pParameter.processorConstructor, lTemplate);
        } else {
            lTemplate = lTemplate.clone();
        }

        // Create component element.
        this.mComponentElement = new ComponentElement(pParameter.htmlElement);

        // Create component builder.
        this.mRootBuilder = new StaticBuilder(lTemplate, new ComponentModules(this, pParameter.expressionModule), new ScopedValues(this), 'ROOT');
        this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor);

        // Initialize user object injections.
        this.setProcessorAttributes(ComponentValuesReference, this.mRootBuilder.values);
        this.setProcessorAttributes(Component, this);
        this.setProcessorAttributes(CoreEntityUpdateZone, this.updateZone);

        // Attach automatic update listener to update zone.
        this.updateZone.addUpdateListener(() => {
            this.update();
        });
    }

    /**
     * Create style element and prepend it to this component.
     * 
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        const lStyleTemplate: PwbTemplateXmlNode = new PwbTemplateXmlNode();
        lStyleTemplate.tagName = 'style';

        const lStyleElement: Element = this.mRootBuilder.createElement(lStyleTemplate);
        lStyleElement.innerHTML = pStyle;
        this.mComponentElement.shadowRoot.prepend(lStyleElement);
    }

    /**
     * Called when component get attached to DOM.
     */
    public connected(): void {
        this.updateZone.enabled = true;

        // Call processor event after enabling updates.
        this.call<IComponentOnConnect, 'onConnect'>('onConnect', false);

        // Trigger light update use self as source to prevent early processor creation.
        if (this.isProcessorCreated) {
            this.updateZone.requestUpdate(new InteractionReason(InteractionResponseType.Custom, this.processor));
        } else {
            this.updateZone.requestUpdate(new InteractionReason(InteractionResponseType.Custom, this));
        }
    }

    /**
     * Deconstruct element.
     */
    public override deconstruct(): void {
        // Disable updates.
        this.updateZone.enabled = false;

        // User callback.
        this.call<IComponentOnDeconstruct, 'onDeconstruct'>('onDeconstruct', false);

        // Deconstruct all child element.
        this.mRootBuilder.deconstruct();

        // Deconstruct history parent / extensions.
        super.deconstruct();
    }

    /**
     * Called when component gets detached from DOM.
     */
    public disconnected(): void {
        this.updateZone.enabled = false;

        // Call processor event after disabling update event..
        this.call<IComponentOnDisconnect, 'onDisconnect'>('onDisconnect', false);
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