import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { PwbTemplateInstructionNode } from '../component/template/nodes/pwb-template-instruction-node';
import { PwbTemplateAttribute } from '../component/template/nodes/values/pwb-template-attribute';
import { PwbTemplateExpression } from '../component/template/nodes/values/pwb-template-expression';
import { LayerValues } from '../component/values/layer-values';
import { AccessMode } from '../enum/access-mode.enum';
import { ExtensionType } from '../enum/extension-type.enum';
import { ExtensionModule } from '../extension/extension-module';
import { InjectionHierarchyParent } from '../injection/injection-hierarchy-parent';
import { ModuleConstructorReference } from '../injection/references/module/module-constructor-reference';
import { ModuleLayerValuesReference } from '../injection/references/module/module-layer-values-reference';
import { ModuleReference } from '../injection/references/module/module-reference';
import { ModuleTargetNodeReference } from '../injection/references/module/module-target-node-reference';
import { ModuleTemplateReference } from '../injection/references/module/module-template-reference';
import { IPwbModuleProcessor, IPwbModuleProcessorConstructor } from '../interface/module.interface';
import { ExtensionModuleConfiguration, GlobalModuleStorage } from './global-module-storage';

export abstract class BaseModule<TTargetNode extends Node, TModuleProcessor extends IPwbModuleProcessor> extends InjectionHierarchyParent {
    private readonly mExtensionList: Array<ExtensionModule>;
    private mProcessor: TModuleProcessor | null;
    private readonly mProcessorConstructor: InjectionConstructor;
    private readonly mTargetNode: TTargetNode;

    /**
     * Processor of module.
     * Initialize processor when it hasn't already.
     */
    public get processor(): TModuleProcessor {
        if (!this.mProcessor) {
            this.createModuleProcessor();
        }

        return this.mProcessor!;
    }

    /**
     * Get target node.
     */
    protected get node(): TTargetNode {
        return this.mTargetNode;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseModuleConstructorParameter<TTargetNode>) {
        super(pParameter.parent);

        // Save parameter
        this.mProcessorConstructor = pParameter.constructor;
        this.mTargetNode = pParameter.targetNode;

        // Init runtime lists.
        this.mProcessor = null;
        this.mExtensionList = new Array<ExtensionModule>();

        // Create module injection mapping.
        this.setProcessorAttributes(ModuleTemplateReference, pParameter.targetTemplate.clone());
        this.setProcessorAttributes(ModuleTargetNodeReference, pParameter.targetNode);
        this.setProcessorAttributes(ModuleLayerValuesReference, pParameter.values);
        this.setProcessorAttributes(ModuleConstructorReference, pParameter.constructor);
        this.setProcessorAttributes(ModuleReference, this);
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
     * Update module.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    public update(): boolean {
        return this.onUpdate();
    }

    /**
     * Create module object.
     * @param pValue - Value for module object.
     */
    private createModuleProcessor(): void {
        const lExtensions: GlobalModuleStorage = new GlobalModuleStorage();

        // Create every write module extension.
        for (const lExtensionModuleConfiguration of lExtensions.getExtensionModuleConfiguration(ExtensionType.Module, AccessMode.Write)) {
            const lModuleExtension: ExtensionModule = new ExtensionModule({
                constructor: lExtensionModuleConfiguration.constructor,
                parent: this
            });

            // Execute extension.
            lModuleExtension.execute();

            this.mExtensionList.push(lModuleExtension);
        }

        // Lock new injections.
        this.lock();

        // Create and store processor to be accessable for all read extensions.
        this.mProcessor = Injection.createObject<TModuleProcessor>(this.mProcessorConstructor, this.injections);

        // Get all read extensions. Keep order to execute readWrite extensions first.
        const lReadExtensions: Array<ExtensionModuleConfiguration> = [
            ...lExtensions.getExtensionModuleConfiguration(ExtensionType.Module, AccessMode.ReadWrite),
            ...lExtensions.getExtensionModuleConfiguration(ExtensionType.Module, AccessMode.Read)
        ];

        // Create every read module extension.
        for (const lExtensionModuleConfiguration of lReadExtensions) {
            const lModuleExtension: ExtensionModule = new ExtensionModule({
                constructor: lExtensionModuleConfiguration.constructor,
                parent: this
            });

            // Execute extension.
            lModuleExtension.execute();

            this.mExtensionList.push(lModuleExtension);
        }
    }

    /**
     * Update module.
     * 
     * @returns True when any update happened, false when all values stayed the same.
     */
    protected abstract onUpdate(): boolean;
}

export type BaseModuleConstructorParameter<TTargetNode extends Node> = {
    parent: InjectionHierarchyParent,
    constructor: IPwbModuleProcessorConstructor<IPwbModuleProcessor>,
    targetNode: TTargetNode;
    targetTemplate: BaseModuleTargetTemplate,
    values: LayerValues;
};

type BaseModuleTargetTemplate = PwbTemplateAttribute | PwbTemplateExpression | PwbTemplateInstructionNode;