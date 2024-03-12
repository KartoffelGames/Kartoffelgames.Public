import { Dictionary } from '@kartoffelgames/core.data';
import { BaseModule } from '../../../module/base-module';
import { ExpressionModule } from '../../../module/expression-module';
import { StaticModule } from '../../../module/static-module';
import { ComponentModules } from '../../component-modules';
import { BaseBuilder } from '../base-builder';
import { BaseBuilderContent } from './base-builder-content';

export class StaticBuilderContent extends BaseBuilderContent {
    private readonly mLinkedModules: Dictionary<Node, Array<BaseModule<boolean, any>>>;

    /**
     * Get all linked module lists.
     */
    public get linkedModuleList(): Array<BaseModule<boolean, any>> {
        const lAllModuleList: Array<BaseModule<boolean, any>> = new Array<BaseModule<boolean, any>>();
        for (const lNodeModuleList of this.mLinkedModules.values()) {
            lAllModuleList.push(...lNodeModuleList);
        }
        return lAllModuleList;
    }

    /**
     * Constructor.
     */
    public constructor(pModules: ComponentModules) {
        super(pModules);

        this.mLinkedModules = new Dictionary<Node, Array<BaseModule<boolean, any>>>();
    }

    /**
     * Link module to node.
     * @param pModule - Module.
     * @param pNode - Build node.
     */
    public linkModule(pModule: StaticModule | ExpressionModule, pNode: Node): void {
        // Get module list of node. Create if it not exists.
        let lModuleList: Array<BaseModule<boolean, any>> | undefined = this.mLinkedModules.get(pNode);
        if (!lModuleList) {
            lModuleList = new Array<BaseModule<boolean, any>>();
            this.mLinkedModules.set(pNode, lModuleList);
        }

        // Add module as linked module to node module list.
        lModuleList.push(pModule);
    }

    /**
     * On deconstruction.
     * Deconstruct linked modules.
     */
    protected onDeconstruct(): void {
        // Deconstruct linked modules.
        for (const lModule of this.linkedModuleList) {
            lModule.deconstruct();
        }
    }
}

export type Boundary = {
    start: Node;
    end: Node;
};

export type BoundaryDescription = {
    start: Node | BaseBuilder;
    end: Node | BaseBuilder;
};

