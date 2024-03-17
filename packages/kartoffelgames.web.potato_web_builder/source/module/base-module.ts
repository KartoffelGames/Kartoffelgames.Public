import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentManager } from '../component/component-manager';
import { BasePwbTemplateNode } from '../component/template/nodes/base-pwb-template-node';
import { PwbTemplateInstructionNode } from '../component/template/nodes/pwb-template-instruction-node';
import { PwbTemplateXmlNode } from '../component/template/nodes/pwb-template-xml-node';
import { PwbTemplateAttribute } from '../component/template/nodes/values/pwb-template-attribute';
import { PwbTemplateExpression } from '../component/template/nodes/values/pwb-template-expression';
import { LayerValues } from '../component/values/layer-values';
import { ModuleAccessType } from '../enum/module-access-type';
import { ComponentManagerReference } from '../injection_reference/component-manager-reference';
import { ModuleAttributeReference } from '../injection_reference/module-attribute-reference';
import { ModuleExpressionReference } from '../injection_reference/module/module-value-reference';
import { ModuleLayerValuesReference } from '../injection_reference/module-layer-values-reference';
import { ModuleTargetReference } from '../injection_reference/module-target-reference';
import { ModuleTemplateReference } from '../injection_reference/module-template-reference';
import { IPwbModuleProcessorConstructor, IPwbModuleProcessor } from '../interface/module';
import { ModuleConfiguration } from './global-module-storage';
import { ModuleExtensions } from './module-extensions';
import { IAnyParameterConstructor } from '@kartoffelgames/core.data/library/source/interface/i-constructor';

export abstract class BaseModule<TTargetNode extends Node, TModuleProcessor extends IPwbModuleProcessor> {
    private readonly mComponentManager: ComponentManager;
    private readonly mExtensionList: Array<ModuleExtensions>;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private readonly mLayerValues: LayerValues;
    private readonly mModuleClass: IPwbModuleProcessorConstructor<TModuleObjectResult>;
    private readonly mModuleDefinition: ModuleConfiguration;
    private mModuleProcessor: IPwbModuleProcessor<TModuleObjectResult> | null;
    private readonly mTargetAttribute: PwbTemplateAttribute | null;
    private readonly mTargetNode: TTargetNode;
    private readonly mTemplateClone: BasePwbTemplateNode;
    private readonly mInjections: Dictionary<InjectionConstructor, object>;

    /**
     * If modules reads data into the view.
     */
    public get isReading(): boolean {
        return (this.mModuleDefinition.access & ModuleAccessType.Read) === ModuleAccessType.Read;
    }

    /**
     * If modules writes data out of the view.
     */
    public get isWriting(): boolean {
        return (this.mModuleDefinition.access & ModuleAccessType.Write) === ModuleAccessType.Write;
    }

    /**
     * Get module definition.
     */
    public get moduleDefinition(): ModuleConfiguration {
        return this.mModuleDefinition;
    }

    /**
     * Get target attribute.
     */
    protected get attribute(): PwbTemplateAttribute | null {
        return this.mTargetAttribute;
    }

    /**
     * Get target node.
     */
    protected get node(): TTargetNode {
        return this.mTargetNode;
    }

