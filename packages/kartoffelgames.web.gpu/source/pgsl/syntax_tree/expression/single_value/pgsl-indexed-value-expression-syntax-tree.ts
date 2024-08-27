import { Exception } from '@kartoffelgames/core';
import { PgslBuildInTypeName } from '../../../enum/pgsl-build-in-type-name.enum';
import { PgslValueType } from '../../../enum/pgsl-value-type.enum';
import { PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';
import { PgslTemplateListSyntaxTree } from '../../general/pgsl-template-list-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from '../../general/pgsl-type-declaration-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

/**
 * PGSL structure holding a variable with index expression.
 */
export class PgslIndexedValueExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslIndexedValueExpressionSyntaxTreeStructureData> {
    private readonly mIndex: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>;
    private readonly mValue: BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData>;

    /**
     * Index expression of variable index expression.
     */
    public get index(): BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> {
        return this.mIndex;
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
    public constructor(pData: PgslIndexedValueExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mIndex = pData.index;
        this.mValue = pData.value;
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        // Set constant state when both value and index are constants.
        return this.mIndex.isConstant && this.mValue.isConstant;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): PgslTypeDeclarationSyntaxTree {
        // Type depends on value type.
        switch (this.mValue.resolveType.valueType) {
            case PgslValueType.Array: {
                // Array must have at least one template parameter. The first ist allways a type definition.
                return this.mValue.resolveType.template!.items[0] as PgslTypeDeclarationSyntaxTree;
            }
            case PgslValueType.Vector: {
                // Vector has one template parameter that is allways a type definition.
                return this.mValue.resolveType.template!.items[0] as PgslTypeDeclarationSyntaxTree;
            }
            case PgslValueType.Matrix: {
                const lInnerType: PgslTypeDeclarationSyntaxTree = this.mValue.resolveType.template!.items[0] as PgslTypeDeclarationSyntaxTree;

                // Find vector type from matrix type.
                let lVectorType: PgslBuildInTypeName = PgslBuildInTypeName.Vector2;
                switch (lInnerType.type as PgslBuildInTypeName) {
                    case PgslBuildInTypeName.Matrix22:
                    case PgslBuildInTypeName.Matrix32:
                    case PgslBuildInTypeName.Matrix42: {
                        lVectorType = PgslBuildInTypeName.Vector2;
                        break;
                    }

                    case PgslBuildInTypeName.Matrix23:
                    case PgslBuildInTypeName.Matrix33:
                    case PgslBuildInTypeName.Matrix43: {
                        lVectorType = PgslBuildInTypeName.Vector3;
                        break;
                    }

                    case PgslBuildInTypeName.Matrix24:
                    case PgslBuildInTypeName.Matrix34:
                    case PgslBuildInTypeName.Matrix44: {
                        lVectorType = PgslBuildInTypeName.Vector4;
                        break;
                    }
                }

                // Build vectorN type from matrix type.
                const lVectorTypeDefinition: PgslTypeDeclarationSyntaxTree = new PgslTypeDeclarationSyntaxTree({
                    name: lVectorType,
                    templateList: new PgslTemplateListSyntaxTree({
                        parameterList: [
                            new PgslTypeDeclarationSyntaxTree({ name: lInnerType.type as PgslBuildInTypeName }, 0, 0, 0, 0) // Inner Type can only be a scalar.
                        ]
                    }, 0, 0, 0, 0)
                }, 0, 0, 0, 0);

                // Matrix has one template parameter that is allways a type definition.
                return lVectorTypeDefinition;
            }
        }

        // This should never be called.
        throw new Exception('Type does not support a index signature', this);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Validate value to be a arraylike and index to be a number.

        switch (this.mValue.resolveType.valueType) {
            case PgslValueType.Array: {
                break;
            }
            case PgslValueType.Vector: {
                break;
            }
            case PgslValueType.Matrix: {
                break;
            }
        }
    }
}

type PgslIndexedValueExpressionSyntaxTreeStructureData = {
    value: BasePgslSingleValueExpressionSyntaxTree<PgslSyntaxTreeInitData>;
    index: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>;
};