import { expect } from 'chai';
import { PwbComponent } from '../../source/core/component/pwb-component.decorator';
import { PwbTemplate } from '../../source/core/component/template/nodes/pwb-template';
import { PwbTemplateXmlNode } from '../../source/core/component/template/nodes/pwb-template-xml-node';
import { PwbConfiguration } from '../../source/core/configuration/pwb-configuration';
import { Processor } from '../../source/core/core_entity/processor';
import { PwbApp } from '../../source/pwb-app/pwb-app';
import '../mock/request-animation-frame-mock-session';
import '../utility/chai-helper';
import { TestUtil } from '../utility/test-util';

describe('PwbApp', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
    });

    it('Property: component', () => {
        // Setup.
        const lApp: PwbApp = new PwbApp();

        // Process.
        const lContent: Element = lApp.component;

        // Evaluation.
        expect(lContent.tagName.toLowerCase()).to.equal('pwb-app');
        expect(lContent.shadowRoot).to.be.not.null;
    });

    describe('Method: addContent', () => {
        it('-- Correct component', async () => {
            // Setup.
            const lApp: PwbApp = new PwbApp();
            lApp.setSplashScreen({ manual: true, animationTime: 0 });
            const lComponentSelector: string = TestUtil.randomSelector();

            // Setup. Define component.
            @PwbComponent({
                selector: lComponentSelector,
                template: '<div/>'
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestComponent extends Processor { }

            // Process.
            lApp.addContent(TestComponent);
            lApp.appendTo(document.body);
            const lContent: Element = <Element>lApp.component.shadowRoot!.querySelector(lComponentSelector);

            // Evaluation.
            expect(lContent.tagName.toLowerCase()).to.equal(lComponentSelector);
        });

        it('-- Initialize component before appendTo', async () => {
            // Setup.
            const lSelector: string = TestUtil.randomSelector();
            const lApp: PwbApp = new PwbApp();
            lApp.setSplashScreen({ manual: true, animationTime: 0 });

            // Setup. Define component.
            @PwbComponent({
                selector: lSelector,
                template: '<div/>'
            })
            class TestComponent extends Processor { }

            // Process.
            lApp.addContent(TestComponent);
            lApp.appendTo(document.body);
            const lContent: HTMLElement = <HTMLElement>lApp.component.shadowRoot!.querySelector(lSelector);
            await TestUtil.waitForUpdate(lContent);

            // Evaluation.
            expect(lContent).componentStructure([
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
            expect(lErrorFunction).to.throw(`Constructor "${String.name}" is not a registered custom element`);
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
            expect(lDummyElement.childNodes[0]).to.equal(lApp.component);
        });

        it('-- No double splash screen remove', async () => {
            // Setup. Create app.
            const lApp: PwbApp = new PwbApp();

            // Process. Create splash screen.
            lApp.setSplashScreen({
                animationTime: 0
            });

            // Process. Append and wait for splash screen remove
            lApp.appendTo(document.body);
            await TestUtil.waitForUpdate(lApp.component); // This Wait is triggered syncron with removeSplacescreen and this triggers another update.
            await TestUtil.waitForUpdate(lApp.component); // Wait for splacescreen removal.
            const lBeforeRemoveChildState: boolean = !!lApp.component.shadowRoot?.querySelector('.splashscreen');

            // Process
            lApp.appendTo(document.body);
            await TestUtil.waitForUpdate(lApp.component); // This Wait is triggered syncron with removeSplacescreen and this triggers another update.
            await TestUtil.waitForUpdate(lApp.component); // Wait for splacescreen removal.
            const lAfterRemoveChildState: boolean = !!lApp.component.shadowRoot?.querySelector('.splashscreen');

            // Evaluation.
            expect(lBeforeRemoveChildState, 'Before').to.be.false;
            expect(lAfterRemoveChildState, 'After').to.be.false;
        });
    });

    it('Method: addErrorListener', async () => {
        // Setup.
        const lErrorMessage: string = 'Custom Error';
        const lSelector: string = TestUtil.randomSelector();

        // Setup. Define component.
        @PwbComponent({
            selector: lSelector,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestComponent extends Processor {
            public constructor() {
                super();

                throw new Error(lErrorMessage);
            }
        }

        // Setup.
        const lApp: PwbApp = new PwbApp();
        lApp.setSplashScreen({ manual: true, animationTime: 0 });
        lApp.addContent(TestComponent);

        // Process. Lof error.
        let lErrorMessageResult: string | null = null;
        lApp.addErrorListener((pError: Error) => {
            lErrorMessageResult = pError.message;

            return false;
        });

        // Throw and catch error.
        try {
            lApp.appendTo(document.body);

            // Trigger processor creation.
            const lContent: HTMLElement = <HTMLElement>lApp.component.shadowRoot!.querySelector(lSelector);
            TestUtil.forceProcessorCreation(lContent);
        } catch (pError) {
            const lError: Error = <Error>pError;
            window.dispatchEvent(new ErrorEvent('error', {
                error: lError,
                message: lError.message,
            }));
        }

        // Evaluation.
        expect(lErrorMessageResult).to.equal(lErrorMessage);
    });

    describe('Method: addStyle', () => {
        it('-- Default', async () => {
            // Setup.
            const lApp: PwbApp = new PwbApp();
            const lStyleContent: string = 'Content';

            // Process.
            lApp.addStyle(lStyleContent);
            lApp.appendTo(document.body);
            const lContent: HTMLStyleElement = <HTMLStyleElement>lApp.component.shadowRoot!.querySelectorAll('style')[1];

            // Evaluation.
            expect(lContent instanceof HTMLStyleElement).to.be.true;
            expect(lContent.textContent).to.equal(lStyleContent);
        });

        it('-- Add style after append', async () => {
            // Setup.
            const lStyleContent: string = 'Content';
            const lApp: PwbApp = new PwbApp();
            lApp.setSplashScreen({ animationTime: 0 });
            lApp.appendTo(document.body);

            // Process. Add style and wait.
            lApp.addStyle(lStyleContent);
            await TestUtil.waitForUpdate(lApp.component);

            // Get style content.
            const lContent: HTMLStyleElement = <HTMLStyleElement>lApp.component.shadowRoot!.querySelectorAll('style')[1];

            // Evaluation.
            expect(lContent instanceof HTMLStyleElement).to.be.true;
            expect(lContent.textContent).to.equal(lStyleContent);
        });
    });

    it('Method: removeSplashScreen', async () => {
        // Setup.
        const lApp: PwbApp = new PwbApp();
        lApp.setSplashScreen({ animationTime: 0 });

        // Process
        await lApp.removeSplashScreen();
        const lContent: Element | null = lApp.component.shadowRoot!.querySelector('.splashscreen');

        // Evaluation.
        expect(lContent).to.be.null;
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
            lApp.appendTo(document.body);

            // Process. Read splash screen data.
            const lContentElement: HTMLElement = lApp.component.shadowRoot!.querySelector('span')!;

            expect(lContentElement.getAttribute('style')).to.equal('color: #fff;');
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

            // Process. Create splash screen.
            lApp.setSplashScreen({
                background: lBackground,
                animationTime: 0,
                manual: true
            });

            // Setup. Add app to document.
            lApp.appendTo(document.body);

            // Process. Read splash screen data.
            const lSplashScreen: HTMLElement = <HTMLElement>lApp.component.shadowRoot!.querySelector('.splashscreen');

            expect(lSplashScreen.style.getPropertyValue('--background')).to.equal(lBackground);
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
            expect(lBeforeRemoveState).to.be.true;
            expect(lAfterRemoveState).to.be.false;
        });
    });
});