import { Dictionary, List } from '@kartoffelgames/core.data';
import { ModuleAccessType } from '../enum/module-access-type';
import { IPwbAttributeModuleClass, IPwbExpressionModuleClass, IPwbInstructionModuleClass } from '../interface/module';

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

    private readonly mAttributeModuleClasses!: Dictionary<AttributeModuleConfiguration, IPwbAttributeModuleClass>;
    private readonly mAttributeModuleConfigurations!: Dictionary<IPwbAttributeModuleClass, AttributeModuleConfiguration>;
    private readonly mExpressionModuleClasses!: Dictionary<ExpressionModuleConfiguration, IPwbExpressionModuleClass>;
    private readonly mExpressionModuleConfigurations!: Dictionary<IPwbExpressionModuleClass, ExpressionModuleConfiguration>;
    private readonly mInstructionModuleClasses!: Dictionary<InstructionModuleConfiguration, IPwbInstructionModuleClass>;
    private readonly mInstructionModuleConfigurations!: Dictionary<IPwbInstructionModuleClass, InstructionModuleConfiguration>;

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
        this.mAttributeModuleClasses = new Dictionary<AttributeModuleConfiguration, IPwbAttributeModuleClass>();
        this.mExpressionModuleClasses = new Dictionary<ExpressionModuleConfiguration, IPwbExpressionModuleClass>();
        this.mInstructionModuleClasses = new Dictionary<InstructionModuleConfiguration, IPwbInstructionModuleClass>();

        // Config storages.
        this.mAttributeModuleConfigurations = new Dictionary<IPwbAttributeModuleClass, AttributeModuleConfiguration>();
        this.mExpressionModuleConfigurations = new Dictionary<IPwbExpressionModuleClass, ExpressionModuleConfiguration>();
        this.mInstructionModuleConfigurations = new Dictionary<IPwbInstructionModuleClass, InstructionModuleConfiguration>();
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
    public getAttributeModuleConfiguration(pModuleClass: IPwbAttributeModuleClass): AttributeModuleConfiguration | undefined {
        return this.mAttributeModuleConfigurations.get(pModuleClass);
    }

    /**
     * Get expression module configuration for expression module class.
     * @param pModuleClass - Module class.
     */
    public getExpressionModuleConfiguration(pModuleClass: IPwbExpressionModuleClass): ExpressionModuleConfiguration | undefined {
        return this.mExpressionModuleConfigurations.get(pModuleClass);
    }

    /**
     * Get instruction module definition for instruction module class.
     * @param pModuleClass - Module class.
     */
    public getInstructionModuleConfiguration(pModuleClass: IPwbInstructionModuleClass): InstructionModuleConfiguration | undefined {
        return this.mInstructionModuleConfigurations.get(pModuleClass);
    }
}

export type AttributeModuleConfiguration = {
    constructor: IPwbAttributeModuleClass,
    selector: RegExp;
    access: ModuleAccessType;
};

export type ExpressionModuleConfiguration = {
    constructor: IPwbExpressionModuleClass,
};

export type InstructionModuleConfiguration = {
    constructor: IPwbInstructionModuleClass,
    instructionType: string;
};

export type ModuleDefinition = AttributeModuleConfiguration | ExpressionModuleConfiguration | InstructionModuleConfiguration;