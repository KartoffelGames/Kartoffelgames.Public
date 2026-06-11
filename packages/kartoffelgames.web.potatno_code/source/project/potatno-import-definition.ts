import type { PotatnoStaticNodeDefinition } from './node_definition/potatno-static-node-definition.ts';
import type { PotatnoProject } from './potatno-project.ts';

/**
 * Definition of an import group.
 * When a function enables this import, the contained node definitions become available in that function's node library.
 */
export class PotatnoImportDefinition<TProject extends PotatnoProject> {
    private readonly mId: string;
    private readonly mLabel: string;
    private readonly mNodes: Array<PotatnoStaticNodeDefinition<TProject>>;

    /**
     * Unique identifier of the import group.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Display label of the import group.
     */
    public get label(): string {
        return this.mLabel;
    }

    /**
     * Node definitions that become available when this import is enabled.
     */
    public get nodes(): ReadonlyArray<PotatnoStaticNodeDefinition<TProject>> {
        return this.mNodes;
    }

    /**
     * Create a new import definition.
     *
     * @param pId - Unique identifier of the import group.
     * @param pLabel - Display label of the import group.
     */
    public constructor(pId: string, pLabel: string) {
        // Init parameter.
        this.mId = pId;
        this.mLabel = pLabel;

        // Initialize empty node definition list.
        this.mNodes = new Array<PotatnoStaticNodeDefinition<TProject>>();
    }

    /**
     * Add a node definition to this import.
     *
     * @param pDefinition - The node definition to add.
     */
    public addNode(pDefinition: PotatnoStaticNodeDefinition<TProject>): void {
        this.mNodes.push(pDefinition);
    }
}
