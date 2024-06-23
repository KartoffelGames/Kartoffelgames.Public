import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { InteractionResponseType, InteractionZone } from '@kartoffelgames/web.change-detection';
import { ErrorListener } from '@kartoffelgames/web.change-detection/library/source/change_detection/interaction-zone';
import { ComponentProcessorConstructor } from '../core/component/component';
import { ComponentRegister } from '../core/component/component-register';
import { PwbTemplate } from '../core/component/template/nodes/pwb-template';
import { UpdateTrigger } from '../enum/update-trigger.enum';
import { PwbAppComponent } from './component/pwb-app-component';

/**
 * Wrapper handles scoped global styles, components and loading splashscreen.
 */
export class PwbApp {
    private static readonly mInteractionZoneToApp: WeakMap<InteractionZone, PwbApp> = new WeakMap<InteractionZone, PwbApp>();

    /**
     * Get app of interaction zone.
     * 
     * @param pInteractionZone - Interaction zone stack.
     */
    public static getAppOfZone(pInteractionZone: InteractionZone): PwbApp | undefined {
        // Move zone stack down.
        let lZoneStackItem: InteractionZone | null = pInteractionZone;
        do {
            if (PwbApp.mInteractionZoneToApp.has(lZoneStackItem)) {
                return PwbApp.mInteractionZoneToApp.get(lZoneStackItem);
            }
        } while ((lZoneStackItem = lZoneStackItem.parent) !== null);

        return undefined;
    }

    private mAppComponent!: HTMLElement & PwbAppComponent;
    private readonly mInteractionZone: InteractionZone;

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
        // Read interaction zone of app component.
        this.mInteractionZone = new InteractionZone('App', { isolate: true, trigger: <InteractionResponseType><unknown>UpdateTrigger.None });
        PwbApp.mInteractionZoneToApp.set(this.mInteractionZone, this);

        // Get app component constructor.
        const lAppComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(PwbAppComponent).elementConstructor;

        // Create app component element inside pwb app interaction zone.
        this.mInteractionZone.execute(() => {
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
        this.mInteractionZone.addErrorListener(pListener);
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
        return this.mAppComponent.updateZone.update().then();
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