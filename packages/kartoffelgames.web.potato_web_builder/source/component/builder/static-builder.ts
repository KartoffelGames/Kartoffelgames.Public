import { BaseModule } from '../../module/base-module';
import { ExpressionModule } from '../../module/expression-module';
import { StaticModule } from '../../module/static-module';
import { ComponentModules } from '../component-modules';
import { ElementCreator } from '../element-creator';
import { BasePwbTemplateNode } from '../template/nodes/base-pwb-template-node';
import { PwbTemplate } from '../template/nodes/pwb-template';
import { PwbTemplateInstructionNode } from '../template/nodes/pwb-template-instruction-node';
import { PwbTemplateTextNode } from '../template/nodes/pwb-template-text-node';
import { PwbTemplateXmlNode } from '../template/nodes/pwb-template-xml-node';
import { PwbTemplateExpression } from '../template/nodes/values/pwb-template-expression';
import { LayerValues } from '../values/layer-values';
import { BaseBuilder } from './base-builder';
import { MultiplicatorBuilder } from './multiplicator-builder';

export class StaticBuilder extends BaseBuilder<StaticPwbTemplate> {
    private mInitialized: boolean;

    /**
     * Constructor.
     * @param pTemplate - Template.
     * @param pModules - Attribute modules.
     * @param pParentLayerValues - Layer value of parent builder.
     */
    public constructor(pTemplate: StaticPwbTemplate, pModules: ComponentModules, pParentLayerValues: LayerValues) {
        super(pTemplate, pModules, pParentLayerValues);

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
            this.buildTemplate([this.template]);
        }

        // Get all modules. // TODO: Expressions are no modules.
        const lModuleList: Array<BaseModule<any, boolean>> = this.content.linkedModuleList;

        // Sort by write->readwrite->read->expression and update.
        lModuleList.sort((pModuleA, pModuleB): number => {
            // "Calculate" execution priority of module A.
            let lCompareValueA: number;
            if (pModuleA instanceof StaticModule) {
                if (pModuleA.isWriting && !pModuleA.isReading) {
                    lCompareValueA = 4;
                } else if (pModuleA.isWriting && pModuleA.isReading) {
                    lCompareValueA = 3;
                } else { // if (!pModuleA.isWriting && pModuleA.isReading) {
                    lCompareValueA = 2;
                }
            } else { // Expression
                lCompareValueA = 1;
            }

            // "Calculate" execution priority of module A.
            let lCompareValueB: number;
            if (pModuleB instanceof StaticModule) {
                if (pModuleB.isWriting && !pModuleB.isReading) {
                    lCompareValueB = 4;
                } else if (pModuleB.isWriting && pModuleB.isReading) {
                    lCompareValueB = 3;
                } else { // if (!pModuleB.isWriting && pModuleB.isReading) 
                    lCompareValueB = 2;
                }
            } else {
                lCompareValueB = 1;
            }

            return lCompareValueA - lCompareValueB;
        });

        let lUpdated: boolean = false;
        for (const lModule of lModuleList) {
            lUpdated = lModule.update() || lUpdated;
        }

        // TODO: Update expressions after.

