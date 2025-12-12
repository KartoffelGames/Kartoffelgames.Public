import { PgslEnumTrace, type PgslEnumTraceValues } from '../../trace/pgsl-enum-trace.ts';
import type { PgslExpressionTrace } from '../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../trace/pgsl-trace.ts';
import { PgslInvalidType } from '../../type/pgsl-invalid-type.ts';
import { PgslNumericType } from '../../type/pgsl-numeric-type.ts';
import { PgslStringType } from '../../type/pgsl-string-type.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../abstract-syntax-tree.ts';
import type { ExpressionAst } from '../expression/pgsl-expression.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslDeclaration } from './declaration-ast.ts';

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
     * Enum values.
     */
    public get values(): ReadonlyPgslEnumDeclarationSyntaxTreeValues {
        return this.mValues;
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
        for (const lItem of pValue) {
            this.appendChild(lItem.value);
        }
    }

    /**
     * Validate data of current structure.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Validate attributes.
        this.attributes.trace(pTrace);

        // Validate that the enum has no dublicate names.
        const lPropertyList: Map<string, ExpressionAst> = new Map<string, ExpressionAst>();

        // Check if enum is already defined.
        if (pTrace.getEnum(this.mName)) {
            pTrace.pushIncident(`Enum "${this.mName}" is already defined.`, this);
        }

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

            const lIsNumeric: boolean = lPropertyValueTrace.resolveType.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger));
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
        const lTraceValues: PgslEnumTraceValues = Array.from(lPropertyList.entries()).map(([pName, pValue]) => {
            return { name: pName, value: pValue };
        });

        // Register enum.
        pTrace.registerEnum(new PgslEnumTrace(this.mName, lFirstPropertyType, lTraceValues));
    }
}

export type PgslEnumDeclarationSyntaxTreeValues = Array<{ name: string; value: ExpressionAst; }>;
export type ReadonlyPgslEnumDeclarationSyntaxTreeValues = ReadonlyArray<{ readonly name: string; readonly value: ExpressionAst; }>;