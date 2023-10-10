import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuDevice } from '../../gpu/gpu-device';
import { PgslTypeInformation, PgslTypeStorage } from '../pgsl-type-storage';
import { PgslType } from '../pgsl-type.enum';
import { InternalStructDefinition, PgslInterpreter, InternalVariableType } from './pgsl-interpreter';

/**
 * Interprests all parts of a pgsl shader.
 * Validates syntax and restrictions.
 */
export class PgslShader {
    private readonly mDevice: GpuDevice;
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

        // Init buffers.
        this.mStructs = new Dictionary<string, PgslStructDefinition>();

        // TODO: Execute precompilers like "#import LightCalculation" //#/ or simple # ??

        // Init buffers saves only buffers that are used.
        const lStructBuffer: Dictionary<string, PgslStructDefinition> = new Dictionary<string, PgslStructDefinition>();
        for (const lStructName of PgslInterpreter.readStructNameList(pSourceCode)) {
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
        const lInteralStructData: InternalStructDefinition = PgslInterpreter.convertInternalStruct(pSourceCode, pStructName);

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


// -------------
// Pgsl globals.
// -------------
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

// -------------------------
// Pgsl Variable definition.
// -------------------------

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