import { type ComponentInformationData, ComponentRegister } from '../core/component/component-register.ts';
import type { Component, ComponentProcessor, ComponentProcessorConstructor } from '../core/component/component.ts';

/**
 * Application class that bundles multiple components together and serves as a root for the component tree.
 * Capsulates the component tree into a own shadow root to apply global styles and prevent style penetration from outside.
 */
export class PwbApplication {
    public static readonly CONFIGURATION_ATTACHMENT: symbol = Symbol('PwbApplicationConfigurationAttachment');

    /**
     * Create a new applications.
     * 
     * @param pCallback - Callback function that is executed withing the application context.
     * @param pTarget - Target element to append the application to. If not set, the application is not appended.
     */
    public static new(pCallback: (pApplication: PwbApplication) => void, pTarget?: Element): void {
        // Create application with the default configuration.
        const lApplication: PwbApplication = new PwbApplication();

        // Execute callback with the application as parameter.
        pCallback(lApplication);

        // If set, append the application to the target element.
        if (pTarget) {
            lApplication.appendTo(pTarget);
        }
    }

    private readonly mContent: Array<Component>;
    private readonly mElement: HTMLElement;

    /**
     * Constructor.
     * Create a new application.
     * 
     * @param pConfiguration - Application configuration.
     */
    protected constructor() {
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
    public addContent<TComponent extends ComponentProcessor>(pContentConstructor: ComponentProcessorConstructor<TComponent>): TComponent {
        // Get component html constructor from class.
        const lComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(pContentConstructor).elementConstructor;

        // Read component manager from component element.
        const lComponentInformation: ComponentInformationData = ComponentRegister.ofElement(new lComponentConstructor());

        // Add component to content list.
        this.mContent.push(lComponentInformation.component);

        // Append component to shadow root.
        this.mElement.shadowRoot!.appendChild(lComponentInformation.element);

        // Return processor of component.
        return lComponentInformation.processor as TComponent;
    }

    /**
     * Inserts css sttyles into a new created {@link HTMLStyleElement} and prepend it to this app.
     * This styles are global available but cant penetrate components shadow root barier.
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