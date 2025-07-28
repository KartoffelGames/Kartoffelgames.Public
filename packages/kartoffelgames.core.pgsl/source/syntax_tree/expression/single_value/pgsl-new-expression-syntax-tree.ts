import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree.ts';
import { BasePgslExpressionSyntaxTree, type PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree.ts';

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
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData {
        // When one parameter is not a constant then nothing is a constant.
        const lIsConstant: boolean = (() => {
            for (const lParameter of this.mParameterList) {
                if (!lParameter.isConstant) {
                    return false;
                }
            }

            // Function is constant, parameters need to be to.
            return true;
        })();

        // When one parameter is not a creation fixed then nothing is a creation fixed.
        const lIsFixed: boolean = (() => {
            for (const lParameter of this.mParameterList) {
                if (!lParameter.isCreationFixed) {
                    return false;
                }
            }

            // Function is constant, parameters need to be to.
            return true;
        })();

        return {
            expression: {
                isFixed: lIsFixed,
                isStorage: false,
                resolveType: this.mType,
                isConstant: lIsConstant
            },
            data: null
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Must be fixed.
        if (!this.mType.isFixed) {
            throw new Exception(`New expression must be a length fixed type.`, this);
        }

        // Must be constructable.
        if (!this.mType.isConstructable) {
            throw new Exception(`New expression must be a length fixed type.`, this);
        }

        // TODO: Validate function parameter and template.
    }
}