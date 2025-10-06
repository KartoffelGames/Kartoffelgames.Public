import { Exception } from '@kartoffelgames/core';
import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../../type/base-pgsl-type-definition.ts";
import { PgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../pgsl-expression.ts';
import { PgslFileMetaInformation } from "../../pgsl-build-result.ts";

/**
 * PGSL syntax tree of a new call expression with optional template list.
 */
export class PgslNewCallExpression extends PgslExpression {
    private readonly mParameterList: Array<PgslExpression>;
    private readonly mType: BasePgslTypeDefinition;

    /**
     * Function parameter.
     */
    public get parameter(): Array<PgslExpression> {
        return this.mParameterList;
    }

    /**
     * Type of new call.
     */
    public get type(): BasePgslTypeDefinition {
        return this.mType;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pType: BasePgslTypeDefinition, pParameterList: Array<PgslExpression>, pMeta: BasePgslSyntaxTreeMeta) {
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
     * @param pTrace - Transpilation trace.
     * 
     * @returns WGSL code of current expression.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        // Simply transpile the type and parameters without the new part.
        return `${this.mType.transpile(pTrace)}(${this.mParameterList.map(param => param.transpile(pTrace)).join(", ")})`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
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