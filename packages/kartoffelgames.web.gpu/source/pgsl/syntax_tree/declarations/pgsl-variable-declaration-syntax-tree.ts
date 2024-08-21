import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { PgslTypeDefinitionSyntaxTree } from '../general/pgsl-type-definition-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslVariableDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslVariableDeclarationSyntaxTreeStructureData> {
    private readonly mAttributeList: PgslAttributeListSyntaxTree | null;
    private readonly mDeclarationType: PgslDeclarationType;
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;
    private readonly mName: string;
    private readonly mType: PgslTypeDefinitionSyntaxTree;

    /**
     * Declaration attributes.
     */
    public get attributes(): PgslAttributeListSyntaxTree | null {
        return this.mAttributeList;
    }

    /**
     * Variable declaration type.
     */
    public get declarationType(): PgslDeclarationType {
        return this.mDeclarationType;
    }

    /**
     * Value initialization expression.
     */
    public get expression(): BasePgslExpressionSyntaxTree | null {
        return this.mExpression;
    }

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Variable type.
     */
    public get type(): PgslTypeDefinitionSyntaxTree {
        return this.mType;
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
    public constructor(pData: PgslVariableDeclarationSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number, pBuildIn: boolean = false) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine, pBuildIn);

        // Create list of all bit operations.
        const lDeclarationTypeList: Array<PgslDeclarationType> = [
            PgslDeclarationType.Const,
            PgslDeclarationType.Storage,
            PgslDeclarationType.Uniform,
            PgslDeclarationType.Workgroup,
            PgslDeclarationType.Private,
            PgslDeclarationType.Param,
        ];

        // Validate.
        if (!lDeclarationTypeList.includes(pData.declarationType as PgslDeclarationType)) {
            throw new Exception(`Declaration type "${pData.declarationType}" can not be used for module scope variable declarations.`, this);
        }

        // Set data.
        this.mType = pData.type;
        this.mName = pData.name;
        this.mDeclarationType = EnumUtil.cast(PgslDeclarationType, pData.declarationType)!;
        this.mAttributeList = null;
        this.mExpression = null;

        // Optional attribute list.
        if (pData.attributeList) {
            this.mAttributeList = pData.attributeList;
        }

        // Optional expression.
        if (pData.expression) {
            this.mExpression = pData.expression;
        }
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Validate if declaration type can store the type.
        // TODO: Validate if declaration type allows any initialization expression. 
        // TODO: Validate if expression fits declaration type.
        // TODO: Validate if declaration is const when it is the expression part should be the same.
    }
}

export type PgslVariableDeclarationSyntaxTreeStructureData = {
    attributeList?: PgslAttributeListSyntaxTree;
    declarationType: string;
    name: string;
    type: PgslTypeDefinitionSyntaxTree;
    expression?: BasePgslExpressionSyntaxTree;
};