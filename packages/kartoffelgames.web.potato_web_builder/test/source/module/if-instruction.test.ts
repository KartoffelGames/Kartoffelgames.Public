import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { PwbExport } from '../../../source/module/export/pwb-export.decorator.ts';
import '../../utility/request-animation-frame-mock-session.ts';
import { TestUtil } from '../../utility/test-util.ts';

// @deno-types="npm:@types/jsdom"
import { JSDOM, DOMWindow } from 'npm:jsdom';

// Setup global scope.
const MOCK_WINDOW: DOMWindow = (() => {
    const lMockDom: JSDOM = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', { pretendToBeVisual: true });

    PwbConfiguration.configuration.scope.window = lMockDom.window as unknown as typeof globalThis;
    PwbConfiguration.configuration.scope.document = lMockDom.window.document;

    return lMockDom.window;
})();

describe('IfInstruction', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('Initial false', async () => {
        // Setup. Values.
        const lDisplayed: boolean = false;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            public displayed: boolean = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).toBeComponentStructure([
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
        ], true);
    });

    it('Initial true', async () => {
        // Setup. Values.
        const lDisplayed: boolean = true;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            public displayed: boolean = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
            MOCK_WINDOW.Comment, // -- Manipulator Child Anchor
            MOCK_WINDOW.HTMLDivElement
        ], true);
    });

    it('Updated false', async () => {
        // Setup. Values.
        const lDisplayed: boolean = false;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public displayed: boolean = !lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.displayed = lDisplayed;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).toBeComponentStructure([
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
        ], true);
    });

    it('Updated true', async () => {
        // Setup. Values.
        const lDisplayed: boolean = true;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            @PwbExport
            public displayed: boolean = !lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);
        lComponent.displayed = lDisplayed;
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
            MOCK_WINDOW.Comment, // -- Manipulator Child Anchor
            MOCK_WINDOW.HTMLDivElement
        ], true);
    });

    it('None boolean false value', async () => {
        // Setup. Values.
        const lDisplayed: any = null;

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            public displayed: any = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation. Two Anchors. Static-Root => Manipulator => No Childs, no anchors.
        expect(lComponent).toBeComponentStructure([
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
        ], true);
    });

    it('None boolean true value', async () => {
        // Setup. Values.
        const lDisplayed: any = new Object();

        // Setup. Define component.
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `$if(this.displayed) {
                <div/>
            }`
        })
        class TestComponent extends Processor {
            public displayed: any = lDisplayed;
        }

        // Setup. Create element.
        const lComponent: HTMLElement & TestComponent = await <any>TestUtil.createComponent(TestComponent);

        // Evaluation.
        expect(lComponent).toBeComponentStructure([
            MOCK_WINDOW.Comment, // Component Anchor
            MOCK_WINDOW.Comment, // - Manipulator Anchor
            MOCK_WINDOW.Comment, // -- Manipulator Child Anchor
            MOCK_WINDOW.HTMLDivElement
        ], true);
    });
});