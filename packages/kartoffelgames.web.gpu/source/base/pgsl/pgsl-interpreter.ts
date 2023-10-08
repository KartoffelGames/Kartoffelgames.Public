import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuDevice } from '../gpu/gpu-device';
import { PgslTypeInformation, PgslTypeStorage } from './pgsl-type-storage';
import { PgslType } from './pgsl-type.enum';

/**
 * Interprests all parts of a pgsl shader.
 * Validates syntax and restrictions.
 */
export class PgslInterpreter {
    // Buffers
    private readonly mBufferStruct: Dictionary<string, PgslStructDefinition>;

    private readonly mDevice: GpuDevice;
    private readonly mSourceCode: string;



    /**
     * Shader source code.
     */
    public get source(): string {
        return this.mSourceCode;
    }

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

        // TODO: Execute precompilers like "#import LightCalculation" //#/ or simple # ??

        // Init buffers.
        this.mBufferStruct = new Dictionary<string, PgslStructDefinition>();

        // TODO: Get Bindings.

        // TODO: Get global scope variables.

        // TODO: Get functions. Line by line content.

        // TODO: Get entry points.
    }

    /**
     * Get definition of struct by name.
     * @param pStructName - Struct name.
     */
    public getStructOf(pStructName: string): PgslStructDefinition {
        return this.readStruct(this.mSourceCode, pStructName);
    }

    /**
     * Convert string of multiple attribute definitions into it raw data.
     * @param pSourceLine - Source of multiple attribute definitions.
     */
    private convertInternalAttrbutes(pSourceLine: string): Dictionary<string, Array<string>> {
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
            lAttributes = this.convertInternalAttrbutes(lVariableAttributes);
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

    private readStruct(pSourceCode: string, pStructName: string): PgslStructDefinition {
        // Load buffered struct.
        if (this.mBufferStruct.has(pStructName)) {
            return this.mBufferStruct.get(pStructName)!;
        }

        // Read internal struct data.
        const lInteralStructData: InternalStructDefinition = this.convertInternalStruct(pSourceCode, pStructName);

        // Create frame of struct that can be cached before the properties are converted.
        const lPageStruct: PgslStructDefinition = {
            name: lInteralStructData.name,
            properies: new Array<PgslStructPropertyDefinition>()
        };

        this.mBufferStruct.set(pStructName, lPageStruct);

        // Convert raw struct properties into definitions.
        for (const lPropertyData of lInteralStructData.properies) {
            // Try to get type from property type name.
            const lDataType: PgslTypeInformation | null = new PgslTypeStorage().typeOf(lPropertyData.type.typeName);

            // Read eighter simple data or struct data.
            if (lDataType !== null) {
                const lVariableType: PgslTypeDefinition = this.readVariableType(lPropertyData.type);

                // Set simple työe
                lPageStruct.properies.push({
                    name: lPropertyData.name,
                    type: {
                        type: PxslVariableType.SimpleData,
                        name: lVariableType,
                    }
                });
            } else {
                // Set struct.
                lPageStruct.properies.push({
                    name: lPropertyData.name,
                    type: {
                        type: PxslVariableType.Struct,
                        name: this.readStruct(pSourceCode, lPropertyData.type.typeName)
                    }
                });
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
    private readVariableType(pVariableType: InternalVariableType): PgslTypeDefinition {

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
        const lGenericList: Array<PgslTypeDefinition> = new Array<PgslTypeDefinition>();
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


// -------------------
// External structure.
// -------------------

type PgslStructDefinition = {
    name: string,
    properies: Array<PgslStructPropertyDefinition>;
};

type PgslStructPropertyDefinition = {
    name: string,
    type: {
        type: PxslVariableType.Struct,
        name: PgslStructDefinition;
    } | {
        type: PxslVariableType.SimpleData,
        name: PgslTypeDefinition;
    };
};

type PgslTypeDefinition = {
    type: PgslType;
    generics: Array<PgslTypeDefinition>;
};

enum PgslVariableScope {
    Global = 1,
    Function = 2
}

enum PxslVariableType {
    Struct = 1,
    SimpleData = 2,
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