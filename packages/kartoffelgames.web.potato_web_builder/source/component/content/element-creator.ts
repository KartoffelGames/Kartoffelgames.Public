import { PwbTemplateXmlNode } from '../template/nodes/pwb-template-xml-node';

export class ElementCreator {
    /**
     * Create comment node.
     * @param pText - Comment text.
     * @returns comment with text as content.
     */
    public static createComment(pText: string): Comment {
        return document.createComment(pText);
    }

    /**
     * Create element with correct namespace.
     * Ignores namespace information for custom elements.
     * @param pXmlElement - Xml content node.
     */
    public static createElement(pXmlElement: PwbTemplateXmlNode): Element {
        const lTagname: string = pXmlElement.tagName;

        // On custom element
        if (lTagname.includes('-')) {
            // Get custom element.
            const lCustomElement: any = window.customElements.get(lTagname);

            // Create custom element.
            if (typeof lCustomElement !== 'undefined') {
                return new lCustomElement();
            }
        }

        return document.createElement(lTagname);
    }

    /**
     * Create text node.
     * @param pText - Text.
     * @returns text node with specified text.
     */
    public static createText(pText: string): Text {
        return document.createTextNode(pText);
    }
}