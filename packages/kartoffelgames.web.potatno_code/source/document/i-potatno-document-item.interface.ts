import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoDocumentValidationResult } from './potatno-document-validation-result.ts';
import type { PotatnoDocument } from './potatno-document.ts';

/**
 * General potatno document item.
 */
export interface IPotatnoDocumentItem<TProjectTypes extends PotatnoProjectTypesDefinition> {
    /**
     * Unique identifier of the node definition this item was created from.
     * Used to resolve the definition.
     */
    readonly definitionId: string;

    /**
     * Display label for this item.
     * Usually set be the user.
     */
    label: string;

    /**
     * The project this item belongs to, used for resolving definitions and types.
     */
    readonly project: PotatnoProject<TProjectTypes>;

    /**
     * The document this item belongs to, used for resolving other items and definitions within the same document.
     */
    readonly document: PotatnoDocument<TProjectTypes>;

    /**
     * Validation function of the item.
     */
    validate(): PotatnoDocumentValidationResult<TProjectTypes>;
}
