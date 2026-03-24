import { PotatnoProjectNodeDefinition } from "./potatno-project.ts";


/**
 * Definition of an import group. When a function enables this import,
 * the contained node definitions become available in that function's node library.
 */
export interface PotatnoImportDefinition {
    /** Display name of the import group. */
    readonly name: string;
    /** Node definitions that become available when this import is enabled. */
    readonly nodes: Array<PotatnoProjectNodeDefinition>;
}
