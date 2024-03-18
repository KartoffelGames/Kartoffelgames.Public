import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentManager } from '../component/component-manager';
import { BasePwbTemplateNode } from '../component/template/nodes/base-pwb-template-node';
import { PwbTemplateInstructionNode } from '../component/template/nodes/pwb-template-instruction-node';
import { PwbTemplateAttribute } from '../component/template/nodes/values/pwb-template-attribute';
import { PwbTemplateExpression } from '../component/template/nodes/values/pwb-template-expression';
import { LayerValues } from '../component/values/layer-values';
import { ComponentManagerReference } from '../injection_reference/component-manager-reference';
import { ModuleTargetReference } from '../injection_reference/module-target-reference';
import { ModuleLayerValuesReference } from '../injection_reference/module/module-layer-values-reference';
import { ModuleTemplateReference } from '../injection_reference/module/module-template-reference';
import { IPwbModuleProcessor, IPwbModuleProcessorConstructor } from '../interface/module.interface';
import { ModuleConfiguration } from './global-module-storage';
import { ModuleExtensions } from './module-extensions';

export abstract class BaseModule<TTargetNode extends Node, TModuleProcessor extends IPwbModuleProcessor> {
    private readonly mComponentManager: ComponentManager;
    private readonly mExtensionList: Array<ModuleExtensions>;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private readonly mLayerValues: LayerValues;
    private readonly mModuleClass: IPwbModuleProcessorConstructor<TModuleProcessor>;
    private mModuleProcessor: TModuleProcessor | null;
    private readonly mTargetNode: TTargetNode;
    private readonly mTemplateClone: BasePwbTemplateNode;

    /**
     * Get target node.
     */
    protected get node(): TTargetNode {
        return this.mTargetNode;
    }

    /**
     * Processor of module.
     * Initialize processor when it hasn't already.
     */
    protected get processor(): TModuleProcessor {
        if (!this.mModuleProcessor) {
            this.mModuleProcessor = this.createModuleObject();
        }

        return this.mModuleProcessor;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseModuleConstructorParameter) {
        // Save parameter
        this.mTemplateClone = pParameter.targetTemplate.clone();
        this.mModuleClass = pParameter.module.constructor;
        this.mTargetNode = pParameter.targetNode;
        this.mComponentManager = pParameter.componentManager;
        this.mLayerValues = pParameter.values;
        
        // Init runtime lists.
        this.mModuleProcessor = null;
        this.mExtensionList = new Array<ModuleExtensions>();
        this.mInjections = new Dictionary<InjectionConstructor, any>();

        // Create injection mapping.
        this.setProcessorAttributes(ModuleLayerValuesReference, this.mLayerValues);
        this.setProcessorAttributes(ComponentManagerReference, pParameter.componentManager);
        this.setProcessorAttributes(ModuleTemplateReference, this.mTemplateClone);
        this.setProcessorAttributes(ModuleTargetReference, new ModuleTargetReference(pParameter.targetNode));
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
        if ('onDeconstruct' in this.processor) {
            this.processor.onDeconstruct();
        }
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
    protected setProcessorAttributes(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void {
        if (this.mModuleProcessor) {
            throw new Exception('Cant add attributes to already initialized module.', this);
        }

        this.mInjections.set(pInjectionTarget, pInjectionValue);
    }

    /**
      * Create module object.
      * @param pValue - Value for module object.
      */
    private createModuleObject(): TModuleProcessor {
        // Clone injections and extend by value reference.
        const lInjections = new Dictionary<InjectionConstructor, object>(this.mInjections);

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
        const lModuleObject: TModuleProcessor = Injection.createObject<TModuleProcessor>(this.mModuleClass, lInjections);

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
    targetNode: Node;
    targetTemplate: BaseModuleTargetTemplate,
    values: LayerValues;
};

type BaseModuleTargetTemplate = PwbTemplateAttribute | PwbTemplateExpression | PwbTemplateInstructionNode;