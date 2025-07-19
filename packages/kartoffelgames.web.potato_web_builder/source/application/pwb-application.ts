import { InteractionZone } from '@kartoffelgames/web-interaction-zone';
import { type ComponentInformationData, ComponentRegister } from '../core/component/component-register.ts';
import type { Component } from '../core/component/component.ts';
import type { Processor } from '../core/core_entity/processor.ts';
import { PwbApplicationConfiguration } from './pwb-application-configuration.ts';

export class PwbApplication {
    public static readonly CONFIGURATION_ATTACHMENT: symbol = Symbol('PwbApplicationConfigurationAttachment');

    /**
     * Create a new applications.
     * 
     * @param pName - Application name.
     * @param pCallback - Callback function that is executed withing the application context.
     * @param pTarget - Target element to append the application to. If not set, the application is not appended.
     */
    public static new(pName: string, pCallback: (pApplication: PwbApplication) => void, pTarget?: Element): void {
        // Create a new application configuration.
        const lDefaultApplicationConfiguration: PwbApplicationConfiguration = new PwbApplicationConfiguration();

        // Create application with the default configuration.
        const lApplication: PwbApplication = new PwbApplication(pName, lDefaultApplicationConfiguration);

        // Execute callback with the application as parameter.
        pCallback(lApplication);

        // If set, append the application to the target element.
        if (pTarget) {
            lApplication.appendTo(pTarget);
        }
    }

    private readonly mConfiguration: PwbApplicationConfiguration;
    private readonly mContent: Array<Component>;
    private readonly mElement: HTMLElement;
    private readonly mInteractionZone: InteractionZone;

    /**
     * Get application configuration.
     */
    public get configuration(): PwbApplicationConfiguration {
        return this.mConfiguration;
    }

    /**
     * Constructor.
     * Create a new application.
     * 
     * @param pName - Application name. 
     */
    private constructor(pName: string, pConfiguration: PwbApplicationConfiguration) {
        // Create interaction zone of app component and attach the configuration to it.
        this.mInteractionZone = InteractionZone.current.create(`App-${pName}`, { isolate: true });
        this.mInteractionZone.attachment(PwbApplication.CONFIGURATION_ATTACHMENT, pConfiguration);

        // Create new application configuration.
        this.mConfiguration = pConfiguration;

        // Create list of all content.
        this.mContent = new Array<Component>();

        // Create a own div with shadow root for this applications.
        this.mElement = document.createElement('div');
        this.mElement.attachShadow({ mode: 'open' });
    }

    /**
     * Append content to app.
     * Component is constructed asynchron after beeing append with {@link appendTo}.
     * 
     * @param pContentConstructor - Content constructor.
     */
    public addContent(pContentConstructor: typeof Processor): void {
        // Get component html constructor from class.
        const lComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(pContentConstructor).elementConstructor;

        // Create component inside applications interaction zone.
        this.mInteractionZone.execute(() => {
            // Read component manager from component element.
            const lComponentInformation: ComponentInformationData = ComponentRegister.ofElement(new lComponentConstructor());

            // Add component to content list.
            this.mContent.push(lComponentInformation.component);

            // Append component to shadow root.
            this.mElement.shadowRoot!.appendChild(lComponentInformation.element);
        });
    }

    /**
     * Add error listener that listens for any uncatched error.
     * Prevent error defaults like print on console when {@link pListener} return the actual value false.
     * 
     * @param pListener - Error listener.
     */
    public addErrorListener(pListener: PwbApplicationErrorListener): void {
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
        // Create style element.
        const lStyleElement: HTMLStyleElement = document.createElement('style');
        lStyleElement.textContent = pStyle;

        // Add style element to shadow root.
        this.mElement.shadowRoot!.prepend(lStyleElement);
    }

    /**
     * Appends this application to an element.
     * 
     * @param pElement - Element.
     */
    public appendTo(pElement: Element): void {
        // Append app element to specified element.
        pElement.appendChild(this.mElement);
    }
}

export type PwbApplicationErrorListener = (pError: any) => void | boolean;