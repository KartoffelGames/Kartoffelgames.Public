import type { PotatnoProject } from '../project/potatno-project.ts';

export interface IPotatnoDocumentItem<TProject extends PotatnoProject<any>> {
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
    readonly project: TProject;
}
