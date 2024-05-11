import { expect } from 'chai';
import { PwbExport } from '../../../source';
import { PwbComponent } from '../../../source/decorator/pwb-component.decorator';
import { UpdateScope } from '../../../source/enum/update-scope.enum';
import { ComponentElement } from '../../../source/interface/component.interface';
import { PwbApp } from '../../../source/pwb-app/pwb-app';
import '../../mock/request-animation-frame-mock-session';
import '../../utility/chai-helper';
import { TestUtil } from '../../utility/test-util';

describe('PwbAppInjectionExtension', () => {
    it('-- PwbApp injection on global element', async () => {
        // Process.
        let lApp: PwbApp | null = null;

        // Process. Define component.    
        @PwbComponent({
            selector: TestUtil.randomSelector()
        })
        class TestComponent {
            public constructor(pApp: PwbApp) {
                lApp = pApp;
            }
        }

        // Process. Create app and skip wait for splash screen.
        const lPwbApp: PwbApp = new PwbApp();
        lPwbApp.setSplashScreen({ manual: true, animationTime: 10 });

        // Process. Add component to pwb app.
        lPwbApp.addContent(TestComponent);
        await lPwbApp.appendTo(document.body);

        // Process. Create elements and wait for update.
        const lComponent: ComponentElement = <ComponentElement>(<ShadowRoot>lPwbApp.content.shadowRoot).childNodes[1];
        TestUtil.forceProcessorCreation(lComponent);
        await TestUtil.waitForUpdate(lComponent);

        // Evaluation.
        expect(lApp).to.be.instanceOf(PwbApp);
    });

    it('-- PwbApp injection on manual element', async () => {
        // Setup.
        const lCapsuledSelector: string = TestUtil.randomSelector();

        // Process.
        let lApp: PwbApp | null = null;

        // Setup. Define component.
        @PwbComponent({
            selector: lCapsuledSelector,
            updateScope: UpdateScope.Manual
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class CapsuledTestComponent {
            public constructor(pApp: PwbApp) {
                lApp = pApp;
            }
        }

        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lCapsuledSelector}/>`,
            updateScope: UpdateScope.Global
        })
        class TestComponent { }

        // Process. Create app and skip wait for splash screen.
        const lPwbApp: PwbApp = new PwbApp();
        lPwbApp.setSplashScreen({ manual: true, animationTime: 10 });

        // Process. Add component to pwb app.
        lPwbApp.addContent(TestComponent);
        await lPwbApp.appendTo(document.body);

        // Process. Create elements and wait for update.
        const lComponent: ComponentElement = <ComponentElement>(<ShadowRoot>lPwbApp.content.shadowRoot).childNodes[1];
        await TestUtil.waitForUpdate(lComponent);

        const lChildContent: ComponentElement = <ComponentElement>(<ShadowRoot>lComponent.shadowRoot).childNodes[1];
        TestUtil.forceProcessorCreation(lChildContent);
        await TestUtil.waitForUpdate(lChildContent);

        // Evaluation.
        expect(lApp).to.be.instanceOf(PwbApp);
    });

    it('-- PwbApp injection on capsuled element', async () => {
        // Setup.
        const lCapsuledSelector: string = TestUtil.randomSelector();

        // Process.
        let lApp: PwbApp | null = null;

        // Setup. Define component.
        @PwbComponent({
            selector: lCapsuledSelector,
            updateScope: UpdateScope.Capsuled
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class CapsuledTestComponent {
            public constructor(pApp: PwbApp) {
                lApp = pApp;
            }
        }

        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lCapsuledSelector}/>`,
            updateScope: UpdateScope.Global
        })
        class TestComponent { }

        // Process. Create app and skip wait for splash screen.
        const lPwbApp: PwbApp = new PwbApp();
        lPwbApp.setSplashScreen({ manual: true, animationTime: 10 });

        // Process. Add component to pwb app.
        lPwbApp.addContent(TestComponent);
        await lPwbApp.appendTo(document.body);

        // Process. Create elements and wait for update.
        const lComponent: ComponentElement = <ComponentElement>(<ShadowRoot>lPwbApp.content.shadowRoot).childNodes[1];
        await TestUtil.waitForUpdate(lComponent);

        // Read cild component.
        const lChildChildContent: ComponentElement = <any>(<ShadowRoot>lComponent.shadowRoot).childNodes[1];
        TestUtil.forceProcessorCreation(lChildChildContent);
        await TestUtil.waitForUpdate(lChildChildContent);

        // Evaluation.
        expect(lApp).to.be.instanceOf(PwbApp);
    });

    it('-- Deep nested manual component', async () => {
        // Setup.
        const lChildSelector: string = TestUtil.randomSelector();
        const lChildChildSelector: string = TestUtil.randomSelector();

        // Process.
        let lApp: PwbApp | null = null;

        // Setup. Define component.
        @PwbComponent({
            selector: lChildChildSelector,
            updateScope: UpdateScope.Manual
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class ChildChildTestComponent {
            public constructor(pApp: PwbApp) {
                lApp = pApp;
            }
        }

        // Setup. Define component.
        @PwbComponent({
            selector: lChildSelector,
            template: `<${lChildChildSelector}/>`,
            updateScope: UpdateScope.Capsuled
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class ChildTestComponent { }

        // Process. Define component.   
        @PwbComponent({
            selector: TestUtil.randomSelector(),
            template: `<${lChildSelector}/>`,
            updateScope: UpdateScope.Global
        })
        class TestComponent { }

        // Process. Create app and skip wait for splash screen.
        const lPwbApp: PwbApp = new PwbApp();
        lPwbApp.setSplashScreen({ manual: true, animationTime: 10 });

        // Process. Add component to pwb app.
        lPwbApp.addContent(TestComponent);
        await lPwbApp.appendTo(document.body);

        // Process. Create elements and wait for update.
        const lComponent: ComponentElement = <ComponentElement>(<ShadowRoot>lPwbApp.content.shadowRoot).childNodes[1];
        await TestUtil.waitForUpdate(lComponent);

        // Read cild component.
        const lChildChildContent: ComponentElement = <any>(<ShadowRoot>lComponent.shadowRoot).childNodes[1];
        await TestUtil.waitForUpdate(lChildChildContent);

        // Read cild component.
        const lChildChildChildContent: ComponentElement = <any>(<ShadowRoot>lChildChildContent.shadowRoot).childNodes[1];
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
        class TestComponent {
            @PwbExport
            public app: PwbApp;

            public constructor(pApp: PwbApp) {
                this.app = pApp;
            }
        }

        // Process. Create element.
        const lComponentConstructor: CustomElementConstructor = <CustomElementConstructor>window.customElements.get(lSelector);

        // Process.
        let lMessage: string | null = null;
        try {
            const lComponent: HTMLElement & TestComponent = new lComponentConstructor() as any;
            lComponent.app; // Force creation off component processor by accessing it.
            await TestUtil.waitForUpdate(lComponent);
        } catch (pException) {
            const lError: Error = <Error>pException;
            lMessage = lError.message;
        }

        // Evaluation.
        expect(lMessage).to.be.equal('Parameter "PwbApp" of TestComponent is not registered to be injectable.');
    });
});