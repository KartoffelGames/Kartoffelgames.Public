import { Exception } from '@kartoffelgames/core.data';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { ErrorListener } from '@kartoffelgames/web.change-detection/library/source/change_detection/change-detection';
import { ElementCreator } from './component/element-creator';
import { UpdateHandler } from './component/handler/update-handler';
import { PwbTemplateXmlNode } from './component/template/nodes/pwb-template-xml-node';
import { ComponentElement, ComponentProcessorConstructor } from './interface/component.interface';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentUpdateHandlerReference } from './injection/references/component/component-update-handler-reference';

export class PwbApp { // TODO: Rework PwbApp to be a component.
    private static readonly mChangeDetectionToApp: WeakMap<ChangeDetection, PwbApp> = new WeakMap<ChangeDetection, PwbApp>();

    /**
     * Get app of change detection.
     * @param pChangeDetection - Change detection.
     */
    public static getChangeDetectionApp(pChangeDetection: ChangeDetection): PwbApp | undefined {
        let lCurrent: ChangeDetection | null = pChangeDetection;

        while (lCurrent) {
            if (PwbApp.mChangeDetectionToApp.has(lCurrent)) {
                return PwbApp.mChangeDetectionToApp.get(lCurrent);
            }

            lCurrent = lCurrent.looseParent;
        }

        return undefined;
    }

    private readonly mAppComponent: HTMLElement;
    private mAppSealed: boolean;
    private readonly mChangeDetection: ChangeDetection;
    private readonly mComponentSelectorList: Array<string>;
    private readonly mShadowRoot: ShadowRoot;
    private readonly mSplashScreen: HTMLElement;
    private mSplashScreenOptions: SplashScreen;

    /**
     * Get app underlying content.
     */
    public get content(): Element {
        return this.mAppComponent;
    }

    /**
     * Constructor.
     * @param pAppName - name of app zone.
     */
    public constructor(pAppName: string) {
        this.mAppSealed = false;
        this.mComponentSelectorList = new Array<string>();
        this.mChangeDetection = new ChangeDetection(pAppName);
        PwbApp.mChangeDetectionToApp.set(this.mChangeDetection, this);

        // Create app wrapper template.
        const lGenericDivTemplate: PwbTemplateXmlNode = new PwbTemplateXmlNode();
        lGenericDivTemplate.tagName = 'div';

        // Create app wrapper add name as data attribute.
        this.mAppComponent = <HTMLElement>ElementCreator.createElement(lGenericDivTemplate);
        this.mAppComponent.setAttribute('data-app', pAppName);
        this.mAppComponent.style.setProperty('width', '100%');
        this.mAppComponent.style.setProperty('height', '100%');

        // Create app shadow root.
        this.mShadowRoot = this.mAppComponent.attachShadow({ mode: 'open' });

        // Add splashscreen container. Fullscreen, full opacity with transistion.
        this.mSplashScreen = <HTMLElement>ElementCreator.createElement(lGenericDivTemplate);
        this.mSplashScreen.style.setProperty('position', 'absolute');
        this.mSplashScreen.style.setProperty('width', '100%');
        this.mSplashScreen.style.setProperty('height', '100%');
        this.mSplashScreen.style.setProperty('opacity', '1');
        this.mShadowRoot.appendChild(this.mSplashScreen);

        // Set default splash screen.
        this.mSplashScreenOptions = { background: '', content: '' };
        this.setSplashScreen({
            background: 'linear-gradient(0deg, rgba(47,67,254,1) 8%, rgba(0,23,255,1) 70%)',
            content: '<span style="color: #fff; font-family: arial; font-weight: bold;">PWB</span>',
            animationTime: 500
        });
    }

    /**
     * Append content to app.
     * @param pContentConstructor - Content constructor.
     */
    public addContent(pContentConstructor: InjectionConstructor | ComponentProcessorConstructor): void {
        // Sealed error.
        if (this.mAppSealed) {
            throw new Exception('App content is sealed after it got append to the DOM', this);
        }

        // Validate constructor to be a component constructor. 
        if (!('__component_selector__' in pContentConstructor) || typeof pContentConstructor.__component_selector__ !== 'string') {
            throw new Exception(`Set constructor is not a component constructor.`, this);
        }

        // Add content to content list.
        this.mComponentSelectorList.push(pContentConstructor.__component_selector__);
    }

    /**
     * Add error listener that listens for any uncatched error.
     * Prevent error defaults like print on console when {@link pListener} return the actual value false.
     * 
     * @param pListener - Error listener.
     */
    public addErrorListener(pListener: ErrorListener): void {
        this.mChangeDetection.addErrorListener(pListener);
    }

    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        // Sealed error.
        if (this.mAppSealed) {
            throw new Exception('App content is sealed after it got append to the DOM', this);
        }

        const lStyleTemplate: PwbTemplateXmlNode = new PwbTemplateXmlNode();
        lStyleTemplate.tagName = 'style';

