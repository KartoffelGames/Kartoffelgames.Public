import { Dictionary } from '@kartoffelgames/core.data';
import { UpdateScope } from '../enum/update-scope.enum';
import { ComponentExtension } from '../extension/component-extension';
import { GlobalExtensionsStorage } from '../extension/global-extensions-storage';
import { ComponentElementReference } from '../injection_reference/component/component-element-reference';
import { ComponentHierarchyInjection, IComponentHierarchyParent } from '../interface/component-hierarchy.interface';
import { IPwbExpressionModuleProcessorConstructor } from '../interface/module.interface';
import { ComponentProcessorConstructor } from '../interface/component.interface';
import { StaticBuilder } from './builder/static-builder';
import { ComponentConnection } from './component-connection';
import { ComponentModules } from './component-modules';
import { ElementCreator } from './element-creator';
import { ElementHandler } from './handler/element-handler';
import { UpdateHandler } from './handler/update-handler';
import { UserObjectHandler } from './handler/user-object-handler';
import { PwbTemplate } from './template/nodes/pwb-template';
import { PwbTemplateXmlNode } from './template/nodes/pwb-template-xml-node';
import { TemplateParser } from './template/template-parser';
import { LayerValues } from './values/layer-values';

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class Component implements IComponentHierarchyParent {
    public static readonly METADATA_SELECTOR: string = 'pwb:selector';

    private static readonly mTemplateCache: Dictionary<ComponentProcessorConstructor, PwbTemplate> = new Dictionary<ComponentProcessorConstructor, PwbTemplate>();
    private static readonly mXmlParser: TemplateParser = new TemplateParser();

    private readonly mElementHandler: ElementHandler;
    private readonly mExtensionList: Array<ComponentExtension>;
    private readonly mRootBuilder: StaticBuilder;
    private readonly mUpdateHandler: UpdateHandler;
    private readonly mComponentProcessor: UserObjectHandler;

    /**
     * Get element handler.
     */
    public get elementHandler(): ElementHandler {
        return this.mElementHandler;
    }

    injections: ComponentHierarchyInjection[];

    /**
     * Get component values of the root builder. 
     */
    public get rootValues(): LayerValues {
        return this.mRootBuilder.values.rootValue;
    }

    /**
     * Update handler.
     */
    public get updateHandler(): UpdateHandler {
        return this.mUpdateHandler;
    }

    /**
     * Get user class object.
     */
    public get processor(): UserObjectHandler {
        return this.mComponentProcessor;
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
        // Load cached or create new module handler and template.
        let lTemplate: PwbTemplate | undefined = Component.mTemplateCache.get(pComponentProcessorConstructor);
        if (!lTemplate) {
            lTemplate = Component.mXmlParser.parse(pTemplateString ?? '');
            Component.mTemplateCache.set(pComponentProcessorConstructor, lTemplate);
        }

        // Create update handler.
        const lUpdateScope: UpdateScope = pUpdateScope;
        this.mUpdateHandler = new UpdateHandler(lUpdateScope);
        this.mUpdateHandler.addUpdateListener(() => {
            // Call user class on update function.
            this.mUpdateHandler.executeOutZone(() => {
                this.mComponentProcessor.callOnPwbUpdate();
            });

            // Update and callback after update.
            if (this.mRootBuilder.update()) {
                this.mComponentProcessor.callAfterPwbUpdate();
            }
        });

        // Create element handler.
        this.mElementHandler = new ElementHandler(pHtmlComponent);

        // Initialize user object injections.
        const lLocalInjections: Array<object | null> = new Array<object | null>();
        lLocalInjections.push(new ComponentElementReference(pHtmlComponent));
        lLocalInjections.push(new ComponentUpdateReference(this.mUpdateHandler));

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

        // Create user object handler.
        this.mComponentProcessor = new UserObjectHandler(pComponentProcessorConstructor, this.updateHandler, lLocalInjections);

        // After build, before initialization.
        this.mComponentProcessor.callOnPwbInitialize();

        // Connect with this component manager.
        ComponentConnection.connectComponentWith(this.elementHandler.htmlElement, this);
        ComponentConnection.connectComponentWith(this.processor.processor, this);
        ComponentConnection.connectComponentWith(this.processor.untrackedUserObject, this);

        // Create component builder.
        const lModules: ComponentModules = new ComponentModules(this, pExpressionModule);
        this.mRootBuilder = new StaticBuilder(lTemplate, lModules, new LayerValues(this), 'ROOT');
        this.elementHandler.shadowRoot.appendChild(this.mRootBuilder.anchor);

        this.mComponentProcessor.callAfterPwbInitialize();
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
        this.elementHandler.shadowRoot.prepend(lStyleElement);
    }

    /**
     * Called when component get attached to DOM.
     */
    public connected(): void {
        this.updateHandler.enabled = true;

        // Trigger light update.
        this.updateHandler.requestUpdate({
            source: this.processor.processor,
            property: Symbol('any'),
            stacktrace: <string>Error().stack
        });
    }

    /**
     * Deconstruct element.
     */
    public deconstruct(): void {
        // Disable updates.
        this.updateHandler.enabled = false;

        // User callback.
        this.processor.callOnPwbDeconstruct();

        // Deconstruct all extensions.
        for(const lExtension of this.mExtensionList) {
            lExtension.deconstruct();
        }

        // Remove change listener from app.
        this.updateHandler.deconstruct();

        // Deconstruct all child element.
        this.mRootBuilder.deconstruct();
    }

    /**
     * Called when component gets detached from DOM.
     */
    public disconnected(): void {
        this.updateHandler.enabled = false;
    }
}