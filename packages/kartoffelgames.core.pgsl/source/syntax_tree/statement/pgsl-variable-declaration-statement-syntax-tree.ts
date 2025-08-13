import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslBaseTypeName } from '../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslStatementSyntaxTree } from "./base-pgsl-statement-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../type/base-pgsl-type-definition-syntax-tree.ts";

/**
 * PGSL structure holding a variable declaration for a function scope variable.
 */
export class PgslVariableDeclarationStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslVariableDeclarationStatementSyntaxTreeValidationAttachment> {
    private readonly mDeclarationTypeName: string;
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Expression reference.
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

        // Add child trees.
        this.appendChild(this.mTypeDeclaration);
        if (this.mExpression) {
            this.appendChild(this.mExpression);
        }
    }

    /**
     * Transpile current declaration statement into a string.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        // TODO: When const declaration and const initial value, this can be a wgsl-const instead of a let. But only when not used as a pointer.

        // Depending on the expression presence, create the declaration with or without an initialization value.
        if(this.mExpression){
            return `${this.mDeclarationTypeName} ${this.mName}: ${this.mTypeDeclaration} = ${this.mExpression};`;
        } else {
            return `${this.mDeclarationTypeName} ${this.mName}: ${this.mTypeDeclaration};`;
        }
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): PgslVariableDeclarationStatementSyntaxTreeValidationAttachment {
        // TODO: Only valid in function scope.

        pValidationTrace.pushScopedValue(this.mName, this);

        // Expression value has a fixed byte size.
        let lFixedState: PgslValueFixedState = PgslValueFixedState.Variable;

        // Read expression attachment when a expression is present.
        if (this.mExpression) {
            const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mExpression);
            lFixedState = lExpressionAttachment.fixedState;

            // Validate same type.
            if (!BasePgslTypeDefinitionSyntaxTree.explicitCastable(pValidationTrace, this.mTypeDeclaration, lExpressionAttachment.resolveType)) {
                pValidationTrace.pushError(`Expression values type can't be converted to variables type.`, this.meta, this);
            }
        }

        // Parse declaration type.
        let lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        if (!lDeclarationType) {
            pValidationTrace.pushError(`Declaration type "${this.mDeclarationTypeName}" not defined.`, this.meta, this);

            lDeclarationType = PgslDeclarationType.Var;
        }

        // Create list of all bit operations.
        const lDeclarationTypeList: Array<PgslDeclarationType> = [
            PgslDeclarationType.Const,
            PgslDeclarationType.Let
        ];

        // Validate.
        if (!lDeclarationTypeList.includes(lDeclarationType)) {
            pValidationTrace.pushError(`Declaration type "${lDeclarationType}" can not be used for block variable declarations.`, this.meta, this);
        }

        // Read attachment of type declaration.
        const lTypeDeclarationAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mTypeDeclaration);

        // Value validation does not apply to pointers.
        if (lTypeDeclarationAttachment.baseType !== PgslBaseTypeName.Pointer) {
            // Type needs to be storable.
            if (!lTypeDeclarationAttachment.storable) {
                throw new Exception(`Type is not storable or a pointer of it.`, this);
            }

            // Const declaration type needs to be constructible.
            if (this.mDeclarationTypeName === PgslDeclarationType.Const && !lTypeDeclarationAttachment.constructible) {
                throw new Exception(`Constant variable declarations can only be of a constructible type.`, this);
            }
        }

        // Validate const value need to have a initialization.
        if (this.mDeclarationTypeName === PgslDeclarationType.Const && !this.mExpression) {
            throw new Exception(`Constants need a initializer value.`, this);
        }

        return {
            declarationType: lDeclarationType,
            fixedState: lFixedState,
            type: this.mTypeDeclaration,
        };
    }
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