
import { BasePwbTemplateNode } from '../template/nodes/base-pwb-template-node';
import { PwbTemplateXmlNode } from '../template/nodes/pwb-template-xml-node';
import { ScopedValues } from '../values/scoped-values';
import { BaseBuilderData, Boundary } from './data/base-builder-data';

/**
 * Builder that builds and updates content of component.
 * 
 * @internal
 */
export abstract class BaseBuilder<TTemplates extends BasePwbTemplateNode = BasePwbTemplateNode, TContent extends BaseBuilderData = BaseBuilderData> {
    private readonly mComponentValues: ScopedValues;
    private readonly mContent: TContent;
    private readonly mTemplate: TTemplates;

    /**
     * Content anchor for later appending build and initilised elements on this place.
     */
    public get anchor(): ChildNode {
        return this.mContent.contentAnchor;
    }

    /**
     * Get boundary of builder. Top and bottom element of builder.
     */
    public get boundary(): Boundary {
        return this.mContent.getBoundary();
    }

    /**
     * Content template.
     */
    public get template(): TTemplates {
        return this.mTemplate;
    }

    /**
     * Get component values of builder.
     */
    public get values(): ScopedValues {
        return this.mComponentValues;
    }

    /**
     * Get component content of builder.
     */
    protected get content(): TContent {
        return this.mContent;
    }

    /**
     * Constructor.
     * 
     * @param pTemplate - Builder template.
     * @param pParentScopedValues - New component values.
     */
    public constructor(pTemplate: TTemplates, pParentScopedValues: ScopedValues, pContent: TContent) {
        // Clone template.
        this.mTemplate = pTemplate;
        this.mTemplate.parent = null; // Nodes doesn't need a real parent. Maidenless nodes.

        // Create new scoped of values with inside parent scope.
        this.mComponentValues = new ScopedValues(pParentScopedValues);
        this.mContent = pContent;

        // Link this builder as content.
        pContent.setCoreBuilder(this);
    }

    /**
     * Create new html element.
     * When the element is a custom element, it invokes the custom element constructor instead of an unknown html element.
     * 
     * Ignores all attribute and expression informations and only uses the tagname information.
     * 
     * @param pXmlElement - Xml content node.
     */
    public createElement(pXmlElement: PwbTemplateXmlNode): Element {
        const lTagname: string = pXmlElement.tagName;

        if (typeof lTagname !== 'string') {
            throw lTagname;
        }

        // On custom element
        if (lTagname.includes('-')) {
            // Get custom element.
            const lCustomElement: any = window.customElements.get(lTagname);

            // Create custom element.
            if (typeof lCustomElement !== 'undefined') {
                return new lCustomElement();
            }
        }

        return document.createElement(lTagname);
    }

    /**
     * Create html text node.
     * 
     * @param pText - Text.
     * 
     * @returns text node with specified text.
     */
    public createText(pText: string): Text {
        return document.createTextNode(pText);
    }


    /**
     * Cleanup all modules, content and anchor.
     * Builder is unuseable after this.
     */
    public deconstruct(): void {
        this.content.deconstruct();
    }

    /**
     * Update content.
     * Updates this builder first and than updated any direct child builder.
     * 
     * When this nor the child builder had any changes, false is returned.
     * 
     * @returns If any changes where made.  
     */
    public update(): boolean {
        // Update this builder.
        let lUpdated: boolean = this.onUpdate();

        // Update all child builder and keep updated true state.
        for (const lBuilder of this.content.builders) {
            lUpdated = lBuilder.update() || lUpdated;
        }

        return lUpdated;
    }

    /**
     * On content update.
     * Update any direct content. When new and old builder doesn't need to be updated here.
     * 
     * @remarks
     * When child builder are beeing updated, they will be updated again and might break performance.
     * Any direct child builder are automaticaly updated in {@link update}.
     * 
     * @returns If any changes where made. 
     */
    protected abstract onUpdate(): boolean;
}