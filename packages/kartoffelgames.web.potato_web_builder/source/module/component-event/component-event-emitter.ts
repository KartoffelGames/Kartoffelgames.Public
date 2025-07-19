import { ComponentEvent } from './component-event.ts';

/**
 * Event emitter.
 * Use in combination with {@link HtmlComponentEvent}.
 */
export class ComponentEventEmitter<T> {
    private readonly mElement: HTMLElement;
    private readonly mEventName: string;

    /**
     * Constructor.
     * Custom event emmiter for html elements.
     * @param pEventName - Event name.
     * @param pHtmlElement - Html element of emmiter.
     */
    constructor(pEventName: string, pHtmlElement: HTMLElement) {
        this.mEventName = pEventName;
        this.mElement = pHtmlElement;
    }

    /**
     * Call all event listener with event arguments.
     * @param pEventArgs - Event arguments.
     */
    public dispatchEvent(pEventArgs: T): void {
        // Create and dispatch event.
        const lEvent: ComponentEvent<T> = new ComponentEvent<T>(this.mEventName, pEventArgs);
        this.mElement.dispatchEvent(lEvent);
    }
}