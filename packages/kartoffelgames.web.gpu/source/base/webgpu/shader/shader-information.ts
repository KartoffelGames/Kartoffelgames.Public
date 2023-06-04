import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core.data';
import { Base } from '../../base/export.';
import { MemoryLayout } from '../../base/memory_layout/memory-layout';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { IShaderInformation, ShaderFunction } from '../../interface/shader/i-shader-information';
import { ArrayBufferMemoryLayout } from '../memory_layout/buffer/array-buffer-layout';
import { WgslAccessMode } from './wgsl_enum/wgsl-access-mode.enum';
import { WgslBindingType } from './wgsl_enum/wgsl-binding-type.enum';
import { WgslShaderStage } from './wgsl_enum/wgsl-shader-stage.enum';
import { WgslType } from './wgsl_enum/wgsl-type.enum';

export class ShaderInformation extends Base.ShaderInformation implements IShaderInformation {
    /**
     * Fetch bindings.
     * @param pSourceCode - Source code.
     */
    protected override fetchBindings(pSourceCode: string): Array<[number, MemoryLayout]> {
        // Get only lines with group attributes.
        const lAllGroupLines: string = [...pSourceCode.matchAll(/^.*@group.*$/gm)].reduce((pCurrent, pLine) => {
            return pCurrent + pLine[0];
        }, '');

        // Available shader states based on entry points.
        // Not the best, but better than nothing.
        let lShaderStage: WgslShaderStage = 0;
        if (/(@compute(.|\r?\n)*?fn )(?<name>\w*)/gm.test(pSourceCode)) {
            lShaderStage |= WgslShaderStage.Compute;
        }
        if (/(@fragment(.|\r?\n)*?fn )(?<name>\w*)/gm.test(pSourceCode)) {
            lShaderStage |= WgslShaderStage.Fragment;
        }
        if (/(@vertex(.|\r?\n)*?fn )(?<name>\w*)/gm.test(pSourceCode)) {
            lShaderStage |= WgslShaderStage.Vertex;
        }

        // Fetch all group variables.
        const lBindingList: Array<[number, MemoryLayout]> = new Array<[number, MemoryLayout]>();
        for (const lVariable of this.fetchVariableDefinitions(lAllGroupLines)) {
            const lGroupAttribute: string | undefined = lVariable.attributes.find(pAttribute => pAttribute.startsWith('@group'));
            const lBindAttribute: string | undefined = lVariable.attributes.find(pAttribute => pAttribute.startsWith('@binding'));
            if (!lGroupAttribute || !lBindAttribute) {
                throw new Exception('Bindind variable needs an binding and group attribute.', this);
            }

            // Parse group index.
            const lGroupIndex: number = parseInt(lGroupAttribute.replace(/[^\d]+/g, ''));

            lBindingList.push([lGroupIndex, this.createMemoryLayout(lVariable)]);
        }

        return lBindingList;
    }

    /**
     * Fetch entry points.
     */
    protected override fetchEntryPoints(pSourceCode: string): Array<[ComputeStage, ShaderFunction]> {
        // Get all functions.
        const lFunctionList: Array<WgslFunction> = this.fetchFunctions(pSourceCode);

        const lEntryPoints: Array<[ComputeStage, ShaderFunction]> = new Array<[ComputeStage, ShaderFunction]>();
        for (const lFunction of lFunctionList) {
            // Assemble shaderstage.
            if (lFunction.attributes.find(pAttribute => pAttribute.startsWith('@compute'))) {
                lEntryPoints.push([ComputeStage.Compute, { name: lFunction.name, parameter: lFunction.parameter, return: lFunction.return }]);
            }
            if (lFunction.attributes.find(pAttribute => pAttribute.startsWith('@fragment'))) {
                lEntryPoints.push([ComputeStage.Fragment, { name: lFunction.name, parameter: lFunction.parameter, return: lFunction.return }]);
            }
            if (lFunction.attributes.find(pAttribute => pAttribute.startsWith('@vertex'))) {
                lEntryPoints.push([ComputeStage.Vertex, { name: lFunction.name, parameter: lFunction.parameter, return: lFunction.return }]);
            }
        }

        return lEntryPoints;
    }

