import { ExpressionModule } from '../../../module/expression-module';
import { StaticModule } from '../../../module/static-module';
import { ComponentModules } from '../../component-modules';
import { BaseBuilderData } from './base-builder-data';

export class StaticBuilderData extends BaseBuilderData {
    private readonly mLinkedExpressionModuleList: Array<ExpressionModule>;
    private readonly mLinkedStaticModuleList: Array<StaticModule>;

    /**
     * Get all linked expression modules.
     */
    public get linkedExpressionModuleList(): Array<ExpressionModule> {
        return [...this.mLinkedExpressionModuleList];
    }

    /**
     * Get all linked static modules.
     */
    public get linkedStaticModuleList(): Array<StaticModule> {
        return [...this.mLinkedStaticModuleList];
    }

    /**
     * Constructor.
     */
    public constructor(pModules: ComponentModules) {
        super(pModules);

        this.mLinkedExpressionModuleList = new Array<ExpressionModule>();
        this.mLinkedStaticModuleList = new Array<StaticModule>();
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
}
