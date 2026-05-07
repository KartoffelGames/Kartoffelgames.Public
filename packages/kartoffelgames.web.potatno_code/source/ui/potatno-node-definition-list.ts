import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoNodeDefinition } from '../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';

/**
 * Project shape accepted by UI components that read Potatno project metadata.
 */
export type PotatnoUiProject = PotatnoProject<PotatnoProjectTypesDefinition<string>>;

/**
 * Display and insertion data for one available node definition.
 */
export type PotatnoNodeDefinitionListEntry<TProject extends PotatnoUiProject> = {
    readonly category: string;
    readonly definition: PotatnoNodeDefinition<TProject>;
    readonly id: string;
    readonly name: string;
};

/**
 * Build the available node definition list for a function from project, document,
 * function-specific, and enabled import definitions.
 *
 * @param pActiveFunction - Function whose node library context should be read.
 *
 * @returns Ordered node definition entries available to the function.
 */
export function buildAvailableNodeDefinitionEntries<TProject extends PotatnoUiProject>(pActiveFunction: PotatnoDocumentFunction<TProject> | null): Array<PotatnoNodeDefinitionListEntry<TProject>> {
    const lEntries: Array<PotatnoNodeDefinitionListEntry<TProject>> = [];
    const lAddedIds: Set<string> = new Set<string>();

    if (!pActiveFunction) {
        return lEntries;
    }

    /**
     * Add a definition if it was not already listed by an earlier source.
     *
     * @param pDefinition - Definition to add to the result list.
     */
    const addDefinition = (pDefinition: PotatnoNodeDefinition<TProject>): void => {
        if (lAddedIds.has(pDefinition.id)) {
            return;
        }

        lAddedIds.add(pDefinition.id);
        lEntries.push({
            category: pDefinition.category,
            definition: pDefinition,
            id: pDefinition.id,
            name: pDefinition.label
        });
    };

    for (const lDefinition of pActiveFunction.project.nodeDefinitions) {
        addDefinition(lDefinition);
    }

    for (const lDefinition of pActiveFunction.nodeDefinitions) {
        addDefinition(lDefinition);
    }

    const lEnabledImports: Set<string> = new Set<string>(pActiveFunction.imports);
    for (const lImport of pActiveFunction.project.imports) {
        if (!lEnabledImports.has(lImport.label)) {
            continue;
        }

        for (const lDefinition of lImport.nodes) {
            addDefinition(lDefinition);
        }
    }

    return lEntries;
}
