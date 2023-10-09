import { Dictionary, Exception } from '@kartoffelgames/core.data';

export class PgslInterpreter {
    /**
     * Convert string of multiple attribute definitions into it raw data.
     * @param pSourceLine - Source of multiple attribute definitions.
     */
    public static convertInternalAttributes(pSourceLine: string): Dictionary<string, Array<string>> {
        const lAttributes: Dictionary<string, Array<string>> = new Dictionary<string, Array<string>>();

        // Split string of multiple attributes.
        for (const lAttributeMatch of pSourceLine.matchAll(/@(?<name>[\w]+)(?:\((?<parameters>[^)]*)\))?/g)) {
            const lAttributeName: string = lAttributeMatch.groups!['name'];
            const lAttributeValue: string = lAttributeMatch.groups!['parameters'] ?? '';

            // Split attribute parameters by ,
            const lParameterList: Array<string> = lAttributeValue.split(',').map((pParameter) => { return pParameter.trim(); });

            // Add each attribute as value attachment.
            lAttributes.set(lAttributeName, lParameterList);
        }

        return lAttributes;
    }

    /**
     * Convert struct definition into raw data.
     * @param pSourceCode - Complete source code.
     * @param pStructName - Name of struct.
     * @param pStructBuffer - Buffer for preventing an unending recursion loop.
     */
    public static convertInternalStruct(pSourceCode: string, pStructName: string): InternalStructDefinition {
        // Create dynamic struct regex.
        const lRegexEscapedStructName: string = pStructName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const lStuctRegex: RegExp = new RegExp(`^\\s*struct\\s+(${lRegexEscapedStructName})\\s*{(?<typeinfo>[^}]*)}$`, 'smg');

        // Read and validate struct.
        const lStructMatch: RegExpMatchArray | null = lStuctRegex.exec(pSourceCode);
        if (!lStructMatch) {
            throw new Exception(`Used struct "${pStructName}" not found.`, this);
        }

        // Create struct structure.
        const lStructDefinition: InternalStructDefinition = {
            name: pStructName,
            properies: new Array<InternalVariableDefinition>()
        };

        // Read and convert all struct properties.
        const lStructBody: string = lStructMatch.groups!['typeinfo'];

        // Split struct body and convert each property on another line.
        for (const lPropertyLineMatch of lStructBody.matchAll(/[^\r\n]+/g)) {
            const lPropertyLine: string = lPropertyLineMatch[0];

            // Convert variable defnition.
            const lVariableDefinition: InternalVariableDefinition = this.convertInternalVariable(lPropertyLine);

            // Create variable structure.
            lStructDefinition.properies.push(lVariableDefinition);
        }

        return lStructDefinition;
    }

    /**
     * Convert type definition into raw data.
     * @param pSourceLine - Source of type definition and only type.
     */
    public static convertInternalType(pSourceLine: string): InternalVariableType {
        const lTypeRegex: RegExp = /(?<typename>\w+)(?:<(?<generics>[<>\w\s,]+)>)?/;

        // Match source line and validate.
        const lTypeMatch: RegExpMatchArray | null = pSourceLine.match(lTypeRegex);
        if (!lTypeMatch) {
            throw new Exception(`Can't interpret "${pSourceLine}" as any type or struct`, this);
        }

        // Quickaccess match groups.
        const lTypeName: string = lTypeMatch.groups!['typename'];
        const lTypeGenerics: string | null = lTypeMatch.groups!['generics'];

        // Variable type structure.
        const lVariableType: InternalVariableType = {
            typeName: lTypeName,
            generics: new Array<InternalVariableType>()
        };

        // Convert generics only when at least one is accessable.
        if (lTypeGenerics) {
            // Recursive parse generics.
            for (const lGenericMatch of lTypeGenerics.matchAll(/(?<generictype>(?:\w+(?:<.+>)?))[,\s]*/g)) {
                const lGenericType: string = lGenericMatch.groups!['generictype'];
                lVariableType.generics.push(this.convertInternalType(lGenericType));
            }
        }

        return lVariableType;
    }

    /**
     * Convert any variable definition in function global or structure scope into its raw data.
     * @param pSourceLine - Single line with one variable definition without assignment.
     */
    public static convertInternalVariable(pSourceLine: string): InternalVariableDefinition {
        // Define regex that can match any variable or struct property definition.
        const lVariableLineRegex: RegExp = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?<modifier>(?:var|let|const|uniform|readstorage|writestorage|readwritestorage)\s+)?(?:(?<variableName>\w+)\s*:\s*)(?<type>\w+(?:<[<>\w\s,]+>)?)/m;

        // Match source line and validate.
        const lVariableMatch: RegExpMatchArray | null = pSourceLine.match(lVariableLineRegex);
        if (!lVariableMatch) {
            throw new Exception(`Can't interpret "${pSourceLine}" as any variable definition.`, this);
        }

        // Quickaccess match groups.
        const lVariableAttributes: string | null = lVariableMatch.groups!['attributes'];
        const lVariableModifier: string | null = lVariableMatch.groups!['modifier'] ?? null;
        const lVariableName: string = lVariableMatch.groups!['variableName'];
        const lVariableType: string = lVariableMatch.groups!['type'];

        // Convert type.
        const lInternalType: InternalVariableType = this.convertInternalType(lVariableType);

        // Convert attributes into its name and parameter parts.
        let lAttributes: Dictionary<string, Array<string>>;
        if (lVariableAttributes) {
            lAttributes = this.convertInternalAttributes(lVariableAttributes);
        } else {
            lAttributes = new Dictionary<string, Array<string>>();
        }

        return {
            name: lVariableName,
            type: lInternalType,
            modifier: lVariableModifier,
            attributes: lAttributes
        };
    }

    /**
     * Get all struct names.
     * @param pSourceCode - Complete source code.
     */
    public static readStructNameList(pSourceCode: string): Array<string> {
        const lStructNameList: Array<string> = new Array<string>();

        // Read all struct names with regex.
        const lStructFindRegex: RegExp = /^\s*struct\s+(?<name>\w+)\s*{[^}]*}$/gm;
        for (const lStructNameMatch of pSourceCode.matchAll(lStructFindRegex)) {
            lStructNameList.push(lStructNameMatch.groups!['name']);
        }

        return lStructNameList;
    }
}

export type InternalVariableDefinition = {
    name: string;
    type: InternalVariableType;
    modifier: string | null,
    attributes: Dictionary<string, Array<string>>;
};

export type InternalVariableType = {
    typeName: string;
    generics: Array<InternalVariableType>;
};

export type InternalStructDefinition = {
    name: string,
    properies: Array<InternalVariableDefinition>;
};