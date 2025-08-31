import { Exception } from '@kartoffelgames/core';
import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { PgslStructPropertyDeclarationSyntaxTree } from '../../declaration/pgsl-struct-property-declaration-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import type { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from '../../type/base-pgsl-type-definition-syntax-tree.ts';
import { PgslVectorTypeName } from '../../type/enum/pgsl-vector-type-name.enum.ts';
import { PgslNumericTypeDefinitionSyntaxTree } from "../../type/pgsl-numeric-type-definition-syntax-tree.ts";
import { PgslStructTypeDefinitionSyntaxTree, PgslStructTypeDefinitionSyntaxTreeAdditionalAttachmentData } from '../../type/pgsl-struct-type-definition-syntax-tree.ts';
import { PgslVectorTypeDefinitionSyntaxTree } from '../../type/pgsl-vector-type-definition-syntax-tree.ts';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

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

    protected override onTranspile(): string {
        // Transpile value and property.
        return `${this.mValue.transpile()}.${this.mProperty}`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Get attachment of value.
        const lValueAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mValue);

        // Read attachment from resolve type.
        const lResolveTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pTrace.getAttachment(lValueAttachment.resolveType);

        // Must be compositeable.
        if (!lResolveTypeAttachment.composite) {
            throw new Exception(`Type must be a compositeable type.`, this);
        }

        // Resolve property type.
        const lResolveType: BasePgslTypeDefinitionSyntaxTree | null = (() => {
            switch (true) {
                case lValueAttachment.resolveType instanceof PgslStructTypeDefinitionSyntaxTree: {
                    // When the resolve type is a struct we can asurre that it has a struct type attachment.
                    const lStructTypeAttachment = lResolveTypeAttachment as unknown as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslStructTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

                    const lProperty: PgslStructPropertyDeclarationSyntaxTree | undefined = lStructTypeAttachment.additional.struct.properties.find((pProperty) => { return pProperty.name === this.mProperty; });
                    if (!lProperty) {
                        throw new Exception(`Struct has no defined property "${this.mProperty}"`, this);
                    }

                    return lProperty.type;
                }

                case lValueAttachment.resolveType instanceof PgslVectorTypeDefinitionSyntaxTree: {
                    // Validate swizzle name.
                    if (!/[rgba]{1,4}|[xyzw]{1,4}/.test(this.mProperty)) {
                        pTrace.pushError(`Swizzle name "${this.mProperty}" can't be used to access vector.`, this.meta, this);
                    }

                    const lInnerType: BasePgslTypeDefinitionSyntaxTree = lValueAttachment.resolveType.innerType;

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

                    // Validate new swizzle result.
                    lSwizzleResult.validate(pTrace);

                    return lSwizzleResult;
                }

                default: {
                    pTrace.pushError(`Value is not a composite type property.`, this.meta, this);
                }
            }

            // No valid type found.
            pTrace.pushError(`Value is not a composite type property "${this.mProperty}".`, this.meta, this);

            return null;
        })();

        if (lResolveType === null) {
            return {
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: null as unknown as PgslNumericTypeDefinitionSyntaxTree // TODO: Maybe use a unknown type here?
            };
        }

        return {
            fixedState: lValueAttachment.fixedState,
            // If the value is a struct, it is a storage. A swizzle name is not a storage. 
            isStorage: lValueAttachment.resolveType instanceof PgslStructTypeDefinitionSyntaxTree,
            resolveType: lResolveType
        };
    }
}
