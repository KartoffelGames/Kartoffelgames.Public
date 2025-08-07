import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree } from "../type/base-pgsl-type-definition-syntax-tree.ts";
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslAliasDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree {
    private readonly mName: string;
    private readonly mTypeDefinition: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Alias name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Alias type definition.
     */
    public get type(): BasePgslTypeDefinitionSyntaxTree {
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
    public constructor(pName: string, pType: BasePgslTypeDefinitionSyntaxTree, pAttributeList: PgslAttributeListSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
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
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        // Transpile attribute list.
        let lResult: string = this.attributes.transpile();

        // Create a alias declaration for the type.
        lResult += `alias ${this.mName} = ${this.mTypeDefinition.transpile()};\n`;

        return lResult;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): void {
        pValidationTrace.pushScopedValue(this.mName, this);

        // Validate type definition and attributes.
        this.mTypeDefinition.validate(pValidationTrace);
        this.attributes.validate(pValidationTrace);
    }
}