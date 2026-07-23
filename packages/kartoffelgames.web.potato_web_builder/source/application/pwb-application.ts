import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { InteractionZone } from '@kartoffelgames/core-interaction-zone';
import { type ComponentInformationData, ComponentRegister } from '../core/component/component-register.ts';
import { Component, type ComponentProcessor, type ComponentProcessorConstructor } from '../core/component/component.ts';
import { ComponentZoneInjection } from '../core/component/component-zone-injection.ts';
import { CoreEntityUpdateError } from '../core/core_entity/updater/core-entity-update-error.ts';

/**
 * Application class that bundles multiple components together and serves as a root for the component tree.
 * Capsulates the component tree into a own shadow root to apply global styles and prevent style penetration from outside.
 */
export class PwbApplication {
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

    private readonly mComponentZoneInjection: ComponentZoneInjection;
    private readonly mContent: Array<Component>;
    private mCurrentTarget: Element | null;
    private readonly mErrorListener: Array<PwbApplicationErrorListener>;
    private readonly mFragment: DocumentFragment;
    private readonly mInteractionZone: InteractionZone;

    /**
     * Constructor.
     * Create a new application.
     */
    protected constructor() {
        // Create list of all content.
        this.mContent = new Array<Component>();

        // Create a fragment for all content.
        this.mFragment = document.createDocumentFragment();

        // Current target is not set.
        this.mCurrentTarget = null;

        // Create empty error listener list.
        this.mErrorListener = new Array<PwbApplicationErrorListener>();

        // Create the applications root interaction zone. Components are constructed within this zone so their
        // update zones share it as a common ancestor and their errors can be attributed to this application.
        this.mInteractionZone = InteractionZone.create('PwbApplication');

        // Create the component injection object and attach it to the applications zone so every component created
        // within this application reads its injections from it.
        this.mComponentZoneInjection = new ComponentZoneInjection();
        this.mInteractionZone.setAttachment(Component.COMPONENT_INJECTION_ATTACHMENT_KEY, this.mComponentZoneInjection);

        // Permanently listen on global errors to handle any error originating from this applications zone.
        globalThis.addEventListener('error', (pEvent: ErrorEvent): void => {
            this.handleZoneError(pEvent, pEvent.error);
        });
        globalThis.addEventListener('unhandledrejection', (pEvent: PromiseRejectionEvent): void => {
            this.handleZoneError(pEvent, pEvent.reason);
        });
    }

    /**
     * Append content to app.
     * Component is constructed asynchron after beeing append with {@link appendTo}.
     *
     * @param pContentConstructor - Content constructor.
     *
     * @returns processor of the created component.
     */
    public addContent<TComponent extends ComponentProcessor>(pContentConstructor: ComponentProcessorConstructor<TComponent>): TComponent {
        // Get component html constructor from class.
        const lComponentConstructor: CustomElementConstructor = ComponentRegister.ofConstructor(pContentConstructor).elementConstructor;

        // Construct the component inside the applications interaction zone so its update zone becomes a
        // descendant of the application zone.
        const lComponentInformation: ComponentInformationData = this.mInteractionZone.execute(() => {
            return ComponentRegister.ofElement(new lComponentConstructor());
        });

        // Add component to content list.
        this.mContent.push(lComponentInformation.component);

        // Append component to shadow root.
        this.mFragment.appendChild(lComponentInformation.element);
        this.updateTarget();

        // Return processor of component.
        return lComponentInformation.processor as TComponent;
    }

    /**
     * Add a listener that is called with any error originating from this applications component tree.
     * A listener can return true to prevent the error from being written to the console.
     *
     * @param pListener - Error listener.
     */
    public addErrorListener(pListener: PwbApplicationErrorListener): void {
        // Remove any potential dublicate listener.
        if (this.mErrorListener.includes(pListener)) {
            this.removeErrorListener(pListener);
        }

        // Add listener to list.
        this.mErrorListener.push(pListener);
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
        this.mFragment.prepend(lStyleElement);
    }

    /**
     * Appends this application to an element.
     *
     * @param pElement - Element.
     */
    public appendTo(pElement: Element): void {
        // Set target and update with current content.
        this.mCurrentTarget = pElement;
        this.updateTarget();
    }

    /**
     * Remove an error listener.
     *
     * @param pListener - Error listener.
     */
    public removeErrorListener(pListener: PwbApplicationErrorListener): void {
        // Try to get the current listener index.
        const lListenerIndex: number = this.mErrorListener.indexOf(pListener);
        if (lListenerIndex === -1) {
            return;
        }

        // Remove listener from list.
        this.mErrorListener.splice(lListenerIndex, 1);
    }

    /**
     * Add an injection that is provided to every component created within this application.
     *
     * @param pInjectionTarget - Injection type.
     * @param pInjectionValue - Actual injected value in replacement for {@link pInjectionTarget}.
     */
    public setInjection(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void {
        // Add injection to the applications component zone injection.
        this.mComponentZoneInjection.setInjection(pInjectionTarget, pInjectionValue);
    }

    /**
     * Handle an error read from a global error event.
     * Errors originating from this applications zone are dispatched to all registered listeners and written
     * to the console unless a listener returns true to suppress it.
     *
     * @param pEvent - Global error event.
     * @param pError - Error read from the event.
     */
    private handleZoneError(pEvent: Event, pError: unknown): void {
        // Only handle errors wrapped by the update cycle.
        if (!(pError instanceof CoreEntityUpdateError)) {
            return;
        }

        // Only handle errors that originate from this applications interaction zone hierarchy.
        if (!this.zoneBelongsToApplication(pError.zone)) {
            return;
        }

        // Take over the default error handling for this error.
        pEvent.preventDefault();

        // Dispatch the original error to all registered listeners. A listener can return true to suppress
        // the default console output.
        let lSuppressConsoleOutput: boolean = false;
        for (const lListener of this.mErrorListener) {
            if (lListener(pError.cause) === true) {
                lSuppressConsoleOutput = true;
            }
        }

        // Output the error to the console unless a listener suppressed it.
        if (!lSuppressConsoleOutput) {
            // eslint-disable-next-line no-console
            console.error(pError.cause);
        }
    }

    /**
     * Update targets content by appending a shadow root and reappending the content fragment.
     */
    private updateTarget(): void {
        if (!this.mCurrentTarget) {
            return;
        }

        // Check if target has a shadow root. Attach one if not.
        if (!this.mCurrentTarget.shadowRoot) {
            this.mCurrentTarget.attachShadow({ mode: 'open' });
        }

        // Update content by reappending the fragment.
        this.mCurrentTarget.shadowRoot!.appendChild(this.mFragment);
    }

    /**
     * Check if a zone is this applications zone or a descendant of it.
     *
     * @param pZone - Zone to check.
     *
     * @returns true when the zone belongs to this application.
     */
    private zoneBelongsToApplication(pZone: InteractionZone): boolean {
        // Walk the zone hierarchy upwards until the applications zone is found.
        let lZone: InteractionZone | null = pZone;
        while (lZone !== null) {
            if (lZone === this.mInteractionZone) {
                return true;
            }

            lZone = lZone.parent;
        }

        // The applications zone is not part of the hierarchy.
        return false;
    }
}

/**
 * Listener called with an error originating from a {@link PwbApplication}s component tree.
 * Return true to prevent the error from being written to the console.
 */
export type PwbApplicationErrorListener = (pError: unknown) => boolean | void;
