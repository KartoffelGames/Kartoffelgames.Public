/**
 * Coponent event.
 */
// Must be extended from window.Event to be compatible with the mocked test event system.
export class ComponentEvent<T> extends window.Event {
    private readonly mValue: T;

    /**
     * Event value.
     */
    public get value(): T {
        return this.mValue;
    }

    /**
     * Pwb custom event constructor.
     * @param pEventName - Event name.
     * @param pValue - Event value.
     */
    constructor(pEventName: string, pValue: T){
        super(pEventName);
        this.mValue = pValue;
    }
}