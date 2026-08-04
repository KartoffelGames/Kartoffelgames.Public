// Import mock at start of file.
import { TestUtil } from '../../../utility/test-util.ts';

// Funcitonal imports after mock.
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../../source/core/component/pwb-component.decorator.ts';
import { PwbTemplateXmlNode } from '../../../../source/core/component/template/nodes/pwb-template-xml-node.ts';
import { PwbTemplate } from '../../../../source/core/component/template/nodes/pwb-template.ts';
import { ComponentState } from '../../../../source/core/core_entity/component_state/component-state.ts';
import { ComponentDataLevel } from '../../../../source/core/data/component-data-level.ts';
import { DataLevel } from '../../../../source/core/data/data-level.ts';
import type { LevelProcedure } from '../../../../source/core/data/level-procedure.ts';
import { ModuleDataLevel } from '../../../../source/core/data/module-data-level.ts';
import type { IInstructionOnUpdate } from '../../../../source/core/module/instruction_module/instruction-module.ts';
import { InstructionResult } from '../../../../source/core/module/instruction_module/instruction-result.ts';
import { PwbInstructionModule } from '../../../../source/core/module/instruction_module/pwb-instruction-module.decorator.ts';
import { PwbExport } from '../../../../source/module/export/pwb-export.decorator.ts';

Deno.test('PwbInstructionModule--Functionality: CustomModule - Same result, twice', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define module.
        @PwbInstructionModule({
            instructionType: 'multiresult'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule implements IInstructionOnUpdate {
            private readonly mDataLevel: ComponentDataLevel;

            public constructor(pValueReference = Injection.use(ComponentDataLevel)) {
                this.mDataLevel = pValueReference;
            }

            public onUpdate(): InstructionResult {
                // If in any way the execution result is true, add template to result.
                const lModuleResult: InstructionResult = new InstructionResult();

                const lTemplateOne: PwbTemplate = new PwbTemplate();
                lTemplateOne.appendChild(new PwbTemplateXmlNode('div'));

                const lTemplateTwo: PwbTemplate = new PwbTemplate();
                lTemplateTwo.appendChild(new PwbTemplateXmlNode('div'));

                lModuleResult.addElement(lTemplateOne, this.mDataLevel.data, null);
                lModuleResult.addElement(lTemplateTwo, this.mDataLevel.data, null);

                return lModuleResult;
            }
        }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$multiresult`
        })
        class TestComponent { }

        // Process. Create element.
        let lErrorMessage: string | null = null;
        try {
            await <any>TestUtil.createComponent(TestComponent);
        } catch (pError) {
            const lError: Error = <Error>pError;
            lErrorMessage = lError.message;
        }

        // Evaluation.
        expect(lErrorMessage).toBe(`Can't add same template or values for multiple Elements.`);
    });
});

Deno.test('PwbInstructionModule--Functionality: Element key - New key reference recreates node', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define module that renders a single element and provides a new key reference on every update.
        @PwbInstructionModule({
            instructionType: 'newkeyelement'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class KeyedModule implements IInstructionOnUpdate {
            private readonly mModuleValues: ModuleDataLevel;
            private readonly mTrigger: LevelProcedure<number>;

            public constructor(pModuleData = Injection.use(ModuleDataLevel)) {
                this.mModuleValues = pModuleData;
                this.mTrigger = this.mModuleValues.createExpressionProcedure('this.trigger');
            }

            public onUpdate(): InstructionResult {
                // Read the reactive trigger so changing it re-runs this module.
                this.mTrigger.execute();

                const lModuleResult: InstructionResult = new InstructionResult();

                const lTemplate: PwbTemplate = new PwbTemplate();
                lTemplate.appendChild(new PwbTemplateXmlNode('div'));

                // Use a fresh object reference as key on every update, so the element identity changes.
                lModuleResult.addElement(lTemplate, new DataLevel(this.mModuleValues.data), {});

                return lModuleResult;
            }
        }

        // Setup. Define component with a reactive trigger to force a second update cycle.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$newkeyelement`
        })
        class TestComponent {
            @PwbExport
            @ComponentState.state()
            public accessor trigger: number = 0;
        }

        // Setup. Create element and read the initial node.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lNodeBefore: HTMLDivElement = TestUtil.getComponentNode<HTMLDivElement>(lComponent, 'div');

        // Process. Force an update.
        lComponent.trigger++;
        await TestUtil.waitForUpdate(lComponent);

        // Read the node after the update.
        const lNodeAfter: HTMLDivElement = TestUtil.getComponentNode<HTMLDivElement>(lComponent, 'div');

        // Evaluation. New key reference on each update => the node was recreated.
        expect(lNodeAfter).not.toBe(lNodeBefore);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbInstructionModule--Functionality: Element key - Null key keeps node', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define module that renders a single element without an identity key (null).
        @PwbInstructionModule({
            instructionType: 'nokeyelement'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class UnkeyedModule implements IInstructionOnUpdate {
            private readonly mModuleValues: ModuleDataLevel;
            private readonly mTrigger: LevelProcedure<number>;

            public constructor(pModuleData = Injection.use(ModuleDataLevel)) {
                this.mModuleValues = pModuleData;
                this.mTrigger = this.mModuleValues.createExpressionProcedure('this.trigger');
            }

            public onUpdate(): InstructionResult {
                // Read the reactive trigger so changing it re-runs this module.
                this.mTrigger.execute();

                const lModuleResult: InstructionResult = new InstructionResult();

                const lTemplate: PwbTemplate = new PwbTemplate();
                lTemplate.appendChild(new PwbTemplateXmlNode('div'));

                // No identity key. Elements are matched purely by their template structure.
                lModuleResult.addElement(lTemplate, new DataLevel(this.mModuleValues.data), null);

                return lModuleResult;
            }
        }

        // Setup. Define component with a reactive trigger to force a second update cycle.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$nokeyelement`
        })
        class TestComponent {
            @PwbExport
            @ComponentState.state()
            public accessor trigger: number = 0;
        }

        // Setup. Create element and read the initial node.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        const lNodeBefore: HTMLDivElement = TestUtil.getComponentNode<HTMLDivElement>(lComponent, 'div');

        // Process. Force an update.
        lComponent.trigger++;
        await TestUtil.waitForUpdate(lComponent);

        // Read the node after the update.
        const lNodeAfter: HTMLDivElement = TestUtil.getComponentNode<HTMLDivElement>(lComponent, 'div');

        // Evaluation. Null key => matched by structure => the same node was kept.
        expect(lNodeAfter).toBe(lNodeBefore);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);
    });
});

Deno.test('PwbInstructionModule--Functionality: CustomModule - Manipulator without update method', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Define module.
        @PwbInstructionModule({
            instructionType: 'noupdatemethod'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class WrongModule { }

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$noupdatemethod`
        })
        class TestComponent { }

        // Process. Create element.
        const lComponent = await <any>TestUtil.createComponent(TestComponent);

        // Wait for any update to finish to prevent timer leaks.
        await TestUtil.waitForUpdate(lComponent);

        // Should be allowed. No errors.
    });
});