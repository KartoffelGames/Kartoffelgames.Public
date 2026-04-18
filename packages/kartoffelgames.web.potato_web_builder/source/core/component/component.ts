import { Dictionary } from '@kartoffelgames/core';
import { CoreEntityUpdateable } from "../core_entity/core-entity-updateable.ts";
import { CoreEntityProcessor } from "../core_entity/core-entity.ts";
import { ComponentDataLevel } from '../data/component-data-level.ts';
import { DataLevel } from '../data/data-level.ts';
import type { IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module.ts';
import { StaticBuilder } from './builder/static-builder.ts';
import { ComponentElement } from './component-element.ts';
import { ComponentModules } from './component-modules.ts';
import { ComponentRegister } from './component-register.ts';
import type { PwbTemplate } from './template/nodes/pwb-template.ts';
import { PwbTemplateParser } from './template/parser/pwb-template-parser.ts';

/**
 * Component manager. 
 * Handles initialisation of the component element and serves as a proxy between builder and the outside world.
 */
export class Component extends CoreEntityUpdateable<ComponentProcessor> {
    private static readonly mTemplateCache: Dictionary<ComponentProcessorConstructor, PwbTemplate> = new Dictionary<ComponentProcessorConstructor, PwbTemplate>();
    private static readonly mXmlParser: PwbTemplateParser = new PwbTemplateParser();
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
            constructor: pParameter.processorConstructor,
            parent: null
        });

        // Register component and element.
        ComponentRegister.registerComponent(this, pParameter.htmlElement);
        this.setProcessorInjection(Component, this);

        // Register untracked processor, than track and register the tracked processor.
        this.addConstructionHook((pProcessor: ComponentProcessor) => {
            ComponentRegister.registerComponent(this, this.mComponentElement.htmlElement, pProcessor);
        });

        // Load cached or parse new template.
        if (!Component.mTemplateCache.has(pParameter.processorConstructor)) {
            Component.mTemplateCache.set(pParameter.processorConstructor, Component.mXmlParser.parse(pParameter.templateString ?? ''));
        }

        const lTemplate: PwbTemplate = Component.mTemplateCache.get(pParameter.processorConstructor)!.clone();

        // Create component element.
        this.mComponentElement = new ComponentElement(pParameter.htmlElement);

        // Create component builder.
        this.mRootBuilder = new StaticBuilder(lTemplate, new ComponentModules(this, pParameter.expressionModule), new DataLevel(this), 'ROOT');
        this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor);

        // Initialize user object injections.
        this.setProcessorInjection(ComponentDataLevel, new ComponentDataLevel(this.mRootBuilder.values));
    }

    /**
     * Create style element and prepend it to this component.
     * 
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        const lStyleElement: Element = document.createElement('style');
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
        this.call<IComponentOnAttributeChange, 'onAttributeChange'>('onAttributeChange', pAttributeName, pOldValue, pNewValue);
    }

    /**
     * Called when component get attached to DOM.
     */
    public connected(): void {
        // Call processor event after updating.
        this.call<IComponentOnConnect, 'onConnect'>('onConnect');
    }

    /**
     * Deconstruct element.
     */
    public override deconstruct(): void {
        // User callback.
        this.call<IComponentOnDeconstruct, 'onDeconstruct'>('onDeconstruct');

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
        this.call<IComponentOnDisconnect, 'onDisconnect'>('onDisconnect');
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
            this.call<IComponentOnUpdate, 'onUpdate'>('onUpdate');

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
export interface ComponentProcessor extends CoreEntityProcessor, Partial<IComponentOnDeconstruct>, Partial<IComponentOnUpdate>, Partial<IComponentOnAttributeChange>, Partial<IComponentOnConnect>, Partial<IComponentOnDisconnect> { }

export type ComponentProcessorConstructor<T extends ComponentProcessor = ComponentProcessor> = {
    new(...pParameter: Array<any>): T;
};