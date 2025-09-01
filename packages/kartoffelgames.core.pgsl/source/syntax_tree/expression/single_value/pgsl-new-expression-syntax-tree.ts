import { Exception } from '@kartoffelgames/core';
import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL syntax tree of a new call expression with optional template list.
 */
export class PgslNewCallExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mParameterList: Array<BasePgslExpressionSyntaxTree>;
    private readonly mType: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Function parameter.
     */
    public get parameter(): Array<BasePgslExpressionSyntaxTree> {
        return this.mParameterList;
    }

    /**
     * Type of new call.
     */
    public get type(): BasePgslTypeDefinitionSyntaxTree {
        return this.mType;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pType: BasePgslTypeDefinitionSyntaxTree, pParameterList: Array<BasePgslExpressionSyntaxTree>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mType = pType;
        this.mParameterList = pParameterList;

        // Add data as child tree.
        this.appendChild(this.mType, ...this.mParameterList);
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @returns WGSL code of current expression.
     */
    protected override onTranspile(): string {
        // Simply transpile the type and parameters without the new part.
        return `${this.mType.transpile()}(${this.mParameterList.map(param => param.transpile()).join(", ")})`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Validate type.
        this.mType.validate(pTrace);

        // Validate parameters.
        for (const lParameter of this.mParameterList) {
            lParameter.validate(pTrace);
        }

        // Read attachment of type.
        const lTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mType);

        // Must be fixed.
        if (!lTypeAttachment.fixedFootprint) {
            pTrace.pushError(`New expression must be a length fixed type.`, this.mType.meta, this);
        }

        // Must be constructable.
        if (!lTypeAttachment.constructible) {
            pTrace.pushError(`New expression must be a constructible type.`, this.mType.meta, this);
        }

        // Find the lowest fixed state of all parameters.
        const lFixedState: PgslValueFixedState = (() => {
            // Create default variables starting with the stiffest state.
            let lFixedState: PgslValueFixedState = PgslValueFixedState.Constant;

            for (const lParameter of this.mParameterList) {
                // Read attachment of parameters.
                const lParameterAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(lParameter);

                // Set the lowest fixed state.
                if (lParameterAttachment.fixedState < lFixedState) {
                    lFixedState = lParameterAttachment.fixedState;
                }
            }

            // Function is constant, parameters need to be to.
            return lFixedState;
        })();

        // TODO: Validate function parameter and template.

        return {
            fixedState: lFixedState,
            isStorage: false,
            resolveType: this.mType,
        };
    }
}