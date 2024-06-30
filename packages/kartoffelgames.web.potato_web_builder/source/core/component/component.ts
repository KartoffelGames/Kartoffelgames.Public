import { Dictionary } from '@kartoffelgames/core';
import { CoreEntityExtendable } from '../core_entity/core-entity-extendable';
import { UpdateMode } from '../enum/update-mode.enum';
import { UpdateTrigger } from '../enum/update-trigger.enum';
import { IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module';
import { ScopedValues } from '../scoped-values';
import { StaticBuilder } from './builder/static-builder';
import { ComponentElement } from './component-element';
import { ComponentModules } from './component-modules';
import { ComponentRegister } from './component-register';
import { ComponentScopedValues } from './injection_reference/component-scoped-values';
import { PwbTemplate } from './template/nodes/pwb-template';
import { TemplateParser } from './template/template-parser';

/**
 * Component manager. 
 * Handles initialisation of the component element and serves as a proxy between builder and the outside world.
 */
export class Component extends CoreEntityExtendable<ComponentProcessor> {
    private static readonly mTemplateCache: Dictionary<ComponentProcessorConstructor, PwbTemplate> = new Dictionary<ComponentProcessorConstructor, PwbTemplate>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();
    private readonly mComponentElement: ComponentElement;
    private readonly mRootBuilder: StaticBuilder;
    private mUpdateEnabled: boolean;

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
            trigger: UpdateTrigger.Any,
            isolate: (pParameter.updateMode & UpdateMode.Isolated) !== 0
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
        this.mUpdateEnabled = false;

        // Create component element.
        this.mComponentElement = new ComponentElement(pParameter.htmlElement);

        // Create component builder.
        this.mRootBuilder = new StaticBuilder(lTemplate, new ComponentModules(this, pParameter.expressionModule), new ScopedValues(this), 'ROOT');
        this.mComponentElement.shadowRoot.appendChild(this.mRootBuilder.anchor);

        // Initialize user object injections.
        this.setProcessorAttributes(ComponentScopedValues, this.mRootBuilder.values);
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
        const lStyleElement: Element = document.createElement('style');
        lStyleElement.innerHTML = pStyle;
        this.mComponentElement.shadowRoot.prepend(lStyleElement);
    }

    /**
     * Called when component get attached to DOM.
     */
    public connected(): void {
        this.mUpdateEnabled = true;

        // Call processor event after enabling updates.
        this.call<IComponentOnConnect, 'onConnect'>('onConnect', false);

        // Trigger update on connect.
        this.update();
    }

    /**
     * Deconstruct element.
     */
    public override deconstruct(): void {
        // Disable updates.
        this.mUpdateEnabled = false;

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
        this.mUpdateEnabled = false;

        // Call processor event after disabling update event..
        this.call<IComponentOnDisconnect, 'onDisconnect'>('onDisconnect', false);
    }

    /**
     * Update component.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    protected async onUpdate(): Promise<boolean> {
        // On disabled update.
        if (!this.mUpdateEnabled) {
            return false;
        }

        // Update and callback after update.
        if (await this.mRootBuilder.update()) {
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