
import { CoreEntityUpdateZone } from '../../core_entity/core-entity-update-zone';
import { ScopedValues } from '../../scoped-values';
import { BasePwbTemplateNode } from '../template/nodes/base-pwb-template-node';
import { PwbTemplateXmlNode } from '../template/nodes/pwb-template-xml-node';
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
    private readonly mUpdateZone: CoreEntityUpdateZone;

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
     * Components update zone.
     */
    public get updateZone(): CoreEntityUpdateZone {
        return this.mUpdateZone;
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
    public constructor(pTemplate: TTemplates, pParentScopedValues: ScopedValues, pContent: TContent, pUpdateZone: CoreEntityUpdateZone) {
        // Clone template.
        this.mTemplate = pTemplate;
        this.mTemplate.parent = null; // Nodes doesn't need a real parent. Maidenless nodes.

        // Create new scoped of values with inside parent scope.
        this.mComponentValues = new ScopedValues(pParentScopedValues);
        this.mContent = pContent;
        this.mUpdateZone = pUpdateZone;

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
    public async update(): Promise<boolean> {
        // Update this builder.
        const lThisBuilderHasUpdated: boolean = await this.onUpdate();

        // Update all child builder and save update promise.
        const lUpdates: Array<Promise<boolean>> = new Array<Promise<boolean>>();
        for (const lBuilder of this.content.builders) {
            lUpdates.push(lBuilder.update());
        }

        // Wait for all Updates to finish
        const lUpdateResult: Array<boolean> = await Promise.all(lUpdates);

        // Return active change flag when the current builder or any of the child builder has any change. 
        return lThisBuilderHasUpdated || lUpdateResult.includes(true);
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
            const lCustomElement: any = window.customElements.get(lTagname);

            // Create custom element.
            if (typeof lCustomElement !== 'undefined') {
                // Create new custom element inside update zone to connect both update zones.
                return this.updateZone.switchToUpdateZone(() => {
                    return new lCustomElement();
                });
            }
        }

        // Create new element inside update zone to connect both update zones.
        return this.updateZone.switchToUpdateZone(() => {
            return document.createElement(lTagname);
        });
    }

    /**
     * Create html text node.
     * 
     * @param pText - Text.
     * 
     * @returns text node with specified text.
     */
    protected createZoneEnabledText(pText: string): Text {
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
    protected abstract onUpdate(): Promise<boolean>;
}