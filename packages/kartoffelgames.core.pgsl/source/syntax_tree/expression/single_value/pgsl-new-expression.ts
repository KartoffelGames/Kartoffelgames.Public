import { PgslValueAddressSpace } from "../../../enum/pgsl-value-address-space.enum.ts";
import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import { PgslExpressionTrace } from "../../../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { PgslType } from "../../../type/pgsl-type.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslTypeDeclaration } from "../../general/pgsl-type-declaration.ts";
import { PgslExpression } from '../pgsl-expression.ts';

/**
 * PGSL syntax tree of a new call expression with optional template list.
 */
export class PgslNewCallExpression extends PgslExpression {
    private readonly mParameterList: Array<PgslExpression>;
    private readonly mType: PgslTypeDeclaration;

    /**
     * Function parameter.
     */
    public get parameter(): Array<PgslExpression> {
        return this.mParameterList;
    }

    /**
     * Type of new call.
     */
    public get type(): PgslTypeDeclaration {
        return this.mType;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pType: PgslTypeDeclaration, pParameterList: Array<PgslExpression>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mType = pType;
        this.mParameterList = pParameterList;

        // Add data as child tree.
        this.appendChild(this.mType, ...this.mParameterList);
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Validate type.
        this.mType.trace(pTrace);

        // Validate parameters.
        for (const lParameter of this.mParameterList) {
            lParameter.trace(pTrace);
        }

        // Read attachment of type.
        const lType: PgslType = this.mType.type

        // Must be fixed.
        if (!lType.fixedFootprint) {
            pTrace.pushIncident(`New expression must be a length fixed type.`, this);
        }

        // Must be constructable.
        if (!lType.constructible) {
            pTrace.pushIncident(`New expression must be a constructible type.`, this);
        }

        // Find the lowest fixed state of all parameters.
        const lFixedState: PgslValueFixedState = (() => {
            // Create default variables starting with the stiffest state.
            let lFixedState: PgslValueFixedState = PgslValueFixedState.Constant;

            for (const lParameter of this.mParameterList) {
                // Read attachment of parameters.
                const lParameterAttachment: PgslExpressionTrace = pTrace.getExpression(lParameter);

                // Set the lowest fixed state.
                if (lParameterAttachment.fixedState < lFixedState) {
                    lFixedState = lParameterAttachment.fixedState;
                }
            }

            // Function is constant, parameters need to be to.
            return lFixedState;
        })();

        // TODO: Validate function parameter and template.

        return new PgslExpressionTrace({
            fixedState: lFixedState,
            isStorage: false,
            resolveType: lType,
            constantValue: null, // TODO: Maybe on simple convertions for f32, i32, etc.
            storageAddressSpace: PgslValueAddressSpace.Inherit,
        });
    }
}