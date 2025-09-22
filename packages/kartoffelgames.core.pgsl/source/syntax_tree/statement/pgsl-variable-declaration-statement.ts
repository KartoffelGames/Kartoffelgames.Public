import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/base-pgsl-expression.ts';
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../type/base-pgsl-type-definition.ts";
import { PgslBaseTypeName } from '../type/enum/pgsl-base-type-name.enum.ts';
import { BasePgslStatement } from "./base-pgsl-statement.ts";
import { PgslTranspilationTrace } from "../pgsl-tranpilation-trace.ts";

/**
 * PGSL structure holding a variable declaration for a function scope variable.
 */
export class PgslVariableDeclarationStatement extends BasePgslStatement<PgslVariableDeclarationStatementSyntaxTreeValidationAttachment> {
    private readonly mDeclarationTypeName: string;
    private readonly mExpression: BasePgslExpression | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: BasePgslTypeDefinition;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpression | null {
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
    public get type(): BasePgslTypeDefinition {
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
     * @param _pTrace - Transpilation trace.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(_pTrace: PgslTranspilationTrace): string {
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
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): PgslVariableDeclarationStatementSyntaxTreeValidationAttachment {
        // TODO: Only valid in function scope.

        // Push variable to current validation scope.
        pValidationTrace.pushScopedValue(this.mName, this);

        // Validate type.
        this.mTypeDeclaration.validate(pValidationTrace);

        // Expression value has a fixed byte size.
        let lFixedState: PgslValueFixedState = PgslValueFixedState.Variable;

        // Read expression attachment when a expression is present.
        if (this.mExpression) {
            // Validate expression.
            this.mExpression.validate(pValidationTrace);

            const lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mExpression);
            lFixedState = lExpressionAttachment.fixedState;

            // Validate same type.
            if (!lExpressionAttachment.resolveType.isImplicitCastableInto(pValidationTrace, this.mTypeDeclaration)) {
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
    type: BasePgslTypeDefinition;
};

export type PgslVariableDeclarationStatementSyntaxTreeConstructorParameter = {
    declarationType: string;
    name: string;
    type: BasePgslTypeDefinition;
    expression: BasePgslExpression | null;
};