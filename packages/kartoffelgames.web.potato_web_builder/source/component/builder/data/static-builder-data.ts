import { ExpressionModule } from '../../../module/expression-module';
import { StaticModule } from '../../../module/static-module';
import { ComponentModules } from '../../component-modules';
import { BaseBuilderData } from './base-builder-data';

export class StaticBuilderData extends BaseBuilderData {
    private readonly mLinkedExpressionModuleList: Array<ExpressionModule>;
    private readonly mLinkedStaticModuleList: Array<StaticModule>;
    private mStaticModulesChangedOrder: boolean;

    /**
     * Get all linked expression modules.
     * 
     * Ordered by time of linking. There is no need to order expressions as they all are readonly modules.
     */
    public get linkedExpressionModules(): Array<ExpressionModule> {
        return this.mLinkedExpressionModuleList;
    }

    /**
     * Get all linked static modules.
     * 
     * Static modules are allways ordered by read and write access.
     */
    public get linkedStaticModules(): Array<StaticModule> {
        // Reorder module list when it has new modules.
        if (this.mStaticModulesChangedOrder) {
            this.mStaticModulesChangedOrder = false;

            this.orderStaticModules();
        }

        return this.mLinkedStaticModuleList;
    }

    /**
     * Constructor.
     */
    public constructor(pModules: ComponentModules) {
        super(pModules);

        this.mLinkedExpressionModuleList = new Array<ExpressionModule>();
        this.mLinkedStaticModuleList = new Array<StaticModule>();

        this.mStaticModulesChangedOrder = false;
    }

    /**
     * Link expression module to builder.
     * Linked modules get updated on every update.
     * 
     * @param pModule - Module.
     */
    public linkExpressionModule(pModule: ExpressionModule): void {
        // Add module as linked module to node module list.
        this.mLinkedExpressionModuleList.push(pModule);
    }

    /**
     * Link static module to builder.
     * Linked modules get updated in data access order on every update.
     * 
     * @param pModule - Module.
     */
    public linkStaticModule(pModule: StaticModule): void {
        // Add module as linked module to node module list.
        this.mLinkedStaticModuleList.push(pModule);

        // Retrigger module reorder.
        this.mStaticModulesChangedOrder = true;
    }

    /**
     * On deconstruction.
     * Deconstruct linked modules.
     */
    protected onDeconstruct(): void {
        // Deconstruct linked static modules.
        for (const lModule of this.mLinkedStaticModuleList) {
            lModule.deconstruct();
        }

        // Deconstruct linked expression modules.
        for (const lModule of this.mLinkedExpressionModuleList) {
            lModule.deconstruct();
        }
    }

    /**
     * Order static modules. Sorts {@link mLinkedStaticModuleList} reference.
     * Sort orders are: write - readwrite - read.
     */
    private orderStaticModules(): void {
        // Sort by write->readwrite->read->expression and update.
        this.mLinkedStaticModuleList.sort((pModuleA, pModuleB): number => {
            // "Calculate" execution priority of module A.
            let lCompareValueA: number;
            if (pModuleA.isWriting && !pModuleA.isReading) {
                lCompareValueA = 4;
            } else if (pModuleA.isWriting && pModuleA.isReading) {
                lCompareValueA = 3;
            } else { // if (!pModuleA.isWriting && pModuleA.isReading) {
                lCompareValueA = 2;
            }

            // "Calculate" execution priority of module A.
            let lCompareValueB: number;
            if (pModuleB.isWriting && !pModuleB.isReading) {
                lCompareValueB = 4;
            } else if (pModuleB.isWriting && pModuleB.isReading) {
                lCompareValueB = 3;
            } else { // if (!pModuleB.isWriting && pModuleB.isReading) 
                lCompareValueB = 2;
            }

            return lCompareValueA - lCompareValueB;
        });
    }
}
