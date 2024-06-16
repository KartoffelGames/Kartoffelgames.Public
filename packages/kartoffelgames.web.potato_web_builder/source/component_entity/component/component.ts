import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { InteractionReason, InteractionResponseType } from '@kartoffelgames/web.change-detection';
import { UpdateMode } from '../../enum/update-mode.enum';
import { BaseComponentEntity } from '../base-component-entity';
import { ComponentConstructorReference } from '../injection-reference/component/component-constructor-reference';
import { ComponentElementReference } from '../injection-reference/component/component-element-reference';
import { ComponentLayerValuesReference } from '../injection-reference/component/component-layer-values-reference';
import { ComponentReference } from '../injection-reference/component/component-reference';
import { ComponentUpdateHandlerReference } from '../injection-reference/component/component-update-handler-reference';
import { IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module';
import { StaticBuilder } from './builder/static-builder';
import { ComponentModules } from './component-modules';
import { ComponentProcessor, ComponentProcessorConstructor } from './component.interface';
import { ElementCreator } from './element-creator';
import { ElementHandler } from './handler/element-handler';
import { UpdateHandler } from './handler/update-handler';
import { PwbTemplate } from './template/nodes/pwb-template';
import { PwbTemplateXmlNode } from './template/nodes/pwb-template-xml-node';
import { TemplateParser } from './template/template-parser';
import { LayerValues } from './values/layer-values';

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class Component extends BaseComponentEntity<ComponentProcessor> {
    private static readonly mConstructorSelector: WeakMap<object, string> = new WeakMap<object, string>();
    private static readonly mElementComponent: WeakMap<Element, Component> = new WeakMap<Element, Component>();
    private static readonly mTemplateCache: Dictionary<ComponentProcessorConstructor, PwbTemplate> = new Dictionary<ComponentProcessorConstructor, PwbTemplate>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();

    /**
     * Get the component manager of a component element.
     * 
     * @param pElement - Element of a custom element.
     * 
     * @returns Component manager of {@link pElement}s component. 
     * 
     * @throws {@link Exception}
     * When {@link pElement} is not a registered pwb component.
     */
    public static componentOf(pElement: Element): Component {
        const lComponent: Component | undefined = Component.mElementComponent.get(pElement);
        if (!lComponent) {
            throw new Exception(`Element "${pElement}" is not a PwbComponent.`, pElement);
        }

        return lComponent;
    }

    /**
     * Get selector of component or component 
     *
     * @param pConstructor - Class of component processor.
     *
     * @returns 
     *  
     * @throws {@link Exception}
     * When {@link pConstructor} is not a registered component processor.
     */
    public static elementConstructorOf(pConstructor: InjectionConstructor): CustomElementConstructor {
        const lSelector: string = Component.elementSelectorOf(pConstructor);

        // Get component constructor from custom element registry.
        const lComponentConstructor: CustomElementConstructor | undefined = window.customElements.get(lSelector);
        if (!lComponentConstructor) {
            throw new Exception(`Constructor "${pConstructor.name}" is not a registered custom element`, pConstructor);
        }

        return lComponentConstructor;
    }


    /**
     * Get the selector of a component processor class.
     * 
     * @param pConstructor - Class of component processor.
     * 
     * @returns selector of custom element. 
     * 
     * @throws {@link Exception}
     * When {@link pConstructor} is not a registered component processor.
     */
    public static elementSelectorOf(pConstructor: InjectionConstructor): string {
        const lSelector: string | undefined = Component.mConstructorSelector.get(pConstructor);
        if (!lSelector) {
            throw new Exception(`Constructor "${pConstructor.name}" is not a PwbComponent.`, pConstructor);
        }

        return lSelector;
    }

    /**
     * Register constructor with its selector.
     * Can override existing entires.
     * 
     * @param pConstructor - Class of component processor.
     * @param pSelector - Selector of component.
     */
    public static registerProcessor(pConstructor: InjectionConstructor, pSelector: string): void {
        Component.mConstructorSelector.set(pConstructor, pSelector);
    }

    /**
     * Register element with its component manager.
     * Can override existing entires.
     * 
     * @param pElement - Html element of component.
     * @param pComponent - Component object.
     */
    private static registerElement(pElement: Element, pComponent: Component): void {
        Component.mElementComponent.set(pElement, pComponent);
    }

    private readonly mElementHandler: ElementHandler;
    private readonly mRootBuilder: StaticBuilder;
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Constructor.
     * 
     * @param pComponentProcessorConstructor - Component processor constructor.
     * @param pTemplateString - Template as xml string.
     * @param pExpressionModule - Expression module constructor.
     * @param pHtmlComponent - HTMLElement of component.
     * @param pUpdateScope - Update scope of component.
     */
    public constructor(pComponentProcessorConstructor: ComponentProcessorConstructor, pTemplateString: string | null, pExpressionModule: IPwbExpressionModuleProcessorConstructor, pHtmlComponent: HTMLElement, pUpdateScope: UpdateMode) {
        const lUpdateHandler: UpdateHandler = new UpdateHandler(pUpdateScope);

        // Init injection history with updatehandler.
        super(pComponentProcessorConstructor, lUpdateHandler);

        // Add register component element.
        Component.registerElement(pHtmlComponent, this);

        // Load cached or create new module handler and template.
        let lTemplate: PwbTemplate | undefined = Component.mTemplateCache.get(pComponentProcessorConstructor);
        if (!lTemplate) {
            lTemplate = Component.mXmlParser.parse(pTemplateString ?? '');
            Component.mTemplateCache.set(pComponentProcessorConstructor, lTemplate);
        } else {
            lTemplate = lTemplate.clone();
        }

        // Create update handler.
        this.mUpdateHandler = lUpdateHandler;
        this.mUpdateHandler.addUpdateListener(() => {
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
            }
        });

        // Create element handler.
        this.mElementHandler = new ElementHandler(pHtmlComponent);

        // Create component builder.
        this.mRootBuilder = new StaticBuilder(lTemplate, new ComponentModules(this, pExpressionModule), new LayerValues(this), 'ROOT');
        this.mElementHandler.shadowRoot.appendChild(this.mRootBuilder.anchor);

        // Initialize user object injections.
        this.setProcessorAttributes(ComponentConstructorReference, pComponentProcessorConstructor);
        this.setProcessorAttributes(ComponentElementReference, pHtmlComponent);
        this.setProcessorAttributes(ComponentLayerValuesReference, this.mRootBuilder.values);
        this.setProcessorAttributes(ComponentUpdateHandlerReference, this.mUpdateHandler);
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
        this.mUpdateHandler.excludeInteractionTrigger(() => {
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
        this.mUpdateHandler.excludeInteractionTrigger(() => {
            this.processor.onPwbUpdate?.();
        }, InteractionResponseType.FunctionCallEnd);
    }

    /**
     * Called when component get attached to DOM.
     */
    public connected(): void {
        this.mUpdateHandler.enabled = true;

        // Call processor event after enabling updates.
        this.callOnPwbConnect();

        // Trigger light update.
        this.mUpdateHandler.requestUpdate(new InteractionReason(InteractionResponseType.Custom, this.mProcessor ?? this));
    }

    /**
     * Deconstruct element.
     */
    public override deconstruct(): void {
        // Disable updates.
        this.mUpdateHandler.enabled = false;

        // User callback.
        this.callOnPwbDeconstruct();

        // Deconstruct history parent / extensions.
        super.deconstruct();

        // Remove change listener from app.
        this.mUpdateHandler.deconstruct();

        // Deconstruct all child element.
        this.mRootBuilder.deconstruct();
    }

    /**
     * Called when component gets detached from DOM.
     */
    public disconnected(): void {
        this.mUpdateHandler.enabled = false;

        // Call processor event after disabling update event..
        this.callOnPwbDisconnect();
    }

    /**
     * Create component processor.
     */
    private createProcessor(): void {
        // Lock injections.
        this.lock();

        // Create user object inside update zone.
        const lUntrackedProcessor: ComponentProcessor = this.mUpdateHandler.enableInteractionTrigger(() => {
            return Injection.createObject<ComponentProcessor>(this.mProcessorConstructor, this.injections);
        });

        // Store processor to be able to read for all read extensions.
        this.mProcessor = this.mUpdateHandler.registerObject(lUntrackedProcessor!);

        // Add __component__ property to processor.
        Object.defineProperty(this.mProcessor, '__component__', { // TODO: remove this bullshit.
            get: () => {
                return this;
            }
        });
    }
}