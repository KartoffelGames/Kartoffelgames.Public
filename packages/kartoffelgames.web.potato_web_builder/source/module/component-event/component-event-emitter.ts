import { InjectionConstructor } from "@kartoffelgames/core-dependency-injection";

/**
 * Event emitter.
 * Use in combination with {@link HtmlComponentEvent}.
 */
export class ComponentEventEmitter<T> {
    private readonly mElement: HTMLElement;
    private readonly mEventName: string;
    private mEventConstructor: InjectionConstructor<IComponentEvent<T>> | null;

    /**
     * Constructor.
     * Custom event emmiter for html elements.
     * @param pEventName - Event name.
     * @param pHtmlElement - Html element of emmiter.
     */
    constructor(pEventName: string, pHtmlElement: HTMLElement) {
        this.mEventName = pEventName;
        this.mElement = pHtmlElement;
        this.mEventConstructor = null;
    }

    /**
     * Call all event listener with event arguments.
     * @param pEventArgs - Event arguments.
     */
    public dispatchEvent(pEventArgs: T): void { // TODO: Reset this
        // Check if event constructor is valid in the current configuration.
        if (!(this.mEventConstructor?.prototype instanceof Event)) {
            // Create new event constructor with the new scope.
            this.mEventConstructor = class extends Event {
                public readonly value: T;
                constructor(pEventName: string, pValue: T) {
                    super(pEventName);
                    this.value = pValue;
                }
            };
        }

        // Create and dispatch event.
        const lEvent: IComponentEvent<T> = new this.mEventConstructor(this.mEventName, pEventArgs);
        this.mElement.dispatchEvent(lEvent);
    }
}

export interface IComponentEvent<T> extends Event {
    readonly value: T;
}