    /**
     * Create buffer type from variable definition.
     * @param pVariable - Variable definition.
     */
    private createMemoryLayout(pVariable: WgslVariable): MemoryLayout {
        // String to type. Undefined must be an struct type.
        const lType: WgslType | null = this.wgslTypeByName(pVariable.type);
        if (lType === WgslType.Enum) {
            throw new Exception('Enum cant be fetched as variable type.', this);
        }

        // Try to parse access and bind setings. Set with defaults.
        let lBindingType: WgslBindingType | undefined = WgslBindingType.None;
        let lAccessMode: WgslAccessMode | undefined = WgslAccessMode.None;
        if (pVariable.access) {
            lBindingType = EnumUtil.enumKeyByValue(WgslBindingType, pVariable.access.bindingType);
            if (!lBindingType) {
                throw new Exception(`Bind type "${pVariable.access.bindingType}" does not exist.`, this);
            }
            if (pVariable.access.accessMode) {
                lAccessMode = EnumUtil.enumKeyByValue(WgslAccessMode, pVariable.access.accessMode);
                if (!lAccessMode) {
                    throw new Exception(`Access mode "${pVariable.access.accessMode}" does not exist.`, this);
                }
            }

            // Set bind type to read only storage if it is in fact a read only storage.
            if (lBindingType === WgslBindingType.Storage && lAccessMode === WgslAccessMode.AccessModeRead) {
                lBindingType = WgslBindingType.ReadonlyStorage;
            }
        }

        // Parse attributes of variable.
        const lAttributes: Dictionary<string, Array<string | number>> = new Dictionary<string, Array<string | number>>();
        for (const lAttribute of pVariable.attributes) {
            const lAttributeMatch: RegExpExecArray | null = /@(?<name>\w+)(\((?<parameter>[^)]*)\))?/g.exec(lAttribute);
            if (!lAttributeMatch) {
                throw new Exception(`Somthing is not right with "${lAttribute}". Dont know what.`, this);
            }

            const lAttributeParameterList: Array<string | number> = new Array<string | number>();
            if (lAttributeMatch.groups!['parameter']) {
                const lParameterPartList: Array<string> = lAttributeMatch.groups!['parameter'].split(',');
                for (const lPart of lParameterPartList) {
                    if (isNaN(<any>lPart)) {
                        lAttributeParameterList.push(lPart);
                    } else {
                        lAttributeParameterList.push(parseInt(lPart));
                    }
                }
            }

            lAttributes.set(lAttributeMatch.groups!['name'], lAttributeParameterList);
        }

        // Try to get location from attributes.
        let lLocationIndex: number | null = null;
        const lLocationValue: string = pVariable.attributes.find(pAttribute => pAttribute.startsWith('@location'))?.replace(/[^\d]+/g, '') ?? '';
        if (lLocationValue && !isNaN(<any>lLocationValue)) {
            lLocationIndex = parseInt(lLocationValue);
        }

