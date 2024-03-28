import { PwbTemplateXmlNode } from './template/nodes/pwb-template-xml-node';

/**
 * Static element creator.
 * Bundles all html element creations.
 * 
 * @internal
 */
export class ElementCreator {
    /**
     * Create comment node with set text.
     * @param pText - Comment text.
     * 
     * @returns XML-Comment with provided text.
     */
    public static createComment(pText: string): Comment {
        return document.createComment(pText);
    }

    /**
     * Create new html element.
     * When the element is a custom element, it invokes the custom element constructor instead of an unknown html element.
     * 
     * Ignores all attribute and expression informations and only uses the tagname information.
     * 
     * @param pXmlElement - Xml content node.
     */
    public static createElement(pXmlElement: PwbTemplateXmlNode): Element {
        const lTagname: string = pXmlElement.tagName;

        if(typeof lTagname !== 'string') {
            throw lTagname;
        }

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
     * Create html text node.
     * @param pText - Text.
     * 
     * @returns text node with specified text.
     */
    public static createText(pText: string): Text {
        return document.createTextNode(pText);
    }
}