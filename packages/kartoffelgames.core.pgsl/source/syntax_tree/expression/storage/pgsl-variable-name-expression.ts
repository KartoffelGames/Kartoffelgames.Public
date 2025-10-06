import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslVariableDeclaration, PgslVariableDeclarationSyntaxTreeValidationAttachment } from '../../declaration/pgsl-variable-declaration.ts';
import { PgslFileMetaInformation } from "../../pgsl-build-result.ts";
import type { PgslValidationTrace } from '../../pgsl-validation-trace.ts';
import { PgslVariableDeclarationStatement, PgslVariableDeclarationStatementSyntaxTreeValidationAttachment } from '../../statement/pgsl-variable-declaration-statement.ts';
import { PgslNumericTypeDefinition } from "../../type/pgsl-numeric-type-definition.ts";
import { PgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../pgsl-expression.ts';

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
     * Transpile current expression to WGSL code.
     * 
     * @param _pTrace - Transpilation trace.
     * 
     * @returns WGSL code.
     */
    protected override onTranspile(_pTrace: PgslFileMetaInformation): string {
        return this.mName;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Check if variable is defined.
        const lVariableDefinition: BasePgslSyntaxTree | undefined = pTrace.getScopedValue(this.mName);
        if (!lVariableDefinition) {
            pTrace.pushError(`Variable "${this.mName}" not defined.`, this.meta, this);
        }

        if (lVariableDefinition instanceof PgslVariableDeclaration) {
            // Read variable definition attachment.
            const lVariableDeclarationAttachment: PgslVariableDeclarationSyntaxTreeValidationAttachment = pTrace.getAttachment(lVariableDefinition);
            return {
                fixedState: lVariableDeclarationAttachment.fixedState,
                isStorage: true,
                resolveType: lVariableDeclarationAttachment.type
            };
        }

        // Must be a variable.
        if (lVariableDefinition instanceof PgslVariableDeclarationStatement) {
            // Read variable definition attachment.
            const lVariableDeclarationAttachment: PgslVariableDeclarationStatementSyntaxTreeValidationAttachment = pTrace.getAttachment(lVariableDefinition);
            return {
                fixedState: lVariableDeclarationAttachment.fixedState,
                isStorage: true,
                resolveType: lVariableDeclarationAttachment.type
            };
        }

        // Variable definition neither a declaration nor a statement.
        pTrace.pushError(`Name "${this.mName}" does not refer to a variable.`, this.meta, this);

        return {
            fixedState: PgslValueFixedState.Variable,
            isStorage: false,
            resolveType: null as unknown as PgslNumericTypeDefinition // TODO: Maybe use a unknown type here?
        };
    }
}