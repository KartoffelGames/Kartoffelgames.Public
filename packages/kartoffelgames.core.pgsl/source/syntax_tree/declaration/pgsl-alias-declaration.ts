import { PgslAliasTrace } from "../../trace/pgsl-alias-trace.ts";
import { PgslTrace } from "../../trace/pgsl-trace.ts";
import { PgslType } from "../../type/pgsl-type.ts";
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslTypeDeclaration } from "../general/pgsl-type-declaration.ts";
import { PgslDeclaration } from './pgsl-declaration.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslAliasDeclaration extends PgslDeclaration {
    private readonly mName: string;
    private readonly mTypeDefinition: PgslTypeDeclaration;

    /**
     * Alias name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Constructor.
     * 
     * @param pName - Alias name.
     * @param pType - Aliased type.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pType: PgslTypeDeclaration, pAttributeList: PgslAttributeList, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributeList, pMeta);

        // Set data.
        this.mName = pName;
        this.mTypeDefinition = pType;

        // Add child trees.
        this.appendChild(pType);
    }

    /**
     * Trace the declaration.
     * 
     * @param pTrace - Trace context.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Trace attributes and type definition.
        this.attributes.trace(pTrace);
        this.mTypeDefinition.trace(pTrace);

        // Read type of type definition.
        const lType: PgslType = this.mTypeDefinition.type;

        // Create alias trace.
        const lAliasTrace: PgslAliasTrace = new PgslAliasTrace(this.mName, lType);

        // Register alias.
        pTrace.registerAlias(lAliasTrace);
    }
}