import { Exception } from '@kartoffelgames/core';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslStructTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-struct-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree';
import { PgslVectorTypeName } from '../../type/enum/pgsl-vector-type-name.enum';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL structure holding a single value of a decomposited composite value.
 */
export class PgslValueDecompositionExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslValueDecompositionExpressionSyntaxTreeStructureData> {
    private readonly mProperty: string;
    private readonly mValue: BasePgslExpressionSyntaxTree;

    /**
     * Index expression of variable index expression.
     */
    public get property(): string {
        return this.mProperty;
    }

    /**
     * Value reference.
     */
    public get value(): BasePgslExpressionSyntaxTree {
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
    protected determinateIsConstant(): boolean {
        // Set constant state when the value is a constants.
        return this.mValue.isConstant;
    }

    /**
     * On creation fixed state request.
     */
    protected override determinateIsCreationFixed(): boolean {
        // Expression is constant when variable is a constant.
        return this.mValue.isCreationFixed;
    }

    /**
     * On is storage set.
     */
    protected determinateIsStorage(): boolean {
        return true;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        switch (true) {
            case this.mValue.resolveType instanceof PgslStructTypeDefinitionSyntaxTree: {
                if (!this.mValue.resolveType.struct.properties.find((pProperty) => { pProperty.name === this.mProperty; })) {
                    throw new Exception(`Struct has no defined property "${this.mProperty}"`, this);
                }
                break;
            }

            case this.mValue.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree: {
                const lInnerType: BasePgslTypeDefinitionSyntaxTree = this.mValue.resolveType.innerType;

                // When swizzle is only one long return the inner type.
                if (this.mProperty.length === 1) {
                    return lInnerType;
                }

                // List of vector types.
                const lVectorTypeList: Array<PgslVectorTypeName> = [PgslVectorTypeName.Vector2, PgslVectorTypeName.Vector2, PgslVectorTypeName.Vector3, PgslVectorTypeName.Vector4];

                // Build vectorN type from matrix type.
                return new PgslVectorTypeDefinitionSyntaxTree({
                    typeName: lVectorTypeList[this.mProperty.length],
                    innerType: lInnerType
                }, 0, 0, 0, 0).setParent(this).validateIntegrity();
            }
        }

        throw new Exception(`Value is not a composite type properties.`, this);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Only struct likes can have accessable properties.
        switch (true) {
            case this.mValue.resolveType instanceof PgslStructTypeDefinitionSyntaxTree: {
                if (!this.mValue.resolveType.struct.properties.find((pProperty) => { pProperty.name === this.mProperty; })) {
                    throw new Exception(`Struct has no defined property "${this.mProperty}"`, this);
                }
                break;
            }

            case this.mValue.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree: {
                // Validate swizzle name.
                if (!/[rgba]{1,4}|[xyzw]{1,4}/.test(this.mProperty)) {
                    throw new Exception(`Swizzle name "${this.mProperty}" can't be used to access vector.`, this);
                }

                break;
            }

            default: {
                throw new Exception(`Value is not a composite type properties.`, this);
            }
        }
    }
}

type PgslValueDecompositionExpressionSyntaxTreeStructureData = {
    value: BasePgslExpressionSyntaxTree;
    property: string;
};