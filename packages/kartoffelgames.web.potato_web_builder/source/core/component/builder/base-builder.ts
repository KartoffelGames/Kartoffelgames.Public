
import type { PwbApplicationConfiguration } from '../../../application/pwb-application-configuration.ts';
import type { DataLevel } from '../../data/data-level.ts';
import type { BasePwbTemplateNode } from '../template/nodes/base-pwb-template-node.ts';
import type { PwbTemplateXmlNode } from '../template/nodes/pwb-template-xml-node.ts';
import type { BaseBuilderData, Boundary } from './data/base-builder-data.ts';

/**
 * Builder that builds and updates content of component.
 * 
 * @internal
 */
export abstract class BaseBuilder<TTemplates extends BasePwbTemplateNode = BasePwbTemplateNode, TContent extends BaseBuilderData = BaseBuilderData> {
    private readonly mApplicationContext: PwbApplicationConfiguration;
    private readonly mComponentValues: DataLevel;
    private readonly mContent: TContent;
    private readonly mTemplate: TTemplates;

    /**
     * Content anchor for later appending build and initilised elements on this place.
     */
    public get anchor(): ChildNode {
        return this.mContent.contentAnchor;
    }

    /**
     * Get application context.
     */
    public get applicationContext(): PwbApplicationConfiguration {
        return this.mApplicationContext;
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
    public get values(): DataLevel {
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
     * @param pApplicationContext - Application context.
     * @param pTemplate - Builder template.
     * @param pDataLevel - Data level of a this builder.
     * @param pContent - Content of this builder.
     */
    public constructor(pApplicationContext: PwbApplicationConfiguration, pTemplate: TTemplates, pDataLevel: DataLevel, pContent: TContent) {
        // Set application context.
        this.mApplicationContext = pApplicationContext;

        // Clone template.
        this.mTemplate = pTemplate;
        this.mTemplate.parent = null; // Nodes doesn't need a real parent. Maidenless nodes.

        // Create new data level of values with inside parent level.
        this.mComponentValues = pDataLevel;
        this.mContent = pContent;

        // Link this builder as content.
        pContent.setCoreBuilder(this);
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
        const lThisBuilderHasUpdated: boolean = this.onUpdate();

        // Length check and For-Index for performance reasons. >90% Faster
        // Update all child builder and save update promise.
        let lUpdated: boolean = false;
        const lBuilderList = this.content.builders;
        if (lBuilderList.length > 0) {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let lIndex: number = 0; lIndex < lBuilderList.length; lIndex++) {
                const lBuilder = lBuilderList[lIndex];

                // Dont use ||=, as it stops calling update once lUpdated is set to true.
                lUpdated = lBuilder.update() || lUpdated;
            }
        }

        // Return active change flag when the current builder or any of the child builder has any change. 
        return lThisBuilderHasUpdated || lUpdated;
    }

    /**
     * Create new html element.
     * When the element is a custom element, it invokes the custom element constructor instead of an unknown html element.
     * 
     * Ignores all attribute and expression informations and only uses the tagname information.
     * 
     * @param pXmlElement - Xml content node.
     */
    protected createZoneEnabledElement(pXmlElement: PwbTemplateXmlNode): Element {
        const lTagname: string = pXmlElement.tagName;

        if (typeof lTagname !== 'string') {
            throw lTagname;
        }

        // On custom element
        if (lTagname.includes('-')) {
            // Get custom element.
            const lCustomElement: any = globalThis.customElements.get(lTagname);

            // Create custom element.
            if (typeof lCustomElement !== 'undefined') {
                // Create new custom element.
                return new lCustomElement();
            }
        }

        // Create new element .
        return document.createElement(lTagname);
    }

    /**
     * Create html text node.
     * 
     * @param pText - Text.
     * 
     * @returns text node with specified text.
     */
    protected createZoneEnabledText(pText: string): Text {
        // Create new text node.
        return document.createTextNode(pText);
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