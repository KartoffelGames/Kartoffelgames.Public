import { Exception } from 'packages/kartoffelgames.core/library/source';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';
import { PgslStructPropertyDeclarationSyntaxTree } from './pgsl-struct-property-declaration-syntax-tree';

/**
 * PGSL syntax tree for a struct declaration.
 */
export class PgslStructDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslStructDeclarationSyntaxTreeStructureData> {
    private readonly mName: string;
    private readonly mProperties: Array<PgslStructPropertyDeclarationSyntaxTree>;
    
    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Variable name.
     */
    public get properties(): Array<PgslStructPropertyDeclarationSyntaxTree> {
        return this.mProperties;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslStructDeclarationSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pData.attributes, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mName = pData.name;
        this.mProperties = pData.properties;
    }

    /**
     * Determinate if declaration is a constant.
     */
    protected determinateIsConstant(): boolean {
        return true;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Type validation is in property syntax tree.

        // Only types with fixed footprints.
        // Only last property is allowed to be variable but then the struct is no longer fixed.
        for(let lIndex: number = 0; lIndex < this.mProperties.length; lIndex++){
            // Skip last property. 
            if(lIndex === (this.mProperties.length - 1)) {
                break;
            }

            // Validate if properties dont have fixed length.
            if(!this.mProperties[lIndex].type.isFixed) {
                throw new Exception('Only the last property of a struct can have a variable length.', this);
            }
        }
    }
}

export type PgslStructDeclarationSyntaxTreeStructureData = {
    attributes: PgslAttributeListSyntaxTree;
    name: string;
    properties: Array<PgslStructPropertyDeclarationSyntaxTree>;
};