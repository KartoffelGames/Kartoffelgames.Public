import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL structure holding a variable name used to get the address.
 */
export class PgslAddressOfExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mVariable: BasePgslExpressionSyntaxTree;

    /**
     * Variable reference.
     */
    public get variable(): BasePgslExpressionSyntaxTree {
        return this.mVariable;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pVariable: BasePgslExpressionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mVariable = pVariable;
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @returns WGSL code.
     */
    protected override onTranspile(): string {
        return `&${this.mVariable.transpile()}`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Validate variable.
        this.mVariable.validate(pTrace);

        // Read attachment of inner expression.
        const lVariableAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mVariable);

        // Type of expression needs to be storable.
        if (!lVariableAttachment.isStorage) {
            throw new Exception(`Target of address needs to a stored value`, this);
        }

        // Read type attachment of variable.
        const lVariableResolveType: BasePgslTypeDefinitionSyntaxTree = lVariableAttachment.resolveType;
        const lVariableResolveTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pTrace.getAttachment(lVariableResolveType);

        // Type of expression needs to be storable.
        if (!lVariableResolveTypeAttachment.storable) {
            throw new Exception(`Target of address needs to storable`, this);
        }

        // TODO: No vector item.

        return {
            fixedState: lVariableAttachment.fixedState,
            isStorage: false,
            resolveType: lVariableResolveType
        };
    }
}