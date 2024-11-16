import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum';
import { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { IPgslVariableDeclarationSyntaxTree } from '../interface/i-pgsl-variable-declaration-syntax-tree.interface';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslBaseType } from '../type/enum/pgsl-base-type.enum';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a variable declaration for a function scope variable.
 */
export class PgslVariableDeclarationStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslVariableDeclarationStatementSyntaxTreeSetupData> implements IPgslVariableDeclarationSyntaxTree {
    private readonly mDeclarationTypeName: string;
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: BasePgslTypeDefinitionSyntaxTree;

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
        this.ensureSetup();

        return this.setupData.declarationType;
    }

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree | null {
        return this.mExpression;
    }

    /**
     * If declaration is a constant expression.
     */
    public get isConstant(): boolean {
        this.ensureSetup();

        return this.setupData.isConstant;
    }

    /**
     * If declaration is a constant expression.
     */
    public get isCreationFixed(): boolean {
        this.ensureSetup();

        return this.setupData.isFixed;
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
        return this.mTypeDeclaration;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Constructor parameter data.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pParameter: PgslVariableDeclarationStatementSyntaxTreeConstructorParameter, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mDeclarationTypeName = pParameter.declarationType;
        this.mName = pParameter.name;
        this.mTypeDeclaration = pParameter.type;
        this.mExpression = pParameter.expression ?? null;
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslVariableDeclarationStatementSyntaxTreeSetupData {
        // Expression value has a fixed byte size.
        let lIsFixed: boolean = false;
        if (this.mExpression) {
            lIsFixed = this.mExpression.isCreationFixed;
        }

        // Parse declaration type.
        const lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        if (!lDeclarationType) {
            throw new Exception(`Declaration type "${this.mDeclarationTypeName}" not defined.`, this);
        }

        return {
            declarationType: lDeclarationType,
            isConstant: this.mDeclarationTypeName === PgslDeclarationType.Const,
            isFixed: lIsFixed
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        this.ensureSetup();

        // Create list of all bit operations.
        const lDeclarationTypeList: Array<PgslDeclarationType> = [
            PgslDeclarationType.Const,
            PgslDeclarationType.Let
        ];

        // Validate.
        if (!lDeclarationTypeList.includes(this.setupData.declarationType)) {
            throw new Exception(`Declaration type "${this.setupData.declarationType}" can not be used for block variable declarations.`, this);
        }

        // Value validation does not apply to pointers.
        if (!(this.mTypeDeclaration.baseType !== PgslBaseType.Pointer)) {
            // Type needs to be storable.
            if (!this.mTypeDeclaration.isStorable) {
                throw new Exception(`Type is not storable or a pointer of it.`, this);
            }

            // Const declaration type needs to be constructible.
            if (this.mDeclarationTypeName === PgslDeclarationType.Const && !this.mTypeDeclaration.isConstructable) {
                throw new Exception(`Constant variable declarations can only be of a constructible type.`, this);
            }
        }

        // Validate same type.
        if (this.mExpression && !this.mTypeDeclaration.equals(this.mExpression.resolveType)) {
            throw new Exception(`Expression value doesn't match variable declaration type.`, this);
        }

        // Validate const value need to have a initialization.
        if (this.mDeclarationTypeName === PgslDeclarationType.Const && !this.mExpression) {
            throw new Exception(`Constants need a initializer value.`, this);
        }
    }

    // TODO: When const declaration and const initial value, this can be a wgsl-const instead of a let. But only when not used as a pointer...
}

type PgslVariableDeclarationStatementSyntaxTreeSetupData = {
    declarationType: PgslDeclarationType;
    isConstant: boolean;
    isFixed: boolean;
};

export type PgslVariableDeclarationStatementSyntaxTreeConstructorParameter = {
    declarationType: string;
    name: string;
    type: BasePgslTypeDefinitionSyntaxTree;
    expression: BasePgslExpressionSyntaxTree | null;
};