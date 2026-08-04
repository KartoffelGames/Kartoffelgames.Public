import { DataLevel } from '../../data/data-level.ts';
import type { AttributeModule } from '../../module/attribute_module/attribute-module.ts';
import type { ExpressionModule } from '../../module/expression_module/expression-module.ts';
import type { ComponentModules } from '../component-modules.ts';
import { ComponentRegister } from '../component-register.ts';
import type { IPwbTemplateNode } from '../template/nodes/i-pwb-template-node.interface.ts';
import { PwbTemplateInstructionNode } from '../template/nodes/pwb-template-instruction-node.ts';
import { PwbTemplateTextNode } from '../template/nodes/pwb-template-text-node.ts';
import { PwbTemplateXmlNode } from '../template/nodes/pwb-template-xml-node.ts';
import { PwbTemplate } from '../template/nodes/pwb-template.ts';
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
    private readonly mKey: unknown;

    /**
     * Identity key of the builder. Must not be unique.
     */
    public get key(): unknown {
        return this.mKey;
    }

    /**
     * Constructor.
     *
     * @param pTemplate - Template.
     * @param pModules - Attribute modules.
     * @param pParentDataLevel - Data of parent builder.
     * @param pAnchorName - Name of builder content anchor.
     * @param pKey - Identity key of the builder.
     */
    public constructor(pTemplate: StaticPwbTemplate, pModules: ComponentModules, pParentDataLevel: DataLevel, pAnchorName: string, pKey: unknown) {
        super(pTemplate, pModules, pParentDataLevel, new StaticBuilderData(`Static - {${pAnchorName}}`));

        // Save key of static builder.
        this.mKey = pKey;

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
        this.content.insert(new InstructionBuilder(pMultiplicatorTemplate, this.modules, new DataLevel(this.values)), 'BottomOf', pParentContent);
    }

    /**
     * Build static template.
     * Create and link all modules.
     * 
     * @param pElementTemplate - Element template.
     * @param pParentContent - Parent of template.
     */
    private buildStaticTemplate(pElementTemplate: PwbTemplateXmlNode, pParentContent: BuilderContent): void {
        // Build element.
        const { element: lHtmlElement, isComponent: lIsComponent } = this.createHtmlElement(pElementTemplate);

        // Collect the attribute modules created for this element so their bindings can be applied before a component update.
        let lElementAttributeModules: Array<AttributeModule> | null = null;
        if (lIsComponent) {
            lElementAttributeModules = new Array<AttributeModule>();
        }

        for (const lAttributeTemplate of pElementTemplate.attributes) {
            // Read static module.
            const lStaticModule: AttributeModule | null = this.modules.createAttributeModule(lAttributeTemplate, lHtmlElement, this.values);
            if (lStaticModule) {
                // Link modules.
                this.content.linkAttributeModule(lStaticModule);

                // Performance. Only set when its a component.
                if (lIsComponent) {
                    lElementAttributeModules!.push(lStaticModule);
                }

                continue;
            }

            // Check for expression values in attribute.
            if (lAttributeTemplate.values.containsExpression) {
                const lAttributeTextNodeList: Array<Text> = new Array<Text>();

                // Create text nodes for each attribute value and link expressions to those textnodes.
                for (const lValue of lAttributeTemplate.values.values) {
                    // Create text node for attribute value.
                    const lAttributeTextNode: Text = this.createTextNode('');
                    lAttributeTextNodeList.push(lAttributeTextNode);

                    // Add text value for non expressions.
                    if (!(lValue instanceof PwbTemplateExpression)) {
                        lAttributeTextNode.data = lValue;
                        continue;
                    }

                    // Create expression module for attribute expression value and link it to builder.
                    const lAttributeExpressionModule: ExpressionModule = this.modules.createExpressionModule(lValue, lAttributeTextNode, this.values);
                    this.content.linkExpressionModule(lAttributeExpressionModule);

                    // Link expression to attribute.
                    this.content.linkAttributeExpression(lAttributeExpressionModule, lAttributeTemplate);
                }

                // Link attribute template with text node list.
                this.content.linkAttributeNodes(lAttributeTemplate, lHtmlElement, lAttributeTextNodeList);

                continue;
            }

            // If it is not a static module nor an expression attribute, add it as simple text attribute.
            lHtmlElement.setAttribute(lAttributeTemplate.name, lAttributeTemplate.values.toString());
        }

        // When the element is a pwb component, execute its static modules and update it before it gets append to the document.
        // Reduces poping to near zero.
        if (lIsComponent) {
            // Update attribute module of child component. That sets the data bindings before the update.
            for (const lComponentAttributeModule of lElementAttributeModules!) {
                lComponentAttributeModule.update();
            }

            // Executes components initial update synchronously, so it gets updated in inside the current update cycle.
            ComponentRegister.ofElement(lHtmlElement as HTMLElement).component.updater.update();
        }

        // Append element to parent.
        this.content.insert(lHtmlElement, 'BottomOf', pParentContent);

        // Build childs.
        this.buildTemplate(pElementTemplate.childList, lHtmlElement);
    }

    /**
     * Build template. Create and link modules.
     * 
     * @param pTemplateNodeList - Template node list.
     * @param pParentContent - Parent element of templates.
     */
    private buildTemplate(pTemplateNodeList: Iterable<IPwbTemplateNode>, pParentContent: BuilderContent): void {
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
                this.content.insert(this.createTextNode(lValue), 'BottomOf', pParentContent);
                continue;
            }

            // Placeholder text node for expression and append it to builder.
            const lExpressionTextNode: Text = this.createTextNode('');
            this.content.insert(lExpressionTextNode, 'BottomOf', pParentContent);

            // Create expression module and link it to builder.
            const lExpressionModule: ExpressionModule = this.modules.createExpressionModule(lValue, lExpressionTextNode, this.values);
            this.content.linkExpressionModule(lExpressionModule);
        }
    }

    /**
     * Create new html element.
     * When the element is a custom element, it invokes the custom element constructor instead of an unknown html element.
     * 
     * Ignores all attribute and expression informations and only uses the tagname information.
     * 
     * @param pXmlElement - Xml content node.
     */
    private createHtmlElement(pXmlElement: PwbTemplateXmlNode): StaticBuilderElement {
        const lTagname: string = pXmlElement.tagName;

        // On custom element
        if (lTagname.includes('-')) {
            // Get custom element.
            const lCustomElement: any = globalThis.customElements.get(lTagname);

            // Create custom element when its a registered custom component.
            if (typeof lCustomElement !== 'undefined') {
                const lCustomComponent: HTMLElement = new lCustomElement();

                // Create new custom element.
                return {
                    element: lCustomComponent,
                    isComponent: ComponentRegister.elementIsComponent(lCustomComponent)
                };
            }
        }

        const lNamespaceObject: PwbTemplateTextNode | null = pXmlElement.getAttribute('xmlns');
        if (lNamespaceObject && !lNamespaceObject.containsExpression) {
            // Create new element with namespace.
            return {
                element: document.createElementNS(lNamespaceObject.values[0] as string, lTagname),
                isComponent: false
            };
        } else {
            // Create new element without namespace.
            return {
                element: document.createElement(lTagname),
                isComponent: false
            };
        }
    }
}
type StaticBuilderElement = {
    element: Element;
    isComponent: boolean;
};

export type StaticPwbTemplate = PwbTemplate | PwbTemplateTextNode | PwbTemplateXmlNode | PwbTemplateInstructionNode;