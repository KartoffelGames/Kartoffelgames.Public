import { Dictionary } from '@kartoffelgames/core';
import { PwbConfiguration, PwbDebugLogLevel } from '../configuration/pwb-configuration.ts';
import { CoreEntityExtendable } from '../core_entity/core-entity-extendable.ts';
import type { Processor } from '../core_entity/processor.ts';
import { ComponentDataLevel } from '../data/component-data-level.ts';
import { DataLevel } from '../data/data-level.ts';
import { UpdateMode } from '../enum/update-mode.enum.ts';
import { UpdateTrigger } from '../enum/update-trigger.enum.ts';
import type { IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module.ts';
import { StaticBuilder } from './builder/static-builder.ts';
import { ComponentElement } from './component-element.ts';
import { ComponentModules } from './component-modules.ts';
import { ComponentRegister } from './component-register.ts';
import type { PwbTemplate } from './template/nodes/pwb-template.ts';
import { TemplateParser } from './template/template-parser.ts';

/**
 * Component manager. 
 * Handles initialisation of the component element and serves as a proxy between builder and the outside world.
 */
export class Component extends CoreEntityExtendable<ComponentProcessor> {
    private static readonly mTemplateCache: Dictionary<ComponentProcessorConstructor, PwbTemplate> = new Dictionary<ComponentProcessorConstructor, PwbTemplate>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();
    private readonly mComponentElement: ComponentElement;
    private readonly mRootBuilder: StaticBuilder;
    private readonly mUpdateMode: UpdateMode;

    /**
     * Component html element.
     */
    public get element(): HTMLElement {
        return this.mComponentElement.htmlElement;
    }

    /**
     * Component update mode.
     */
    public get updateMode(): UpdateMode {
        return this.mUpdateMode;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ComponentConstructorParameter) {
        super({
            constructor: pParameter.processorConstructor,
            debugLevel: PwbDebugLogLevel.Component,
            trigger: UpdateTrigger.Any,
            isolate: (pParameter.updateMode & UpdateMode.Isolated) !== 0,
            trackConstructorChanges: true
        });

        // Register component and element.
        ComponentRegister.registerComponent(this, pParameter.htmlElement);

        // Register untracked processor, than track and register the tracked processor.
        this.addCreationHook((pProcessor: ComponentProcessor) => {
            ComponentRegister.registerComponent(this, this.mComponentElement.htmlElement, pProcessor);
        }).addCreationHook((pProcessor: ComponentProcessor) => {
            return this.registerObject(pProcessor);
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

        // Update initial disabled.
        this.mUpdateMode = pParameter.updateMode;

        // Create component element.
        this.mComponentElement = new ComponentElement(pParameter.htmlElement);

        // Create component builder.
        this.mRootBuilder = new StaticBuilder(lTemplate, new ComponentModules(this, pParameter.expressionModule), new DataLevel(this), 'ROOT');
        this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor);

        // Initialize user object injections.
        this.setProcessorAttributes(ComponentDataLevel, new ComponentDataLevel(this.mRootBuilder.values));
        this.setProcessorAttributes(Component, this);

        // Setup auto update when not in manual update mode.
        if ((pParameter.updateMode & UpdateMode.Manual) === 0) {
            this.setAutoUpdate(UpdateTrigger.Any);
        }
    }

    /**
     * Create style element and prepend it to this component.
     * 
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        // Read document scope from configuration.
        const lDocument = PwbConfiguration.configuration.scope.document

        const lStyleElement: Element = lDocument.createElement('style');
        lStyleElement.innerHTML = pStyle;
        this.mComponentElement.shadowRoot.prepend(lStyleElement);
    }

    /**
     * Called when a html attribute changes.
     * 
     * @param pAttributeName - The name of the attribute which changed.
     * @param pOldValue - The attribute's old value.
     * @param pNewValue - The attribute's new value.
     */
    public attributeChanged(pAttributeName: string, pOldValue: string | null, pNewValue: string | null): void {
        // Call OnAttributeChange.
        this.call<IComponentOnAttributeChange, 'onAttributeChange'>('onAttributeChange', false, pAttributeName, pOldValue, pNewValue);
    }

    /**
     * Called when component get attached to DOM.
     */
    public connected(): void {
        // Call processor event after updating.
        this.call<IComponentOnConnect, 'onConnect'>('onConnect', false);
    }

    /**
     * Deconstruct element.
     */
    public override deconstruct(): void {
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
        // Call processor event after disabling update event..
        this.call<IComponentOnDisconnect, 'onDisconnect'>('onDisconnect', false);
    }

    /**
     * Update component.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    protected onUpdate(): boolean {
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
    onAttributeChange(pAttributeName: string, pOldValue: string | null, pNewValue: string | null): void;
}
export interface IComponentOnConnect {
    onConnect(): void;
}
export interface IComponentOnDisconnect {
    onDisconnect(): void;
}
export interface ComponentProcessor extends Processor, Partial<IComponentOnDeconstruct>, Partial<IComponentOnUpdate>, Partial<IComponentOnAttributeChange>, Partial<IComponentOnConnect>, Partial<IComponentOnDisconnect> { }

export type ComponentProcessorConstructor = {
    new(...pParameter: Array<any>): ComponentProcessor;
};