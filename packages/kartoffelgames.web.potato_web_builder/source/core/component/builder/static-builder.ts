import type { AttributeModule } from '../../module/attribute_module/attribute-module.ts';
import type { ExpressionModule } from '../../module/expression_module/expression-module.ts';
import { DataLevel } from '../../data/data-level.ts';
import type { ComponentModules } from '../component-modules.ts';
import type { BasePwbTemplateNode } from '../template/nodes/base-pwb-template-node.ts';
import { PwbTemplate } from '../template/nodes/pwb-template.ts';
import { PwbTemplateInstructionNode } from '../template/nodes/pwb-template-instruction-node.ts';
import { PwbTemplateTextNode } from '../template/nodes/pwb-template-text-node.ts';
import { PwbTemplateXmlNode } from '../template/nodes/pwb-template-xml-node.ts';
import type { PwbTemplateAttribute } from '../template/nodes/values/pwb-template-attribute.ts';
import { PwbTemplateExpression } from '../template/nodes/values/pwb-template-expression.ts';
import { BaseBuilder } from './base-builder.ts';
import type { BuilderContent } from './data/base-builder-data.ts';
import { StaticBuilderData, type StaticBuilderLinkedAttributeData } from './data/static-builder-data.ts';
import { InstructionBuilder } from './instruction-builder.ts';

/**
 * Static builder. Handles any type of pwb template but creates new {@link InstructionBuilder} for every instruction node.
 * 
 * @internal
 */
export class StaticBuilder extends BaseBuilder<StaticPwbTemplate, StaticBuilderData> {
    private mInitialized: boolean;

    /**
     * Constructor.
     * 
     * @param pTemplate - Template.
     * @param pModules - Attribute modules.
     * @param pParentDataLevel - Data of parent builder.
     * @param pAnchorName - Name of builder content anchor.
     */
    public constructor(pTemplate: StaticPwbTemplate, pModules: ComponentModules, pParentDataLevel: DataLevel, pAnchorName: string) {
        super(pTemplate, pParentDataLevel, new StaticBuilderData(pModules, `Static - {${pAnchorName}}`));

        // Not initialized on start.
        this.mInitialized = false;
    }

    /**
     * Update static builder.
     */
    protected onUpdate(): boolean {
        // One time build of template. Statics doesn't change that much...
        if (!this.mInitialized) {
            this.mInitialized = true;
            this.buildTemplate([this.template], this);
        }

        // Update attribute modules.
        let lAttributeModuleUpdated: boolean = false;
        const lLinkedAttributeModules = this.content.linkedAttributeModules;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let lIndex: number = 0; lIndex < lLinkedAttributeModules.length; lIndex++) {
            const lModule: AttributeModule = lLinkedAttributeModules[lIndex];

            // Dont use ||=, as it stops calling update once lAttributeModuleUpdated is set to true.
            lAttributeModuleUpdated = lModule.update() || lAttributeModuleUpdated;
        }