        let lBufferType: BufferLayout;
        switch (lType) {
            case WgslType.Struct: {
                const lStructType: StructBufferLayout = new StructBufferLayout(pVariable.name, pVariable.type, lAccessMode, lBindingType, lLocationIndex);

                // Get struct body and fetch types.
                const lStructBody: string = this.getStructBody(pVariable.type);
                this.fetchVariableDefinitions(lStructBody).forEach((pPropertyVariable, pIndex) => {
                    const lProperyBufferType: BufferLayout = this.createMemoryLayout(pPropertyVariable);

                    // Add property to struct buffer type.
                    lStructType.addProperty(pIndex, lProperyBufferType);
                });

                lBufferType = lStructType;
                break;
            }
            case WgslType.Array: {
                // Validate generic range.
                if (pVariable.generics.length !== 1 && pVariable.generics.length !== 2) {
                    throw new Exception('Array type must have one or two generic types.', this);
                }

                // Fetch first generic by extending generic type to a variable definition and parse recursive.
                const lTypeGeneric: WgslVariable | undefined = this.fetchVariableDefinitions(`PLACEHOLDER: ${pVariable.generics.at(0)!};`).at(0)!;
                const lTypeGenericBufferType: BufferLayout = this.createMemoryLayout(lTypeGeneric);

                // Fetch optional size gerneric.
                let lSizeGeneric: number = -1;
                if (pVariable.generics.at(1)) {
                    if (!isNaN(<any>pVariable.generics.at(1))) {
                        throw new Exception('Array size parameter needs to be a number.', this);
                    }
                    lSizeGeneric = parseInt(pVariable.generics.at(1)!);
                }

                // Create array buffer type.
                lBufferType = new ArrayBufferMemoryLayout(pVariable.name, lTypeGenericBufferType, lSizeGeneric, lAccessMode, lBindingType, lLocationIndex);
                break;
            }
            default: {
                // Map generics to struct like body. Fetch variable definitions and save only type.
                const lPseudoStructBody: string = pVariable.generics.reduce((pCurrent, pGeneric) => {
                    return pCurrent + `PLACEHOLDER: ${pGeneric};`;
                }, '');
                const lPseudoVariableList: Array<WgslVariable> = this.fetchVariableDefinitions(lPseudoStructBody);
                const lGenericList: Array<WgslType> = lPseudoVariableList.map((pVariable) => { return this.wgslTypeByName(pVariable.type); });

                lBufferType = new SimpleBufferLayout(pVariable.name, lType, lGenericList, lAccessMode, lBindingType, lLocationIndex);
                break;
            }
        }

        // Add attributes to buffer type.
        for (const [lAttributeName, lAttributeParameterList] of lAttributes) {
            lBufferType.setAttribute(lAttributeName, lAttributeParameterList);
        }

