import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum';
import { PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { IPgslVariableDeclarationSyntaxTree } from '../interface/i-pgsl-variable-declaration-syntax-tree.interface';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslTypeName } from '../type/enum/pgsl-type-name.enum';
import { PgslTypeDeclarationSyntaxTree } from '../type/pgsl-type-declaration-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a variable declaration for a function scope variable.
 */
export class PgslVariableDeclarationStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslVariableDeclarationStatementSyntaxTreeStructureData> implements IPgslVariableDeclarationSyntaxTree {
    private readonly mDeclarationType: PgslDeclarationType;
    private readonly mExpression: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | null;
    private mIsConstant: boolean | null;
    private mIsCreationFixed: boolean | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: PgslTypeDeclarationSyntaxTree;

    /**
    * Address space of declaration.
    */
    public get addressSpace(): PgslValueAddressSpace {
        return PgslValueAddressSpace.Function;
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
     * If declaration is a constant expression.
     */
    public get isConstant(): boolean {
        this.ensureValidity();

        // Init value.
        if (this.mIsConstant === null) {
            this.mIsConstant = this.determinateIsConstant();
        }

        return this.mIsConstant;
    }

    /**
     * If declaration is a constant expression.
     */
    public get isCreationFixed(): boolean {
        this.ensureValidity();

        // Init value.
        if (this.mIsCreationFixed === null) {
            this.mIsCreationFixed = this.determinateIsCreationFixed();
        }

        return this.mIsCreationFixed;
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
    public get type(): BasePgslTypeDefinitionSyntaxTree {
        this.ensureValidity();

        return this.mTypeDeclaration.type;
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
        this.mTypeDeclaration = pData.type;
        this.mExpression = pData.expression ?? null;

        // Set empty values.
        this.mIsConstant = null;
        this.mIsCreationFixed = null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Value validation does not apply to pointers.
        if (!(this.mTypeDeclaration.type.typeName !== PgslTypeName.Pointer)) {
            // Type needs to be storable.
            if (!this.mTypeDeclaration.type.isStorable) {
                throw new Exception(`Type is not storable or a pointer of it.`, this);
            }

            // Const declaration type needs to be constructible.
            if (this.mDeclarationType === PgslDeclarationType.Const && !this.mTypeDeclaration.type.isConstructable) {
                throw new Exception(`Constant variable declarations can only be of a constructible type.`, this);
            }
        }

        // Validate same type.
        if (this.mExpression && !this.mTypeDeclaration.type.equals(this.mExpression.resolveType)) {
            throw new Exception(`Expression value doesn't match variable declaration type.`, this);
        }

        // Validate const value need to have a initialization.
        if (this.mDeclarationType === PgslDeclarationType.Const && !this.mExpression) {
            throw new Exception(`Constants need a initializer value.`, this);
        }
    }

    /**
     * Determinate if declaration is a constant.
     */
    private determinateIsConstant(): boolean {
        // Is a constant when const type and expression is a constant.
        return this.mDeclarationType === PgslDeclarationType.Const && this.mExpression!.isConstant;
    }

    /**
     * Determinate if declaration is a creation fixed constant.
     */
    private determinateIsCreationFixed(): boolean {
        // Constant values are also creation fixed
        if (this.isConstant) {
            return true;
        }

        // Is a constant when const type and expression is a constant.
        return this.mDeclarationType === PgslDeclarationType.Const && this.mExpression!.isCreationFixed;
    }

    // TODO: When const declaration and const initial value, this can be a wgsl-const instead of a let. But only when not used as a pointer...
}

export type PgslVariableDeclarationStatementSyntaxTreeStructureData = {
    declarationType: string;
    name: string;
    type: PgslTypeDeclarationSyntaxTree;
    expression?: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>;
};