// Import mock at start of file.
import { TestUtil } from '../../utility/test-util.ts';

// Functional imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { Injection } from '../../../../kartoffelgames.core.dependency_injection/source/injection/injection.ts';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { UpdateMode } from '../../../source/core/enum/update-mode.enum.ts';
import { PwbApp } from '../../../source/pwb-app/pwb-app.ts';

Deno.test('PwbAppInjection--Functionality: PwbApp injection on global element', async (pContext) => {
    await pContext.step('Default', async () => {
        // Process.
        let lApp: PwbApp | null = null;
        const lSelector: string = TestUtil.randomSelector();

        // Process. Define component.    
        @PwbComponent({
            selector: lSelector
        })
        class TestComponent extends Processor {
            public constructor(pApp = Injection.use(PwbApp)) {
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
        expect(lApp).toBeInstanceOf(PwbApp);
    });
});

Deno.test('PwbAppInjection--Functionality: PwbApp injection on manual element', async (pContext) => {
    await pContext.step('Default', async () => {
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
            public constructor(pApp = Injection.use(PwbApp)) {
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
        expect(lApp).toBeInstanceOf(PwbApp);
    });
});

Deno.test('PwbAppInjection--Functionality: Deep nested manual component', async (pContext) => {
    await pContext.step('Default', async () => {
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
            public constructor(pApp = Injection.use(PwbApp)) {
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

        // Read child component.
        const lChildChildContent: HTMLElement = TestUtil.getComponentNode(lComponent, lChildSelector);
        TestUtil.manualUpdate(lChildChildContent);

        // Read child component.
        const lChildChildChildContent: HTMLElement = TestUtil.getComponentNode(lChildChildContent, lChildChildSelector);
        TestUtil.forceProcessorCreation(lChildChildChildContent);
        await TestUtil.waitForUpdate(lChildChildChildContent);

        // Evaluation.
        expect(lApp).toBeInstanceOf(PwbApp);
    });
});

Deno.test('PwbAppInjection--Functionality: Creation without PwbApp', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector,
            template: '<div/>'
        })

        class TestComponent extends Processor {

            public constructor(_pApp = Injection.use(PwbApp)) {
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
        expect(lMessage).toBe('Constructor "PwbApp" is not registered for injection and can not be built');
    });
});

Deno.test('PwbAppInjection--Functionality: Creation with isolated component', async (pContext) => {
    await pContext.step('Default', async () => {
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
            public constructor(pApp = Injection.use(PwbApp)) {
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
        expect(lApp).toBeInstanceOf(PwbApp);
    });
});