import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from '../general/pgsl-type-declaration-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../statement/pgsl-block-statement-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslFunctionDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslFunctionDeclarationSyntaxTreeStructureData> {
    private readonly mBlock: PgslBlockStatementSyntaxTree;
    private readonly mConstant: boolean;
    private readonly mName: string;
    private readonly mParameter: Array<PgslFunctionDeclarationParameter>;
    private readonly mReturnType: PgslTypeDeclarationSyntaxTree;
    
    /**
     * Function block.
     */
    public get block(): PgslBlockStatementSyntaxTree {
        return this.mBlock;
    }

    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Function parameter list.
     */
    public get parameter(): Array<PgslFunctionDeclarationParameter> {
        return [...this.mParameter];
    }

    /**
     * Function return type.
     */
    public get returnType(): PgslTypeDeclarationSyntaxTree {
        return this.mReturnType;
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
     * @param pConstant - Function is a constant function.
     */
    public constructor(pData: PgslFunctionDeclarationSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number, pBuildIn: boolean = false, pConstant: boolean = false) {
        super(pData, pData.attributes, pStartColumn, pStartLine, pEndColumn, pEndLine, pBuildIn);

        // Set data.
        this.mConstant = pConstant;
        this.mBlock = pData.block;
        this.mName = pData.name;
        this.mParameter = pData.parameter;
        this.mReturnType = pData.returnType;
    }

    /**
     * Determinate if declaration is a constant.
     */
    protected determinateIsConstant(): boolean {
        return this.mConstant;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Not really something to validate.
    }
}

type PgslFunctionDeclarationParameter = {
    readonly type: PgslTypeDeclarationSyntaxTree;
    readonly name: string;
};

export type PgslFunctionDeclarationSyntaxTreeStructureData = {
    attributes: PgslAttributeListSyntaxTree;
    name: string;
    parameter: Array<PgslFunctionDeclarationParameter>;
    returnType: PgslTypeDeclarationSyntaxTree;
    block: PgslBlockStatementSyntaxTree;
};