import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { UpdateScope } from '../enum/update-scope.enum';
import { ComponentExtension } from '../extension/component-extension';
import { GlobalExtensionsStorage } from '../extension/global-extensions-storage';
import { ComponentConstructorReference } from '../injection_reference/component/component-constructor-reference';
import { ComponentElementReference } from '../injection_reference/component/component-element-reference';
import { ComponentLayerValuesReference } from '../injection_reference/component/component-layer-values-reference';
import { ComponentUpdateHandlerReference } from '../injection_reference/component/component-update-handler-reference';
import { ComponentHierarchyInjection, IComponentHierarchyParent } from '../interface/component-hierarchy.interface';
import { ComponentProcessor, ComponentProcessorConstructor } from '../interface/component.interface';
import { IPwbExpressionModuleProcessorConstructor } from '../interface/module.interface';
import { StaticBuilder } from './builder/static-builder';
import { ComponentModules } from './component-modules';
import { ElementCreator } from './element-creator';
import { ElementHandler } from './handler/element-handler';
import { UpdateHandler } from './handler/update-handler';
import { PwbTemplate } from './template/nodes/pwb-template';
import { PwbTemplateXmlNode } from './template/nodes/pwb-template-xml-node';
import { TemplateParser } from './template/template-parser';
import { LayerValues } from './values/layer-values';
import { ComponentReference } from '../injection_reference/component/component-reference';

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class Component implements IComponentHierarchyParent {
    private static readonly mTemplateCache: Dictionary<ComponentProcessorConstructor, PwbTemplate> = new Dictionary<ComponentProcessorConstructor, PwbTemplate>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();

    private readonly mElementHandler: ElementHandler;
    private readonly mExtensionList: Array<ComponentExtension>;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private mProcessor: ComponentProcessor | null;
    private readonly mProcessorConstructor: ComponentProcessorConstructor;
    private readonly mRootBuilder: StaticBuilder;
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Read all current set injections.
     */
    public get injections(): Array<ComponentHierarchyInjection> {
        // TODO: Can we cache it.
        return this.mInjections.map((pKey: InjectionConstructor, pValue: any) => {
            return { target: pKey, value: pValue };
        });
    }

    /**
     * Component processor.
     */
    public get processor(): ComponentProcessor {
        if (!this.mProcessor) {
            this.mProcessor = this.createProcessor();
        }

        return this.mProcessor;
    }

    /**
     * Untracked Component processor.
     */
    public get untrackedProcessor(): ComponentProcessor {
        return ChangeDetection.getUntrackedObject(this.processor);
    }

    /**
     * Constructor.
     * @param pComponentProcessorConstructor - Component processor constructor.
     * @param pTemplateString - Template as xml string.
     * @param pExpressionModule - Expression module constructor.
     * @param pHtmlComponent - HTMLElement of component.
     * @param pUpdateScope - Update scope of component.
     */
    public constructor(pComponentProcessorConstructor: ComponentProcessorConstructor, pTemplateString: string | null, pExpressionModule: IPwbExpressionModuleProcessorConstructor, pHtmlComponent: HTMLElement, pUpdateScope: UpdateScope) {
        // Set empty component processor.
        this.mProcessor = null;
        this.mProcessorConstructor = pComponentProcessorConstructor;

        // Load cached or create new module handler and template.
        let lTemplate: PwbTemplate | undefined = Component.mTemplateCache.get(pComponentProcessorConstructor);
        if (!lTemplate) {
            lTemplate = Component.mXmlParser.parse(pTemplateString ?? '');
            Component.mTemplateCache.set(pComponentProcessorConstructor, lTemplate);
        } else {
            lTemplate = lTemplate.clone();
        }

        // Create update handler.
        this.mUpdateHandler = new UpdateHandler(pUpdateScope);
        this.mUpdateHandler.addUpdateListener(() => {
            // Call component processor on update function.
            this.mUpdateHandler.executeOutZone(() => {
                this.callOnPwbUpdate();
            });

            // Update and callback after update.
            if (this.mRootBuilder.update()) {
                this.callAfterPwbUpdate();
            }
        });

        // Add __component__ property to processor.
        Object.defineProperty(pHtmlComponent, '__component__', {
            get: () => {
                return this;
            }
        });

        // Create element handler.
        this.mElementHandler = new ElementHandler(pHtmlComponent);

        // Create component builder.
        const lModules: ComponentModules = new ComponentModules(this, pExpressionModule);
        this.mRootBuilder = new StaticBuilder(lTemplate, lModules, new LayerValues(this), 'ROOT');
        this.mElementHandler.shadowRoot.appendChild(this.mRootBuilder.anchor);

        // Initialize user object injections.
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.setProcessorAttributes(ComponentConstructorReference, pComponentProcessorConstructor);
        this.setProcessorAttributes(ComponentElementReference, pHtmlComponent);
        this.setProcessorAttributes(ComponentLayerValuesReference, this.mRootBuilder.values);
        this.setProcessorAttributes(ComponentUpdateHandlerReference, this.mUpdateHandler);
        this.setProcessorAttributes(ComponentReference, this);

        // Create injection extensions.
        this.mExtensionList = new Array<ComponentExtension>();

        // Create local injections with extensions.
        const lExtensions: GlobalExtensionsStorage = new GlobalExtensionsStorage();
        this.mUpdateHandler.executeInZone(() => {
            for (const lExtensionConstructor of lExtensions.componentExtensions) {
                const lExtension: ComponentExtension = new ComponentExtension({
                    constructor: lExtensionConstructor,
                    parent: this
                });

                this.mExtensionList.push(lExtension);
            }
        });

        // After build, before initialization.
        this.callOnPwbInitialize();

        this.callAfterPwbInitialize();
    }

    /**
     * Create style element and prepend it to this component.
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
    public callAfterPwbInitialize(): void {
        this.processor.afterPwbInitialize?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callAfterPwbUpdate(): void {
        this.processor.afterPwbUpdate?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     * @param pAttributeName - Name of updated attribute.
     */
    public callOnPwbAttributeChange(pAttributeName: string): void {
        this.processor.onPwbAttributeChange?.(pAttributeName);
    }

    /**
     * Call onPwbDeconstruct of component processor object.
     */
    public callOnPwbDeconstruct(): void {
        this.processor.onPwbDeconstruct?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callOnPwbInitialize(): void {
        this.processor.onPwbInitialize?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callOnPwbUpdate(): void {
        this.processor.onPwbUpdate?.();
    }

    /**
     * Called when component get attached to DOM.
     */
    public connected(): void {
        this.mUpdateHandler.enabled = true;

        // Trigger light update.
        this.mUpdateHandler.requestUpdate({
            source: this.processor,
            property: Symbol('any'),
            stacktrace: <string>Error().stack
        });
    }

    /**
     * Deconstruct element.
     */
    public deconstruct(): void {
        // Disable updates.
        this.mUpdateHandler.enabled = false;

        // User callback.
        this.callOnPwbDeconstruct();

        // Deconstruct all extensions.
        for (const lExtension of this.mExtensionList) {
            lExtension.deconstruct();
        }

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
    }

    /**
     * Set injection parameter for the module processor class construction. 
     * 
     * @param pInjectionTarget - Injection type that should be provided to processor.
     * @param pInjectionValue - Actual injected value in replacement for {@link pInjectionTarget}.
     * 
     * @throws {@link Exception}
     * When the processor was already initialized.
     */
    public setProcessorAttributes(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void {
        if (this.mProcessor) {
            throw new Exception('Cant add attributes to already initialized module.', this);
        }

        this.mInjections.set(pInjectionTarget, pInjectionValue);
    }

    /**
     * Create component processor.
     */
    private createProcessor(): ComponentProcessor {
        // Create user object inside update zone.
        // Constructor needs to be called inside zone.
        let lUntrackedProcessor: ComponentProcessor | null = null;
        this.mUpdateHandler.executeInZone(() => {
            lUntrackedProcessor = Injection.createObject<ComponentProcessor>(this.mProcessorConstructor, this.mInjections);
        });

        // Add __component__ property to processor.
        Object.defineProperty(lUntrackedProcessor, '__component__', {
            get: () => {
                return this;
            }
        });

        const lTrackedProcessor: ComponentProcessor = this.mUpdateHandler.registerObject(lUntrackedProcessor!);

        return lTrackedProcessor;
    }
}