        return lUpdated;
    }

    /**
     * Build expression template and append to parent.
     * @param pExpressionTemplate - Expression template.
     * @param pParentHtmlElement - Build parent element of template. 
     */
    private buildExpressionTemplate(pExpressionTemplate: PwbTemplateExpression, pParentHtmlElement: Element | null): void {
        // Create and process expression module, append text node to content.
        const lHtmlNode: Text = ElementCreator.createText('');

        // Create temporary text node. // TODO: Real please.
        const lTemporaryTextNode: PwbTemplateTextNode = new PwbTemplateTextNode();
        lTemporaryTextNode.text = `{{${pExpressionTemplate.value}}}`;

        // Create and link expression module, link only if text has any expression.
        const lExpressionModule: ExpressionModule = this.content.modules.getTextExpressionModule(lTemporaryTextNode, lHtmlNode, this.values);
        this.content.linkModule(lExpressionModule, lHtmlNode);

        // Append text to parent.
        this.content.append(lHtmlNode, pParentHtmlElement);
    }

    /**
     * Build template with multiplicator module.
     * Creates a new multiplicator builder and append to content.
     * @param pMultiplicatorTemplate - Template with multiplicator module.
     * @param pParentHtmlElement - Build parent element of template.
     * @param pShadowParent - Parent template element that is loosly linked as parent.
     */
    private buildMultiplicatorTemplate(pMultiplicatorTemplate: PwbTemplateXmlNode, pParentHtmlElement: Element | null, pShadowParent: BasePwbTemplateNode): void {
        // Create new component builder and add to content.
        const lMultiplicatorBuilder: MultiplicatorBuilder = new MultiplicatorBuilder(pMultiplicatorTemplate, pShadowParent, this.content.modules, this.values, this);
        this.content.append(lMultiplicatorBuilder, pParentHtmlElement);
    }

    /**
     * Build static template.
     * Create and link all modules.
     * @param pElementTemplate - Element template.
     * @param pParentHtmlElement - Parent of template.
     */
    private buildStaticTemplate(pElementTemplate: PwbTemplateXmlNode, pParentHtmlElement: Element | null): void {
        // Build element.
        const lHtmlNode: Element = ElementCreator.createElement(pElementTemplate);

        // Every attribute is a module. Even text attributes without any any expression.
        for (const lModule of this.content.modules.getElementStaticModules(pElementTemplate, lHtmlNode, this.values)) {
            // Link modules.
            this.content.linkModule(lModule, lHtmlNode);
        }

        // Append element to parent.
        this.content.append(lHtmlNode, pParentHtmlElement);

        // Build childs.
        this.buildTemplate(pElementTemplate.childList, lHtmlNode);
    }

    /**
     * Build template. Creates and link modules.
     * @param pTemplateNodeList - Template node list.
     * @param pParentElement - Parent element of templates.
     */
    private buildTemplate(pTemplateNodeList: Array<StaticPwbTemplate>, pParentElement: Element | null = null): void {

        // Create each template.
        for (const lTemplateNode of pTemplateNodeList) {
            /* istanbul ignore else */
            if (lTemplateNode instanceof PwbTemplate) {
                // Ignore documents just process body.
                this.buildTemplate(lTemplateNode.body, pParentElement, lTemplateNode);
            } else if (lTemplateNode instanceof PwbTemplateTextNode) {
                this.buildTextTemplate(lTemplateNode, pParentElement);
            } else if (lTemplateNode instanceof PwbTemplateExpression) {
                this.buildExpressionTemplate(lTemplateNode, pParentElement);
            } else if (lTemplateNode instanceof PwbTemplateXmlNode) {
                // Differentiate between static and multiplicator templates.
                const lMultiplicatorAttribute: PwbTemplateAttribute | undefined = this.content.modules.getMultiplicatorAttribute(lTemplateNode);
                if (lMultiplicatorAttribute) {
                    this.buildMultiplicatorTemplate(lTemplateNode, pParentElement, lShadowParent);
                } else {
                    this.buildStaticTemplate(lTemplateNode, pParentElement);
                }
            }

            // Ignore comments.
        }
    }

    /**
     * Build text template and append to parent.
     * @param pTextTemplate - Text template.
     * @param pParentHtmlElement - Build parent element of template. 
     */
    private buildTextTemplate(pTextTemplate: PwbTemplateTextNode, pParentHtmlElement: Element | null): void {
        // Create and process expression module, append text node to content.
        const lHtmlNode: Text = ElementCreator.createText('');

        // Create and link expression module, link only if text has any expression.
        const lExpressionModule: ExpressionModule = this.content.modules.getTextExpressionModule(pTextTemplate, lHtmlNode, this.values);
        this.content.linkModule(lExpressionModule, lHtmlNode);

        // Append text to parent.
        this.content.append(lHtmlNode, pParentHtmlElement);
    }
}

type StaticPwbTemplate = PwbTemplate | PwbTemplateTextNode | PwbTemplateXmlNode | PwbTemplateInstructionNode;