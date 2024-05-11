import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { PwbTemplate } from '../../component/template/nodes/pwb-template';
import { PwbComponent } from '../../decorator/pwb-component.decorator';
import { PwbExport } from '../../default/export/pwb-export.decorator';
import { ComponentProcessorConstructor } from '../../interface/component.interface';
import pwbAppStyle from './pwb-app-component.css';
import pwbAppTemplate from './pwb-app-component.html';
import { Exception } from '@kartoffelgames/core.data';
import { PwbTemplateXmlNode } from '../../component/template/nodes/pwb-template-xml-node';


@PwbComponent({
    selector: 'pwb-app',
    style: pwbAppStyle,
    template: pwbAppTemplate
})
export class PwbAppComponent{
    public splashscreenConfig: SplashscreenConfiguration;
    public splashscreenState: SplashscreenState;

    public styleList: Array<string>;

    private readonly mContent: PwbTemplate;

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
    constructor() {
        this.mContent = new PwbTemplate();

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

    // TODO: Add "OnComponentConnected" "OnComponentDisconnected" listeners that adds and removes splashscreen.
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