import { Dictionary } from '@kartoffelgames/core.data';
import { Injection } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../enum/access-mode.enum';
import { ExtensionType } from '../enum/extension-type.enum';
import { UpdateScope } from '../enum/update-scope.enum';
import { ComponentExtension } from '../extension/component-extension';
import { GlobalExtensionsStorage } from '../extension/global-extensions-storage';
import { InjectionHierarchyParent } from '../injection/injection-hierarchy-parent';
import { ComponentConstructorReference } from '../injection/references/component/component-constructor-reference';
import { ComponentElementReference } from '../injection/references/component/component-element-reference';
import { ComponentLayerValuesReference } from '../injection/references/component/component-layer-values-reference';
import { ComponentReference } from '../injection/references/component/component-reference';
import { ComponentUpdateHandlerReference } from '../injection/references/component/component-update-handler-reference';
import { ComponentProcessor, ComponentProcessorConstructor } from '../interface/component.interface';
import { IPwbExtensionProcessorClass } from '../interface/extension.interface';
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

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class Component extends InjectionHierarchyParent {
    private static readonly mTemplateCache: Dictionary<ComponentProcessorConstructor, PwbTemplate> = new Dictionary<ComponentProcessorConstructor, PwbTemplate>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();

    private readonly mElementHandler: ElementHandler;
    private readonly mExtensionList: Array<ComponentExtension>;
    private mProcessor: ComponentProcessor | null;
    private readonly mProcessorConstructor: ComponentProcessorConstructor;
    private readonly mRootBuilder: StaticBuilder;
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Component processor.
     */
    public get processor(): ComponentProcessor {
        if (!this.mProcessor) {
            this.createProcessor();
        }

        return this.mProcessor!;
    }

    /**
     * Constructor.
     * 
     * @param pComponentProcessorConstructor - Component processor constructor.
     * @param pTemplateString - Template as xml string.
     * @param pExpressionModule - Expression module constructor.
     * @param pHtmlComponent - HTMLElement of component.
     * @param pUpdateScope - Update scope of component.
     */
    public constructor(pComponentProcessorConstructor: ComponentProcessorConstructor, pTemplateString: string | null, pExpressionModule: IPwbExpressionModuleProcessorConstructor, pHtmlComponent: HTMLElement, pUpdateScope: UpdateScope) {
        super(null);

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
        this.setProcessorAttributes(ComponentConstructorReference, pComponentProcessorConstructor);
        this.setProcessorAttributes(ComponentElementReference, pHtmlComponent);
        this.setProcessorAttributes(ComponentLayerValuesReference, this.mRootBuilder.values);
        this.setProcessorAttributes(ComponentUpdateHandlerReference, this.mUpdateHandler);
        this.setProcessorAttributes(ComponentReference, this);

        // Create injection extensions.
        this.mExtensionList = new Array<ComponentExtension>();

        this.executeExtensions();
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
        if (!this.mProcessor) {
            return;
        }

        this.processor.afterPwbUpdate?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     * @param pAttributeName - Name of updated attribute.
     */
    public callOnPwbAttributeChange(pAttributeName: string): void {
        // Skip callback call when the processor was not even created.
        if (!this.mProcessor) {
            return;
        }

        this.processor.onPwbAttributeChange?.(pAttributeName);
    }

    /**
     * Call onPwbDeconstruct of component processor object.
     */
    public callOnPwbDeconstruct(): void {
        // Skip callback call when the processor was not even created.
        if (!this.mProcessor) {
            return;
        }

        this.processor.onPwbDeconstruct?.();
    }

    /**
     * Call onPwbInitialize of component processor object.
     */
    public callOnPwbUpdate(): void {
        // Skip callback call when the processor was not even created.
        if (!this.mProcessor) {
            return;
        }

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
     * Create component processor.
     */
    private createProcessor(): void {
        // Lock injections.
        this.lock();

        //console.log(new Error().stack);

        // Create user object inside update zone.
        let lUntrackedProcessor: ComponentProcessor | null = null;
        this.mUpdateHandler.executeInZone(() => {
            lUntrackedProcessor = Injection.createObject<ComponentProcessor>(this.mProcessorConstructor, this.injections);
        });

        // Add __component__ property to processor.
        Object.defineProperty(lUntrackedProcessor, '__component__', {
            get: () => {
                return this;
            }
        });

        // Store processor to be able to read for all read extensions.
        this.mProcessor = this.mUpdateHandler.registerObject(lUntrackedProcessor!);
    }

    private executeExtensions(): void {
        const lExtensions: GlobalExtensionsStorage = new GlobalExtensionsStorage();

        // Create local injections with write extensions.
        // Execute all inside the zone.
        this.mUpdateHandler.executeInZone(() => {
            for (const lExtensionConstructor of lExtensions.get(ExtensionType.Component, AccessMode.Write)) {
                const lComponentExtension: ComponentExtension = new ComponentExtension({
                    constructor: lExtensionConstructor,
                    parent: this
                });

                // Execute extension.
                lComponentExtension.execute();

                this.mExtensionList.push(lComponentExtension);
            }
        });

        // Create execute all other read extensions.
        // Execute all inside the zone.
        this.mUpdateHandler.executeInZone(() => {
            const lReadExtensions: Array<IPwbExtensionProcessorClass> = [
                ...lExtensions.get(ExtensionType.Component, AccessMode.ReadWrite),
                ...lExtensions.get(ExtensionType.Component, AccessMode.Read)
            ];

            for (const lExtensionConstructor of lReadExtensions) {
                const lComponentExtension: ComponentExtension = new ComponentExtension({
                    constructor: lExtensionConstructor,
                    parent: this
                });

                // Execute extension.
                lComponentExtension.execute();

                this.mExtensionList.push(lComponentExtension);
            }
        });
    }

}