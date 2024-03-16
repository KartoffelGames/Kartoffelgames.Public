import { ChangeState, DifferenceSearch, HistoryItem } from '@kartoffelgames/web.change-detection';
import { MultiplicatorModule } from '../../module/multiplicator-module';
import { ManipulatorElement, MultiplicatorResult } from '../../module/result/multiplicator-result';
import { ComponentModules } from '../component-modules';
import { PwbTemplateInstructionNode } from '../template/nodes/pwb-template-instruction-node';
import { LayerValues } from '../values/layer-values';
import { BaseBuilder } from './base-builder';
import { InstructionBuilderData } from './data/instruction-builder-data';
import { StaticBuilder } from './static-builder';

// TODO: Rename multiplicator to "Instruction"
export class MultiplicatorBuilder extends BaseBuilder<PwbTemplateInstructionNode, InstructionBuilderData> {

    /**
     * Constructor.
     * 
     * @param pTemplate - Instruction template.
     * @param pModules - Attribute modules.
     * @param pParentLayerValues - Layer value of parent builder.
     */
    public constructor(pTemplate: PwbTemplateInstructionNode, pModules: ComponentModules, pParentLayerValues: LayerValues,) {
        super(pTemplate, pParentLayerValues, new InstructionBuilderData(pModules));
    }

    /**
     * Update content dependent on temporar value. 
     */
    protected onUpdate(): boolean {
        // Create multiplicator module if is does not exist.
        if (!this.content.multiplicatorModule) {
            const lTemplate: PwbTemplateInstructionNode = this.template;

            // Create module and save inside. Allways has existing module bc. can only be called with found multiplicator module.
            const lManipulatorModule: MultiplicatorModule = <MultiplicatorModule>this.content.modules.getElementMultiplicatorModule(lTemplate, this.values);
            this.content.multiplicatorModule = lManipulatorModule;
        }

        // Call module update.
        const lModuleResult: MultiplicatorResult | null = (<MultiplicatorModule>this.content.multiplicatorModule).update();
        if (lModuleResult) {
            // Get current StaticBuilder. Only content are static builder.
            const lOldStaticBuilderList: Array<StaticBuilder> = <Array<StaticBuilder>>this.content.body;

            // Update content and save new added builder.
            this.updateStaticBuilder(lOldStaticBuilderList, lModuleResult.elementList);
        }

        // No need to report any update.
        // Builder are updated in base builder and will report itself.
        return false;
    }

    /**
     * Insert new content after last found content.
     * @param pNewContent - New content.
     * @param pLastContent - Last content that comes before new content.
     */
    private insertNewContent(pNewContent: ManipulatorElement, pLastContent: StaticBuilder | null): StaticBuilder {
        // Create new static builder.
        const lStaticBuilder: StaticBuilder = new StaticBuilder(pNewContent.template, this.content.modules, pNewContent.componentValues);

        // Prepend content if no content is before the new content. 
        if (pLastContent === null) {
            this.content.insert(lStaticBuilder, 'TopOf', this);
        } else {
            // Append after content that is before the new content. Obviously -,-
            this.content.insert(lStaticBuilder, 'After', pLastContent);
        }

        return lStaticBuilder;
    }

    /**
     * Update content of manipulator builder.
     * @param pNewContentList - New content list.
     * @param pOldContentList - Old content list.
     */
    private updateStaticBuilder(pOldContentList: Array<StaticBuilder>, pNewContentList: Array<ManipulatorElement>): void {
        // Define difference search.
        const lDifferenceSearch: DifferenceSearch<StaticBuilder, ManipulatorElement> = new DifferenceSearch<StaticBuilder, ManipulatorElement>((pA, pB) => {
            return pB.componentValues.equal(pA.values) && pB.template.equals(pA.template);
        });

        // Get differences of old an new content.
        const lDifferenceList: Array<HistoryItem<StaticBuilder, ManipulatorElement>> = lDifferenceSearch.differencesOf(pOldContentList, pNewContentList);

        let lLastExistingChildBuilder: StaticBuilder | null = null;
        for (const lHistoryItem of lDifferenceList) {
            // Update, Remove or do nothing with static builder depended on change state.
            if (lHistoryItem.changeState === ChangeState.Remove) {
                this.content.remove(lHistoryItem.item);
            } else if (lHistoryItem.changeState === ChangeState.Insert) {
                // Create new static builder, insert after last content.
                lLastExistingChildBuilder = this.insertNewContent(lHistoryItem.item, lLastExistingChildBuilder);
            } else { // if (lHistoryItem.changeState === ChangeState.Keep) {
                lLastExistingChildBuilder = lHistoryItem.item;
            }
        }
    }
}