import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslFileMetaInformation } from "../../pgsl-file-meta-information.ts";
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition.ts";
import { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression.ts';

/**
 * PGSL structure holding a variable name used to get the address.
 */
export class PgslAddressOfExpression extends BasePgslExpression {
    private readonly mVariable: BasePgslExpression;

    /**
     * Variable reference.
     */
    public get variable(): BasePgslExpression {
        return this.mVariable;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pVariable: BasePgslExpression, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mVariable = pVariable;
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns WGSL code.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        return `&${this.mVariable.transpile(pTrace)}`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Validate variable.
        this.mVariable.validate(pTrace);

        // Read attachment of inner expression.
        const lVariableAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mVariable);

        // Type of expression needs to be storable.
        if (!lVariableAttachment.isStorage) {
            pTrace.pushError(`Target of address needs to a stored value`, this.mVariable.meta, this);
        }

        // Read type attachment of variable.
        const lVariableResolveType: BasePgslTypeDefinition = lVariableAttachment.resolveType;
        const lVariableResolveTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pTrace.getAttachment(lVariableResolveType);

        // Type of expression needs to be storable.
        if (!lVariableResolveTypeAttachment.storable) {
            pTrace.pushError(`Target of address needs to storable`, this.mVariable.meta, this);
        }

        // TODO: No vector item.

        return {
            fixedState: lVariableAttachment.fixedState,
            isStorage: false,
            resolveType: lVariableResolveType
        };
    }
}