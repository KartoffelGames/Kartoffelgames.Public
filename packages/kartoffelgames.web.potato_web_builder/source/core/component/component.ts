import { Dictionary } from '@kartoffelgames/core.data';
import { InteractionReason, InteractionResponseType } from '@kartoffelgames/web.change-detection';
import { UpdateMode } from '../../enum/update-mode.enum';
import { BaseComponentEntity } from '../base-component-entity';
import { ComponentConstructorReference } from '../injection-reference/component/component-constructor-reference';
import { ComponentElementReference } from '../injection-reference/component/component-element-reference';
import { ComponentLayerValuesReference } from '../injection-reference/component/component-layer-values-reference';
import { ComponentReference } from '../injection-reference/component/component-reference';
import { IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module';
import { StaticBuilder } from './builder/static-builder';
import { ComponentInformation } from './component-information';
import { ComponentModules } from './component-modules';
import { ComponentProcessor, ComponentProcessorConstructor } from './component.interface';
import { ElementCreator } from './element-creator';
import { ElementHandler } from './handler/element-handler';
import { PwbTemplate } from './template/nodes/pwb-template';
import { PwbTemplateXmlNode } from './template/nodes/pwb-template-xml-node';
import { TemplateParser } from './template/template-parser';
import { LayerValues } from './values/layer-values';

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class Component extends BaseComponentEntity<ComponentProcessor> {
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
            manualUpdate: pParameter.updateMode % UpdateMode.Manual !== 0,
            isolatedInteraction: pParameter.updateMode % UpdateMode.Isolated !== 0,
            includeExtensions: true,
            trackProcessor: true
        });

        // Add register component element.
        ComponentInformation.register(this, pParameter.htmlElement, pParameter.processorConstructor);

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
     * Call onPwbInitialize of component processor object.
     */
    public callAfterPwbUpdate(): void {
        // Skip callback call when the processor was not even created.
        if (!this.processorCreated) {
            return;
        }

        // Exclude function call trigger from zone.
        // Prevents any "Get" call from function to trigger interaction again.
        this.updateHandler.excludeInteractionTrigger(() => {
            this.processor.afterPwbUpdate?.();
        }, InteractionResponseType.FunctionCallEnd);
    }

    /**
     * Call onPwbInitialize of component processor object.
     * @param pAttributeName - Name of updated attribute.
     */
    public callOnPwbAttributeChange(pAttributeName: string): void {
        // Skip callback call when the processor was not even created.
        if (!this.processorCreated) {
            return;
        }

        this.processor.onPwbAttributeChange?.(pAttributeName);
    }

    /**
     * Call onPwbConnect of component processor object.
     */
    public callOnPwbConnect(): void {
        // Skip callback call when the processor was not even created.
        if (!this.processorCreated) {
            return;
        }

        this.processor.onPwbConnect?.();
    }

    /**
     * Call onPwbDeconstruct of component processor object.
     */
    public callOnPwbDeconstruct(): void {
        // Skip callback call when the processor was not even created.
        if (!this.processorCreated) {
            return;
        }

        this.processor.onPwbDeconstruct?.();
    }

    /**
     * Call onPwbDisconnect of component processor object.
     */
    public callOnPwbDisconnect(): void {
        // Skip callback call when the processor was not even created.
        if (!this.processorCreated) {
            return;
        }

        this.processor.onPwbDisconnect?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callOnPwbUpdate(): void {
        // Skip callback call when the processor was not even created.
        if (!this.processorCreated) {
            return;
        }

        // Exclude function call trigger from zone.
        // Prevents any "Get" call from function to trigger interaction again.
        this.updateHandler.excludeInteractionTrigger(() => {
            this.processor.onPwbUpdate?.();
        }, InteractionResponseType.FunctionCallEnd);
    }

    /**
     * Called when component get attached to DOM.
     */
    public connected(): void {
        this.updateHandler.enabled = true;

        // Call processor event after enabling updates.
        this.callOnPwbConnect();

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
        this.callOnPwbDeconstruct();

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
        this.callOnPwbDisconnect();
    }

    /**
     * Register processor on creation.
     * 
     * @param pProcessor - Created processor.
     */
    protected override onCreation(pProcessor: ComponentProcessor): void {
        ComponentInformation.register(this, this.mElementHandler.htmlElement, this.processorConstructor, pProcessor);
    }

    /**
     * Update component.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    protected onUpdate(): boolean {
        // Call component processor on update function.
        this.callOnPwbUpdate();

        // Save if processor was created before update.
        const lProcessorWasCreated: boolean = !!this.processorCreated;

        // Update and callback after update.
        if (this.mRootBuilder.update()) {
            // Try to call update before "AfterUpdate" when the processor was created on builder update.
            if (!lProcessorWasCreated) {
                this.callOnPwbUpdate();
            }

            this.callAfterPwbUpdate();

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