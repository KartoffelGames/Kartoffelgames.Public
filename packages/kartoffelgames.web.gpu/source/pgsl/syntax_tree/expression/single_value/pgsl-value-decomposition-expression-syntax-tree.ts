import { Exception } from '@kartoffelgames/core';
import { PgslBuildInTypeName } from '../../../enum/pgsl-build-in-type-name.enum';
import { PgslValueType } from '../../../enum/pgsl-value-type.enum';
import { PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';
import { PgslTemplateListSyntaxTree } from '../../general/pgsl-template-list-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from '../../general/pgsl-type-declaration-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

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
    protected determinateIsConstant(): boolean {
        // Set constant state when the value is a constants.
        return this.mValue.isConstant;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): PgslTypeDeclarationSyntaxTree {
        // Type depends on value type.
        switch (this.mValue.resolveType.valueType) {
            case PgslValueType.Struct: {
                // Array must have at least one template parameter. The first ist allways a type definition.
                return this.mValue.resolveType.template!.items[0] as PgslTypeDeclarationSyntaxTree;
            }
            case PgslValueType.Vector: {
                const lInnerType: PgslTypeDeclarationSyntaxTree = this.mValue.resolveType.template!.items[0] as PgslTypeDeclarationSyntaxTree;

                // When swizzle is only one long return the inner type.
                if (this.mProperty.length === 1) {
                    return lInnerType;
                }

                // Find vector type from swizzle length.
                let lVectorType: PgslBuildInTypeName = PgslBuildInTypeName.Vector2;
                switch (this.mProperty.length) {
                    case 2: {
                        lVectorType = PgslBuildInTypeName.Vector2;
                        break;
                    }
                    case 3: {
                        lVectorType = PgslBuildInTypeName.Vector3;
                        break;
                    }
                    case 4: {
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