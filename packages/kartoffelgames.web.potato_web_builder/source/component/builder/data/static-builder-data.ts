import { BaseModule } from '../../../module/base-module';
import { ExpressionModule } from '../../../module/expression-module';
import { StaticModule } from '../../../module/static-module';
import { ComponentModules } from '../../component-modules';
import { BaseBuilderData } from './base-builder-data';

export class StaticBuilderData extends BaseBuilderData {
    private readonly mLinkedModuleList: Array<BaseModule<boolean, any>>;

    /**
     * Get all linked module lists.
     */
    public get linkedModuleList(): Array<BaseModule<boolean, any>> {
        return [...this.mLinkedModuleList];
    }

    /**
     * Constructor.
     */
    public constructor(pModules: ComponentModules) {
        super(pModules);

        this.mLinkedModuleList = new Array<BaseModule<boolean, any>>();
    }

    /**
     * Link static module to builder.
     * Linked modules get updated in data access order on every update.
     * 
     * @param pModule - Module.
     */
    public linkModule(pModule: StaticModule | ExpressionModule): void {
        // Add module as linked module to node module list.
        this.mLinkedModuleList.push(pModule);
    }

    /**
     * On deconstruction.
     * Deconstruct linked modules.
     */
    protected onDeconstruct(): void {
        // Deconstruct linked modules.
        for (const lModule of this.mLinkedModuleList) {
            lModule.deconstruct();
        }
    }
}
