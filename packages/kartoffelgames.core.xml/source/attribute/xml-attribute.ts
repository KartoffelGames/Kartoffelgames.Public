import { List } from '@kartoffelgames/core';
import type { XmlElement } from '../node/xml-element.ts';

/**
 * Xml attribute. Can handle values with lists or string.
 */
export class XmlAttribute {
    private readonly mName: string;
    private readonly mNamespacePrefix: string | null;
    private readonly mSeperator: string;
    private readonly mValues: List<string>;
    private mXmlElement: XmlElement | null;

    /**
     * Get attribute name without namespace prefix.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Namespace.
     */
    public get namespace(): string | null {
        // Check if attribute is append and has an prefix.
        if (this.xmlElement && this.namespacePrefix) {
            return this.xmlElement.getNamespace(this.namespacePrefix);
        }

        // Default namespace is allways null.
        return null;
    }

    /**
     * Namespace key of attribute.
     */
    public get namespacePrefix(): string | null {
        return this.mNamespacePrefix;
    }

    /**
     * Get attribute name with namespace prefix.
     */
    public get qualifiedName(): string {
        if (this.mNamespacePrefix) {
            return `${this.mNamespacePrefix}:${this.mName}`;
        } else {
            return this.mName;
        }
    }

    /**
     * Seperator values get joined.
     */
    public get seperator(): string {
        return this.mSeperator;
    }

    /**
     * Get value list as string.
     */
    public get value(): string {
        return this.mValues.join(this.mSeperator);
    }

    /**
     * Set value list as string.
     */
    public set value(pValue: string) {
        // Clear list.
        this.mValues.splice(0, this.mValues.length);

        // Split with seperator and add to value list.
        this.mValues.push(...pValue.split(this.mSeperator));
    }

    /**
     * Get value list.
     */
    public get valueList(): Array<string> {
        return this.mValues.clone();
    }

    /**
     * Xml element of attribute.
     */
    public get xmlElement(): XmlElement | null {
        return this.mXmlElement;
    }

    /**
     * Xml element of attribute.
     */
    public set xmlElement(pXmlElement: XmlElement | null) {
        this.mXmlElement = pXmlElement;
    }

    /**
     * Constructor.
     * Create list attribute with name and optional custom value seperator.
     * @param pName - Name of attribute.
     * @param pNamespacePrefix - Namespace prefix of attribute name.
     * @param pSeperator - Seperator values get joined.
     */
    public constructor(pName: string);
    public constructor(pName: string, pNamespacePrefix: string | null);
    public constructor(pName: string, pNamespacePrefix: string | null, pSeperator: string);
    public constructor(pName: string, pNamespacePrefix: string | null = null, pSeperator: string = ' ') {
        this.mValues = new List<string>();
        this.mName = pName;
        this.mSeperator = pSeperator;
        this.mNamespacePrefix = pNamespacePrefix;
        this.mXmlElement = null;
    }
}