        const lStyleElement: Element = ElementCreator.createElement(lStyleTemplate);
        lStyleElement.innerHTML = pStyle;
        this.mShadowRoot.prepend(lStyleElement);
    }

    /**
     * Append app to element.
     * @param pElement - Element.
     */
    public async appendTo(pElement: Element): Promise<void> {
        // Append app element to specified element.
        pElement.appendChild(this.mAppComponent);

        // Exit if app was already initialized.
        if (this.mAppSealed) {
            return;
        }

        // Seal content.
        this.mAppSealed = true;

        return new Promise<void>((pResolve, pReject) => {
            // Wait for update and remove splash screen after.
            globalThis.requestAnimationFrame(() => {
                const lUpdateWaiter: Array<Promise<boolean>> = new Array<Promise<boolean>>();

                // Create new update waiter for each component.
                for (const lComponentConstructor of this.mComponentSelectorList) {
                    // Create component and forward error.
                    let lComponentElement: ComponentElement;
                    try {
                        lComponentElement = this.createComponent(lComponentConstructor);
                    } catch (pError) {
                        pReject(pError);
                        return;
                    }

                    // Get component of html element and add update waiter to the waiter list. 
                    const lUpdater: UpdateHandler = lComponentElement.__component__.getProcessorAttribute<UpdateHandler>(ComponentUpdateHandlerReference)!;
                    lUpdateWaiter.push(lUpdater.waitForUpdate());
                }

                // Promise that waits for all component to finish updating.
                let lUpdatePromise: Promise<any> = Promise.all(lUpdateWaiter);

                // Remove splash screen if not in manual mode.
                if (!this.mSplashScreenOptions.manual) {
                    lUpdatePromise = lUpdatePromise.then(async () => {
                        return this.removeSplashScreen();
                    });
                }

                // Forward resolve and rejection.
                lUpdatePromise.then(() => { pResolve(); }).catch((pError) => { pReject(pError); });
            });
        });
    }

    /**
     * Remove splash screen.
     */
    public async removeSplashScreen(): Promise<void> {
        // Not good for testing.
        /* istanbul ignore next */
        const lTransistionTimerMilliseconds: number = this.mSplashScreenOptions.animationTime ?? 500;

        this.mSplashScreen.style.setProperty('transition', `opacity ${(lTransistionTimerMilliseconds / 1000).toString()}s linear`);
        this.mSplashScreen.style.setProperty('opacity', '0');

        // Remove splashscreen after transition.
        return new Promise<void>((pResolve) => {
            // Wait for transition to end.
            globalThis.setTimeout(() => {
                this.mSplashScreen.remove();

                // Resolve promise after remove.
                pResolve();
            }, lTransistionTimerMilliseconds);
        });
    }

    /**
     * Set new splash screen.
     * @param pSplashScreen - Splashscreen settings.
     */
    public setSplashScreen(pSplashScreen: SplashScreen): void {
        // Sealed error.
        if (this.mAppSealed) {
            throw new Exception('App content is sealed after it got append to the DOM', this);
        }

        // Set manual state.
        this.mSplashScreenOptions = pSplashScreen;

        // Create app wrapper template.
        const lGenericDivTemplate: PwbTemplateXmlNode = new PwbTemplateXmlNode();
        lGenericDivTemplate.tagName = 'div';

        // Create content wrapper.
        const lContentWrapper: HTMLElement = <HTMLElement>ElementCreator.createElement(lGenericDivTemplate);
        lContentWrapper.style.setProperty('display', 'grid');
        lContentWrapper.style.setProperty('align-content', 'center');
        lContentWrapper.style.setProperty('width', '100%');
        lContentWrapper.style.setProperty('height', '100%');
        lContentWrapper.style.setProperty('background', pSplashScreen.background);

        // Create spplash screen content and append to content wrapper.
        const lContent: HTMLElement = <HTMLElement>ElementCreator.createElement(lGenericDivTemplate);
        lContent.style.setProperty('width', 'fit-content');
        lContent.style.setProperty('height', 'fit-content');
        lContent.style.setProperty('margin', '0 auto');
        lContent.innerHTML = pSplashScreen.content;
        lContentWrapper.appendChild(lContent);

        this.mSplashScreen.replaceChildren(lContentWrapper);
    }

    /**
     * Create component.
     * @param pContentClass - Component class.
     */
    private createComponent(pSelector: string): ComponentElement {
        // Create content template content is always inside xhtml namespace.
        const lContentTemplate: PwbTemplateXmlNode = new PwbTemplateXmlNode();
        lContentTemplate.tagName = pSelector;

        // Create content from template inside change detection.
        let lContent: Element | ComponentElement | null = null;
        this.mChangeDetection.execute(() => {
            lContent = ElementCreator.createElement(lContentTemplate);

            // Append content to shadow root
            this.mShadowRoot.appendChild(lContent);
        });

        // Validate content to be a component.
        if (!lContent || !('__component__' in lContent)) {
            throw new Exception(`Selector "${pSelector}" is not a component.`, this);
        }

        return lContent;
    }
}

export type SplashScreen = {
    background: string,
    content: string;
    manual?: boolean;
    animationTime?: number;
};