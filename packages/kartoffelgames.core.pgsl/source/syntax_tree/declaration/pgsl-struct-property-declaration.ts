import { Exception } from "@kartoffelgames/core";
import { PgslTrace } from "../../trace/pgsl-trace.ts";
import { PgslType } from "../../type/pgsl-type.ts";
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslTypeDefinition } from "../general/pgsl-type-definition.ts";
import { PgslDeclaration } from './pgsl-declaration.ts';
import { PgslStructDeclaration } from "./pgsl-struct-declaration.ts";
import { PgslStructPropertyTrace, PgslStructPropertyTraceConstructorParameter } from "../../trace/pgsl-struct-property-trace.ts";
import { PgslExpression } from "../expression/pgsl-expression.ts";
import { PgslExpressionTrace } from "../../trace/pgsl-expression-trace.ts";
import { PgslInterpolateTypeEnumDeclaration } from "../buildin/pgsl-interpolate-type-enum-declaration.ts";
import { PgslInterpolateSamplingEnumDeclaration } from "../buildin/pgsl-interpolate-sampling-enum-declaration.ts";

/**
 * PGSL syntax tree for a struct property declaration.
 */
export class PgslStructPropertyDeclaration extends PgslDeclaration {
    private readonly mName: string;
    private readonly mTypeDefinition: PgslTypeDefinition;
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
    public get type(): PgslTypeDefinition {
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
    public constructor(pName: string, pType: PgslTypeDefinition, pAttributes: PgslAttributeList, pMeta?: BasePgslSyntaxTreeMeta) {
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
                const lAttributeParameter: Array<PgslExpression> = this.attributes.getAttributeParameter(PgslAttributeList.attributeNames.accessMode)!;
                if (lAttributeParameter.length !== 1) {
                    pTrace.pushIncident(`Location attribute must have exactly one parameter.`, this);
                    return;
                }

                // Read expression trace.
                const pExpressionTrace: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[0]);

                // Expression must have a constant value.
                if (typeof pExpressionTrace.constantValue !== 'string') {
                    pTrace.pushIncident(`Location attribute parameter must be a constant string.`, this);
                    return;
                }

                // Set location name to meta.
                lMeta.locationName = pExpressionTrace.constantValue;
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
                const pExpressionTrace: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[0]);

                // Expression must have a constant value.
                if (typeof pExpressionTrace.constantValue !== 'number') {
                    pTrace.pushIncident(`Size attribute parameter must be a constant number.`, this);
                    return;
                }

                // Value must be a positive integer.
                if (!Number.isInteger(pExpressionTrace.constantValue) || pExpressionTrace.constantValue <= 0) {
                    pTrace.pushIncident(`Size attribute parameter must be a positive integer.`, this);
                    return;
                }

                // Set size to meta.
                lMeta.size = pExpressionTrace.constantValue;
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
                const pExpressionTrace: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[0]);

                // Expression must have a constant value.
                if (typeof pExpressionTrace.constantValue !== 'number') {
                    pTrace.pushIncident(`Align attribute parameter must be a constant number.`, this);
                    return;
                }

                // Number must be a positive integer.
                if (!Number.isInteger(pExpressionTrace.constantValue) || pExpressionTrace.constantValue <= 0) {
                    pTrace.pushIncident(`Align attribute parameter must be a positive integer.`, this);
                    return;
                }

                // Number must be a power of two.
                if ((pExpressionTrace.constantValue & (pExpressionTrace.constantValue - 1)) !== 0) {
                    pTrace.pushIncident(`Align attribute parameter must be a power of two.`, this);
                    return;
                }

                // Set align to meta.
                lMeta.alignment = pExpressionTrace.constantValue;
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
                const pExpressionTrace: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[0]);

                // Expression must have a constant value.
                if (typeof pExpressionTrace.constantValue !== 'number') {
                    pTrace.pushIncident(`Blend source attribute parameter must be a constant number.`, this);
                    return;
                }

                // Number must be either a zero or one.
                if (pExpressionTrace.constantValue !== 0 && pExpressionTrace.constantValue !== 1) {
                    pTrace.pushIncident(`Blend source attribute parameter must be either zero or one.`, this);
                    return;
                }

                // Set blend source to meta.
                lMeta.blendSrc = pExpressionTrace.constantValue;
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
                const pExpressionTraceType: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[0]);
                const pExpressionTraceSampling: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[1]);

                // Both expressions must have a constant value.
                if (typeof pExpressionTraceType.constantValue !== 'string') {
                    pTrace.pushIncident(`First interpolate attribute parameter must be a constant string.`, this);
                    return;
                }
                if (typeof pExpressionTraceSampling.constantValue !== 'string') {
                    pTrace.pushIncident(`Second interpolate attribute parameter must be a constant string.`, this);
                    return;
                }

                // Both constant values must be valid enum values.
                if (!PgslInterpolateTypeEnumDeclaration.containsValue(pExpressionTraceType.constantValue)) {
                    pTrace.pushIncident(`First interpolate attribute parameter is not a valid interpolate type.`, this);
                    return;
                }
                if (!PgslInterpolateSamplingEnumDeclaration.containsValue(pExpressionTraceSampling.constantValue)) {
                    pTrace.pushIncident(`Second interpolate attribute parameter is not a valid interpolate sampling.`, this);
                    return;
                }
                
                // Set interpolation to meta.
                lMeta.interpolation = {
                    type: pExpressionTraceType.constantValue,
                    sampling: pExpressionTraceSampling.constantValue,
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