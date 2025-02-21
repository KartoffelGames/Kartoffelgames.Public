import { expect } from '@kartoffelgames/core-test';
import { describe, it, before } from '@std/testing/bdd';
import { PwbComponent } from '../../../source/core/component/pwb-component.decorator.ts';
import { PwbTemplate } from '../../../source/core/component/template/nodes/pwb-template.ts';
import { PwbTemplateXmlNode } from '../../../source/core/component/template/nodes/pwb-template-xml-node.ts';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration.ts';
import { Processor } from '../../../source/core/core_entity/processor.ts';
import { PwbApp } from '../../../source/pwb-app/pwb-app.ts';
import '../../utility/request-animation-frame-mock-session.ts';
import { TestUtil } from '../../utility/test-util.ts';

describe('PwbApp', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('Property: component', () => {
        // Setup.
        const lApp: PwbApp = new PwbApp();

        // Process.
        const lContent: Element = lApp.component;

        // Evaluation.
        expect(lContent.tagName.toLowerCase()).toBe('pwb-app');
        expect(lContent.shadowRoot).not.toBeNull();
    });

    describe('Method: addContent', () => {
        it('-- Correct component', async () => {
            // Setup.
            const lApp: PwbApp = new PwbApp();
            const lSelector: string = TestUtil.randomSelector();

            // Setup. Define component.
            @PwbComponent({
                selector: lSelector,
                template: '<div/>'
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestComponent extends Processor { }

            // Process. Add component and wait for update.
            lApp.addContent(TestComponent);
            await TestUtil.waitForUpdate(lApp.component);

            // Process. Read component.
            const lContent: Element = <Element>lApp.component.shadowRoot!.querySelector(lSelector);

            // Evaluation.
            expect(lContent.tagName.toLowerCase()).toBe(lSelector);
        });

        it('-- Initialize component before appendTo', async () => {
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
            expect(lContent).toBeComponentStructure([
                Comment,
                HTMLDivElement
            ], true);
        });

        it('-- Wrong component type', () => {
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

    describe('Method: appendTo', () => {
        it('-- Default', async () => {
            // Setup.
            const lDummyElement: HTMLDivElement = document.createElement('div');
            const lApp: PwbApp = new PwbApp();
            lApp.setSplashScreen({ manual: true, animationTime: 0 });

            // Process.
            lApp.appendTo(lDummyElement);

            // Evaluation.
            expect(lDummyElement.childNodes[0]).toBe(lApp.component);
        });

        it('-- Reappend to document.', async () => {
            // Setup. Create app.
            const lApp: PwbApp = new PwbApp();

            // Process. Create splash screen.
            lApp.setSplashScreen({
                animationTime: 0
            });

            // Process. Append and wait for splash screen remove
            lApp.appendTo(document.body);
            await TestUtil.waitForUpdate(lApp.component);

            // Process
            lApp.appendTo(document.body);
            await TestUtil.waitForUpdate(lApp.component);
        });
    });

    it('Method: addErrorListener', async () => {
        // Setup.
        const lErrorMessage: string = 'Custom Error';
        const lSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector,
            template: '{{this.value}}'
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        lApp.appendTo(document.body);

        // Process. Lof error.
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

    describe('Method: addStyle', () => {
        it('-- Default', async () => {
            // Setup.
            const lStyleContent: string = 'Content';

            // Setup. Init app.
            const lApp: PwbApp = new PwbApp();
            lApp.appendTo(document.body);

            // Process.
            lApp.addStyle(lStyleContent);
            await TestUtil.waitForUpdate(lApp.component);

            const lContent: HTMLStyleElement = <HTMLStyleElement>lApp.component.shadowRoot!.querySelectorAll('style')[1];

            // Evaluation.
            expect(lContent instanceof HTMLStyleElement).toBeTruthy();
            expect(lContent.textContent).toBe(lStyleContent);
        });

        it('-- Add style after append', async () => {
            // Setup.
            const lStyleContent: string = 'Content';

            // Setup. Init app.
            const lApp: PwbApp = new PwbApp();
            lApp.setSplashScreen({ animationTime: 0 });
            lApp.appendTo(document.body);

            // Process. Add style and wait.
            lApp.addStyle(lStyleContent);
            await TestUtil.waitForUpdate(lApp.component);

            // Get style content.
            const lContent: HTMLStyleElement = <HTMLStyleElement>lApp.component.shadowRoot!.querySelectorAll('style')[1];

            // Evaluation.
            expect(lContent instanceof HTMLStyleElement).toBeTruthy();
            expect(lContent.textContent).toBe(lStyleContent);
        });
    });

    it('Method: removeSplashScreen', async () => {
        // Setup.
        const lApp: PwbApp = new PwbApp();
        lApp.setSplashScreen({ animationTime: 0 });
        lApp.appendTo(document.body);

        // Process
        await lApp.removeSplashScreen();
        const lContent: Element | null = lApp.component.shadowRoot!.querySelector('.splashscreen');

        // Evaluation.
        expect(lContent).toBeNull();
    });

    describe('Method: setSplashScreen', () => {
        it('-- Content', async () => {
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

        it('-- Background', async () => {
            // Setup.
            const lBackground: string = 'red';

            // Setup. Content.
            const lContentSpan = new PwbTemplateXmlNode();
            lContentSpan.tagName = 'span';
            lContentSpan.setAttribute('style').addValue('color: #fff;');

            // Setup. Create app.
            const lApp: PwbApp = new PwbApp();
            lApp.appendTo(document.body);

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

        it('-- Manual splash screen', async () => {
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
            lApp.appendTo(document.body);
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
});