import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslValueTrace } from '../../../trace/pgsl-value-trace.ts';
import { PgslPointerType } from '../../../type/pgsl-pointer-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslAccessMode } from '../../buildin/pgsl-access-mode.enum.ts';
import type { PgslExpression } from '../../expression/pgsl-expression.ts';
import type { PgslTypeDeclaration } from '../../general/pgsl-type-declaration.ts';
import { BasePgslStatement } from '../base-pgsl-statement.ts';
/**
 * PGSL structure holding a variable declaration for a function scope variable.
 */
export class PgslVariableDeclarationStatement extends BasePgslStatement {
    private readonly mDeclarationTypeName: string;
    private readonly mExpression: PgslExpression | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: PgslTypeDeclaration;

    /**
     * Declaration type name.
     */
    public get declarationType(): string {
        return this.mDeclarationTypeName;
    }

    /**
     * Expression reference.
     */
    public get expression(): PgslExpression | null {
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
    public get type(): PgslTypeDeclaration {
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
     * Validate data of current structure.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Validate type.
        this.mTypeDeclaration.trace(pTrace);

        // Expression value has a fixed byte size.
        let lFixedState: PgslValueFixedState = PgslValueFixedState.Variable;
        let lConstantValue: number | string | null = null;

        // Read expression attachment when a expression is present.
        if (this.mExpression) {
            // Validate expression.
            this.mExpression.trace(pTrace);

            const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(this.mExpression);
            lFixedState = lExpressionTrace.fixedState;
            lConstantValue = lExpressionTrace.constantValue;

            // Validate same type.
            if (!lExpressionTrace.resolveType.isImplicitCastableInto(this.mTypeDeclaration.type)) {
                pTrace.pushIncident(`Expression values type can't be converted to variables type.`, this.mExpression);
            }
        }

        // Parse declaration type.
        let lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        if (!lDeclarationType) {
            pTrace.pushIncident(`Declaration type "${this.mDeclarationTypeName}" not defined.`, this);

            lDeclarationType = PgslDeclarationType.Var;
        }

        // Create list of all bit operations.
        const lDeclarationTypeList: Array<PgslDeclarationType> = [
            PgslDeclarationType.Const,
            PgslDeclarationType.Let
        ];

        // Validate.
        if (!lDeclarationTypeList.includes(lDeclarationType)) {
            pTrace.pushIncident(`Declaration type "${lDeclarationType}" can not be used for block variable declarations.`, this);
        }

        // Value validation does not apply to pointers.
        if (!(this.mTypeDeclaration.type instanceof PgslPointerType)) {
            // Type needs to be storable.
            if (!this.mTypeDeclaration.type.storable) {
                throw new Exception(`Type is not storable or a pointer of it.`, this);
            }

            // Const declaration type needs to be constructible.
            if (this.mDeclarationTypeName === PgslDeclarationType.Const && !this.mTypeDeclaration.type.constructible) {
                throw new Exception(`Constant variable declarations can only be of a constructible type.`, this);
            }
        }

        // Validate const value need to have a initialization.
        if (this.mDeclarationTypeName === PgslDeclarationType.Const && !this.mExpression) {
            throw new Exception(`Constants need a initializer value.`, this);
        }

        // Push variable to current validation scope.
        pTrace.currentScope.addValue(this.mName, new PgslValueTrace({
            fixedState: lFixedState,
            declarationType: lDeclarationType,
            addressSpace: PgslValueAddressSpace.Function,
            type: this.mTypeDeclaration.type,
            name: this.mName,
            constantValue: typeof lConstantValue === 'number' ? lConstantValue : null,
            accessMode: PgslAccessMode.ReadWrite,
            bindingInformation: null
        }));
    }
}

export type PgslVariableDeclarationStatementSyntaxTreeValidationAttachment = {
    fixedState: PgslValueFixedState;
    declarationType: PgslDeclarationType;
    type: PgslTypeDeclaration;
};

export type PgslVariableDeclarationStatementSyntaxTreeConstructorParameter = {
    declarationType: string;
    name: string;
    type: PgslTypeDeclaration;
    expression: PgslExpression | null;
};