/**
 * Handles the component element.
 * Creates and attaches a new shadowroot.
 */
export class ElementHandler {
    private readonly mHtmlElement: HTMLElement;
    private readonly mShadowRoot: ShadowRoot;

    /**
     * Get html element.
     */
    public get htmlElement(): HTMLElement {
        return this.mHtmlElement;
    }

    /**
     * Elements shadow root.
     */
    public get shadowRoot(): ShadowRoot {
        return this.mShadowRoot;
    }

    /**
     * Constructor.
     * 
     * @param pHtmlElement - HTMLElement.
     */
    public constructor(pHtmlElement: HTMLElement) {
        this.mHtmlElement = pHtmlElement;
        this.mShadowRoot = this.mHtmlElement.attachShadow({ mode: 'open' });
    }
}