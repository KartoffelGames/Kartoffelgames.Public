import { Injection, type InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { ComponentRegister } from '../../core/component/component-register.ts';
import { Component, type ComponentProcessorConstructor, type IComponentOnConnect, type IComponentOnDisconnect } from '../../core/component/component.ts';
import { PwbComponent } from '../../core/component/pwb-component.decorator.ts';
import { PwbTemplateXmlNode } from '../../core/component/template/nodes/pwb-template-xml-node.ts';
import { PwbTemplate } from '../../core/component/template/nodes/pwb-template.ts';
import { Processor } from '../../core/core_entity/processor.ts';
import { PwbExport } from '../../module/export/pwb-export.decorator.ts';

@PwbComponent({
    selector: 'pwb-app',
    style: `
        :host {
            display: block;
            width: 100%;
            height: 100%;
        }

        .splashscreen {
            position: absolute;
            display: grid;
            align-content: center;
            width: 100%;
            height: 100%;
            opacity: 1;
            background: var(--background, blue);
        }

        .splashscreen.hide {
            opacity: 0;
            transition: var(--transition-time-ms, 1000ms) linear;
        }

        .splashscreen__content {
            width: fit-content;
            height: fit-content;
            margin: 0 auto;
        }`,
    template: `
        <!-- Additional styles -->
        $for(styleText of this.styleList) {
            <style>{{this.styleText}}</style>
        }

        <!-- Splashscreen -->
        $if(this.splashscreenState.append) {
            <div class="splashscreen {{this.splashscreenState.hide ? 'hide' : ''}}" style="--transition-time-ms: {{this.splashscreenConfig.animationTime}}ms; --background: {{this.splashscreenConfig.background}}">
                <div class="splashscreen__content">
                    $dynamic-content(this.splashscreenConfig.content)
                </div>
            </div>
        }

        <!-- Actual content -->
        <div>
            $dynamic-content(this.content)
        </div>`,
})
export class PwbAppComponent extends Processor implements IComponentOnConnect, IComponentOnDisconnect {
    // Used in view.
    public splashscreenConfig: SplashscreenConfiguration;
    public splashscreenState: SplashscreenState;
    public styleList: Array<string>;

    // Only internal.
    private readonly mComponent: Component;
    private readonly mContent: PwbTemplate;

    /**
     * Get app content as pwb template.
     */
    @PwbExport get content(): PwbTemplate {
        return this.mContent;
    }

    /**
     * Splashscreen animation time.
     */
    @PwbExport set splashscreenAnimationTime(pMilliseconds: number) {
        this.splashscreenConfig.animationTime = pMilliseconds;
    }

    /**
     * Splashscreen background.
     */
    @PwbExport set splashscreenBackground(pValue: string) {
        this.splashscreenConfig.background = pValue;
    }

    /**
     * Splashscreen content
     */
    @PwbExport set splashscreenContent(pTemplate: PwbTemplate) {
        this.splashscreenConfig.content = pTemplate;
    }

    /**
     * Splashscreen manual mode.
     */
    @PwbExport set splashscreenManualMode(pValue: boolean) {
        this.splashscreenConfig.manual = pValue;
    }

    /**
     * Constructor.
     */
    constructor(pComponent = Injection.use(Component)) {
        super();

        this.mContent = new PwbTemplate();
        this.mComponent = pComponent;

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
        lContentTemplate.tagName = ComponentRegister.ofConstructor(pContentConstructor).selector;

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
            setTimeout(() => {
                // Remove 
                this.splashscreenState.append = false;

                // Resolve promise after remove and update.
                this.mComponent.waitForUpdate().then(() => {
                    pResolve();
                });
            }, this.splashscreenConfig.animationTime);
        });
    }

    /**
     * Remove splashscreen on component connect to a document when any component is updated.
     */
    public onConnect(): void {
        // Skip any automatic handling when manual is set up.
        if (this.splashscreenConfig.manual) {
            return;
        }

        // Start asynchron update.
        this.mComponent.updateAsync();

        // Remove splashscreen when any component was updated.
        this.mComponent.waitForUpdate().then(() => {
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