import { PgslStructTrace } from '../../trace/pgsl-struct-trace.ts';
import type { PgslTrace } from '../../trace/pgsl-trace.ts';
import type { BasePgslSyntaxTreeMeta } from '../abstract-syntax-tree.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslDeclaration } from './declaration-ast.ts';
import type { PgslStructPropertyDeclaration } from './pgsl-struct-property-declaration.ts';

/**
 * PGSL syntax tree for a struct declaration.
 */
export class PgslStructDeclaration extends PgslDeclaration {
    private readonly mName: string;
    private readonly mProperties: Array<PgslStructPropertyDeclaration>;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Variable name.
     */
    public get properties(): Array<PgslStructPropertyDeclaration> {
        return this.mProperties;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pName: string, pProperties: Array<PgslStructPropertyDeclaration>, pAttributes: PgslAttributeList, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mName = pName;
        this.mProperties = pProperties;

        // Add all properties as child and set this struct as parent.
        for (const lProperty of pProperties) {
            lProperty.setContainingStruct(this);

            // Add property as child.
            this.appendChild(lProperty);
        }
    }

    /**
     * Trace data of current structure.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Trace attributes.
        this.attributes.trace(pTrace);

        // Check if struct is already defined.
        if (pTrace.getStruct(this.mName)) {
            pTrace.pushIncident(`Struct "${this.mName}" is already defined.`, this);
        }

        const lNameBuffer: Set<string> = new Set<string>();

        // Create new struct trace and register struct before tracing as the properties need to be able to reference the struct itself.
        const lStructTrace = new PgslStructTrace(this.mName, this);
        pTrace.registerStruct(lStructTrace);

        // Validate properties.
        for (let lIndex: number = 0; lIndex < this.mProperties.length; lIndex++) {
            // Read property.
            const lProperty: PgslStructPropertyDeclaration = this.mProperties[lIndex];

            // Validate property. Type validation is in property syntax tree.
            lProperty.trace(pTrace);

            // Validate property name.
            if (lNameBuffer.has(lProperty.name)) {
                pTrace.pushIncident(`Property name '${lProperty.name}' is already used in struct '${this.mName}'.`, lProperty);
            }

            // Add property name to buffer.
            // This is used to check for duplicate property names.
            lNameBuffer.add(lProperty.name);

            // Only last property is allowed to be variable but then the struct is no longer fixed.
            // Skip for last property. 
            if (lIndex !== this.mProperties.length - 1) {
                // Validate if properties dont have fixed length.
                if (!lProperty.type.type.fixedFootprint) {
                    pTrace.pushIncident('Only the last property of a struct can have a variable length.', lProperty);
                }
            }
        }

        // Must have at least one property.
        if (this.mProperties.length === 0) {
            pTrace.pushIncident('Struct must have at least one property.', this);
        }
    }
}