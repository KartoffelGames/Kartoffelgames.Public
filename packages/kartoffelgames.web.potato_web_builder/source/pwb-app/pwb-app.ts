import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { ErrorListener } from '@kartoffelgames/web.change-detection/library/source/change_detection/change-detection';
import { PwbTemplate } from '../component/template/nodes/pwb-template';
import { ComponentProcessorConstructor } from '../interface/component.interface';
import { PwbAppComponent } from './component/pwb-app-component';

/**
 * Wrapper handles scoped global styles, components and loading splashscreen.
 */
export class PwbApp {
    private static readonly mChangeDetectionToApp: WeakMap<ChangeDetection, PwbApp> = new WeakMap<ChangeDetection, PwbApp>();

    /**
     * Get app of change detection.
     * 
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

    private mAppComponent!: HTMLElement & PwbAppComponent;
    private readonly mChangeDetection: ChangeDetection;

    /**
     * Get app underlying content.
     */
    public get component(): HTMLElement {
        return this.mAppComponent;
    }

    /**
     * Constructor.
     */
    public constructor() {
        // Get app component constructor.
        const lAppComponentSelector: string = (<ComponentProcessorConstructor><unknown>PwbAppComponent).__component_selector__;
        const lAppComponentConstructor: CustomElementConstructor = window.customElements.get(lAppComponentSelector)!;

        // Read change detection of app component.
        this.mChangeDetection = new ChangeDetection('App');
        PwbApp.mChangeDetectionToApp.set(this.mChangeDetection, this);

        // Create app component element inside pwb app change detection.
        this.mChangeDetection.execute(() => {
            this.mAppComponent = <HTMLElement & PwbAppComponent>new lAppComponentConstructor();
        });
    }

    /**
     * Append content to app.
     * Component is constructed asynchron after beeing append with {@link appendTo}.
     * 
     * @param pContentConstructor - Content constructor.
     */
    public addContent(pContentConstructor: InjectionConstructor | ComponentProcessorConstructor): void {
        this.mAppComponent.addContent(pContentConstructor);
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
     * Inserts css sttyles into a new created {@link HTMLStyleElement} and prepend it to this app.
     * This styles are global available but cant penetrate components shadow root barier.
     * 
     * @remarks
     * Splashscreen content can be styles with this function.
     * 
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        this.mAppComponent.addStyle(pStyle);
    }

    /**
     * Append this app to an element.
     * Triggers the automatic splashscreen removal when not set to manual mode.
     * 
     * @param pElement - Element.
     */
    public async appendTo(pElement: Element): Promise<void> {
        // Append app element to specified element.
        pElement.appendChild(this.mAppComponent);

        // Wait for any component update.
        return this.mAppComponent.updateHandler.waitForUpdate().then();
    }

    /**
     * Remove splash screen.
     * 
     * @returns Promise that resolves when the splacescreen is completly removed.
     */
    public async removeSplashScreen(): Promise<void> {
        return this.mAppComponent.removeSplashScreen();
    }

    /**
     * Set splashscreen configuration. Only updates configurations that are set and leaves the others untouched.
     * Content is allways centered.
     * 
     * @param pSplashScreen - Splashscreen settings.
     * 
     * @example
     * ``` Typescript
     * const app = new PwbApp();
     * 
     * // Only change manual mode.
     * app.setSplashScreen({ manual: true });
     * 
     * // Animation time and background.
     * app.setSplashScreen({ splashscreenAnimationTime: 750, background: '#c24fb7' });
     *  
     * // Set custom content.
     * const text = new PwbTemplateTextNode();
     * text.addValue('My splashscreen text');
     *
     * const div = new PwbTemplateXmlNode();
     * div.tagName = 'div';
     * div.appendChild(text);
     *
     * const template = new PwbTemplate();
     * template.appendChild(div);
     * 
     * app.setSplashScreen({ content: template });
     * 
     * ```
     */
    public setSplashScreen(pSplashScreen: SplashScreen): void {
        // Set background.
        if (typeof pSplashScreen.background === 'string') {
            this.mAppComponent.splashscreenBackground = pSplashScreen.background;
        }

        // Set splash screen remove animation time.
        if (typeof pSplashScreen.animationTime === 'number') {
            this.mAppComponent.splashscreenAnimationTime = pSplashScreen.animationTime;
        }

        // Set splash screen content template.
        if (typeof pSplashScreen.content !== 'undefined') {
            this.mAppComponent.splashscreenContent = pSplashScreen.content;
        }

        // Set splashscreen manual remove mode.
        if (typeof pSplashScreen.manual === 'boolean') {
            this.mAppComponent.splashscreenManualMode = pSplashScreen.manual;
        }
    }
}

export type SplashScreen = {
    background?: string,
    content?: PwbTemplate;
    manual?: boolean;
    animationTime?: number;
};