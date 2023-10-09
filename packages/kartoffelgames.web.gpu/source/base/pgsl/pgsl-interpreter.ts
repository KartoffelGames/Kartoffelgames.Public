import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuDevice } from '../gpu/gpu-device';
import { PgslTypeInformation, PgslTypeStorage } from './pgsl-type-storage';
import { PgslType } from './pgsl-type.enum';

/**
 * Interprests all parts of a pgsl shader.
 * Validates syntax and restrictions.
 */
export class PgslInterpreter {
    private readonly mDevice: GpuDevice;
    private readonly mSourceCode: string;
    private readonly mStructs: Dictionary<string, PgslStructDefinition>;

    /**
     * Gpu device.
     */
    protected get device(): GpuDevice {
        return this.mDevice;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pSourceCode - Shader source code.
     */
    public constructor(pDevice: GpuDevice, pSourceCode: string) {
        this.mDevice = pDevice;
        this.mSourceCode = pSourceCode;

        // Init buffers.
        this.mStructs = new Dictionary<string, PgslStructDefinition>();

        // TODO: Execute precompilers like "#import LightCalculation" //#/ or simple # ??

        // Init buffers saves only buffers that are used.
        const lStructBuffer: Dictionary<string, PgslStructDefinition> = new Dictionary<string, PgslStructDefinition>();
        const lStructFindRegex: RegExp = /^\s*struct\s+(?<name>\w+)\s*{[^}]*}$/gm;
        for (const lStructNameMatch of pSourceCode.matchAll(lStructFindRegex)) {
            const lStructName: string = lStructNameMatch.groups!['name'];
            const lStruct: PgslStructDefinition = this.readStruct(pSourceCode, lStructName, lStructBuffer);
            this.mStructs.set(lStruct.name, lStruct);
        }

        // TODO: Get global scope variables. Excluding bindings.

        // TODO: Get Bindings from global scope variables.

        // TODO: Get functions. Line by line content.

        // TODO: Get entry points from functions.
    }

    /**
     * Get definition of struct by name.
     * @param pStructName - Struct name.
     */
    public getStructOf(pStructName: string): PgslStructDefinition {
        const lStruct: PgslStructDefinition | undefined = this.mStructs.get(pStructName);
        if (!lStruct) {
            throw new Exception(`Struct "${pStructName}" not found.`, this);
        }

        return lStruct;
    }

