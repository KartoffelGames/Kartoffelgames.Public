import { ChangeState, HistoryItem, MyersDiff } from '@kartoffelgames/core';
import { InstructionModule } from '../../module/instruction_module/instruction-module';
import { InstructionResultElement } from '../../module/instruction_module/instruction-result';
import { ScopedValues } from '../../scoped-values';
import { ComponentModules } from '../component-modules';
import { PwbTemplateInstructionNode } from '../template/nodes/pwb-template-instruction-node';
import { BaseBuilder } from './base-builder';
import { InstructionBuilderData } from './data/instruction-builder-data';
import { StaticBuilder } from './static-builder';

/**
 * Instruction builder. Only builds and handles instruction templates.
 * Creates new static builder for every generated instruction result.
 * 
 * @internal
 */
export class InstructionBuilder extends BaseBuilder<PwbTemplateInstructionNode, InstructionBuilderData> {
    /**
     * Constructor.
     * 
     * @param pTemplate - Instruction template.
     * @param pModules - Modules of component scope.
     * @param pParentScopedValues - Scoped value of parent builder.
     */
    public constructor(pTemplate: PwbTemplateInstructionNode, pModules: ComponentModules, pParentScopedValues: ScopedValues) {
        super(pTemplate, pParentScopedValues, new InstructionBuilderData(pModules, `Instruction - {$${pTemplate.instructionType}}`));
    }

    /**
     * Update content dependent on temporar value. 
     */
    protected async onUpdate(): Promise<boolean> {
        // Create instruction module if is does not exist.
        if (!this.content.instructionModule) {
            // Create and link instruction module.
            const lInstructionModule: InstructionModule = this.content.modules.createInstructionModule(this.template, this.values);
            this.content.instructionModule = lInstructionModule;
        }

        // Call module update.
        const lInstructionUpdated: boolean = await this.content.instructionModule.update();
        if (lInstructionUpdated) {
            // Get current StaticBuilder. Only content are static builder.
            const lOldStaticBuilderList: Array<StaticBuilder> = <Array<StaticBuilder>>this.content.body;

            // Update content and save new added builder.
            this.updateStaticBuilder(lOldStaticBuilderList, this.content.instructionModule.instructionResult.elementList);
        }

        // No need to report any update.
        // Builder are updated in base builder and will report itself.
        return false;
    }

    /**
     * Insert new content after last found content.
     * 
     * @param pNewContent - New content.
     * @param pContentCursor - Content that comes before new content.
     * 
     * @returns a new {@link StaticBuilder} instance for the generated instruction result.
     */
    private insertNewContent(pNewContent: InstructionResultElement, pContentCursor: StaticBuilder | null): StaticBuilder {
        // Create new static builder.
        const lStaticBuilder: StaticBuilder = new StaticBuilder(pNewContent.template, this.content.modules, pNewContent.componentValues, `Child - {$${this.template.instructionType}}`);

        // Prepend content if no content is before the new content. 
        if (pContentCursor === null) {
            this.content.insert(lStaticBuilder, 'TopOf', this);
        } else {
            // Append after content that is before the new content. Obviously -,-
            this.content.insert(lStaticBuilder, 'After', pContentCursor);
        }

        return lStaticBuilder;
    }

    /**
     * Update content of manipulator builder.
     * Uses {@link DifferenceSearch} to decide wich static item needs to be removed or created.
     * 
     * @param pOldContentList - Old content list.
     * @param pNewContentList - New content list.
     */
    private updateStaticBuilder(pOldContentList: Array<StaticBuilder>, pNewContentList: Array<InstructionResultElement>): void {
        // Define difference search.
        const lMyersDiff: MyersDiff<StaticBuilder, InstructionResultElement> = new MyersDiff<StaticBuilder, InstructionResultElement>((pA, pB) => {
            return pB.componentValues.equals(pA.values) && pB.template.equals(pA.template);
        });

        // Get differences of old an new content.
        const lDifferenceList: Array<HistoryItem<StaticBuilder, InstructionResultElement>> = lMyersDiff.differencesOf(pOldContentList, pNewContentList);

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