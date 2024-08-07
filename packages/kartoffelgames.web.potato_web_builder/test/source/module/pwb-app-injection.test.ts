import { expect } from 'chai';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration';
import { Processor } from '../../../source/core/core_entity/processor';
import { UpdateMode } from '../../../source/core/enum/update-mode.enum';
import { PwbApp } from '../../../source/pwb-app/pwb-app';
import '../../utility/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('PwbAppInjection', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- PwbApp injection on global element', async () => {
        // Process.
        let lApp: PwbApp | null = null;
        const lSelector: string = TestUtil.randomSelector();

        // Process. Define component.    
        @PwbComponent({
            selector: lSelector
        })
        class TestComponent extends Processor {
            public constructor(pApp: PwbApp) {
                super();

                lApp = pApp;
            }
        }

        // Process. Create app and skip wait for splash screen.
        const lPwbApp: PwbApp = new PwbApp();

        // Process. Add component to pwb app.
        lPwbApp.addContent(TestComponent);
        await TestUtil.waitForUpdate(lPwbApp.component);
        await TestUtil.waitForUpdate(lPwbApp.component);
        await TestUtil.waitForUpdate(lPwbApp.component);

        // Process. Create elements and wait for update.
        const lComponent: HTMLElement = <HTMLElement>lPwbApp.component.shadowRoot!.querySelector(lSelector);
        TestUtil.forceProcessorCreation(lComponent);
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lApp).to.be.instanceOf(PwbApp);
    });

    it('-- PwbApp injection on manual element', async () => {
        // Setup.
        const lCapsuledSelector: string = TestUtil.randomSelector();
        const lSelector: string = TestUtil.randomSelector();

        // Process.
        let lApp: PwbApp | null = null;

        // Setup. Define component.
        @PwbComponent({
            selector: lCapsuledSelector,
            updateScope: UpdateMode.Manual
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class CapsuledTestComponent extends Processor {
            public constructor(pApp: PwbApp) {
                super();

                lApp = pApp;
            }
        }

        // Process. Define component.   
        @PwbComponent({
            selector: lSelector,
            template: `<${lCapsuledSelector}/>`,
            updateScope: UpdateMode.Default
        })
        class TestComponent extends Processor { }

        // Process. Create app and skip wait for splash screen.
        const lPwbApp: PwbApp = new PwbApp();

        // Process. Add component to pwb app.
        lPwbApp.addContent(TestComponent);
        await TestUtil.waitForUpdate(lPwbApp.component);

        // Process. Create elements and wait for update.
        const lComponent: HTMLElement = <HTMLElement>lPwbApp.component.shadowRoot!.querySelector(lSelector);
        await TestUtil.waitForUpdate(lComponent);

        const lChildContent: HTMLElement = <HTMLElement>lComponent.shadowRoot!.querySelector(lCapsuledSelector);
        TestUtil.forceProcessorCreation(lChildContent);
        await TestUtil.waitForUpdate(lChildContent);

        // Evaluation.
        expect(lApp).to.be.instanceOf(PwbApp);
    });

    it('-- Deep nested manual component', async () => {
        // Setup.
        const lSelector: string = TestUtil.randomSelector();
        const lChildSelector: string = TestUtil.randomSelector();
        const lChildChildSelector: string = TestUtil.randomSelector();

        // Process.
        let lApp: PwbApp | null = null;

        // Setup. Define component.
        @PwbComponent({
            selector: lChildChildSelector,
            updateScope: UpdateMode.Manual
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class ChildChildTestComponent extends Processor {
            public constructor(pApp: PwbApp) {
                super();

                lApp = pApp;
            }
        }

        // Setup. Define component.
        @PwbComponent({
            selector: lChildSelector,
            template: `<${lChildChildSelector}/>`,
            updateScope: UpdateMode.Manual
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class ChildTestComponent extends Processor { }

        // Process. Define component.   
        @PwbComponent({
            selector: lSelector,
            template: `<${lChildSelector}/>`,
            updateScope: UpdateMode.Default
        })
        class TestComponent extends Processor { }

        // Process. Create app and skip wait for splash screen.
        const lPwbApp: PwbApp = new PwbApp();

        // Process. Add component to pwb app.
        lPwbApp.addContent(TestComponent);
        await TestUtil.waitForUpdate(lPwbApp.component);

        // Process. Create elements and wait for update.
        const lComponent: HTMLElement = TestUtil.getComponentNode(lPwbApp.component, lSelector);
        await TestUtil.waitForUpdate(lComponent);

        // Read cild component.
        const lChildChildContent: HTMLElement = TestUtil.getComponentNode(lComponent, lChildSelector);
        TestUtil.manualUpdate(lChildChildContent);

        // Read cild component.
        const lChildChildChildContent: HTMLElement = TestUtil.getComponentNode(lChildChildContent, lChildChildSelector);
        TestUtil.forceProcessorCreation(lChildChildChildContent);
        await TestUtil.waitForUpdate(lChildChildChildContent);

        // Evaluation.
        expect(lApp).to.be.instanceOf(PwbApp);
    });

    it('-- Creation without PwbApp', async () => {
        // Setup.
        const lSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector,
            template: '<div/>'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestComponent extends Processor {

            public constructor(_pApp: PwbApp) {
                super();
            }
        }

        // Process. Create element.
        const lComponentConstructor: CustomElementConstructor = <CustomElementConstructor>window.customElements.get(lSelector);

        // Process.
        let lMessage: string | null = null;
        try {
            const lComponent: HTMLElement & TestComponent = new lComponentConstructor() as any;
            TestUtil.forceProcessorCreation(lComponent);
            await TestUtil.waitForUpdate(lComponent);
        } catch (pException) {
            const lError: Error = <Error>pException;
            lMessage = lError.message;
        }

        // Evaluation.
        expect(lMessage).to.be.equal('Parameter "PwbApp" of TestComponent is not registered to be injectable.');
    });

    it('-- Creation with isloated component', async () => {
        // Process.
        const lSelector: string = TestUtil.randomSelector();

        // Process.
        let lApp: PwbApp | null = null;

        // Process. Define component.    
        @PwbComponent({
            selector: lSelector,
            updateScope: UpdateMode.Isolated
        })
        class TestComponent extends Processor {
            public constructor(pApp: PwbApp) {
                super();
                lApp = pApp;
            }
        }

        // Process. Create app and skip wait for splash screen.
        const lPwbApp: PwbApp = new PwbApp();

        // Process. Add component to pwb app.
        lPwbApp.addContent(TestComponent);
        await TestUtil.waitForUpdate(lPwbApp.component);

        // Process. Create elements and wait for update.
        const lComponent: HTMLElement = <HTMLElement>lPwbApp.component.shadowRoot!.querySelector(lSelector);
        TestUtil.forceProcessorCreation(lComponent);
        await TestUtil.waitForUpdate(lPwbApp.component);

        // Evaluation.
        expect(lApp).to.be.instanceOf(PwbApp);
    });
});