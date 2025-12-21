import { StructDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from "../abstract-syntax-tree.ts";
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { DeclarationAstData, IDeclarationAst } from "./i-declaration-ast.interface.ts";
import { StructPropertyDeclarationAst } from './struct-property-declaration-ast.ts';

// TODO: Dynamically calculate size and alignment based on type.

/**
 * PGSL syntax tree for a struct declaration.
 */
export class StructDeclarationAst extends AbstractSyntaxTree<StructDeclarationCst, StructDeclarationAstData> implements IDeclarationAst {
    /**
     * Trace data of current structure.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): StructDeclarationAstData {
        // Create attribute list.
        const lAttributes: AttributeListAst = new AttributeListAst(this.cst.attributeList, this).process(pContext);

        // Check if struct is already defined.
        if (pContext.getStruct(this.cst.name)) {
            pContext.pushIncident(`Struct "${this.cst.name}" is already defined.`, this);
        }

        // Save properties as map. Luck for us, properties are still kept in order like in a array.
        const lProperties: Map<string, StructPropertyDeclarationAst> = new Map<string, StructPropertyDeclarationAst>();
        const lLocationNames: Set<string> = new Set<string>();

        // Validate properties.
        for (let lIndex: number = 0; lIndex < this.cst.properties.length; lIndex++) {
            // Read property.
            const lProperty: StructPropertyDeclarationAst = new StructPropertyDeclarationAst(this.cst.properties[lIndex], this).process(pContext);

            // Validate property name.
            if (lProperties.has(lProperty.data.name)) {
                pContext.pushIncident(`Property name '${lProperty.data.name}' is already used in struct '${this.cst.name}'.`, lProperty);
            }

            // Add property name to buffer.
            // This is used to check for duplicate property names.
            lProperties.set(lProperty.data.name, lProperty);

            // Only last property is allowed to be variable but then the struct is no longer fixed.
            // Skip for last property. 
            if (lIndex !== this.cst.properties.length - 1) {
                // Validate if properties dont have fixed length.
                if (!lProperty.data.typeDeclaration.data.type.data.fixedFootprint) {
                    pContext.pushIncident('Only the last property of a struct can have a variable length.', lProperty);
                }
            }

            // Validate if property unique location attribute.
            if (lProperty.data.meta.locationName) {
                if (lLocationNames.has(lProperty.data.meta.locationName)) {
                    pContext.pushIncident(`Location name '${lProperty.data.meta.locationName}' is already used in struct '${this.cst.name}'.`, lProperty);
                }

                lLocationNames.add(lProperty.data.meta.locationName);
            }
        }

        // Must have at least one property.
        if (lProperties.size === 0) {
            pContext.pushIncident('Struct must have at least one property.', this);
        }

        // Register struct to the current context.
        pContext.registerStruct(this.cst.name, this);

        return {
            attributes: lAttributes,
            name: this.cst.name,
            properties: Array.from(lProperties.values())
        };
    }
}

export type StructDeclarationAstData = {
    name: string;
    properties: ReadonlyArray<StructPropertyDeclarationAst>;
} & DeclarationAstData;