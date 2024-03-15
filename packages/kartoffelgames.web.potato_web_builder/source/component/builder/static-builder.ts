import { ExpressionModule } from '../../module/expression-module';
import { StaticModule } from '../../module/static-module';
import { ComponentModules } from '../component-modules';
import { ElementCreator } from '../element-creator';
import { BasePwbTemplateNode } from '../template/nodes/base-pwb-template-node';
import { PwbTemplate } from '../template/nodes/pwb-template';
import { PwbTemplateInstructionNode } from '../template/nodes/pwb-template-instruction-node';
import { PwbTemplateTextNode } from '../template/nodes/pwb-template-text-node';
import { PwbTemplateXmlNode } from '../template/nodes/pwb-template-xml-node';
import { LayerValues } from '../values/layer-values';
import { BaseBuilder } from './base-builder';
import { BuilderContent } from './data/base-builder-data';
import { StaticBuilderData } from './data/static-builder-data';
import { MultiplicatorBuilder } from './multiplicator-builder';

export class StaticBuilder extends BaseBuilder<StaticPwbTemplate, StaticBuilderData> {
    private mInitialized: boolean;

    /**
     * Constructor.
     * 
     * @param pTemplate - Template.
     * @param pModules - Attribute modules.
     * @param pParentLayerValues - Layer value of parent builder.
     */
    public constructor(pTemplate: StaticPwbTemplate, pModules: ComponentModules, pParentLayerValues: LayerValues) {
        super(pTemplate, pParentLayerValues, new StaticBuilderData(pModules));

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

        // Get all modules. // TODO: Cache order of linked modules in this.content.
        const lModuleList: Array<StaticModule> = this.content.linkedStaticModules;

        // Sort by write->readwrite->read->expression and update.
        lModuleList.sort((pModuleA, pModuleB): number => {
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

        let lUpdated: boolean = false;
        for (const lModule of lModuleList) {
            lUpdated = lModule.update() || lUpdated;
        }

        // Update expressions after.
        for (const lExpressionModule of this.content.linkedExpressionModules) {
            lUpdated = lExpressionModule.update() || lUpdated;
        }

        return lUpdated;
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
        const lInstructionBuilder: MultiplicatorBuilder = new MultiplicatorBuilder(pMultiplicatorTemplate, this.content.modules, this.values);
        this.content.insert(lInstructionBuilder, 'BottomOf', pParentContent);
    }

    /**
     * Build static template.
     * Create and link all modules.
     * @param pElementTemplate - Element template.
     * @param pParentContent - Parent of template.
     */
    private buildStaticTemplate(pElementTemplate: PwbTemplateXmlNode, pParentContent: BuilderContent): void {
        // Build element.
        const lHtmlNode: Element = ElementCreator.createElement(pElementTemplate);

        // Every attribute is a module. Even text attributes without any any expression.
        for (const lModule of this.content.modules.getElementStaticModules(pElementTemplate, lHtmlNode, this.values)) {
            // Link modules.
            this.content.linkStaticModule(lModule, lHtmlNode);
        }

        // Append element to parent.
        this.content.append(lHtmlNode, pParentContent);

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
                this.content.insert(ElementCreator.createText(lValue), 'BottomOf', pParentContent);
                continue;
            }

            // Placeholder text node for expression and append it to builder.
            const lExpressionTextNode: Text = ElementCreator.createText('');
            this.content.insert(lExpressionTextNode, 'BottomOf', pParentContent);

            // Create expression module and link it to builder.
            const lExpressionModule: ExpressionModule = this.content.modules.createExpressionModule(lValue, lExpressionTextNode, this.values);
            this.content.linkExpressionModule(lExpressionModule);
        }
    }
}

type StaticPwbTemplate = PwbTemplate | PwbTemplateTextNode | PwbTemplateXmlNode | PwbTemplateInstructionNode;