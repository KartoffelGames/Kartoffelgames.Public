import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslStructDeclarationSyntaxTree } from '../../declaration/pgsl-struct-declaration-syntax-tree.ts';
import { PgslBaseTypeName } from '../enum/pgsl-base-type-name.enum.ts';
import { BasePgslTypeDefinitionSyntaxTree, PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree.ts';

/**
 * struct type definition.
 */
export class PgslStructTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslStructTypeDefinitionSyntaxTreeSetupData> {
    private readonly mStructName: string;

    /**
     * Struct definition.
     */
    public get struct(): PgslStructDeclarationSyntaxTree {
        this.ensureSetup();

        return this.setupData?.data.struct;
    }

    /**
     * Struct name.
     */
    public get structName(): string {
        return this.mStructName;
    }

    /**
     * Constructor.
     * 
     * @param pStructName - name of struct.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pStructName: string, pMeta: BasePgslSyntaxTreeMeta) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set data.
        this.mStructName = pStructName;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastable(_pTarget: this): boolean {
        // Never castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isImplicitCastable(_pTarget: this): boolean {
        // Never castable.
        return false;
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<PgslStructTypeDefinitionSyntaxTreeSetupData> {
        // Read aliased type.
        const lStruct: PgslStructDeclarationSyntaxTree  = this.document.resolveStruct(this.mStructName);

        // Only when all members are constructable
        const lConstructable: boolean = (() => {
            for (const lProperty of lStruct.properties) {
                if (!lProperty.type.isConstructable) {
                    return false;
                }
            }

            return true;
        })();

        // Only when all members are sharable.
        const lHostSharable: boolean = (() => {
            for (const lProperty of lStruct.properties) {
                if (!lProperty.type.isHostShareable) {
                    return false;
                }
            }

            return true;
        })();

        // Only when all members are fixed.
        const lFixed: boolean = (() => {
            if (lStruct.properties.length === 0) {
                return true;
            }

            // Only the last member can be a variable size.
            return lStruct.properties.at(-1)!.type.isFixed;
        })();

        return {
            aliased: false,
            baseType: PgslBaseTypeName.Struct,
            data: {
                struct: lStruct
            },
            typeAttributes: {
                composite: true,
                constructable: lConstructable,
                fixed: lFixed,
                indexable: false,
                plain: true,
                hostSharable: lHostSharable,
                storable: true
            }
        };
    }
}

export type PgslStructTypeDefinitionSyntaxTreeSetupData = {
    struct: PgslStructDeclarationSyntaxTree;
};