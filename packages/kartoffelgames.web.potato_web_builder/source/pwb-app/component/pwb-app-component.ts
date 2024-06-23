import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentProcessorConstructor, IComponentOnConnect, IComponentOnDisconnect } from '../../core/component/component';
import { ComponentInformation } from '../../core/component/component-information';
import { UpdateHandler } from '../../core/component/handler/update-handler';
import { PwbComponent } from '../../core/component/pwb-component.decorator';
import { PwbTemplate } from '../../core/component/template/nodes/pwb-template';
import { PwbTemplateXmlNode } from '../../core/component/template/nodes/pwb-template-xml-node';
import { ComponentUpdateHandlerReference } from '../../core/injection-reference/component/component-update-handler-reference';
import { PwbExport } from '../../default_module/export/pwb-export.decorator';
import pwbAppStyle from './pwb-app-component.css';
import pwbAppTemplate from './pwb-app-component.html';

@PwbComponent({
    selector: 'pwb-app',
    style: pwbAppStyle,
    template: pwbAppTemplate
})
export class PwbAppComponent implements IComponentOnConnect, IComponentOnDisconnect {
    // Used in view.
    public splashscreenConfig: SplashscreenConfiguration;
    public splashscreenState: SplashscreenState;
    public styleList: Array<string>;

    // Only internal.
    private readonly mContent: PwbTemplate;
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Get app content as pwb template.
     */
    @PwbExport get content(): PwbTemplate {
        return this.mContent;
    }

    /**
     * Splashscreen animation time.
     */
    @PwbExport get splashscreenAnimationTime(): number {
        return this.splashscreenConfig.animationTime;
    } set splashscreenAnimationTime(pMilliseconds: number) {
        this.splashscreenConfig.animationTime = pMilliseconds;
    }

    /**
     * Splashscreen background.
     */
    @PwbExport get splashscreenBackground(): string {
        return this.splashscreenConfig.background;
    } set splashscreenBackground(pValue: string) {
        this.splashscreenConfig.background = pValue;
    }

    /**
     * Splashscreen content
     */
    @PwbExport get splashscreenContent(): PwbTemplate {
        return this.splashscreenConfig.content;
    } set splashscreenContent(pTemplate: PwbTemplate) {
        this.splashscreenConfig.content = pTemplate;
    }

    /**
     * Splashscreen manual mode.
     */
    @PwbExport get splashscreenManualMode(): boolean {
        return this.splashscreenConfig.manual;
    } set splashscreenManualMode(pValue: boolean) {
        this.splashscreenConfig.manual = pValue;
    }

    /**
     * UpdateHandler
     */
    @PwbExport get updateHandler(): UpdateHandler {
        return this.mUpdateHandler;
    }

    /**
     * Constructor.
     */
    constructor(pUpdateHandler: ComponentUpdateHandlerReference) {
        this.mContent = new PwbTemplate();

        this.mUpdateHandler = pUpdateHandler;
        this.styleList = new Array<string>();

        // Set default splashscreen state. Not hidden and append to component.
        this.splashscreenState = {
            hide: false,
            append: true
        };

        // Set default splashscreen configuration.
        this.splashscreenConfig = {
            background: 'blue',
            content: new PwbTemplate(),
            manual: false,
            animationTime: 1000
        };
    }

    /**
     * Append content to app.
     * 
     * @param pContentConstructor - Content constructor.
     */
    @PwbExport addContent(pContentConstructor: InjectionConstructor | ComponentProcessorConstructor): void {
        // Create xml template from component class selector.
        const lContentTemplate: PwbTemplateXmlNode = new PwbTemplateXmlNode();
        lContentTemplate.tagName = ComponentInformation.ofConstructor(pContentConstructor).selector;

        // Add content to content template.
        this.mContent.appendChild(lContentTemplate);
    }

    /**
     * Create style element and prepend it to this components content.
     * 
     * @param pStyle - Css style as string.
     */
    @PwbExport addStyle(pStyle: string): void {
        this.styleList.push(pStyle);
    }

    /**
     * Removes splashscreen with an opacity animation.
     * 
     * @returns promise that resolved when the splacescreen remove animation finishes.
     */
    @PwbExport async removeSplashScreen(): Promise<void> {
        // Wait for the next frame to give the splashscreen at least one frame time to set the default styles before applying transitions.
        globalThis.requestAnimationFrame(() => {
            this.splashscreenState.hide = true;
        });

        // Remove splashscreen after transition.
        return new Promise<void>((pResolve) => {
            // Wait for transition to end.
            globalThis.setTimeout(() => {
                // Remove 
                this.splashscreenState.append = false;

                // Resolve promise after remove.
                pResolve();
            }, this.splashscreenConfig.animationTime);
        });
    }

    /**
     * Get splashscreen content.
     * 
     * @returns Cached splashscreen content.
     */
    public getSplacescreenContent(): PwbTemplate {
        return this.splashscreenConfig.content;
    }

    /**
     * Remove splashscreen on component connect to a document when any component is updated.
     */
    public onConnect(): void {
        // Skip any automatic handling when manual is set up.
        if (this.splashscreenConfig.manual) {
            return;
        }

        // Remove splashscreen when any component was updated.
        this.mUpdateHandler.update().then(() => {
            this.removeSplashScreen();
        });
    }

    /**
     * Add splashscreen to document when element was moved/reappend to document.
     */
    public onDisconnect(): void {
        this.splashscreenState.hide = false;
        this.splashscreenState.append = true;
    }
}

type SplashscreenState = {
    hide: boolean;
    append: boolean;
};

type SplashscreenConfiguration = {
    background: string,
    content: PwbTemplate;
    manual: boolean;
    animationTime: number;
};