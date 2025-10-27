import { Exception } from '@kartoffelgames/core';
import type { PgslTrace } from '../../trace/pgsl-trace.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import type { PgslTypeDeclaration } from '../general/pgsl-type-declaration.ts';
import { PgslDeclaration } from './pgsl-declaration.ts';
import type { PgslStructDeclaration } from './pgsl-struct-declaration.ts';
import { PgslStructPropertyTrace, type PgslStructPropertyTraceConstructorParameter } from '../../trace/pgsl-struct-property-trace.ts';
import type { PgslExpression } from '../expression/pgsl-expression.ts';
import type { PgslExpressionTrace } from '../../trace/pgsl-expression-trace.ts';
import { PgslInterpolateTypeEnumDeclaration } from '../buildin/pgsl-interpolate-type-enum-declaration.ts';
import { PgslInterpolateSamplingEnumDeclaration } from '../buildin/pgsl-interpolate-sampling-enum-declaration.ts';

/**
 * PGSL syntax tree for a struct property declaration.
 */
export class PgslStructPropertyDeclaration extends PgslDeclaration {
    private readonly mName: string;
    private readonly mTypeDefinition: PgslTypeDeclaration;
    private mStruct: PgslStructDeclaration | null = null;

    /**
     * Property name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Property type.
     */
    public get type(): PgslTypeDeclaration {
        return this.mTypeDefinition;
    }

    /**
     * Get parent struct of this property.
     */
    public get struct(): PgslStructDeclaration {
        if (!this.mStruct) {
            throw new Exception(`Property ${this.name} is not part of a struct.`, this);
        }

        return this.mStruct;
    }

    /**
     * Constructor.
     * 
     * @param pName - Property name.
     * @param pType - Property type.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pType: PgslTypeDeclaration, pAttributes: PgslAttributeList, pMeta?: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mName = pName;
        this.mTypeDefinition = pType;
        this.mStruct = null;

        // Add type defintion as child tree.
        this.appendChild(pType);
    }

    /**
     * Set the struct this property belongs to.
     * 
     * @param pStruct - Struct declaration.
     */
    public setContainingStruct(pStruct: PgslStructDeclaration): void {
        if (this.mStruct) {
            throw new Exception(`Property ${this.name} is already part of a struct.`, this);
        }

        this.mStruct = pStruct;
    }

