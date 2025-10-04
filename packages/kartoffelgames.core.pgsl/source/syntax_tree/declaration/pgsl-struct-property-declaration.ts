import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslFileMetaInformation } from "../pgsl-build-result.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from "../type/base-pgsl-type-definition.ts";
import { PgslDeclaration } from './pgsl-declaration.ts';

/**
 * PGSL syntax tree for a struct property declaration.
 */
export class PgslStructPropertyDeclaration extends PgslDeclaration {
    private readonly mName: string;
    private readonly mTypeDefinition: BasePgslTypeDefinition;

    /**
     * Property name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Property type.
     */
    public get type(): BasePgslTypeDefinition {
        return this.mTypeDefinition;
    }

    /**
     * Constructor.
     * 
     * @param pName - Property name.
     * @param pType - Property type.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pType: BasePgslTypeDefinition, pAttributes: PgslAttributeList, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mName = pName;
        this.mTypeDefinition = pType;

        // Add type defintion as child tree.
        this.appendChild(pType);
    }

    /**
     * Transpile current property declaration into a string.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled code.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        // Transpile property type.
        const lType: string = this.mTypeDefinition.transpile(pTrace);

        // Transpile attribute list.
        const lAttributes: string = this.attributes.transpile(pTrace);

        return `${lAttributes} ${this.mName}: ${lType},`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): void {
        // Validate type definition and attributes.
        this.mTypeDefinition.validate(pValidationTrace);
        this.attributes.validate(pValidationTrace);

        // Get property type attachment.
        const lPropertyTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment =  pValidationTrace.getAttachment( this.mTypeDefinition);

        // Validate property type.
        if (!lPropertyTypeAttachment.concrete) {
            pValidationTrace.pushError(`Property type must be concrete.`, this.meta, this);
        }
        if(!lPropertyTypeAttachment.plain) {
            pValidationTrace.pushError(`Property type must be plain.`, this.meta, this);
        }
    }
}