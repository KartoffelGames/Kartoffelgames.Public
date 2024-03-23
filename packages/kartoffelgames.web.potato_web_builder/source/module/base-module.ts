import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { PwbTemplateInstructionNode } from '../component/template/nodes/pwb-template-instruction-node';
import { PwbTemplateAttribute } from '../component/template/nodes/values/pwb-template-attribute';
import { PwbTemplateExpression } from '../component/template/nodes/values/pwb-template-expression';
import { LayerValues } from '../component/values/layer-values';
import { GlobalExtensionsStorage } from '../extension/global-extensions-storage';
import { ModuleExtension } from '../extension/module-extension';
import { ModuleTargetNode } from '../injection_reference/module/module-target-node-reference';
import { ModuleTemplateReference } from '../injection_reference/module/module-template-reference';
import { ModuleValueReference } from '../injection_reference/module/module-value-reference';
import { ComponentHierarchyInjection, IComponentHierarchyParent } from '../interface/component-hierarchy.interface';
import { IPwbModuleProcessor, IPwbModuleProcessorConstructor } from '../interface/module.interface';

export abstract class BaseModule<TTargetNode extends Node, TModuleProcessor extends IPwbModuleProcessor> implements IComponentHierarchyParent {
    private readonly mExtensionList: Array<ModuleExtension>;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private mModuleProcessor: TModuleProcessor | null;
    private readonly mProcessorConstructor: InjectionConstructor;
    private readonly mTargetNode: TTargetNode;

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
            this.mModuleProcessor = this.createModuleProcessor();
        }

        return this.mModuleProcessor;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseModuleConstructorParameter<TTargetNode>) {
        // Save parameter
        this.mProcessorConstructor = pParameter.constructor;
        this.mTargetNode = pParameter.targetNode;

        // Init runtime lists.
        this.mModuleProcessor = null;
        this.mExtensionList = new Array<ModuleExtension>();
        this.mInjections = new Dictionary<InjectionConstructor, any>();

        // Init injections from hierarchy parent.
        for (const lParentInjection of pParameter.parent.injections) {
            this.setProcessorAttributes(lParentInjection.target, lParentInjection.value);
        }

        // Create module injection mapping.
        this.setProcessorAttributes(ModuleTemplateReference, pParameter.targetTemplate.clone());
        this.setProcessorAttributes(ModuleTargetNode, pParameter.targetNode);
        this.setProcessorAttributes(ModuleValueReference, pParameter.values);
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
        if ('onDeconstruct' in this.processor && typeof this.processor.onDeconstruct === 'function') {
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
    public setProcessorAttributes(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void {
        if (this.mModuleProcessor) {
            throw new Exception('Cant add attributes to already initialized module.', this);
        }

        this.mInjections.set(pInjectionTarget, pInjectionValue);
    }

    /**
      * Create module object.
      * @param pValue - Value for module object.
      */
    private createModuleProcessor(): TModuleProcessor {
        const lExtensions: GlobalExtensionsStorage = new GlobalExtensionsStorage();

        // Create every module extension.
        for (const lExtensionProcessorConstructor of lExtensions.moduleExtensions) {
            const lModuleExtension: ModuleExtension = new ModuleExtension({
                constructor: lExtensionProcessorConstructor,
                parent: this
            });

            this.mExtensionList.push(lModuleExtension);
        }

        return Injection.createObject<TModuleProcessor>(this.mProcessorConstructor, this.mInjections);
    }

    /**
     * Update module.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    public abstract update(): boolean;
}

export type BaseModuleConstructorParameter<TTargetNode extends Node> = {
    parent: IComponentHierarchyParent,
    constructor: IPwbModuleProcessorConstructor<IPwbModuleProcessor>,
    targetNode: TTargetNode;
    targetTemplate: BaseModuleTargetTemplate,
    values: LayerValues;
};

type BaseModuleTargetTemplate = PwbTemplateAttribute | PwbTemplateExpression | PwbTemplateInstructionNode;