    /**
     * Processor of module.
     * 
     * @throws {@link Exception}
     * When the processor was not initialized.
     */
    protected get processor(): TModuleProcessor {
        if (!this.mModuleProcessor) {
            throw new Exception('No module processor was initialized.', this);
        }

        return this.mModuleProcessor;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseModuleConstructorParameter) {
        // Clone template.
        this.mTemplateClone = pParameter.targetTemplate.clone();
        this.mTemplateClone.parent = pParameter.targetTemplate.parent;

        // Remove target atribute.
        if (this.mTemplateClone instanceof PwbTemplateXmlNode && pParameter.targetAttribute) {
            this.mTemplateClone.removeAttribute(pParameter.targetAttribute.name);
        }

        this.mModuleDefinition = pParameter.module;
        this.mModuleClass = pParameter.module.constructor;
        this.mTargetNode = pParameter.targetNode;
        this.mTargetAttribute = pParameter.targetAttribute;
        this.mComponentManager = pParameter.componentManager;
        this.mLayerValues = pParameter.values;
        this.mExtensionList = new Array<ModuleExtensions>();
        this.mModuleProcessor = null;
        this.mInjections = new Dictionary<InjectionConstructor, object>();

        // Create injection mapping.
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mInjections.set(ModuleLayerValuesReference, new ModuleLayerValuesReference(this.mLayerValues));
        this.mInjections.set(ComponentManagerReference, new ComponentManagerReference(pParameter.componentManager));
        if (pParameter.targetAttribute !== null) {
            this.mInjections.set(ModuleAttributeReference, new ModuleAttributeReference(pParameter.targetAttribute));
        }
        this.mInjections.set(ModuleTemplateReference, new ModuleTemplateReference(this.mTemplateClone));
        this.mInjections.set(ModuleTargetReference, new ModuleTargetReference(pParameter.targetNode));


        // TODO: Please redo id. PLEASE :.(
        // TODO: Call this before update when no module exists.
        this.mModuleProcessor = this.createModuleObject(pValue);
    }

    /**
     * Deconstruct module.
     */
    public deconstruct(): void {
        // Deconstruct extensions.
        for (const lExtensions of this.mExtensionList) {
            lExtensions.deconstruct();
        }

        // Deconstruct modules.
        for (const lModule of this.mModuleProcessor) {
            lModule.onDeconstruct?.();
        }
    }

    /**
     * Set injection parameter for the module processor class construction. 
     * 
     * @param pInjectionTarget - Injection type that should be provided to processor.
     * @param pInjectionValue - Actual injected value in replacement for {@link pInjectionTarget}.
     */
    protected setProcessorAttributes(pInjectionTarget: InjectionConstructor, pInjectionValue: object): void {
        this.mInjections.set(pInjectionTarget, pInjectionValue);
    }

    /**
      * Create module object.
      * @param pValue - Value for module object.
      */
    private createModuleObject(pValue: string): IPwbModuleProcessor<TModuleObjectResult> {
        // Clone injections and extend by value reference.
        const lInjections = new Dictionary<InjectionConstructor, object>(this.mInjections);
        lInjections.set(ModuleExpressionReference, new ModuleExpressionReference(pValue));

        // Create extensions and collect extension injections.
        const lExtensions: ModuleExtensions = new ModuleExtensions();
        const lExtensionInjectionList: Array<object | null> = lExtensions.executeInjectorExtensions({
            componentManager: this.mComponentManager,
            targetClass: this.mModuleClass,
            template: this.mTemplateClone,
            attribute: this.mTargetAttribute,
            layerValues: this.mLayerValues,
            element: this.mTargetNode
        });

        // Parse and merge extension injections into local injections.
        for (const lInjectionObject of lExtensionInjectionList) {
            if (typeof lInjectionObject === 'object' && lInjectionObject !== null) {
                lInjections.set(<InjectionConstructor>lInjectionObject.constructor, lInjectionObject);
            }
        }

        // Create module object with local injections.
        const lModuleObject: IPwbModuleProcessor<TModuleObjectResult> = Injection.createObject(this.mModuleClass, lInjections);

        // Execute patcher extensions and save extension for deconstructing.
        this.mExtensionList.push(lExtensions);
        lExtensions.executePatcherExtensions({
            componentManager: this.mComponentManager,
            targetClass: this.mModuleClass,
            targetObject: lModuleObject,
            template: this.mTemplateClone,
            attribute: this.mTargetAttribute,
            layerValues: this.mLayerValues,
            element: this.mTargetNode
        });

        return lModuleObject;
    }

    /**
     * Update module.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    public abstract update(): boolean;
}

export type BaseModuleConstructorParameter = {
    componentManager: ComponentManager,
    module: ModuleConfiguration,
    targetNode: Node | null;
    targetTemplate: BaseModuleTargetTemplate,
    values: LayerValues;
};

type BaseModuleTargetTemplate = PwbTemplateAttribute | PwbTemplateExpression | PwbTemplateInstructionNode;