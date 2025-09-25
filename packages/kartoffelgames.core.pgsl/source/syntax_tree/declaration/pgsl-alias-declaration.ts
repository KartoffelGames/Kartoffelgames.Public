import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslFileMetaInformation } from "../pgsl-file-meta-information.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition } from "../type/base-pgsl-type-definition.ts";
import { BasePgslDeclaration } from './base-pgsl-declaration.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslAliasDeclaration extends BasePgslDeclaration {
    private readonly mName: string;
    private readonly mTypeDefinition: BasePgslTypeDefinition;

    /**
     * Alias name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Alias type definition.
     */
    public get type(): BasePgslTypeDefinition {
        return this.mTypeDefinition;
    }

    /**
     * Constructor.
     * 
     * @param pName - Alias name.
     * @param pType - Aliased type.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pType: BasePgslTypeDefinition, pAttributeList: PgslAttributeList, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributeList, pMeta);

        // Set data.
        this.mName = pName;
        this.mTypeDefinition = pType;

        // Add child trees.
        this.appendChild(pType);
    }

    /**
     * Transpile current alias declaration into a string.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        // Transpile attribute list.
        let lResult: string = this.attributes.transpile(pTrace);

        // Create a alias declaration for the type.
        lResult += `alias ${this.mName} = ${this.mTypeDefinition.transpile(pTrace)};\n`;

        return lResult;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): void {
        pValidationTrace.pushScopedValue(this.mName, this);

        // Validate type definition and attributes.
        this.mTypeDefinition.validate(pValidationTrace);
        this.attributes.validate(pValidationTrace);
    }
}