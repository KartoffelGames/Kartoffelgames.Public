
import { ComponentModules } from '../component-modules';
import { Boundary, BuilderContent } from '../content/builder-content';
import { BasePwbTemplateNode } from '../template/nodes/base-pwb-template-node';
import { LayerValues } from '../values/layer-values';

/**
 * Builder that builds and updates content of component.
 * 
 * @internal
 */
export abstract class BaseBuilder<TTemplates extends BasePwbTemplateNode> {
    private readonly mComponentValues: LayerValues;
    private readonly mContent: BuilderContent;
    private readonly mTemplate: TTemplates;

    /**
     * Content anchor for later appending build and initilised elements on this place.
     */
    public get anchor(): Comment {
        return this.mContent.anchor;
    }

    /**
     * Get boundary of builder. Top and bottom element of builder.
     */
    public get boundary(): Boundary {
        return this.mContent.getBoundary(); // TODO: Validate if boundary needs to be exposed or can be precalculated.
    }

    /**
     * Get component values of builder.
     */
    public get values(): LayerValues {
        return this.mComponentValues;
    }

    /**
     * Get component content of builder.
     */
    protected get content(): BuilderContent {
        return this.mContent;
    }

    /**
     * Content template.
     */
    protected get template(): TTemplates {
        return this.mTemplate;
    }

    /**
     * Constructor.
     * @param pTemplate - Builder template.
     * @param pModules - Available modules of builder-
     * @param pParentLayerValues - New component values.
     */
    public constructor(pTemplate: TTemplates, pModules: ComponentModules, pParentLayerValues: LayerValues) {
        // Clone template.
        this.mTemplate = <TTemplates>pTemplate.clone(); // TODO: Validate if this needs to be cloned.
        this.mTemplate.parent = null; // Nodes doesn't need a real parent. Maidenless nodes.

        // Create new layer of values.
        this.mComponentValues = new LayerValues(pParentLayerValues);
        this.mContent = new BuilderContent(pModules); // TODO: A good way to have better anchor names.
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
        for (const lBuilder of this.content.childBuilderList) {
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