import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../type/base-pgsl-type-definition.ts";
import { BasePgslDeclaration } from './base-pgsl-declaration.ts';
import type { PgslStructPropertyDeclaration } from './pgsl-struct-property-declaration.ts';

/**
 * PGSL syntax tree for a struct declaration.
 */
export class PgslStructDeclaration extends BasePgslDeclaration {
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

        // Add all properties as child.
        this.appendChild(...pProperties);
    }

    /**
     * Transpile current struct declaration into a string.
     * 
     * @returns Transpiled code.
     */
    protected override onTranspile(): string {
        // Transpile attribute list.
        const lAttributes: string = this.attributes.transpile();

        // Transpile properties.
        const lProperties: string = this.mProperties.map((pProperty: PgslStructPropertyDeclaration) => pProperty.transpile()).join(' ');

        return `${lAttributes} struct ${this.mName} {\n${lProperties}\n}\n`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): void {
        // Push struct declaration as scoped value.
        pValidationTrace.pushScopedValue(this.mName, this);

        // Validate attributes.
        this.attributes.validate(pValidationTrace);

        const lNameBuffer: Set<string> = new Set<string>();

        // Create new scope for validation of properties.
        pValidationTrace.newScope(this, () => {
            for (let lIndex: number = 0; lIndex < this.mProperties.length; lIndex++) {
                // Read property.
                const lProperty: PgslStructPropertyDeclaration = this.mProperties[lIndex];

                // Validate property. Type validation is in property syntax tree.
                lProperty.validate(pValidationTrace);

                // Validate property name.
                if (lNameBuffer.has(lProperty.name)) {
                    pValidationTrace.pushError(`Property name '${lProperty.name}' is already used in struct '${this.mName}'.`, lProperty.meta, this);
                }

                // Add property name to buffer.
                // This is used to check for duplicate property names.
                lNameBuffer.add(lProperty.name);

                // Only last property is allowed to be variable but then the struct is no longer fixed. // TODO: Maybe set this in validation.
                // Skip for last property. 
                if (lIndex !== this.mProperties.length - 1) {
                    // Read attachment of type.
                    const lTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lProperty.type);

                    // Validate if properties dont have fixed length.
                    if (!lTypeAttachment.fixedFootprint) {
                        pValidationTrace.pushError('Only the last property of a struct can have a variable length.', lProperty.meta, this);
                    }
                }
            }
        });

        // Must have at least one property.
        if (this.mProperties.length === 0) {
            pValidationTrace.pushError('Struct must have at least one property.', this.meta, this);
        }
    }
}