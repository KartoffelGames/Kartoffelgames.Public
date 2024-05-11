import { Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { UpdateHandler } from '../../component/handler/update-handler';
import { PwbTemplate } from '../../component/template/nodes/pwb-template';
import { PwbTemplateXmlNode } from '../../component/template/nodes/pwb-template-xml-node';
import { PwbComponent } from '../../decorator/pwb-component.decorator';
import { PwbExport } from '../../default/export/pwb-export.decorator';
import { ComponentUpdateHandlerReference } from '../../injection/references/component/component-update-handler-reference';
import { ComponentProcessorConstructor, IPwbOnConnect, IPwbOnDisconnect } from '../../interface/component.interface';
import pwbAppStyle from './pwb-app-component.css';
import pwbAppTemplate from './pwb-app-component.html';

@PwbComponent({
    selector: 'pwb-app',
    style: pwbAppStyle,
    template: pwbAppTemplate
})
export class PwbAppComponent implements IPwbOnConnect, IPwbOnDisconnect {
    // Used in view.
    public splashscreenConfig: SplashscreenConfiguration;
    public splashscreenState: SplashscreenState;
    public styleList: Array<string>;

    // Only internal.
    private readonly mContent: PwbTemplate;
    private readonly mUpdateHandler: UpdateHandler;

    /**
     * Splashscreen content
     */
    @PwbExport get splacescreenContent(): PwbTemplate {
        return this.splashscreenConfig.content;
    } set splacescreenContent(pTemplate: PwbTemplate) {
        this.splashscreenConfig.content = pTemplate;
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
        // Validate constructor to be a component constructor. 
        if (!('__component_selector__' in pContentConstructor) || typeof pContentConstructor.__component_selector__ !== 'string') {
            throw new Exception(`Set constructor is not a component constructor.`, this);
        }

        // Create xml template from component class selector.
        const lContentTemplate: PwbTemplateXmlNode = new PwbTemplateXmlNode();
        lContentTemplate.tagName = pContentConstructor.__component_selector__;

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
        this.splashscreenState.hide = true;

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
     * Get app content as pwb template.
     * 
     * @returns template containing all app content.
     */
    public getContent(): PwbTemplate {
        return this.mContent;
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
    public onPwbConnect(): void {
        // Skip any automatic handling when manual is set up.
        if(this.splashscreenConfig.manual) {
            return;
        }

        // Remove splashscreen when any component was updated.
        this.mUpdateHandler.waitForUpdate().then(()=>{
            this.removeSplashScreen();
        });
    }

    /**
     * Add splashscreen to document when element was moved/reappend to document.
     */
    public onPwbDisconnect(): void {
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