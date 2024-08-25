import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum';
import { PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from '../general/pgsl-type-declaration-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a variable declaration for a function scope variable.
 */
export class PgslVariableDeclarationStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslVariableDeclarationStatementSyntaxTreeStructureData> {
    private readonly mDeclarationType: PgslDeclarationType;
    private readonly mExpression: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | null;
    private mIsConstant: boolean | null;
    private readonly mName: string;
    private readonly mType: PgslTypeDeclarationSyntaxTree;

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
     * Variable declaration is a constant value and can not be changed.
     */
    public get isConstant(): boolean {
        this.ensureValidity();

        // Constant was not set.
        if (this.mIsConstant === null) {
            throw new Exception('Constant state of declaration was not set.', this);
        }

        return this.mIsConstant;
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
    public get type(): PgslTypeDeclarationSyntaxTree {
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

        if (this.mDeclarationType === PgslDeclarationType.Const && !pData.expression) {
            throw new Exception(`Const declaration "${pData.name}" needs a assignment.`, this);
        }

        // Set data.
        this.mName = pData.name;
        this.mType = pData.type;
        this.mExpression = pData.expression ?? null;
        this.mIsConstant = null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Is a constant when const type and expression is a constant.
        this.mIsConstant = this.mDeclarationType === PgslDeclarationType.Const && this.mExpression!.isConstant;

        // Const declaration type needs to be constructible.
        if (this.mDeclarationType === PgslDeclarationType.Const && !this.mType.isConstructible) {
            throw new Exception(`Constant variable declarations can only be of a constructible type.`, this);
        }

        // TODO.
        // TODO: Musst be a creation-fixed footprint type.
        // TODO: Validate const value need to have a initialization.
        // TODO: Validate same type.
    }

    // TODO: When const declaration and const initial value, this can be a wgsl-const instead of a let.
}

export type PgslVariableDeclarationStatementSyntaxTreeStructureData = {
    declarationType: string;
    name: string;
    type: PgslTypeDeclarationSyntaxTree;
    expression?: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>;
};