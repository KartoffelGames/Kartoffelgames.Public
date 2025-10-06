import { PgslEnumTrace, PgslEnumTraceValues } from "../../trace/pgsl-enum-trace.ts";
import { PgslExpressionTrace } from "../../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../../trace/pgsl-trace.ts";
import { PgslInvalidType } from "../../type/pgsl-invalid-type.ts";
import { PgslNumericType } from "../../type/pgsl-numeric-type.ts";
import { PgslStringType } from "../../type/pgsl-string-type.ts";
import { PgslType } from "../../type/pgsl-type.ts";
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/pgsl-expression.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslDeclaration } from './pgsl-declaration.ts';

/**
 * PGSL syntax tree of a enum declaration.
 */
export class PgslEnumDeclaration extends PgslDeclaration {
    private readonly mName: string;
    private readonly mValues: PgslEnumDeclarationSyntaxTreeValues;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Constructor.
     * 
     * @param pName - Enum name.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pValue: PgslEnumDeclarationSyntaxTreeValues, pAttributes: PgslAttributeList, pMeta?: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mName = pName;
        this.mValues = pValue;

        // Add all values as child.
        for (const pItem of pValue) {
            this.appendChild(pItem.value);
        }
    }

    /**
     * Validate data of current structure.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Validate attributes.
        this.attributes.trace(pTrace);

        // Validate that the enum has no dublicate names.
        const lPropertyList: Map<string, PgslExpression> = new Map<string, PgslExpression>();

        let lFirstPropertyType: PgslType | null = null;
        for (const lProperty of this.mValues) {
            // Validate property.
            lProperty.value.trace(pTrace);

            // Validate dublicates.
            if (lPropertyList.has(lProperty.name)) {
                pTrace.pushIncident(`Value "${lProperty.name}" was already added to enum "${this.mName}"`, this);
            }

            // Add property.
            lPropertyList.set(lProperty.name, lProperty.value);

            // Read attachment of literal value.
            const lPropertyValueTrace: PgslExpressionTrace = pTrace.getExpression(lProperty.value);

            const lIsNumeric: boolean = lPropertyValueTrace.resolveType.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger))
            const lIsString: boolean = lPropertyValueTrace.resolveType.isImplicitCastableInto(new PgslStringType(pTrace));

            // All values need to be string or integer.
            if (!lIsNumeric && !lIsString) {
                pTrace.pushIncident(`Enum "${this.mName}" can only hold unsigned integer values.`, this);
            }
            
            // Init on first value.
            if (lFirstPropertyType === null) {
                lFirstPropertyType = lPropertyValueTrace.resolveType;
            }

            // Property is the same type as the others.
            if (!lPropertyValueTrace.resolveType.equals(lFirstPropertyType)) {
                pTrace.pushIncident(`Enum "${this.mName}" has mixed value types. Expected all values to be of the same type.`, this);
            }
        }

        // Fallback to invalid type.
        if (lFirstPropertyType === null) {
            lFirstPropertyType = new PgslInvalidType(pTrace);

            pTrace.pushIncident(`Enum ${this.mName} has no values`, this);
        }

        // Convert properties to trace values.
        const lTraceValues: PgslEnumTraceValues = Array.from(lPropertyList.entries()).map(([name, value]) => {
            return { name: name, value: value };
        });

        // Register enum.
        pTrace.registerEnum(new PgslEnumTrace(this.mName, lFirstPropertyType, lTraceValues));
    }
}

export type PgslEnumDeclarationSyntaxTreeValues = Array<{ name: string; value: PgslExpression; }>;