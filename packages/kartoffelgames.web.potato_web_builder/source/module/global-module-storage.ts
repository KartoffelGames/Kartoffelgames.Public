import { Dictionary, List } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { AccessMode } from '../enum/access-mode.enum';
import { UpdateTrigger } from '../enum/update-trigger.enum';
import { IPwbAttributeModuleProcessorConstructor, IPwbExpressionModuleProcessorConstructor, IPwbExtensionModuleProcessorConstructor, IPwbInstructionModuleProcessorConstructor } from '../interface/module.interface';

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
    private readonly mExtensionModuleClasses!: Dictionary<ExtensionModuleConfiguration, IPwbExtensionModuleProcessorConstructor>;
    private readonly mExtensionModuleConfigurations!: Dictionary<IPwbExtensionModuleProcessorConstructor, ExtensionModuleConfiguration>;
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
     * Get expression module definitions of all expression modules.
     */
    public get extensionModuleConfigurations(): Array<ExtensionModuleConfiguration> {
        return List.newListWith(...this.mExtensionModuleConfigurations.values());
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
        this.mExtensionModuleClasses = new Dictionary<ExtensionModuleConfiguration, IPwbExtensionModuleProcessorConstructor>();

        // Config storages.
        this.mAttributeModuleConfigurations = new Dictionary<IPwbAttributeModuleProcessorConstructor, AttributeModuleConfiguration>();
        this.mExpressionModuleConfigurations = new Dictionary<IPwbExpressionModuleProcessorConstructor, ExpressionModuleConfiguration>();
        this.mInstructionModuleConfigurations = new Dictionary<IPwbInstructionModuleProcessorConstructor, InstructionModuleConfiguration>();
        this.mExtensionModuleConfigurations = new Dictionary<IPwbExtensionModuleProcessorConstructor, ExtensionModuleConfiguration>();
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
     * Add global component extension.
     * @param pExtension - Extension constructor.
     * @param pExtensionType - Type of extension.
     */
    public addExtensionModule(pModuleDefinition: ExtensionModuleConfiguration): void {
        this.mExtensionModuleClasses.set(pModuleDefinition, pModuleDefinition.constructor);
        this.mExtensionModuleConfigurations.set(pModuleDefinition.constructor, pModuleDefinition);
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
     * Get extension module definition for extension module class.
     * @param pModuleClass - Module class.
     */
    public getExtensionModuleConfiguration(pModuleClass: IPwbExtensionModuleProcessorConstructor): ExtensionModuleConfiguration | undefined {
        return this.mExtensionModuleConfigurations.get(pModuleClass);
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
    trigger: UpdateTrigger;
    targetRestrictions: Array<InjectionConstructor>;
};