import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum';
import { PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslTypeDefinitionSyntaxTree } from '../general/pgsl-type-definition-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a variable declaration for a function scope variable.
 */
export class PgslVariableDeclarationStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslVariableDeclarationStatementSyntaxTreeStructureData> {
    private readonly mConstant: boolean;
    private readonly mDeclarationType: PgslDeclarationType;
    private readonly mExpression: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | null;
    private readonly mName: string;
    private readonly mType: PgslTypeDefinitionSyntaxTree;

    /**
     * Variable declaration is a constant value and can not be changed.
     */
    public get constant(): boolean {
        return this.mConstant;
    }

    /**
     * Variable declaration type.
     */
    public get declarationType(): PgslDeclarationType {
        return this.mDeclarationType;
    }

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | null {
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
    public constructor(pData: PgslVariableDeclarationStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Create list of all bit operations.
        const lDeclarationTypeList: Array<PgslDeclarationType> = [
            PgslDeclarationType.Const,
            PgslDeclarationType.Let
        ];

        // Validate.
        if (!lDeclarationTypeList.includes(pData.declarationType as PgslDeclarationType)) {
            throw new Exception(`Declaration type "${pData.declarationType}" can not be used for block variable declarations.`, this);
        }

        // Set parsed declaration type.
        this.mDeclarationType = EnumUtil.cast(PgslDeclarationType, pData.declarationType)!;

        if(this.mDeclarationType === PgslDeclarationType.Const && !pData.expression){
            throw new Exception(`Const declaration "${pData.name}" needs a assignment.`, this);
        }

        // Set data.
        this.mName = pData.name;
        this.mType = pData.type;
        this.mExpression = pData.expression ?? null;
        this.mConstant = false; // TODO: Read from expression.
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate eighter.
    }
}

export type PgslVariableDeclarationStatementSyntaxTreeStructureData = {
    declarationType: string;
    name: string;
    type: PgslTypeDefinitionSyntaxTree;
    expression?: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>;
};