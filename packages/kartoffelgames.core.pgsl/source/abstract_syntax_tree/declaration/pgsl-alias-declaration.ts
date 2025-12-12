import { PgslAliasTrace } from '../../trace/pgsl-alias-trace.ts';
import type { PgslTrace } from '../../trace/pgsl-trace.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../abstract-syntax-tree.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import type { PgslTypeDeclaration } from '../general/pgsl-type-declaration.ts';
import { PgslDeclaration } from './declaration-ast.ts';

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
     * Aliased type definition.
     */
    public get typeDefinition(): PgslTypeDeclaration {
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

        // Check if alias with same name already exists.
        if (pTrace.getAlias(this.mName)) {
            pTrace.pushIncident(`Alias with name "${this.mName}" already defined.`, this);
            return;
        }

        // Create alias trace.
        const lAliasTrace: PgslAliasTrace = new PgslAliasTrace(this.mName, lType);

        // Register alias.
        pTrace.registerAlias(lAliasTrace);
    }
}