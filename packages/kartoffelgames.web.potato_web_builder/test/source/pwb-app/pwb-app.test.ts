// Import mock at start of file.
import { MOCK_WINDOW, TestUtil } from '../../utility/test-util.ts';

// Functional imports after mock.
import { expect } from '@kartoffelgames/core-test';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { PwbTemplateXmlNode } from '../../../source/core/component/template/nodes/pwb-template-xml-node.ts';
import { PwbTemplate } from '../../../source/core/component/template/nodes/pwb-template.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { PwbApp } from '../../../source/pwb-app/pwb-app.ts';

Deno.test('PwbApp.component', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lApp: PwbApp = new PwbApp();

        // Process.
        const lContent: Element = lApp.component;

        // Evaluation.
        expect(lContent.tagName.toLowerCase()).toBe('pwb-app');
        expect(lContent.shadowRoot).not.toBeNull();
    });
});

Deno.test('PwbApp.addContent()', async (pContext) => {
    await pContext.step('Correct component', async () => {
        // Setup.
        const lApp: PwbApp = new PwbApp();
        const lSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector,
            template: '<div/>'
        })
        class TestComponent extends Processor { }

        // Process. Add component and wait for update.
        lApp.addContent(TestComponent);
        await TestUtil.waitForUpdate(lApp.component);

        // Process. Read component.
        const lContent: Element = <Element>lApp.component.shadowRoot!.querySelector(lSelector);

        // Evaluation.
        expect(lContent.tagName.toLowerCase()).toBe(lSelector);
    });

    await pContext.step('Initialize component before appendTo', async () => {
        // Setup.
        const lSelector: string = TestUtil.randomSelector();
        const lApp: PwbApp = new PwbApp();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector,
            template: '<div/>'
        })
        class TestComponent extends Processor { }

        // Process. Add content and wait for rendering.
        lApp.addContent(TestComponent);
        await TestUtil.waitForUpdate(lApp.component);

        // Process. Get component.
        const lContent: HTMLElement = <HTMLElement>lApp.component.shadowRoot!.querySelector(lSelector);

        // Evaluation.
        expect(lContent).toBeComponentStructure(MOCK_WINDOW, [
            MOCK_WINDOW.Comment,
            MOCK_WINDOW.HTMLDivElement
        ], true);
    });

    await pContext.step('Wrong component type', () => {
        // Setup.
        const lApp: PwbApp = new PwbApp();

        // Process.
        const lErrorFunction = () => {
            lApp.addContent(String);
        };

        // Evaluation.
        expect(lErrorFunction).toThrow(`Constructor "${String.name}" is not a registered custom element`);
    });
});

Deno.test('PwbApp.appendTo()', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lDummyElement: HTMLDivElement = MOCK_WINDOW.document.createElement('div');
        const lApp: PwbApp = new PwbApp();
        lApp.setSplashScreen({ manual: true, animationTime: 0 });

        // Process.
        lApp.appendTo(lDummyElement);

        // Evaluation.
        expect(lDummyElement.childNodes[0]).toBe(lApp.component);
    });

    await pContext.step('Reappend to document.', async () => {
        // Setup. Create app.
        const lApp: PwbApp = new PwbApp();

        // Process. Create splash screen.
        lApp.setSplashScreen({
            animationTime: 0
        });

        // Process. Append and wait for splash screen remove
        lApp.appendTo(MOCK_WINDOW.document.body);
        await TestUtil.waitForUpdate(lApp.component);

        // Process
        lApp.appendTo(MOCK_WINDOW.document.body);
        await TestUtil.waitForUpdate(lApp.component);
    });
});

Deno.test('PwbApp.addErrorListener()', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lErrorMessage: string = 'Custom Error';
        const lSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector,
            template: '{{this.value}}'
        })
        class TestComponent extends Processor {
            public value: string = '';

            public constructor() {
                super();

                throw new Error(lErrorMessage);
            }
        }

        // Setup. Init app.
        const lApp: PwbApp = new PwbApp();
        lApp.setSplashScreen({ manual: true, animationTime: 0 });
        lApp.appendTo(MOCK_WINDOW.document.body);

        // Process. Log error.
        let lErrorMessageResult: string | null = null;
        lApp.addErrorListener((pError: Error) => {
            lErrorMessageResult = pError.message;
            return false;
        });

        // Throw and catch error.
        try {
            lApp.addContent(TestComponent);
            await TestUtil.waitForUpdate(lApp.component);
        } catch (pError) {
            const lError: Error = <Error>pError;
            globalThis.dispatchEvent(new ErrorEvent('error', {
                error: lError,
                message: lError.message,
            }));
        }

        // Evaluation.
        expect(lErrorMessageResult).toBe(lErrorMessage);
    });
});

