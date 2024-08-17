import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';
import { PgslTemplateListSyntaxTree, PgslTemplateListSyntaxTreeStructureData } from './pgsl-template-list-syntax-tree';

/**
 * General PGSL syntax tree of a type definition.
 */
export class PgslTypeDefinitionSyntaxTree extends BasePgslSyntaxTree<PgslTypeDefinitionSyntaxTreeStructureData['meta']['type'], PgslTypeDefinitionSyntaxTreeStructureData['data']> {
    private mName: string;
    private mTemplateList: PgslTemplateListSyntaxTree | null;

    /**
     * Name of type.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Template of type.
     */
    public get template(): PgslTemplateListSyntaxTree | null {
        return this.mTemplateList;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('General-TypeDefinition');

        this.mName = 'float';
        this.mTemplateList = null;
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslTypeDefinitionSyntaxTreeStructureData['data']): void {
        // Validate type existance.
        (() => {
            // Alias has no template.
            if (!pData.templateList && this.document.resolveAlias(pData.name)) {
                return;
            }

            // TODO: Read all type aliases and defined type definition names.

            throw new Exception(`Typename "${pData.name}" not defined`, this);
        })();

        // Set type name.
        this.mName = pData.name;

        // Apply template list when available.
        this.mTemplateList = null;
        if (pData.templateList) {
            this.mTemplateList = new PgslTemplateListSyntaxTree().applyDataStructure(pData.templateList, this);
        }
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslTypeDefinitionSyntaxTreeStructureData['data'] {
        // Build data structure with required name.
        const lData: PgslTypeDefinitionSyntaxTreeStructureData['data'] = {
            name: this.mName
        };

        // Retrieve optional template list.
        if (this.mTemplateList) {
            lData.templateList = this.mTemplateList.retrieveDataStructure();
        }

        return lData;
    }
}

export type PgslTypeDefinitionSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'General-TypeDefinition', {
    name: string,
    templateList?: PgslTemplateListSyntaxTreeStructureData;
}>;

export type PgslTemplateListSyntaxTreeData = PgslTypeDefinitionSyntaxTreeStructureData['meta'];

