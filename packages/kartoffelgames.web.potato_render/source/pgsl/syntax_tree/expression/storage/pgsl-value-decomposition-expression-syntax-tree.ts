import { Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { BasePgslTypeDefinitionSyntaxTree } from '../../type/definition/base-pgsl-type-definition-syntax-tree.ts';
import { PgslStructTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-struct-type-definition-syntax-tree.ts';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-vector-type-definition-syntax-tree.ts';
import { PgslVectorTypeName } from '../../type/enum/pgsl-vector-type-name.enum.ts';
import { BasePgslExpressionSyntaxTree, type PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree.ts';
import type { PgslStructPropertyDeclarationSyntaxTree } from '../../declaration/pgsl-struct-property-declaration-syntax-tree.ts';

/**
 * PGSL structure holding a single value of a decomposited composite value.
 */
export class PgslValueDecompositionExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
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
     * @param pValue - Value part of decompostion.
     * @param pProperty - Property of decompostion.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pValue: BasePgslExpressionSyntaxTree, pProperty: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mProperty = pProperty;
        this.mValue = pValue;

        // Add data as child tree.
        this.appendChild(this.mValue);
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData {
        // Resolve property type.
        const lResolveType: BasePgslTypeDefinitionSyntaxTree = (() => {
            switch (true) {
                case this.mValue.resolveType instanceof PgslStructTypeDefinitionSyntaxTree: {
                    const lProperty: PgslStructPropertyDeclarationSyntaxTree | undefined = this.mValue.resolveType.struct.properties.find((pProperty) => { return pProperty.name === this.mProperty; });
                    if (!lProperty) {
                        throw new Exception(`Struct has no defined property "${this.mProperty}"`, this);
                    }

                    return lProperty.type;
                }

                case this.mValue.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree: {
                    const lInnerType: BasePgslTypeDefinitionSyntaxTree = this.mValue.resolveType.innerType;

                    // When swizzle is only one long return the inner type.
                    if (this.mProperty.length === 1) {
                        return lInnerType;
                    }

                    // List of vector types.
                    const lVectorTypeList: Array<PgslVectorTypeName> = [PgslVectorTypeName.Vector2, PgslVectorTypeName.Vector2, PgslVectorTypeName.Vector3, PgslVectorTypeName.Vector4];

                    // Build vectorN type from vector type.
                    const lSwizzleResult: PgslVectorTypeDefinitionSyntaxTree = new PgslVectorTypeDefinitionSyntaxTree(lVectorTypeList[this.mProperty.length], lInnerType, {
                        range: [
                            this.meta.position.start.line,
                            this.meta.position.start.column,
                            this.meta.position.end.line,
                            this.meta.position.end.column,
                        ]
                    });
                    this.appendChild(lSwizzleResult);

                    return lSwizzleResult;
                }
            }

            throw new Exception(`Value is not a composite type properties.`, this);
        })();

        return {
            expression: {
                isFixed: this.mValue.isCreationFixed,
                isStorage: false,
                resolveType: lResolveType,
                isConstant: this.mValue.isConstant
            },
            data: null
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Must be compositeable.
        if (!this.mValue.resolveType.isComposite) {
            throw new Exception(`Type must be a compositeable type.`, this);
        }

        // Only struct likes can have accessable properties.
        switch (true) {
            case this.mValue.resolveType instanceof PgslStructTypeDefinitionSyntaxTree: {
                if (!this.mValue.resolveType.struct.properties.find((pProperty) => { return pProperty.name === this.mProperty; })) {
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
                throw new Exception(`Value is not a composite type property.`, this);
            }
        }
    }
}
