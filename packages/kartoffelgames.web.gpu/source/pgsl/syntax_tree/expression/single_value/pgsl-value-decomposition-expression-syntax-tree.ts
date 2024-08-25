import { Exception } from '@kartoffelgames/core';
import { PgslValueType } from '../../../enum/pgsl-value-type.enum';
import { PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';
import { PgslTypeDefinitionSyntaxTree } from '../../general/pgsl-type-definition-syntax-tree';

/**
 * PGSL structure holding a single value of a decomposited composite value.
 */
export class PgslValueDecompositionExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslValueDecompositionExpressionSyntaxTreeStructureData> {
    private readonly mProperty: string;
    private readonly mValue: BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData>;

    /**
     * Index expression of variable index expression.
     */
    public get property(): string {
        return this.mProperty;
    }

    /**
     * Value reference.
     */
    public get value(): BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData> {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslValueDecompositionExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mProperty = pData.property;
        this.mValue = pData.value;
    }

    /**
     * On constant state request.
     */
    protected onConstantStateSet(): boolean {
        // Set constant state when the value is a constants.
        return this.mValue.isConstant;
    }

    /**
     * On type resolve of expression
     */
    protected onResolveType(): PgslTypeDefinitionSyntaxTree {
        // TODO: Depends on swizzle property or struct property.
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Validate value to be a composition object and haves the property.

        // Only struct likes can have accessable properties.
        switch (this.mValue.resolveType.valueType) {
            case PgslValueType.Struct: {
                break;
            }

            case PgslValueType.Vector: {
                if (!/[rgba]{1,4}|[xyzw]{1,4}/.test(this.mProperty)) {
                    throw new Exception(`Swizzle name "${this.mProperty}" can't be used to access vector.`, this);
                }

                // TODO: Vector of length of swizzle name.
                break;
            }

            default: {
                throw new Exception(`Value type "${this.mValue.resolveType.valueType}" can't have properties.`, this);
            }
        }
    }
}

type PgslValueDecompositionExpressionSyntaxTreeStructureData = {
    value: BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData>;
    property: string;
};