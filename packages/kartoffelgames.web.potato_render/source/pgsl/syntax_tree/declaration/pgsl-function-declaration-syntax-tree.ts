import { SyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../statement/pgsl-block-statement-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from '../type/pgsl-type-declaration-syntax-tree';
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
     * Function declaration can be used to create constant expressions.
     */
    public get isConstant(): boolean {
        return this.mConstant;
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
    public get returnType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mReturnType.type;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslFunctionDeclarationSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pData.attributes, pMeta, pBuildIn);

        // Set data.
        this.mConstant = pData.constant;
        this.mBlock = pData.block;
        this.mName = pData.name;
        this.mParameter = pData.parameter;
        this.mReturnType = pData.returnType;
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
    constant: boolean;
};