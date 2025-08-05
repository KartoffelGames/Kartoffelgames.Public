import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree.ts';
import type { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from '../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslStatementSyntaxTree } from "./base-pgsl-statement-syntax-tree.ts";

/**
 * PGSL structure holding a variable declaration for a function scope variable.
 */
export class PgslVariableDeclarationStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslVariableDeclarationStatementSyntaxTreeValidationAttachment> {
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
        super(pMeta, false);

        // Set data.
        this.mDeclarationTypeName = pParameter.declarationType;
        this.mName = pParameter.name;
        this.mTypeDeclaration = pParameter.type;
        this.mExpression = pParameter.expression ?? null;

        // Add child trees.
        this.appendChild(this.mTypeDeclaration);
        if (this.mExpression) {
            this.appendChild(this.mExpression);
        }
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslVariableDeclarationStatementSyntaxTreeSetupData {
        // Push variable definition to current scope.
        this.pushScopedValue(this.mName, this);

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
    protected override onValidateIntegrity(): PgslVariableDeclarationStatementSyntaxTreeValidationAttachment {
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
        if (!(this.mTypeDeclaration.baseType !== PgslBaseTypeName.Pointer)) {
            // Type needs to be storable.
            if (!this.mTypeDeclaration.isStorable) {
                throw new Exception(`Type is not storable or a pointer of it.`, this);
            }

            // Const declaration type needs to be constructible.
            if (this.mDeclarationTypeName === PgslDeclarationType.Const && !this.mTypeDeclaration.isConstructible) {
                throw new Exception(`Constant variable declarations can only be of a constructible type.`, this);
            }
        }

        // Validate same type.
        if (this.mExpression && !this.mTypeDeclaration.explicitCastable(this.mExpression.resolveType)) {
            throw new Exception(`Expression values type can't be converted to variables type.`, this);
        }

        // Validate const value need to have a initialization.
        if (this.mDeclarationTypeName === PgslDeclarationType.Const && !this.mExpression) {
            throw new Exception(`Constants need a initializer value.`, this);
        }
    }

    // TODO: When const declaration and const initial value, this can be a wgsl-const instead of a let. But only when not used as a pointer...
}


export type PgslVariableDeclarationStatementSyntaxTreeValidationAttachment = {
    fixedState: PgslValueFixedState;
    declarationType: PgslDeclarationType;
    type: BasePgslTypeDefinitionSyntaxTree;
};


export type PgslVariableDeclarationStatementSyntaxTreeConstructorParameter = {
    declarationType: string;
    name: string;
    type: BasePgslTypeDefinitionSyntaxTree;
    expression: BasePgslExpressionSyntaxTree | null;
};