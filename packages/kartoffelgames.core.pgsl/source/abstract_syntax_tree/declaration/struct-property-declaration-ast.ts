import { PgslInterpolateSampling, PgslInterpolateSamplingEnum } from "../../buildin/pgsl-interpolate-sampling-enum.ts";
import { PgslInterpolateType, PgslInterpolateTypeEnum } from "../../buildin/pgsl-interpolate-type-enum.ts";
import { StructPropertyDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import type { PgslExpressionTrace } from '../../trace/pgsl-expression-trace.ts';
import { type PgslStructPropertyTraceConstructorParameter } from '../../trace/pgsl-struct-property-trace.ts';
import { PgslNumericType } from "../../type/pgsl-numeric-type.ts";
import type { PgslType } from '../../type/pgsl-type.ts';
import { PgslVectorType } from "../../type/pgsl-vector-type.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import { IExpressionAst } from "../expression/i-expression-ast.interface.ts";
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../general/type-declaration-ast.ts';
import { DeclarationAstData, IDeclarationAst } from './i-declaration-ast.interface.ts';

/**
 * PGSL syntax tree for a struct property declaration.
 */
export class StructPropertyDeclarationAst extends AbstractSyntaxTree<StructPropertyDeclarationCst, StructPropertyDeclarationAstData> implements IDeclarationAst {
    /**
     * Validate data of current structure.
     */
    protected override process(pContext: AbstractSyntaxTreeContext): StructPropertyDeclarationAstData {
        // Create attribute list.
        const lAttributes: AttributeListAst = new AttributeListAst(this.cst.attributeList, this, pContext);

        // Get property type.
        const lTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(this.cst.typeDeclaration, pContext);
        const lType: PgslType = lTypeDeclaration.data.type;

        // Validate property type.
        if (!lType.concrete) {
            pContext.pushIncident(`Property type must be concrete.`, this);
        }
        if (!lType.plain) {
            pContext.pushIncident(`Property type must be plain.`, this);
        }

        return {
            attributes: lAttributes,
            name: this.cst.name,
            typeDeclaration: lTypeDeclaration,
            meta: this.getMeta(lAttributes, pContext, lType)
        };
    }

    private getMeta(pAttributes: AttributeListAst, pContext: AbstractSyntaxTreeContext, pType: PgslType): PgslStructPropertyTraceConstructorParameter['meta'] {
        // Set property meta based on attributes.
        const lMeta: PgslStructPropertyTraceConstructorParameter['meta'] = {};

        // Check for location attribute.
        const lLocationName = this.getLocationName(pAttributes, pContext, pType);
        if (lLocationName !== null) {
            lMeta.locationName = lLocationName;
        }

        // Check for size attribute.
        const lSize = this.getSize(pAttributes, pContext);
        if (lSize !== null) {
            lMeta.size = lSize;
        }

        // Check for alignment attribute.
        const lAlignment = this.getAlignment(pAttributes, pContext);
        if (lAlignment !== null) {
            lMeta.alignment = lAlignment;
        }

        // Check for blend source attribute.
        const lBlendSrc = this.getBlendSource(pAttributes, pContext, lMeta);
        if (lBlendSrc !== null) {
            lMeta.blendSrc = lBlendSrc;
        }

        // Check for interpolation attribute.
        const lInterpolation = this.getInterpolation(pAttributes, pContext, lMeta);
        if (lInterpolation !== null) {
            lMeta.interpolation = lInterpolation;
        }

        return lMeta;
    }

    /**
     * Gets the location name from the location attribute.
     *
     * @param pAttributes - Attribute list.
     * @param pContext - Abstract syntax tree context.
     * @param pType - Property type.
     *
     * @returns The location name or null if attribute not present or invalid.
     */
    private getLocationName(pAttributes: AttributeListAst, pContext: AbstractSyntaxTreeContext, pType: PgslType): string | null {
        if (!pAttributes.hasAttribute(AttributeListAst.attributeNames.location)) {
            return null;
        }

        // Read attribute parameter, add another incident if not valid.
        const lAttributeParameter: Array<IExpressionAst> = pAttributes.getAttributeParameter(AttributeListAst.attributeNames.location)!;
        if (lAttributeParameter.length !== 1) {
            pContext.pushIncident(`Location attribute must have exactly one parameter.`, this);
            return null;
        }

        // Read expression trace.
        const lLocationExpression: IExpressionAst = lAttributeParameter[0];

        // Expression must have a constant value.
        if (typeof lLocationExpression.data.constantValue !== 'string') {
            pContext.pushIncident(`Location attribute parameter must be a constant string.`, this);
            return null;
        }

        const lNumericTypeList: Array<PgslNumericType> = [
            new PgslNumericType(pContext, PgslNumericType.typeName.float32),
            new PgslNumericType(pContext, PgslNumericType.typeName.signedInteger)
        ];

        // Type must be a numeric scalar, or numeric vector.
        const lValidType: boolean = (() => {
            // Can be either float32 or int.
            for (const lNumericType of lNumericTypeList) {
                if (pType.isImplicitCastableInto(lNumericType)) {
                    return true;
                }
            }

            // Can be a vector2..4 of a numeric type.
            for (let lDimension: number = 2; lDimension <= 4; lDimension++) {
                for (const lNumericType of lNumericTypeList) {
                    const lVectorType: PgslType = new PgslVectorType(pContext, lDimension, lNumericType);
                    if (pType.isImplicitCastableInto(lVectorType)) {
                        return true;
                    }
                }
            }

            return false;
        })();

        if (!lValidType) {
            pContext.pushIncident(`Location attribute can only be applied to numeric scalar or numeric vector types.`, this);
            return null;
        }

        return lLocationExpression.data.constantValue;
    }

    /**
     * Gets the size from the size attribute.
     *
     * @param pAttributes - Attribute list.
     * @param pContext - Abstract syntax tree context.
     *
     * @returns The size or null if attribute not present or invalid.
     */
    private getSize(pAttributes: AttributeListAst, pContext: AbstractSyntaxTreeContext): number | null {
        if (!pAttributes.hasAttribute(AttributeListAst.attributeNames.size)) {
            return null;
        }

        // Read attribute parameters, add another incident if not valid.
        const lAttributeParameter: Array<IExpressionAst> = pAttributes.getAttributeParameter(AttributeListAst.attributeNames.size)!;
        if (lAttributeParameter.length !== 1) {
            pContext.pushIncident(`Size attribute must have exactly one parameter.`, this);
            return null;
        }

        // Read expression trace.
        const lSizeExpression: IExpressionAst = lAttributeParameter[0];

        // Expression must have a constant value.
        if (typeof lSizeExpression.data.constantValue !== 'number') {
            pContext.pushIncident(`Size attribute parameter must be a constant number.`, this);
            return null;
        }

        // Value must be a positive integer.
        if (!Number.isInteger(lSizeExpression.data.constantValue) || lSizeExpression.data.constantValue <= 0) {
            pContext.pushIncident(`Size attribute parameter must be a positive integer.`, this);
            return null;
        }

        return lSizeExpression.data.constantValue;
    }

    /**
     * Gets the alignment from the align attribute.
     *
     * @param pAttributes - Attribute list.
     * @param pContext - Abstract syntax tree context.
     *
     * @returns The alignment or null if attribute not present or invalid.
     */
    private getAlignment(pAttributes: AttributeListAst, pContext: AbstractSyntaxTreeContext): number | null {
        if (!pAttributes.hasAttribute(AttributeListAst.attributeNames.align)) {
            return null;
        }

        // Read attribute parameters, add another incident if not valid.
        const lAttributeParameter: Array<IExpressionAst> = pAttributes.getAttributeParameter(AttributeListAst.attributeNames.align)!;
        if (lAttributeParameter.length !== 1) {
            pContext.pushIncident(`Align attribute must have exactly one parameter.`, this);
            return null;
        }

        // Read expression trace.
        const lAlignExpression: IExpressionAst = lAttributeParameter[0]

        // Expression must have a constant value.
        if (typeof lAlignExpression.data.constantValue !== 'number') {
            pContext.pushIncident(`Align attribute parameter must be a constant number.`, this);
            return null;
        }

        // Number must be a positive integer.
        if (!Number.isInteger(lAlignExpression.data.constantValue) || lAlignExpression.data.constantValue <= 0) {
            pContext.pushIncident(`Align attribute parameter must be a positive integer.`, this);
            return null;
        }

        // Number must be a power of two.
        if ((lAlignExpression.data.constantValue & (lAlignExpression.data.constantValue - 1)) !== 0) {
            pContext.pushIncident(`Align attribute parameter must be a power of two.`, this);
            return null;
        }

        return lAlignExpression.data.constantValue;
    }

    /**
     * Gets the blend source from the blend source attribute.
     *
     * @param pAttributes - Attribute list.
     * @param pContext - Abstract syntax tree context.
     * @param pMeta - Current metadata object (to check for location dependency).
     *
     * @returns The blend source or null if attribute not present or invalid.
     */
    private getBlendSource(pAttributes: AttributeListAst, pContext: AbstractSyntaxTreeContext, pMeta: PgslStructPropertyTraceConstructorParameter['meta']): number | null {
        if (!pAttributes.hasAttribute(AttributeListAst.attributeNames.blendSource)) {
            return null;
        }

        // Read attribute parameters, add another incident if not valid.
        const lAttributeParameter: Array<IExpressionAst> = pAttributes.getAttributeParameter(AttributeListAst.attributeNames.blendSource)!;
        if (lAttributeParameter.length !== 1) {
            pContext.pushIncident(`Blend source attribute must have exactly one parameter.`, this);
            return null;
        }

        // Blend source attribute only valid when location attribute is set.
        if (!pMeta.locationName) {
            pContext.pushIncident(`Blend source attribute is only valid when location attribute is set.`, this);
            return null;
        }

        // Read expression trace.
        const lBlendSourceExpression: IExpressionAst = lAttributeParameter[0]

        // Expression must have a constant value.
        if (typeof lBlendSourceExpression.data.constantValue !== 'number') {
            pContext.pushIncident(`Blend source attribute parameter must be a constant number.`, this);
            return null;
        }

        // Number must be either a zero or one.
        if (lBlendSourceExpression.data.constantValue !== 0 && lBlendSourceExpression.data.constantValue !== 1) {
            pContext.pushIncident(`Blend source attribute parameter must be either zero or one.`, this);
            return null;
        }

        return lBlendSourceExpression.data.constantValue;
    }

    /**
     * Gets the interpolation from the interpolate attribute.
     *
     * @param pAttributes - Attribute list.
     * @param pContext - Abstract syntax tree context.
     * @param pMeta - Current metadata object (to check for location dependency).
     *
     * @returns The interpolation configuration or null if attribute not present or invalid.
     */
    private getInterpolation(pAttributes: AttributeListAst, pContext: AbstractSyntaxTreeContext, pMeta: PgslStructPropertyTraceConstructorParameter['meta']): { type: PgslInterpolateType, sampling: PgslInterpolateSampling } | null {
        if (!pAttributes.hasAttribute(AttributeListAst.attributeNames.interpolate)) {
            return null;
        }

        // Read attribute parameters, add another incident if not valid.
        const lAttributeParameter: Array<IExpressionAst> = pAttributes.getAttributeParameter(AttributeListAst.attributeNames.interpolate)!;
        if (lAttributeParameter.length !== 2) {
            pContext.pushIncident(`Interpolate attribute must have exactly two parameters.`, this);
            return null;
        }

        // Interpolate attribute only valid when location attribute is set.
        if (!pMeta.locationName) {
            pContext.pushIncident(`Interpolate attribute is only valid when location attribute is set.`, this);
            return null;
        }

        // Read expression trace.
        const lInterpolationTypeExpression: IExpressionAst = lAttributeParameter[0]
        const lSamplingExpression: IExpressionAst = lAttributeParameter[1]

        // Both expressions must have a constant value.
        if (typeof lInterpolationTypeExpression.data.constantValue !== 'string') {
            pContext.pushIncident(`First interpolate attribute parameter must be a constant string.`, this);
            return null;
        }
        if (typeof lSamplingExpression.data.constantValue !== 'string') {
            pContext.pushIncident(`Second interpolate attribute parameter must be a constant string.`, this);
            return null;
        }

        // Both constant values must be valid enum values.
        if (!PgslInterpolateTypeEnum.containsValue(lInterpolationTypeExpression.data.constantValue)) {
            pContext.pushIncident(`First interpolate attribute parameter is not a valid interpolate type.`, this);
            return null;
        }
        if (!PgslInterpolateSamplingEnum.containsValue(lSamplingExpression.data.constantValue)) {
            pContext.pushIncident(`Second interpolate attribute parameter is not a valid interpolate sampling.`, this);
            return null;
        }

        return {
            type: lInterpolationTypeExpression.data.constantValue,
            sampling: lSamplingExpression.data.constantValue,
        };
    }
}

export type StructPropertyDeclarationAstData = {
    /**
     * The name of the property
     */
    name: string;

    /**
     * The type of the property
     */
    typeDeclaration: TypeDeclarationAst;

    /**
     * Metadata for the property
     */
    meta: {
        /**
         * Memory alignment requirement in bytes
         */
        alignment?: number;

        /**
         * Size of the property in bytes
         */
        size?: number;

        /**
         * Location name for vertex to fragment or texture location data
         */
        locationName?: string;

        /**
         * Interpolation mode for vertex to fragment data
         */
        interpolation?: {
            type: PgslInterpolateType,
            sampling: PgslInterpolateSampling,
        };

        /**
         * Blend source configuration
         */
        blendSrc?: number;
    };
} & DeclarationAstData;