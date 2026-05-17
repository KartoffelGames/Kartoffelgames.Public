import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import { PotatnoCodeGeneratorResult } from './potatno-code-generator-result.ts';

/**
 * Code generation result for a full-function build.
 *
 * Aggregates one Graph per exit node in the owning function.
 * Returned by generateFunctionCode and by the recursive function-call resolution inside the inner walk.
 *
 * Adds no fields of its own. The base class does all the heavy lifting.
 * The subclass exists so callers can distinguish a full result from a single-graph intermediate result via instanceof.
 */
export class PotatnoCodeGeneratorFunctionResult<TProject extends PotatnoProject> extends PotatnoCodeGeneratorResult<TProject> {
    /**
     * Constructor.
     *
     * @param pFunction - The document function the result represents.
     */
    public constructor(pFunction: PotatnoDocumentFunction<TProject>) {
        super(pFunction);
    }
}
