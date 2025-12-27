import { Exception } from '@kartoffelgames/core';
import type { StructDeclarationAst } from '../abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import type { StructPropertyDeclarationAst } from '../abstract_syntax_tree/declaration/struct-property-declaration-ast.ts';
import type { VariableDeclarationAst } from '../abstract_syntax_tree/declaration/variable-declaration-ast.ts';

export class TranspilationMeta {
    private readonly mStructLocations: Map<StructDeclarationAst, Map<StructPropertyDeclarationAst, number>>;
    private readonly mBindings: Map<VariableDeclarationAst, TranspilationMetaBinding>;
    private readonly mBindingNameResolutions: Map<string, TranspilationMetaBindingNameResolutions>;

    /**
     * Creates a new transpilation meta instance.
     */
    public constructor() {
        this.mStructLocations = new Map<StructDeclarationAst, Map<StructPropertyDeclarationAst, number>>();
        this.mBindings = new Map<VariableDeclarationAst, TranspilationMetaBinding>();
        this.mBindingNameResolutions = new Map<string, TranspilationMetaBindingNameResolutions>();
    }

    /**
     * Reads the location mapping for a struct.
     * 
     * @param pStruct - Struct declaration.
     * 
     * @returns Mapping of struct properties to their locations. 
     */
    public locationsOf(pStruct: StructDeclarationAst): ReadonlyMap<StructPropertyDeclarationAst, number> {
        const lLocations: Map<StructPropertyDeclarationAst, number> | undefined = this.mStructLocations.get(pStruct);
        if (!lLocations) {
            return new Map<StructPropertyDeclarationAst, number>();
        }
        return lLocations;
    }

    /**
     * Reads the binding information for a variable declaration.
     * 
     * @param pVariable - Variable declaration.
     * 
     * @returns Binding information or null if not found. 
     */
    public bindingOf(pVariable: VariableDeclarationAst): TranspilationMetaBinding | null {
        const lBinding: TranspilationMetaBinding | undefined = this.mBindings.get(pVariable);
        if (!lBinding) {
            return null;
        }

        return lBinding;
    }

    /**
     * Creates a location mapping for a struct property.
     * If it already exists, the existing location is returned.
     * 
     * @param pStruct - Struct declaration.
     * @param pProperty - Struct property declaration.
     * 
     * @returns Location index.
     */
    public createLocationFor(pStruct: StructDeclarationAst, pProperty: StructPropertyDeclarationAst): number {
        // Get or create location map for struct.
        let lLocations: Map<StructPropertyDeclarationAst, number> | undefined = this.mStructLocations.get(pStruct);
        if (!lLocations) {
            lLocations = new Map<StructPropertyDeclarationAst, number>();
            this.mStructLocations.set(pStruct, lLocations);
        }

        // Check if property already has a location, else create a new one.
        let lLocation: number | undefined = lLocations.get(pProperty);
        if (typeof lLocation !== 'number') {
            lLocation = lLocations.size;
            lLocations.set(pProperty, lLocation);
        }

        return lLocation;
    }

    /**
     * Registers a module-level variable declaration.
     *
     * @param pValue - The value of the variable.
     */
    public createBindingFor(pValue: VariableDeclarationAst): TranspilationMetaBinding {
        if (!pValue.data.bindingInformation) {
            throw new Exception(`Cannot create binding for variable declaration '${pValue.data.name}' without binding information.`, pValue);
        }

        // Create resolved bindings if value is a resource.
        if (!this.mBindings.has(pValue)) {
            const lBinding: TranspilationMetaBinding = this.resolveBinding(pValue.data.bindingInformation.bindGroupName, pValue.data.bindingInformation.bindLocationName);
            this.mBindings.set(pValue, lBinding);
        }

        return this.mBindings.get(pValue)!;
    }

    /**
     * Resolves the binding for a given bind group and binding name.
     *
     * @param pBindGroupName - The name of the bind group.
     * @param pBindingName - The name of the binding.
     *
     * @returns The resolved binding information.
     */
    private resolveBinding(pBindGroupName: string, pBindingName: string): TranspilationMetaBinding {
        // Create a new bind group index or read existing one.
        let lBindGroupIndex: number | null = this.mBindingNameResolutions.get(pBindGroupName)?.index ?? null;
        if (lBindGroupIndex === null) {
            // Use the current size as new bind group index.
            lBindGroupIndex = this.mBindingNameResolutions.size;

            // Create a new entry for the bind group if it does not exist.
            this.mBindingNameResolutions.set(pBindGroupName, {
                index: lBindGroupIndex,
                locations: new Map<string, number>(),
            });
        }

        // Read the binding names map of the current bind group.
        const lBindGroupLocations: Map<string, number> = this.mBindingNameResolutions.get(pBindGroupName)!.locations;

        // Check if bindgroup binding exists and create if needed.
        if (!lBindGroupLocations.has(pBindingName)) {
            // Read the current bind group binding index of the current bind group and increment them by one.
            const lNextBindGroupBindingIndex: number = lBindGroupLocations.size;

            // Save the increment.
            lBindGroupLocations.set(pBindingName, lNextBindGroupBindingIndex);
        }

        // Return the binding location.
        return {
            bindGroupIndex: lBindGroupIndex,
            bindingIndex: lBindGroupLocations.get(pBindingName)!,
        };
    }
}

export type TranspilationMetaBinding = {
    readonly bindGroupIndex: number;
    readonly bindingIndex: number;
};

export type TranspilationMetaBindingNameResolutions = {
    index: number;
    locations: Map<string, number>;
};