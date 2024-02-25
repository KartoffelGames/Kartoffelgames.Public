import { XmlParser } from '@kartoffelgames/core.xml';

/**
 * XML parser for parsing template strings.
 */
export class TemplateParser extends XmlParser {
    /**
     * Constructor.
     * Set new setting for parsing attributes with special characters and remove comments.
     */
    public constructor() {
        super();

        // Attribute name with everything.
        this.allowedAttributeCharacters = 'abcdefghijklmnopqrstuvwxyz_:-.1234567890*[]()$§%&?#';

        // Remove user comments.
        this.removeComments = true;

        // TODO: Add new multiplicator node.
    }
}