import { IVoidParameterConstructor } from '@kartoffelgames/core';
import { CommentNode } from '../node/comment-node.ts';
import { TextNode } from '../node/text-node.ts';
import { XmlElement } from '../node/xml-element.ts';
import { BaseXmlParser } from './base-xml-parser.ts';

export class XmlParser extends BaseXmlParser {
    /**
     * Get Comment node constructor.
     */
    protected getCommentNodeConstructor(): IVoidParameterConstructor<CommentNode> {
        return CommentNode;
    }

    /**
     * Get documents default namespace.
     */
    protected getDefaultNamespace(): string {
        return 'http://www.w3.org/1999/xhtml';
    }

    /**
     * Get Text node constructor.
     */
    protected getTextNodeConstructor(): IVoidParameterConstructor<TextNode> {
        return TextNode;
    }

    /**
     * Get XML Element constructor.
     */
    protected getXmlElementConstructor(): IVoidParameterConstructor<XmlElement> {
        return XmlElement;
    }
}