        // List with all expression that are updated and linked with any attribute.
        let lExpressionModuleUpdated: boolean = false;
        const lLinkedExpressionModules = this.content.linkedExpressionModules;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let lIndex: number = 0; lIndex < lLinkedExpressionModules.length; lIndex++) {
            const lExpressionModule: ExpressionModule = lLinkedExpressionModules[lIndex];

            // Update expression and save updatestate.
            // Check if expression is mapped with any attribute.
            if (lExpressionModule.update()) {
                // Update update state of all expression modules.
                lExpressionModuleUpdated = true;

                // Read linked attribute of expression. Exit when it has none.
                const lLinkedAttribute: PwbTemplateAttribute | undefined = this.content.attributeOfLinkedExpressionModule(lExpressionModule);
                if (!lLinkedAttribute) {
                    continue;
                }

                // Read all attribute text nodes.
                const lLinkedAttributeData: StaticBuilderLinkedAttributeData = this.content.getLinkedAttributeData(lLinkedAttribute);

                // Accumulate all up to date text data.
                const lAccumulatedText: string = lLinkedAttributeData.values.reduce((pCurrent: string, pNext: Text) => { return pCurrent + pNext.data; }, '');

                // Update DOM attribute value with accumulated text.
                lLinkedAttributeData.node.setAttribute(lLinkedAttribute.name, lAccumulatedText);
            }
        }

        // Update happened when any module has an update.
        return lAttributeModuleUpdated || lExpressionModuleUpdated;
    }

    /**
     * Build template with instruction module.
     * Creates a new instruction builder and append to content.
     * 
     * @param pMultiplicatorTemplate - Template with multiplicator module.
     * @param pParentContent - Parent content of instruction template.
     */
    private buildInstructionTemplate(pMultiplicatorTemplate: PwbTemplateInstructionNode, pParentContent: BuilderContent): void {
        // Create new instruction builder and add to bottom of parent content.
        const lInstructionBuilder: InstructionBuilder = new InstructionBuilder(pMultiplicatorTemplate, this.content.modules, new DataLevel(this.values));
        this.content.insert(lInstructionBuilder, 'BottomOf', pParentContent);
    }

    /**
     * Build static template.
     * Create and link all modules.
     * 
     * @param pElementTemplate - Element template.
     * @param pParentContent - Parent of template.
     */
    private buildStaticTemplate(pElementTemplate: PwbTemplateXmlNode, pParentContent: BuilderContent): void {
        // Build element and append to builder.
        const lHtmlNode: Element = this.createZoneEnabledElement(pElementTemplate);
        this.content.insert(lHtmlNode, 'BottomOf', pParentContent);

        for (const lAttributeTemplate of pElementTemplate.attributes) {

            // Read static module.
            const lStaticModule: AttributeModule | null = this.content.modules.createAttributeModule(lAttributeTemplate, lHtmlNode, this.values);
            if (lStaticModule) {
                // Link modules.
                this.content.linkAttributeModule(lStaticModule);
                continue;
            }

            // Check for expression values in attribute.
            if (lAttributeTemplate.values.containsExpression) {
                const lAttributeTextNodeList: Array<Text> = new Array<Text>();

                // Create text nodes for each attribute value and link expressions to those textnodes.
                for (const lValue of lAttributeTemplate.values.values) {
                    // Create text node for attribute value.
                    const lAttributeTextNode: Text = this.createZoneEnabledText('');
                    lAttributeTextNodeList.push(lAttributeTextNode);

                    // Add text value for non expressions.
                    if (!(lValue instanceof PwbTemplateExpression)) {
                        lAttributeTextNode.data = lValue;
                        continue;
                    }

                    // Create expression module for attribute expression value and link it to builder.
                    const lAttributeExpressionModule: ExpressionModule = this.content.modules.createExpressionModule(lValue, lAttributeTextNode, this.values);
                    this.content.linkExpressionModule(lAttributeExpressionModule);

                    // Link expression to attribute.
                    this.content.linkAttributeExpression(lAttributeExpressionModule, lAttributeTemplate);
                }

                // Link attribute template with text node list.
                this.content.linkAttributeNodes(lAttributeTemplate, lHtmlNode, lAttributeTextNodeList);

                continue;
            }

            // If it is not a static module nor an expression attribute, add it as simple text attribute.
            lHtmlNode.setAttribute(lAttributeTemplate.name, lAttributeTemplate.values.toString());
        }

        // Append element to parent.
        this.content.insert(lHtmlNode, 'BottomOf', pParentContent);

        // Build childs.
        this.buildTemplate(pElementTemplate.childList, lHtmlNode);
    }

    /**
     * Build template. Create and link modules.
     * 
     * @param pTemplateNodeList - Template node list.
     * @param pParentContent - Parent element of templates.
     */
    private buildTemplate(pTemplateNodeList: Array<BasePwbTemplateNode>, pParentContent: BuilderContent): void {
        // Create each template based on template node type.
        for (const lTemplateNode of pTemplateNodeList) {
            if (lTemplateNode instanceof PwbTemplate) {
                // Ignore documents just process body.
                this.buildTemplate(lTemplateNode.body, pParentContent);
            } else if (lTemplateNode instanceof PwbTemplateTextNode) {
                this.buildTextTemplate(lTemplateNode, pParentContent);
            } else if (lTemplateNode instanceof PwbTemplateInstructionNode) {
                this.buildInstructionTemplate(lTemplateNode, pParentContent);
            } else if (lTemplateNode instanceof PwbTemplateXmlNode) {
                this.buildStaticTemplate(lTemplateNode, pParentContent);
            }
        }
    }

    /**
     * Build text template and append every value to parent.
     * Creates and links expression modules for every expression value.
     * 
     * @param pTextTemplate - Text template.
     * @param pParentContent - Build parent content of template. 
     */
    private buildTextTemplate(pTextTemplate: PwbTemplateTextNode, pParentContent: BuilderContent): void {
        // Create values of text nodes.
        for (const lValue of pTextTemplate.values) {
            // Create simple and static textnode for string values.
            if (typeof lValue === 'string') {
                this.content.insert(this.createZoneEnabledText(lValue), 'BottomOf', pParentContent);
                continue;
            }

            // Placeholder text node for expression and append it to builder.
            const lExpressionTextNode: Text = this.createZoneEnabledText('');
            this.content.insert(lExpressionTextNode, 'BottomOf', pParentContent);

            // Create expression module and link it to builder.
            const lExpressionModule: ExpressionModule = this.content.modules.createExpressionModule(lValue, lExpressionTextNode, this.values);
            this.content.linkExpressionModule(lExpressionModule);
        }
    }
}

export type StaticPwbTemplate = PwbTemplate | PwbTemplateTextNode | PwbTemplateXmlNode | PwbTemplateInstructionNode;