Deno.test('PwbApp.addStyle()', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lStyleContent: string = 'Content';

        // Setup. Init app.
        const lApp: PwbApp = new PwbApp();
        lApp.appendTo(MOCK_WINDOW.document.body);

        // Process.
        lApp.addStyle(lStyleContent);
        await TestUtil.waitForUpdate(lApp.component);

        const lContent: HTMLStyleElement = <HTMLStyleElement>lApp.component.shadowRoot!.querySelectorAll('style')[1];

        // Evaluation.
        expect(lContent instanceof MOCK_WINDOW.HTMLStyleElement).toBeTruthy();
        expect(lContent.textContent).toBe(lStyleContent);
    });

    await pContext.step('Add style after append', async () => {
        // Setup.
        const lStyleContent: string = 'Content';

        // Setup. Init app.
        const lApp: PwbApp = new PwbApp();
        lApp.setSplashScreen({ animationTime: 0 });
        lApp.appendTo(MOCK_WINDOW.document.body);

        // Process. Add style and wait.
        lApp.addStyle(lStyleContent);
        await TestUtil.waitForUpdate(lApp.component);

        // Get style content.
        const lContent: HTMLStyleElement = <HTMLStyleElement>lApp.component.shadowRoot!.querySelectorAll('style')[1];

        // Evaluation.
        expect(lContent instanceof MOCK_WINDOW.HTMLStyleElement).toBeTruthy();
        expect(lContent.textContent).toBe(lStyleContent);
    });
});

Deno.test('PwbApp.removeSplashScreen()', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lApp: PwbApp = new PwbApp();
        lApp.setSplashScreen({ animationTime: 0 });
        lApp.appendTo(MOCK_WINDOW.document.body);

        // Process
        await lApp.removeSplashScreen();
        const lContent: Element | null = lApp.component.shadowRoot!.querySelector('.splashscreen');

        // Evaluation.
        expect(lContent).toBeNull();
    });
});

Deno.test('PwbApp.setSplashScreen()', async (pContext) => {
    await pContext.step('Content', async () => {
        // Setup. Content.
        const lContentSpan = new PwbTemplateXmlNode();
        lContentSpan.tagName = 'span';
        lContentSpan.setAttribute('style').addValue('color: #fff;');

        // Setup. Add content to content template.
        const lContent = new PwbTemplate();
        lContent.appendChild(lContentSpan);

        // Setup. Create app.
        const lApp: PwbApp = new PwbApp();

        // Process. Create splash screen.
        lApp.setSplashScreen({
            content: lContent,
            animationTime: 0,
            manual: true
        });

        // Setup. Add app to document.
        await TestUtil.waitForUpdate(lApp.component);

        // Process. Read splash screen data.
        const lContentElement: HTMLElement = lApp.component.shadowRoot!.querySelector('span')!;

        expect(lContentElement.getAttribute('style')).toBe('color: #fff;');
    });

    await pContext.step('Background', async () => {
        // Setup.
        const lBackground: string = 'red';

        // Setup. Content.
        const lContentSpan = new PwbTemplateXmlNode();
        lContentSpan.tagName = 'span';
        lContentSpan.setAttribute('style').addValue('color: #fff;');

        // Setup. Create app.
        const lApp: PwbApp = new PwbApp();
        lApp.appendTo(MOCK_WINDOW.document.body);

        // Process. Create splash screen.
        lApp.setSplashScreen({
            background: lBackground,
            animationTime: 0,
            manual: true
        });
        await TestUtil.waitForUpdate(lApp.component);

        // Process. Read splash screen data.
        const lSplashScreen: HTMLElement = <HTMLElement>lApp.component.shadowRoot!.querySelector('.splashscreen');

        expect(lSplashScreen.style.getPropertyValue('--background')).toBe(lBackground);
    });

    await pContext.step('Manual splash screen', async () => {
        // Setup. Create app.
        const lApp: PwbApp = new PwbApp();
        lApp.setSplashScreen({
            animationTime: 0
        });

        // Process. Create splash screen.
        lApp.setSplashScreen({
            manual: true
        });

        // Process. Append and wait for splash screen remove
        lApp.appendTo(MOCK_WINDOW.document.body);
        const lBeforeRemoveState: boolean = !!lApp.component.shadowRoot?.querySelector('.splashscreen');

        // Process
        await lApp.removeSplashScreen();
        await TestUtil.waitForUpdate(lApp.component);
        const lAfterRemoveState: boolean = !!lApp.component.shadowRoot?.querySelector('.splashscreen');

        // Evaluation.
        expect(lBeforeRemoveState).toBeTruthy();
        expect(lAfterRemoveState).toBeFalsy();
    });
});