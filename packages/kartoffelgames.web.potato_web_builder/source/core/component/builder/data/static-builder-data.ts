import { Exception } from '@kartoffelgames/core';
import type { AttributeModule } from '../../../module/attribute_module/attribute-module.ts';
import type { ExpressionModule } from '../../../module/expression_module/expression-module.ts';
import type { ComponentModules } from '../../component-modules.ts';
import type { PwbTemplateAttribute } from '../../template/nodes/values/pwb-template-attribute.ts';
import { BaseBuilderData } from './base-builder-data.ts';

export class StaticBuilderData extends BaseBuilderData {
    private mAttributeModulesChangedOrder: boolean;
    private readonly mLinkedAttributeElement: WeakMap<PwbTemplateAttribute, Element>;
    private readonly mLinkedAttributeExpressionModules: WeakMap<ExpressionModule, PwbTemplateAttribute>;
    private readonly mLinkedAttributeModuleList: Array<AttributeModule>;
    private readonly mLinkedAttributeNodes: WeakMap<PwbTemplateAttribute, Array<Text>>;
    private readonly mLinkedExpressionModuleList: Array<ExpressionModule>;
    

    /**
     * Get all linked attribute modules.
     * 
     * Attribute modules are allways ordered by read and write access.
     */
    public get linkedAttributeModules(): Array<AttributeModule> {
        // Reorder module list when it has new modules.
        if (this.mAttributeModulesChangedOrder) {
            this.mAttributeModulesChangedOrder = false;

            this.orderAttributeModules();
        }

        return this.mLinkedAttributeModuleList;
    }

    /**
     * Get all linked expression modules.
     * 
     * Ordered by time of linking. There is no need to order expressions as they all are readonly modules.
     */
    public get linkedExpressionModules(): Array<ExpressionModule> {
        return this.mLinkedExpressionModuleList;
    }

    /**
     * Constructor.
     * 
     * @param pModules - Builder modules.
     * @param pAnchorName - Name of generated content anchor.
     */
    public constructor(pModules: ComponentModules, pAnchorName: string) {
        super(pModules, pAnchorName);

        this.mLinkedExpressionModuleList = new Array<ExpressionModule>();
        this.mLinkedAttributeModuleList = new Array<AttributeModule>();

        // Attribute expression maps.
        this.mLinkedAttributeExpressionModules = new WeakMap<ExpressionModule, PwbTemplateAttribute>();
        this.mLinkedAttributeNodes = new WeakMap<PwbTemplateAttribute, Array<Text>>();
        this.mLinkedAttributeElement = new WeakMap<PwbTemplateAttribute, Element>();

        this.mAttributeModulesChangedOrder = false;
    }

    /**
     * Get linked attribute of expression module.
     * Return undefined when no attribute is linked to the module.
     * 
     * @param pModule - Expression module.
     * 
     * @returns linked attribute of expression module.
     */
    public attributeOfLinkedExpressionModule(pModule: ExpressionModule): PwbTemplateAttribute | undefined {
        return this.mLinkedAttributeExpressionModules.get(pModule);
    }

    /**
     * Get linked data of attribute.
     * Includes linked element and text values of attribute. 
     * 
     * @param pAttribute - Attribute template with linked data.
     * 
     * @returns Linked text nodes and element of {@link pAttribute}.
     * 
     * @throws {@link Exception}
     * When {@link pAttribute} has no linked data.
     */
    public getLinkedAttributeData(pAttribute: PwbTemplateAttribute): StaticBuilderLinkedAttributeData {
        // Read linked attribute nodes. Throw when no are linked.
        const lLinkedAttributeNodeList: Array<Text> | undefined = this.mLinkedAttributeNodes.get(pAttribute);
        const lLinedAttributeElement: Element | undefined = this.mLinkedAttributeElement.get(pAttribute);
        if (!lLinkedAttributeNodeList || !lLinedAttributeElement) {
            throw new Exception(`Attribute has no linked data.`, this);
        }

        return {
            values: lLinkedAttributeNodeList,
            node: lLinedAttributeElement
        };
    }

    /**
     * Link expression module with a attribute.
     * 
     * @param pModule - Expression modules handling a value of {@link pAttribute}.
     * @param pAttribute - Attribute template with {@link pModule} as child value.
     */
    public linkAttributeExpression(pModule: ExpressionModule, pAttribute: PwbTemplateAttribute): void {
        this.mLinkedAttributeExpressionModules.set(pModule, pAttribute);
    }

    /**
     * Link attribute module to builder.
     * Linked modules get updated in data access order on every update.
     * 
     * @param pModule - Module.
     */
    public linkAttributeModule(pModule: AttributeModule): void {
        // Add module as linked module to node module list.
        this.mLinkedAttributeModuleList.push(pModule);

        // Retrigger module reorder.
        this.mAttributeModulesChangedOrder = true;
    }

    /**
     * Link attribute data with a attribute.
     * 
     * @param pAttribute - Attribute template with {@link pModule} as child value.
     * @param pElement - Element of {@link pAttribute}.
     * @param pValues - Text node values, containing text nodes with linked expression modules.
     */
    public linkAttributeNodes(pAttribute: PwbTemplateAttribute, pElement: Element, pValues: Array<Text>): void {
        this.mLinkedAttributeNodes.set(pAttribute, pValues);
        this.mLinkedAttributeElement.set(pAttribute, pElement);
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
     * On deconstruction.
     * Deconstruct linked modules.
     */
    protected onDeconstruct(): void {
        // Deconstruct linked static modules.
        for (const lModule of this.mLinkedAttributeModuleList) {
            lModule.deconstruct();
        }

        // Deconstruct linked expression modules.
        for (const lModule of this.mLinkedExpressionModuleList) {
            lModule.deconstruct();
        }
    }

    /**
     * Order attribute modules. Sorts {@link mLinkedAttributeModuleList} reference.
     * Sort orders are: write - readwrite - read.
     */
    private orderAttributeModules(): void {
        // Sort by write->readwrite->read->expression and update.
        this.mLinkedAttributeModuleList.sort((pModuleA, pModuleB): number => {
            return pModuleA.accessMode - pModuleB.accessMode;
        });
    }
}

export type StaticBuilderLinkedAttributeData = {
    values: Array<Text>;
    node: Element;
};