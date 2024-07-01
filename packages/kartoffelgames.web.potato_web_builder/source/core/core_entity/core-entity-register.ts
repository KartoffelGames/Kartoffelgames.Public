import { Dictionary } from '@kartoffelgames/core';
import { CoreEntity, CoreEntityProcessorConstructor } from './core-entity';
import { Processor } from './processor';

export class CoreEntityRegister {
    private static mInstance: CoreEntityRegister;

    private readonly mCoreEntityConstructor!: Dictionary<CoreEntityConstructor, Set<CoreEntityProcessorConstructor>>;
    private readonly mProcessorConstructorConfiguration!: Dictionary<CoreEntityProcessorConstructor, CoreEntityProcessorConstructorConfiguration>;

    /**
     * Constructor.
     * 
     * Reuses single instance.
     */
    public constructor() {
        if (CoreEntityRegister.mInstance) {
            return CoreEntityRegister.mInstance;
        }

        CoreEntityRegister.mInstance = this;

        // Class storages.
        this.mCoreEntityConstructor = new Dictionary<CoreEntityConstructor, Set<CoreEntityProcessorConstructor>>();
        this.mProcessorConstructorConfiguration = new Dictionary<CoreEntityProcessorConstructor, CoreEntityProcessorConstructorConfiguration>();
    }

    /**
     * Get registered constructors and their configurations.
     * 
     * @param pType - Constructor type. Can be anything in the inheritance chain of a core entity.
     * 
     * @returns a list of constructor and its configuration with the set types. 
     */
    public get<TConfiguration extends CoreEntityProcessorConstructorConfiguration>(pType: CoreEntityConstructor): Array<CoreEntityProcessorConstructorSetup<TConfiguration>> {
        // Get constructor list of target type.
        const lConstructorList: Set<CoreEntityProcessorConstructor> | undefined = this.mCoreEntityConstructor.get(pType) as (Set<CoreEntityProcessorConstructor> | undefined);
        if (!lConstructorList) {
            return new Array<CoreEntityProcessorConstructorSetup<TConfiguration>>();
        }

        // Read and map constructor configuration.
        const lResultList: Array<CoreEntityProcessorConstructorSetup<TConfiguration>> = new Array<CoreEntityProcessorConstructorSetup<TConfiguration>>();
        for (const lConstructor of lConstructorList) {
            lResultList.push({
                processorConstructor: lConstructor,
                processorConfiguration: this.mProcessorConstructorConfiguration.get(lConstructor)! as TConfiguration
            });
        }

        return lResultList;
    }

    /**
     * Register 
     * 
     * @param pCoreEntityTarget - Core entity constructor.
     */
    public register<TConfiguration extends CoreEntityProcessorConstructorConfiguration>(pCoreEntityTarget: CoreEntityConstructor, pProcessorConstructor: CoreEntityProcessorConstructor, pConfiguration: TConfiguration): void {
        // Register configuration.
        this.mProcessorConstructorConfiguration.set(pProcessorConstructor, pConfiguration);

        // Set register constructor target and every parent inherition.
        let lKeyConstructor: CoreEntityConstructor | null = pCoreEntityTarget;
        do {
            // No need to register for constructors of none core entity type.
            if (!(lKeyConstructor.prototype instanceof CoreEntity) && lKeyConstructor !== CoreEntity) {
                break;
            }

            // Init register set.
            if (!this.mCoreEntityConstructor.has(lKeyConstructor)) {
                this.mCoreEntityConstructor.set(lKeyConstructor, new Set<CoreEntityProcessorConstructor>());
            }

            // Register constructor to target key constructor.
            this.mCoreEntityConstructor.get(lKeyConstructor)!.add(pProcessorConstructor);
        } while ((lKeyConstructor = Object.getPrototypeOf(lKeyConstructor)));
    }
}

export type CoreEntityConstructor<TProcessor extends Processor = Processor> = new (...pParameter: Array<any>) => CoreEntity<TProcessor>;

type CoreEntityProcessorConstructorConfiguration = { [key: string]: any; };
export type CoreEntityProcessorConstructorSetup<TConfiguration extends CoreEntityProcessorConstructorConfiguration = CoreEntityProcessorConstructorConfiguration> = {
    processorConstructor: CoreEntityProcessorConstructor,
    processorConfiguration: TConfiguration;
};
