import { Dictionary, List } from '@kartoffelgames/core.data';
import { ModuleAccessType } from './enum/module-access-type';
import { IPwbExpressionModuleClass, IPwbModuleClass, IPwbAttributeModuleClass } from './interface/module';

/**
 * Global module storage.
 * Containing all imported modules.
 * 
 * Singleton instance.
 */
export class GlobalModuleStorage {
    private static mInstance: GlobalModuleStorage;

    private readonly mAttributeModuleClasses!: Dictionary<AttributeModuleDefinition, IPwbAttributeModuleClass>;
    private readonly mAttributeModuleConfigurations!: Dictionary<IPwbAttributeModuleClass, AttributeModuleDefinition>;

    private readonly mExpressionModuleClasses!: Dictionary<ExpressionModuleDefinition, IPwbExpressionModuleClass>;
    private readonly mExpressionModuleConfigurations!: Dictionary<IPwbExpressionModuleClass, ExpressionModuleDefinition>;

    private readonly mInstructionModuleClasses!: Dictionary<InstructionModuleDefinition, IPwbModuleClass<unknown>>;
    private readonly mInstructionModuleConfigurations!: Dictionary<IPwbModuleClass<unknown>, InstructionModuleDefinition>;

    /**
     * Get attribute module configurations of all attribute modules.
     */
    public get attributeModuleConfigurations(): Array<AttributeModuleDefinition> {
        return List.newListWith(...this.mAttributeModuleConfigurations.values());
    }

    /**
     * Get expression module definitions of all expression modules.
     */
    public get expressionModuleConfigurations(): Array<ExpressionModuleDefinition> {
        return List.newListWith(...this.mExpressionModuleConfigurations.values());
    }

    /**
     * Get instruction module definitions of all instruction modules.
     */
    public get instructionModuleConfigurations(): Array<InstructionModuleDefinition> {
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
        this.mAttributeModuleClasses = new Dictionary<AttributeModuleDefinition, IPwbAttributeModuleClass>();
        this.mExpressionModuleClasses = new Dictionary<ExpressionModuleDefinition, IPwbExpressionModuleClass>();
        this.mInstructionModuleClasses = new Dictionary<InstructionModuleDefinition, IPwbModuleClass<unknown>>();

        // Config storages.
        this.mAttributeModuleConfigurations = new Dictionary<IPwbAttributeModuleClass, AttributeModuleDefinition>();
        this.mExpressionModuleConfigurations = new Dictionary<IPwbExpressionModuleClass, ExpressionModuleDefinition>();
        this.mInstructionModuleConfigurations = new Dictionary<IPwbModuleClass<unknown>, InstructionModuleDefinition>();
    }

    /**
     * Add attribute module to global scope.
     * @param pModuleClass - User module class.
     * @param pModuleDefinition - Module definition.
     */
    public addAttributeModule(pModuleClass: IPwbAttributeModuleClass, pModuleDefinition: AttributeModuleDefinition): void {
        this.mAttributeModuleClasses.set(pModuleDefinition, pModuleClass);
        this.mAttributeModuleConfigurations.set(pModuleClass, pModuleDefinition);
    }

    /**
     * Add expression module to global scope.
     * @param pModuleClass - User module class.
     * @param pModuleDefinition - Module definition.
     */
    public addExpressionModule(pModuleClass: IPwbExpressionModuleClass, pModuleDefinition: ExpressionModuleDefinition): void {
        this.mExpressionModuleClasses.set(pModuleDefinition, pModuleClass);
        this.mExpressionModuleConfigurations.set(pModuleClass, pModuleDefinition);
    }

    /**
     * Add instruction module to global scope.
     * @param pModuleClass - User module class.
     * @param pModuleDefinition - Module definition.
     */
    public addInstructionModule(pModuleClass: IPwbModuleClass<unknown>, pModuleDefinition: InstructionModuleDefinition): void {
        this.mInstructionModuleClasses.set(pModuleDefinition, pModuleClass);
        this.mInstructionModuleConfigurations.set(pModuleClass, pModuleDefinition);
    }

    /**
     * Get attribute module definition for attribute module class.
     * @param pModuleClass - Module class.
     */
    public getAttributeModuleConfiguration(pModuleClass: IPwbAttributeModuleClass): AttributeModuleDefinition | undefined {
        return this.mAttributeModuleConfigurations.get(pModuleClass);
    }

    /**
     * Get expression module configuration for expression module class.
     * @param pModuleClass - Module class.
     */
    public getExpressionModuleConfiguration(pModuleClass: IPwbExpressionModuleClass): ExpressionModuleDefinition | undefined {
        return this.mExpressionModuleConfigurations.get(pModuleClass);
    }

    /**
     * Get instruction module definition for instruction module class.
     * @param pModuleClass - Module class.
     */
    public getInstructionModuleConfiguration(pModuleClass: IPwbModuleClass<unknown>): InstructionModuleDefinition | undefined {
        return this.mInstructionModuleConfigurations.get(pModuleClass);
    }

}

type AttributeModuleDefinition = {
    constructor: IPwbAttributeModuleClass,
    selector: RegExp;
    access: ModuleAccessType;
};

type ExpressionModuleDefinition = {
    constructor: IPwbAttributeModuleClass,
};

type InstructionModuleDefinition = {
    constructor: IPwbAttributeModuleClass,
    instructionType: string;
};