    /**
     * Validate data of current structure.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Validate type definition and attributes.
        this.mTypeDefinition.trace(pTrace);
        this.attributes.trace(pTrace);

        // Get property type.
        const lType: PgslType = this.mTypeDefinition.type;

        // Validate property type.
        if (!lType.concrete) {
            pTrace.pushIncident(`Property type must be concrete.`, this);
        }
        if (!lType.plain) {
            pTrace.pushIncident(`Property type must be plain.`, this);
        }

        // Set property meta based on attributes.
        const lMeta: PgslStructPropertyTraceConstructorParameter['meta'] = {};

        // Check for location attriute.
        (() => {
            if (this.attributes.hasAttribute(PgslAttributeList.attributeNames.location)) {
                // Read attribute parameterk, add another incident if not valid.
                const lAttributeParameter: Array<PgslExpression> = this.attributes.getAttributeParameter(PgslAttributeList.attributeNames.location)!;
                if (lAttributeParameter.length !== 1) {
                    pTrace.pushIncident(`Location attribute must have exactly one parameter.`, this);
                    return;
                }

                // Read expression trace.
                const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[0]);

                // Expression must have a constant value.
                if (typeof lExpressionTrace.constantValue !== 'string') {
                    pTrace.pushIncident(`Location attribute parameter must be a constant string.`, this);
                    return;
                }

                // Set location name to meta.
                lMeta.locationName = lExpressionTrace.constantValue;
            }
        })();

        // Check for size attribute.
        (() => {
            if (this.attributes.hasAttribute(PgslAttributeList.attributeNames.size)) {
                // Read attribute parameters, add another incident if not valid.
                const lAttributeParameter: Array<PgslExpression> = this.attributes.getAttributeParameter(PgslAttributeList.attributeNames.size)!;
                if (lAttributeParameter.length !== 1) {
                    pTrace.pushIncident(`Size attribute must have exactly one parameter.`, this);
                    return;
                }

                // Read expression trace.
                const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[0]);

                // Expression must have a constant value.
                if (typeof lExpressionTrace.constantValue !== 'number') {
                    pTrace.pushIncident(`Size attribute parameter must be a constant number.`, this);
                    return;
                }

                // Value must be a positive integer.
                if (!Number.isInteger(lExpressionTrace.constantValue) || lExpressionTrace.constantValue <= 0) {
                    pTrace.pushIncident(`Size attribute parameter must be a positive integer.`, this);
                    return;
                }

                // Set size to meta.
                lMeta.size = lExpressionTrace.constantValue;
            }
        })();

        // Check for alignment attribute.
        (() => {
            if (this.attributes.hasAttribute(PgslAttributeList.attributeNames.align)) {
                // Read attribute parameters, add another incident if not valid.
                const lAttributeParameter: Array<PgslExpression> = this.attributes.getAttributeParameter(PgslAttributeList.attributeNames.align)!;
                if (lAttributeParameter.length !== 1) {
                    pTrace.pushIncident(`Align attribute must have exactly one parameter.`, this);
                    return;
                }

                // Read expression trace.
                const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[0]);

                // Expression must have a constant value.
                if (typeof lExpressionTrace.constantValue !== 'number') {
                    pTrace.pushIncident(`Align attribute parameter must be a constant number.`, this);
                    return;
                }

                // Number must be a positive integer.
                if (!Number.isInteger(lExpressionTrace.constantValue) || lExpressionTrace.constantValue <= 0) {
                    pTrace.pushIncident(`Align attribute parameter must be a positive integer.`, this);
                    return;
                }

                // Number must be a power of two.
                if ((lExpressionTrace.constantValue & (lExpressionTrace.constantValue - 1)) !== 0) {
                    pTrace.pushIncident(`Align attribute parameter must be a power of two.`, this);
                    return;
                }

                // Set align to meta.
                lMeta.alignment = lExpressionTrace.constantValue;
            }
        })();

        // Check for blend source attribute.
        (() => {
            if (this.attributes.hasAttribute(PgslAttributeList.attributeNames.blendSource)) {
                // Read attribute parameters, add another incident if not valid.
                const lAttributeParameter: Array<PgslExpression> = this.attributes.getAttributeParameter(PgslAttributeList.attributeNames.blendSource)!;
                if (lAttributeParameter.length !== 1) {
                    pTrace.pushIncident(`Blend source attribute must have exactly one parameter.`, this);
                    return;
                }

                // Blend source attribute only valid when location attribute is set.
                if (!lMeta.locationName) {
                    pTrace.pushIncident(`Blend source attribute is only valid when location attribute is set.`, this);
                    return;
                }

                // Read expression trace.
                const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[0]);

                // Expression must have a constant value.
                if (typeof lExpressionTrace.constantValue !== 'number') {
                    pTrace.pushIncident(`Blend source attribute parameter must be a constant number.`, this);
                    return;
                }

                // Number must be either a zero or one.
                if (lExpressionTrace.constantValue !== 0 && lExpressionTrace.constantValue !== 1) {
                    pTrace.pushIncident(`Blend source attribute parameter must be either zero or one.`, this);
                    return;
                }

                // Set blend source to meta.
                lMeta.blendSrc = lExpressionTrace.constantValue;
            }
        })();

        // Check for interpolation attribute.
        (() => {
            if (this.attributes.hasAttribute(PgslAttributeList.attributeNames.interpolate)) {
                // Read attribute parameters, add another incident if not valid.
                const lAttributeParameter: Array<PgslExpression> = this.attributes.getAttributeParameter(PgslAttributeList.attributeNames.interpolate)!;
                if (lAttributeParameter.length !== 2) {
                    pTrace.pushIncident(`Interpolate attribute must have exactly two parameters.`, this);
                    return;
                }

                // Interpolate attribute only valid when location attribute is set.
                if (!lMeta.locationName) {
                    pTrace.pushIncident(`Interpolate attribute is only valid when location attribute is set.`, this);
                    return;
                }

                // Read expression trace.
                const lExpressionTraceType: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[0]);
                const lExpressionTraceSampling: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[1]);

                // Both expressions must have a constant value.
                if (typeof lExpressionTraceType.constantValue !== 'string') {
                    pTrace.pushIncident(`First interpolate attribute parameter must be a constant string.`, this);
                    return;
                }
                if (typeof lExpressionTraceSampling.constantValue !== 'string') {
                    pTrace.pushIncident(`Second interpolate attribute parameter must be a constant string.`, this);
                    return;
                }

                // Both constant values must be valid enum values.
                if (!PgslInterpolateTypeEnumDeclaration.containsValue(lExpressionTraceType.constantValue)) {
                    pTrace.pushIncident(`First interpolate attribute parameter is not a valid interpolate type.`, this);
                    return;
                }
                if (!PgslInterpolateSamplingEnumDeclaration.containsValue(lExpressionTraceSampling.constantValue)) {
                    pTrace.pushIncident(`Second interpolate attribute parameter is not a valid interpolate sampling.`, this);
                    return;
                }
                
                // Set interpolation to meta.
                lMeta.interpolation = {
                    type: lExpressionTraceType.constantValue,
                    sampling: lExpressionTraceSampling.constantValue,
                };
            }
        })();

        // Register locations.
        pTrace.registerStructProperty(this, new PgslStructPropertyTrace({
            name: this.mName,
            type: lType,
            meta: lMeta
        }));
    }
}