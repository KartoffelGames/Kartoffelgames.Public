import type { TypeCst } from '../../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { StructDeclarationAst } from '../declaration/struct-declaration-ast.ts';
import type { IType, TypeProperties } from './i-type.interface.ts';

/**
 * Struct type definition.
 * Represents a user-defined struct type that contains multiple named fields.
 * Struct types are composite types that can be used to group related data.
 */
export class PgslStructType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements IType {
    private readonly mStructName: string;

    /**
     * Gets the name of the struct type.
     * 
     * @returns The struct name.
     */
    public get structName(): string {
        return this.mStructName;
    }

    /**
     * Constructor for struct type.
     * 
     * @param pStructName - The name of the struct type.
     */
    public constructor(pStructName: string) {
        super({ type: 'Type', range: [0, 0, 0, 0] });

        // Set data.
        this.mStructName = pStructName;
    }

    /**
     * Compare this struct type with a target type for equality.
     * Two struct types are equal if they have the same struct name.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same struct name.
     */
    public equals(pTarget: IType): boolean {
        // Must both be a struct.
        if (!(pTarget instanceof PgslStructType)) {
            return false;
        }

        return this.structName === pTarget.structName;
    }

    /**
     * Check if this struct type is explicitly castable into the target type.
     * Struct types are never castable to other types.
     * 
     * @param _pTarget - Target type to check castability to.
     * 
     * @returns Always false - structs cannot be cast.
     */
    public isExplicitCastableInto(_pTarget: IType): boolean {
        // A struct is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if this struct type is implicitly castable into the target type.
     * Struct types are never castable to other types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns Always false - structs cannot be cast.
     */
    public isImplicitCastableInto(pTarget: IType): boolean {
        // A struct is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for struct types.
     * Validates that the struct exists and aggregates properties from all struct fields.
     * 
     * @param pContext - Trace context for validation and error reporting.
     * 
     * @returns Type properties aggregated from struct fields.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): TypeProperties {
        // Read struct trace information.
        const lStruct: StructDeclarationAst | undefined = pContext.getStruct(this.mStructName);

        if (!lStruct) {
            pContext.pushIncident(`Name '${this.mStructName}' does not resolve to a struct declaration.`);

            return {
                // Meta information.
                metaTypes: [`Struct-${this.mStructName}`],

                // Default struct information.
                composite: true,
                indexable: false,
                storable: true,
                scalar: false,
                concrete: true,
                plain: true,

                // Data normally from struct properties.
                hostShareable: false,
                constructible: false,
                fixedFootprint: false,
            };
        }

        // Check properties for constructible, host shareable, and fixed footprint characteristics
        const [lConstructible, lHostShareable, lFixedFootprint]: [boolean, boolean, boolean] = (() => {
            let lConstructible = true;
            let lHostShareable = true;
            let lFixedFootprint = true;

            // Check all properties for their characteristics
            for (const lPropertyDeclaration of lStruct.data.properties) {
                // Check if property is constructible
                lConstructible &&= lPropertyDeclaration.data.typeDeclaration.data.type.data.constructible;

                // Check if property is host shareable
                lHostShareable &&= lPropertyDeclaration.data.typeDeclaration.data.type.data.hostShareable;

                // For fixed footprint: all properties must be fixed
                lFixedFootprint &&= lPropertyDeclaration.data.typeDeclaration.data.type.data.fixedFootprint;
            }

            return [lConstructible, lHostShareable, lFixedFootprint];
        })();

        return {
            // Meta information.
            metaTypes: [`Struct-${this.mStructName}`],

            // Default struct information.
            composite: true,
            indexable: false,
            storable: true,
            scalar: false,
            concrete: true,
            plain: true,

            // Only takes effect when all members share the same property.
            hostShareable: lHostShareable,
            constructible: lConstructible,
            fixedFootprint: lFixedFootprint,
        };
    }
}