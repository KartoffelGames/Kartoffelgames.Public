import { XmlElement } from '@kartoffelgames/core.xml';

/**
 * Multiplicator node.
 * 
 * Implied syntax for templates are:
 * ``` XML
 * [SingleType attribute="" attribute2="" /]
 * 
 * [MultiType attribute="" attribute2=""]
 *  <MoreContent />
 * [/MultiType]
 * ```
 */
export class MultiplicatorNode extends XmlElement {
    /**
     * Get namespace prefix of xml node.
     * Does allways return null and does nothing on set.
     */
    public override get namespacePrefix(): string | null {
        return null;
    } override set namespacePrefix(_pNamespacePrefix: string | null) {
        // Does nothing.
    }

    /**
     * Namespaces not supported for this xml element.
     * Does allways return parent namespace or null when no parent is provided.
     */
    public override getNamespace(_pPrefix: string | null = null): string | null {
        return this.parent?.defaultNamespace ?? null;
    }
}