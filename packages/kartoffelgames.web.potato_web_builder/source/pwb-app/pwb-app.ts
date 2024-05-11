import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { ErrorListener } from '@kartoffelgames/web.change-detection/library/source/change_detection/change-detection';
import { PwbTemplate } from '../component/template/nodes/pwb-template';
import { ComponentProcessorConstructor } from '../interface/component.interface';
import { PwbAppComponent } from './component/pwb-app-component';

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

    private readonly mAppComponent: HTMLElement & PwbAppComponent;
    private readonly mChangeDetection: ChangeDetection;


    /**
     * Get app underlying content.
     */
    public get content(): Element {
        return this.mAppComponent;
    }

    /**
     * Constructor.
     */
    public constructor() {
        // Get app component constructor.
        const lAppComponentSelector: string = (<ComponentProcessorConstructor><unknown>PwbAppComponent).__component_selector__;
        const lAppComponentConstructor: CustomElementConstructor = window.customElements.get(lAppComponentSelector)!;

        // Create app component element.
        this.mAppComponent = <HTMLElement & PwbAppComponent>new lAppComponentConstructor();

        // Read change detection of app component.
        this.mChangeDetection = this.mAppComponent.updateHandler.changeDetection;
        PwbApp.mChangeDetectionToApp.set(this.mChangeDetection, this);
    }

    /**
     * Append content to app.
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
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        this.mAppComponent.addStyle(pStyle);
    }

    /**
     * Append app to element.
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
     */
    public async removeSplashScreen(): Promise<void> {
        return this.mAppComponent.removeSplashScreen();
    }

    /**
     * Set new splash screen.
     * @param pSplashScreen - Splashscreen settings.
     */
    public setSplashScreen(pSplashScreen: SplashScreen): void {
        if (typeof pSplashScreen.background === 'string') {
            this.mAppComponent.splashscreenBackground = pSplashScreen.background;
        }

        if (typeof pSplashScreen.animationTime === 'number') {
            this.mAppComponent.splashscreenAnimationTime = pSplashScreen.animationTime;
        }

        if (typeof pSplashScreen.content !== 'undefined') {
            this.mAppComponent.splashscreenContent = pSplashScreen.content;
        }

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