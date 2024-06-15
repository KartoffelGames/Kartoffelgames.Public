import { Dictionary, List } from '@kartoffelgames/core.data';
import { AccessMode } from '../enum/access-mode.enum';
import { IPwbAttributeModuleProcessorConstructor, IPwbExpressionModuleProcessorConstructor, IPwbInstructionModuleProcessorConstructor } from '../interface/module.interface';
import { IPwbExtensionModuleProcessorConstructor } from '../interface/extension.interface';
import { UpdateTrigger } from '../enum/update-trigger.enum';
import { ExtensionType } from '../enum/extension-type.enum';

/**
 * Global module storage.
 * Containing all imported modules.
 * 
 * Singleton instance.
 * 
 * @internal
 */
export class GlobalModuleStorage {
    private static mInstance: GlobalModuleStorage;

    private readonly mAttributeModuleClasses!: Dictionary<AttributeModuleConfiguration, IPwbAttributeModuleProcessorConstructor>;
    private readonly mAttributeModuleConfigurations!: Dictionary<IPwbAttributeModuleProcessorConstructor, AttributeModuleConfiguration>;
    private readonly mExpressionModuleClasses!: Dictionary<ExpressionModuleConfiguration, IPwbExpressionModuleProcessorConstructor>;
    private readonly mExpressionModuleConfigurations!: Dictionary<IPwbExpressionModuleProcessorConstructor, ExpressionModuleConfiguration>;
    private readonly mInstructionModuleClasses!: Dictionary<InstructionModuleConfiguration, IPwbInstructionModuleProcessorConstructor>;
    private readonly mInstructionModuleConfigurations!: Dictionary<IPwbInstructionModuleProcessorConstructor, InstructionModuleConfiguration>;

    /**
     * Get attribute module configurations of all attribute modules.
     */
    public get attributeModuleConfigurations(): Array<AttributeModuleConfiguration> {
        return List.newListWith(...this.mAttributeModuleConfigurations.values());
    }

    /**
     * Get expression module definitions of all expression modules.
     */
    public get expressionModuleConfigurations(): Array<ExpressionModuleConfiguration> {
        return List.newListWith(...this.mExpressionModuleConfigurations.values());
    }

    /**
     * Get instruction module definitions of all instruction modules.
     */
    public get instructionModuleConfigurations(): Array<InstructionModuleConfiguration> {
        return List.newListWith(...this.mInstructionModuleConfigurations.values());
    }

    /**
     * Constructor.
     * 
     * Reuses single instance.
     */
    public constructor() {
        if (GlobalModuleStorage.mInstance) {
            return GlobalModuleStorage.mInstance;
        }

        GlobalModuleStorage.mInstance = this;

        // Class storages.
        this.mAttributeModuleClasses = new Dictionary<AttributeModuleConfiguration, IPwbAttributeModuleProcessorConstructor>();
        this.mExpressionModuleClasses = new Dictionary<ExpressionModuleConfiguration, IPwbExpressionModuleProcessorConstructor>();
        this.mInstructionModuleClasses = new Dictionary<InstructionModuleConfiguration, IPwbInstructionModuleProcessorConstructor>();

        // Config storages.
        this.mAttributeModuleConfigurations = new Dictionary<IPwbAttributeModuleProcessorConstructor, AttributeModuleConfiguration>();
        this.mExpressionModuleConfigurations = new Dictionary<IPwbExpressionModuleProcessorConstructor, ExpressionModuleConfiguration>();
        this.mInstructionModuleConfigurations = new Dictionary<IPwbInstructionModuleProcessorConstructor, InstructionModuleConfiguration>();
    }

    /**
     * Add attribute module to global scope.
     * @param pModuleClass - User module class.
     * @param pModuleDefinition - Module definition.
     */
    public addAttributeModule(pModuleDefinition: AttributeModuleConfiguration): void {
        this.mAttributeModuleClasses.set(pModuleDefinition, pModuleDefinition.constructor);
        this.mAttributeModuleConfigurations.set(pModuleDefinition.constructor, pModuleDefinition);
    }

    /**
     * Add expression module to global scope.
     * @param pModuleClass - User module class.
     * @param pModuleDefinition - Module definition.
     */
    public addExpressionModule(pModuleDefinition: ExpressionModuleConfiguration): void {
        this.mExpressionModuleClasses.set(pModuleDefinition, pModuleDefinition.constructor);
        this.mExpressionModuleConfigurations.set(pModuleDefinition.constructor, pModuleDefinition);
    }

    /**
     * Add instruction module to global scope.
     * @param pModuleClass - User module class.
     * @param pModuleDefinition - Module definition.
     */
    public addInstructionModule(pModuleDefinition: InstructionModuleConfiguration): void {
        this.mInstructionModuleClasses.set(pModuleDefinition, pModuleDefinition.constructor);
        this.mInstructionModuleConfigurations.set(pModuleDefinition.constructor, pModuleDefinition);
    }

    /**
     * Get attribute module definition for attribute module class.
     * @param pModuleClass - Module class.
     */
    public getAttributeModuleConfiguration(pModuleClass: IPwbAttributeModuleProcessorConstructor): AttributeModuleConfiguration | undefined {
        return this.mAttributeModuleConfigurations.get(pModuleClass);
    }

    /**
     * Get expression module configuration for expression module class.
     * @param pModuleClass - Module class.
     */
    public getExpressionModuleConfiguration(pModuleClass: IPwbExpressionModuleProcessorConstructor): ExpressionModuleConfiguration | undefined {
        return this.mExpressionModuleConfigurations.get(pModuleClass);
    }

    /**
     * Get instruction module definition for instruction module class.
     * @param pModuleClass - Module class.
     */
    public getInstructionModuleConfiguration(pModuleClass: IPwbInstructionModuleProcessorConstructor): InstructionModuleConfiguration | undefined {
        return this.mInstructionModuleConfigurations.get(pModuleClass);
    }
}

export type AttributeModuleConfiguration = {
    access: AccessMode;
    constructor: IPwbAttributeModuleProcessorConstructor;
    selector: RegExp;
    trigger: UpdateTrigger;
};

export type ExpressionModuleConfiguration = {
    constructor: IPwbExpressionModuleProcessorConstructor;
    trigger: UpdateTrigger;
};

export type InstructionModuleConfiguration = {
    constructor: IPwbInstructionModuleProcessorConstructor;
    instructionType: string;
    trigger: UpdateTrigger;
};

export type ExtensionModuleConfiguration = {
    access: AccessMode;
    constructor: IPwbExtensionModuleProcessorConstructor;
    type: ExtensionType;
    trigger: UpdateTrigger;
};