        return lBufferType;
    }

    /**
     * Fetch all function declarations of source snipped.
     * @param pSourceSnipped - Source snipped with function declarations.
     */
    private fetchFunctions(pSourceSnipped: string): Array<WgslFunction> {
        const lFunctionRegex: RegExp = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:\s)*?fn\s+(?<name>\w*)\s*\((?<parameter>(?:.|\r?\n)*?)\)(?:\s*->\s*(?<result>[^{]+))?\s*{/gm;

        const lFunctionList: Array<WgslFunction> = new Array<WgslFunction>();
        for (const lFunctionMatch of pSourceSnipped.matchAll(lFunctionRegex)) {
            // Fetch attributes.
            const lAttributeList: Array<string> = new Array<string>();
            if (lFunctionMatch.groups!['attributes']) {
                // Split string of multiple attributes.
                for (const lAttributeMatch of lFunctionMatch.groups!['attributes'].matchAll(/@[\w]+(\([^)]*\))?/g)) {
                    lAttributeList.push(lAttributeMatch[0]);
                }
            }

            // Fetch Parameter.
            const lParameterVariableList: Array<WgslVariable> = this.fetchVariableDefinitions(lFunctionMatch.groups!['parameter']!);
            const lParameterList: Array<BufferLayout> = lParameterVariableList.map((pVariable) => { return this.createMemoryLayout(pVariable); });

            // Fetch result type.
            let lResult: BufferLayout | null = null;
            if (lFunctionMatch.groups!['result']) {
                const lResultVariable: WgslVariable = this.fetchVariableDefinitions(lFunctionMatch.groups!['result']!).at(0)!;
                lResult = this.createMemoryLayout(lResultVariable);
            }

            lFunctionList.push({
                name: lFunctionMatch.groups!['name'],
                return: lResult,
                parameter: lParameterList,
                attributes: lAttributeList
            });
        }

        return lFunctionList;
    }

    /**
     * Find all variable definitions and fetch data.
     * @param pSourceSnipped - Source snipped with variables.
     */
    private fetchVariableDefinitions(pSourceSnipped: string): Array<WgslVariable> {
        const lDefinitionRegex: RegExp = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:var(?:<(?<access>[\w\s,]+)?>)?\s+)?(?:(?<variable>\w+)\s*:\s*)?(?<type>(?<typename>\w+)(?:<(?<generics>[<>\w\s,]+)>)?)/gm;

        const lVariableList: Array<WgslVariable> = new Array<WgslVariable>();
        for (const lDefinitionMatch of pSourceSnipped.matchAll(lDefinitionRegex)) {
            // Fetch attributes.
            const lAttributes: Array<string> = new Array<string>();
            if (lDefinitionMatch.groups!['attributes']) {
                // Split string of multiple attributes.
                for (const lAttributeMatch of lDefinitionMatch.groups!['attributes'].matchAll(/@[\w]+\([^)]*\)/g)) {
                    lAttributes.push(lAttributeMatch[0]);
                }
            }

            // Parse optional acccess modifier.
            let lAccess: { bindingType: string; accessMode: string | null; } | null = null;
            if (lDefinitionMatch.groups!['access']) {
                // var<addressSpace [,accessMode]>
                const lAccessList: Array<string> = lDefinitionMatch.groups!['access'].split(',').map((pValue: string) => pValue.trim()).filter((pValue: string) => pValue.length);
                lAccess = {
                    bindingType: lAccessList[0],
                    accessMode: lAccessList[1] ?? null
                };
            }

            // Split generic types.
            const lGenericList: Array<string> = new Array<string>();
            if (lDefinitionMatch.groups!['generics']) {
                for (const lGenericMatch of lDefinitionMatch.groups!['generics'].matchAll(/(?<generictype>(?:\w+(?:<.+>)?))[,\s]*/g)) {
                    lGenericList.push(lGenericMatch.groups!['generictype']);
                }
            }

            lVariableList.push({
                name: lDefinitionMatch.groups!['variable'] ?? '',
                type: lDefinitionMatch.groups!['typename'],
                generics: lGenericList,
                attributes: lAttributes,
                access: lAccess
            });
        }

        return lVariableList;
    }

    /**
     * Get struct information of struct name.
     * @param pSource - Source.
     * @param pStructName - Struct name.
     */
    private getStructBody(pStructName: string): string {
        const lStuctRegex: RegExp = /^\s*struct\s+(?<name>\w+)\s*{(?<typeinfo>[^}]*)}$/smg;

        let lStructBody: string | null = null;

        // Find struct name and body.
        for (const lStructMatch of this.mSource.matchAll(lStuctRegex)) {
            if (lStructMatch.groups!['name'] === pStructName) {
                lStructBody = lStructMatch.groups!['typeinfo'];
                break;
            }
        }

        // Validate found struct body.
        if (!lStructBody) {
            throw new Exception(`Struct "${pStructName}" not found.`, this);
        }

        return lStructBody;
    }

    /**
     * Get wgsl type by name without generics.
     * @param pName - Type name.
     */
    private wgslTypeByName(pName: string): WgslType {
        let lType: WgslType | undefined = EnumUtil.enumKeyByValue(WgslType, pName);
        if (!lType) {
            try {
                // Try to find struct. Throws error on missing struct declaration.
                this.getStructBody(pName);

                lType = WgslType.Struct;
            } catch (_ex) {
                // On error (when struct not found). It can only be an enum.
                lType = WgslType.Enum;
            }
        }

        return lType;
    }
}

export type WgslBind = {
    visibility: WgslShaderStage;
    variable: BufferLayout;
    index: number;
};

export type WgslBindGroup = {
    group: number;
    binds: Array<WgslBind>;
};

export type WgslFunction = {
    attributes: Array<string>;
    name: string;
    parameter: Array<BufferLayout>;
    return: BufferLayout | null;
};

type WgslVariable = {
    name: string;
    type: string;
    generics: Array<string>;
    attributes: Array<string>;
    access: { bindingType: string; accessMode: string | null; } | null;
};