    /**
     * Convert string of multiple attribute definitions into it raw data.
     * @param pSourceLine - Source of multiple attribute definitions.
     */
    private convertInternalAttributes(pSourceLine: string): Dictionary<string, Array<string>> {
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
    private convertInternalStruct(pSourceCode: string, pStructName: string): InternalStructDefinition {
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
    private convertInternalType(pSourceLine: string): InternalVariableType {
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
    private convertInternalVariable(pSourceLine: string): InternalVariableDefinition {
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
     * Read struct definition.
     * @param pSourceCode - Complete source code.
     * @param pStructName - Struct name.
     */
    private readStruct(pSourceCode: string, pStructName: string, pBufferedStructs: Dictionary<string, PgslStructDefinition>): PgslStructDefinition {
        // Load buffered struct.
        if (pBufferedStructs.has(pStructName)) {
            return pBufferedStructs.get(pStructName)!;
        }

        // Read internal struct data.
        const lInteralStructData: InternalStructDefinition = this.convertInternalStruct(pSourceCode, pStructName);

        // Create frame of struct that can be cached before the properties are converted.
        const lPageStruct: PgslStructDefinition = {
            name: lInteralStructData.name,
            properies: new Array<PgslStructPropertyDefinition>()
        };
        pBufferedStructs.set(pStructName, lPageStruct);

        // Convert raw struct properties into definitions.
        for (const lPropertyData of lInteralStructData.properies) {
            // Try to get type from property type name.
            const lDataType: PgslTypeInformation | null = new PgslTypeStorage().typeOf(lPropertyData.type.typeName);

            // Convert attribute data.
            const lAttributes: Record<string, PgslAttribute> = {};
            for (const lAttributeName of lPropertyData.attributes.keys()) {
                const lAttributeValues = lPropertyData.attributes.get(lAttributeName)!;

                // Convert atribute parameter to string or number.
                const lAttributeParameter: Array<string | number> = lAttributeValues.map((pAttributeValue) => {
                    if (!isNaN(<any>pAttributeValue)) {
                        return parseInt(pAttributeValue);
                    }

                    return pAttributeValue.toString();
                });

                // Set attribute parameter.
                lAttributes[lAttributeName] = {
                    name: lAttributeName,
                    parameter: lAttributeParameter
                };
            }

            // Create and add property.
            const lPgslStructPropertyDefinition: PgslStructPropertyDefinition = {
                name: lPropertyData.name,
                attributes: lAttributes,
                type: <any>undefined
            };
            lPageStruct.properies.push(lPgslStructPropertyDefinition);

            // Read eighter simple data or struct data.
            if (lDataType !== null) {
                // Set simple type
                lPgslStructPropertyDefinition.type = {
                    type: PxslValueType.SimpleData,
                    name: this.readVariableType(lPropertyData.type)
                };
            } else {
                // Set struct.
                lPgslStructPropertyDefinition.type = {
                    type: PxslValueType.Struct,
                    name: this.readStruct(pSourceCode, lPropertyData.type.typeName, pBufferedStructs)
                };
            }
        }

        return lPageStruct;
    }

    /**
     * Read type definition form raw type data.
     * Returns null when no definition was found for this type.
     * This can mean, that this type is a struct.
     * @param pVariableType 
     */
    private readVariableType(pVariableType: InternalVariableType): PgslSimpleTypeDefinition {

        // Read type information.
        const lTypeInformation = new PgslTypeStorage().typeOf(pVariableType.typeName);
        if (!lTypeInformation) {
            throw new Exception(`Type with name ${pVariableType.typeName} not definied.`, this);
        }

        // Validate generics.
        if (!lTypeInformation.genericSupport.includes(pVariableType.generics.length)) {
            throw new Exception(`Type "${pVariableType.typeName}" does not support ${pVariableType.generics.length} generics. Valid: (${lTypeInformation.genericSupport.join(', ')})`, this);
        }

        // Create generics with recursion.
        const lGenericList: Array<PgslSimpleTypeDefinition> = new Array<PgslSimpleTypeDefinition>();
        for (const lGeneric of pVariableType.generics) {
            lGenericList.push(this.readVariableType(lGeneric));
        }

        return {
            type: lTypeInformation.type,
            generics: lGenericList
        };
    }
}

// -------------------
// Internal structure.
// -------------------

type InternalVariableDefinition = {
    name: string;
    type: InternalVariableType;
    modifier: string | null,
    attributes: Dictionary<string, Array<string>>;
};

type InternalVariableType = {
    typeName: string;
    generics: Array<InternalVariableType>;
};

type InternalStructDefinition = {
    name: string,
    properies: Array<InternalVariableDefinition>;
};

// ----------------------
// Pgsl globals.
// ----------------------
type PgslSimpleTypeDefinition = {
    type: PgslType;
    generics: Array<PgslSimpleTypeDefinition>;
};

type PgslTypeDefinition = {
    type: PxslValueType.Struct,
    name: PgslStructDefinition;
} | {
    type: PxslValueType.SimpleData,
    name: PgslSimpleTypeDefinition;
};

type PgslAttribute = {
    name: string,
    parameter: Array<string | number>;
};

enum PxslValueType {
    Struct = 1,
    SimpleData = 2,
}

// ----------------------
// Pgsl struct structure.
// ----------------------

type PgslStructDefinition = {
    name: string,
    properies: Array<PgslStructPropertyDefinition>;
};

type PgslStructPropertyDefinition = {
    name: string,
    type: PgslTypeDefinition;
    attributes: Record<string, PgslAttribute>;
};

// ----------------------
// Pgsl Variable definition.
// ----------------------

type PgslVariable = {
    name: string;
    type: PgslTypeDefinition;
    modifier: PxslVariableModifier,
    attributes: Dictionary<string, Array<string>>;
    scope: PgslVariableScope;
};

enum PgslVariableScope {
    Global = 1,
    Function = 2
}

enum PxslVariableModifier {
    Var = 1,
    Let = 2,
    Const = 3,
    Uniform = 4,
    ReadStorage = 5,
    WriteStorage = 6,
    ReadWriteStorage = 7,
}