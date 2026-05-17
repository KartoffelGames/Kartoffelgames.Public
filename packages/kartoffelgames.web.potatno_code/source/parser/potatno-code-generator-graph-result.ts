import { Exception } from '@kartoffelgames/core';
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoCodeGeneratorResult } from './potatno-code-generator-result.ts';

/**
 * Code generation result for a single-graph intermediate build.
 *
 * Carries the generation restraint that this result was anchored to a specific exit node, exposed via the generatedNode getter.
 * Returned by generateNodeGraphCode and the inner generateNodeCodeWithDependencies.
 */
export class PotatnoCodeGeneratorGraphResult<TProject extends PotatnoProject> extends PotatnoCodeGeneratorResult<TProject> {
    /**
     * The node passed in that triggered this graph generation.
     * Get from the single contained graph for caller convenience.
     */
    public get generatedNode(): PotatnoDocumentNode<TProject> {
        const lGraph = this.graphs.at(-1);
        if (!lGraph) {
            throw new Exception('Graph result has no graphs and cannot determine generatedNode.', this);
        }
        
        return lGraph.generatedNode;
    }

    /**
     * Constructor.
     *
     * @param pFunction - The owning document function.
     */
    public constructor(pFunction: PotatnoDocumentFunction<TProject>) {
        super(pFunction);
    }
}
