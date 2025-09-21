import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import type { PgslStructPropertyDeclaration } from '../../declaration/pgsl-struct-property-declaration.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import type { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from '../../type/base-pgsl-type-definition.ts';
import { PgslBaseTypeName } from "../../type/enum/pgsl-base-type-name.enum.ts";
import { PgslVectorTypeName } from '../../type/enum/pgsl-vector-type-name.enum.ts';
import { PgslInvalidTypeDefinition } from "../../type/pgsl-invalid-type-definition.ts";
import { PgslStructTypeDefinitionSyntaxTreeAdditionalAttachmentData } from '../../type/pgsl-struct-type-definition.ts';
import { PgslVectorTypeDefinition, PgslVectorTypeDefinitionSyntaxTreeAdditionalAttachmentData } from '../../type/pgsl-vector-type-definition.ts';
import { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression.ts';

/**
 * PGSL structure holding a single value of a decomposited composite value.
 */
export class PgslValueDecompositionExpression extends BasePgslExpression {
    private readonly mProperty: string;
    private readonly mValue: BasePgslExpression;

    /**
     * Index expression of variable index expression.
     */
    public get property(): string {
        return this.mProperty;
    }

    /**
     * Value reference.
     */
    public get value(): BasePgslExpression {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pValue - Value part of decompostion.
     * @param pProperty - Property of decompostion.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pValue: BasePgslExpression, pProperty: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mProperty = pProperty;
        this.mValue = pValue;

        // Add data as child tree.
        this.appendChild(this.mValue);
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @returns WGSL code of current expression.
     */
    protected override onTranspile(): string {
        // Transpile value and property.
        return `${this.mValue.transpile()}.${this.mProperty}`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Validate value.
        this.mValue.validate(pTrace);

        // Get attachment of value.
        const lValueAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(this.mValue);

        // Read attachment from resolve type.
        const lValueTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pTrace.getAttachment(lValueAttachment.resolveType);

        // Must be compositeable.
        if (!lValueTypeAttachment.composite) {
            pTrace.pushError(`Type must be a compositeable type.`, this.meta, this);
        }

        // Resolve property type.
        const lPropertyType: BasePgslTypeDefinition | null = (() => {
            switch (true) {
                case lValueTypeAttachment.baseType === PgslBaseTypeName.Struct: {
                    // When the resolve type is a struct we can assure that it has a struct type attachment.
                    const lStructTypeAttachment = lValueTypeAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslStructTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

                    // Find property by name in its struct.
                    const lProperty: PgslStructPropertyDeclaration | undefined = lStructTypeAttachment.struct.properties.find((pProperty) => { return pProperty.name === this.mProperty; });
                    if (!lProperty) {
                        pTrace.pushError(`Struct has no defined property "${this.mProperty}"`, this.meta, this);
                        return null;
                    }

                    return lProperty.type;
                }

                case lValueTypeAttachment.baseType === PgslBaseTypeName.Vector: {
                    // Validate swizzle name.
                    if (!/[rgba]{1,4}|[xyzw]{1,4}/.test(this.mProperty)) {
                        pTrace.pushError(`Swizzle name "${this.mProperty}" can't be used to access vector.`, this.meta, this);
                    }

                    // When the resolve type is a vector we can assure that it has a vector type attachment.
                    const lVectorTypeAttachment = lValueTypeAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslVectorTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

                    // When swizzle is only one long return the inner type.
                    if (this.mProperty.length === 1) {
                        return lVectorTypeAttachment.innerType;
                    }

                    // List of vector types.
                    const lVectorTypeList: Array<PgslVectorTypeName> = [PgslVectorTypeName.Vector2, PgslVectorTypeName.Vector2, PgslVectorTypeName.Vector3, PgslVectorTypeName.Vector4];

                    // Build vectorN type from vector type.
                    const lSwizzleResult: PgslVectorTypeDefinition = new PgslVectorTypeDefinition(
                        lVectorTypeList[this.mProperty.length],
                        lVectorTypeAttachment.innerType,
                        BasePgslSyntaxTree.convertMeta(this.meta)
                    );

                    // Add swizzle result as child.
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

        if (lPropertyType === null) {
            return {
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: PgslInvalidTypeDefinition.type()
            };
        }

        return {
            fixedState: lValueAttachment.fixedState,
            resolveType: lPropertyType,

            // If the value is a struct, it is a storage. A swizzle name is not a storage. 
            isStorage: lValueTypeAttachment.baseType === PgslBaseTypeName.Struct,
        };
    }
}
