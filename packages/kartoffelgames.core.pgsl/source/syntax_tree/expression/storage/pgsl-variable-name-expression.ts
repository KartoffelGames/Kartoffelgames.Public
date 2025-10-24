import { PgslValueAddressSpace } from "../../../enum/pgsl-value-address-space.enum.ts";
import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import { PgslEnumTrace } from "../../../trace/pgsl-enum-trace.ts";
import { PgslExpressionTrace } from "../../../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { PgslValueTrace } from "../../../trace/pgsl-value-trace.ts";
import { PgslEnumType } from "../../../type/pgsl-enum-type.ts";
import { PgslInvalidType } from "../../../type/pgsl-invalid-type.ts";
import type { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslVariableDeclaration } from '../../declaration/pgsl-variable-declaration.ts';
import { PgslVariableDeclarationStatement, PgslVariableDeclarationStatementSyntaxTreeValidationAttachment } from '../../statement/pgsl-variable-declaration-statement.ts';
import { PgslExpression } from '../pgsl-expression.ts';

/**
 * PGSL structure holding single variable name.
 */
export class PgslVariableNameExpression extends PgslExpression {
    private readonly mName: string;

    /**
     * Get the variable name of the expression.
     */
    public get variableName(): string {
        return this.mName;
    }

    /**
     * Constructor.
     * 
     * @param pName - Variable name.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mName = pName;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Check if variable is defined.
        const lVariableDefinition: PgslValueTrace | null = pTrace.currentScope.getValue(this.mName);
        if (!lVariableDefinition) {
            pTrace.pushIncident(`Variable "${this.mName}" not defined.`, this);

            return new PgslExpressionTrace({
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslInvalidType(pTrace),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Function
            });
        }

        // If it was not a variable, check if it is an enum.
        const lEnumDefinition: PgslEnumTrace | undefined = pTrace.getEnum(this.mName);
        if (lEnumDefinition) {
            return new PgslExpressionTrace({
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslEnumType(pTrace, lEnumDefinition.name),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Module
            });
        }

        return new PgslExpressionTrace({
            fixedState: lVariableDefinition?.fixedState,
            isStorage: true,
            resolveType: lVariableDefinition.type,
            constantValue: lVariableDefinition.constantValue,
            storageAddressSpace: lVariableDefinition.addressSpace
        });
    }
}