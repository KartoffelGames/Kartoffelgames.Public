import { FunctionOverloadDeclarationAst, type FunctionOverloadDeclarationAstData } from '../../../abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import { AttributeListAst } from '../../../abstract_syntax_tree/general/attribute-list-ast.ts';
import { type BasePgslType, BasePgslTypeKind } from '../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslBuildInType, type PgslBuildInTypeName } from '../../../abstract_syntax_tree/type/definition/pgsl-build-in-type.ts';
import { PgslGenericType } from '../../../abstract_syntax_tree/type/definition/pgsl-generic-type.ts';
import type { PgslStructType } from '../../../abstract_syntax_tree/type/definition/pgsl-struct-type.ts';
import { PgslVectorType } from '../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslVoidType } from '../../../abstract_syntax_tree/type/definition/pgsl-void-type.ts';
import { PgslInterpolateTypeEnum } from '../../../feature_set/enum/pgsl-interpolate-type-enum.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of FunctionOverloadDeclarationAst.
 */
export class FunctionOverloadDeclarationAstValidationProcessor extends PgslValidatorProcessor<FunctionOverloadDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionOverloadDeclarationAst {
        return FunctionOverloadDeclarationAst;
    }

    /**
     * Validates the PGSL function overload declaration syntax tree.
     * 
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: FunctionOverloadDeclarationAstData): void {
        // Validate the child attribute list.
        this.validateAst(pData.attributes);

        // Validate the child restriction type declarations of every generic.
        for (const lRestrictionTypeDeclarations of pData.generic.restrictions.values()) {
            for (const lRestrictionTypeDeclaration of lRestrictionTypeDeclarations) {
                this.validateAst(lRestrictionTypeDeclaration);
            }
        }

        // Validate the child return type declaration.
        this.validateAst(pData.returnType);

        // Validate the child block.
        this.validateAst(pData.block);

        // Validate that an entry point overload has no generics.
        if (pData.entryPoint && pData.generic.types.length > 0) {
            this.pushIncident(`The ${pData.entryPoint.stage} entry point must not have generic parameters.`);
        }

        // Parameter names that are already defined by a previous parameter.
        const lParameterNames: Set<string> = new Set<string>();

        // Validate the child type declaration of every parameter.
        for (const lParameter of pData.parameter) {
            this.validateAst(lParameter.type);

            // Validate that every generic parameter has its generic defined as function generic.
            const lParameterType: BasePgslType = lParameter.type.data.type;
            if (lParameterType instanceof PgslGenericType && !pData.generic.restrictions.has(lParameterType)) {
                this.pushIncident(`Generic parameter name "${lParameterType.name}" is not defined for this function header.`);
            }

            // Validate parameter names are not dublicated.
            if (lParameterNames.has(lParameter.name)) {
                this.pushIncident(`Parameter "${lParameter.name}" is already defined.`);
            }
            lParameterNames.add(lParameter.name);

            // Validate that the parameter name does not start with two underscores.
            if (lParameter.name.startsWith('__')) {
                this.pushIncident(`Name "${lParameter.name}" must not start with two underscores.`);
            }

            // Validate that the parameter name does not contain the reserved name part __GENERIC__.
            if (lParameter.name.includes('__GENERIC__')) {
                this.pushIncident(`Name "${lParameter.name}" must not contain the reserved name part "__GENERIC__".`);
            }

            // Validate that the parameter name does not contain the reserved name part __CATCH__.
            if (lParameter.name.includes('__CATCH__')) {
                this.pushIncident(`Name "${lParameter.name}" must not contain the reserved name part "__CATCH__".`);
            }

            // Validate that the parameter type is constructible, a pointer, a texture or a sampler.
            if (!lParameterType.isKind(BasePgslTypeKind.Constructible) && !lParameterType.isKind(BasePgslTypeKind.Pointer) && !lParameterType.isKind(BasePgslTypeKind.Texture) && !lParameterType.isKind(BasePgslTypeKind.Sampler)) {
                this.pushIncident(`Parameter type must be constructible, a pointer, a texture or a sampler.`, lParameter.type);
            }
        }

        // TODO: Validate that a parameter is not shadowed by a inner variable declaration.

        // Validate that generics names have no dublicates.
        const lGenericNames: Set<string> = new Set<string>();
        for (const lGeneric of pData.generic.types) {
            if (lGenericNames.has(lGeneric.name)) {
                this.pushIncident(`Generic type name "${lGeneric.name}" is already defined for this function header.`);
            }

            lGenericNames.add(lGeneric.name);
        }

        // TODO: Validate that a generic restriction only references generics declared before it (new).
        // TODO: Validate that no generic name shadows a module scope type (new).
        // TODO: Validate that no parameter name is a WGSL predeclared type, enumerant or built-in function name like f32, vec3, read or min, which the parameter would shadow in the transpiled function body (new).
        // TODO: Validate that no parameter name is the name of a function or struct declaration, which the parameter would shadow in the transpiled function body while PGSL still resolves calls and type names in the body to that declaration (new).

        // Validate that the return type is void or constructible.
        if (!(pData.returnType.data.type instanceof PgslVoidType) && !pData.returnType.data.type.isKind(BasePgslTypeKind.Constructible)) {
            this.pushIncident(`Return type must be void or constructible.`, pData.returnType);
        }

        // TODO: Validate that every control flow path of an overload with a non-void return type ends in a return statement, counting returns nested in if/else and switch branches, in place of today's comparison of the block return type with the declared return type.

        // Validate that the block return type can convert to the return type.
        if (pData.block.data.returnType.conversionRankTo(pData.returnType.data.type) === Number.POSITIVE_INFINITY) {
            this.pushIncident(`Function block return type does not match the declared return type.`, pData.block);
        }

        // Count endpoint attributes.
        const lEntryPointAttributeCount: number = [AttributeListAst.attributeNames.vertex, AttributeListAst.attributeNames.fragment, AttributeListAst.attributeNames.compute].filter((pAttributeName) => {
            return pData.attributes.hasAttribute(pAttributeName);
        }).length;

        // Validate that only one endpoint attribute is set.
        if (lEntryPointAttributeCount > 1) {
            this.pushIncident(`Only one endpoint attribute can be set. Either Vertex, Fragment or Compute.`, pData.attributes);
        }

        // Everything but a compute entry point.
        if (pData.entryPoint && pData.entryPoint.stage !== 'compute') {
            // Validate that a Vertex or Fragment entry point has exactly one parameter.
            if (pData.parameter.length !== 1) {
                this.pushIncident(`The ${pData.entryPoint.stage} entry points must have exactly one parameter defining the ${pData.entryPoint.stage} input structure.`);
            }

            // Validate that the parameter type of a Vertex or Fragment entry point is a struct. A missing parameter is already reported by the parameter count.
            if (pData.parameter.length > 0 && !pData.entryPoint.parameter) {
                this.pushIncident(`The ${pData.entryPoint.stage} entry point parameter must be a struct type defining the ${pData.entryPoint.stage} input structure.`);
            }

            // Validate that the return type of a Vertex or Fragment entry point is a struct.
            if (!pData.entryPoint.returnType) {
                this.pushIncident(`The ${pData.entryPoint.stage} entry point return type must be a struct type defining the ${pData.entryPoint.stage} output structure.`);
            }

            const lEndpointStage: 'vertex' | 'fragment' | 'compute' = pData.entryPoint.stage;

            // Read the built-in type eacg endpoint allows.
            const lAllowedBuildIns: { input: Array<PgslBuildInTypeName>; output: Array<PgslBuildInTypeName>; } = (() => {
                switch (lEndpointStage) {
                    case 'vertex': return {
                        input: [PgslBuildInType.typeName.vertexIndex, PgslBuildInType.typeName.instanceIndex],
                        output: [PgslBuildInType.typeName.position, PgslBuildInType.typeName.clipDistances]
                    };
                    case 'fragment': return {
                        input: [PgslBuildInType.typeName.position, PgslBuildInType.typeName.frontFacing, PgslBuildInType.typeName.sampleIndex, PgslBuildInType.typeName.sampleMask, PgslBuildInType.typeName.primitiveIndex],
                        output: [PgslBuildInType.typeName.fragDepth, PgslBuildInType.typeName.sampleMask]
                    };
                    case 'compute': return {
                        input: [PgslBuildInType.typeName.globalInvocationId, PgslBuildInType.typeName.localInvocationId, PgslBuildInType.typeName.localInvocationIndex, PgslBuildInType.typeName.numWorkgroups],
                        output: []
                    };
                }
            })();

            // Small mapping for input and output types.
            const lEntryPointStructList: Array<[direction: 'input' | 'output', struct: PgslStructType | null]> = [
                ['input', pData.entryPoint.parameter],
                ['output', pData.entryPoint.returnType]
            ];


            // Validate the properties of the input and output struct.
            for (const [lDirection, lStruct] of lEntryPointStructList) {
                // Skip further validation on broken or missing types. 
                if (!lStruct) {
                    continue;
                }

                // Additional checks for structs that exchanges data between stages.
                const lIsExchangeStruct: boolean = (() => {
                    if (lEndpointStage === 'vertex' && lDirection === 'output') {
                        return true;
                    }

                    if (lEndpointStage === 'fragment' && lDirection === 'input') {
                        return true;
                    }

                    return false;
                })();

                // Mapping for used Built-ins.
                const lUsedBuildIns: Set<PgslBuildInTypeName> = new Set<PgslBuildInTypeName>();

                // Check each property.
                for (const lProperty of lStruct.declaration.data.properties) {
                    const lBuildIn: PgslBuildInTypeName | undefined = lProperty.data.typeDeclaration.data.buildIn;
                    if (lBuildIn) {
                        // Validate that no built-in type occurs more than once.
                        if (lUsedBuildIns.has(lBuildIn)) {
                            this.pushIncident(`Built-in type "${lBuildIn}" is used more than once in struct "${lStruct.structName}".`, lProperty);
                        }

                        // Add build in to build in mapping.
                        lUsedBuildIns.add(lBuildIn);

                        // Validate that the built-in type fits the stage and direction.
                        if (!lAllowedBuildIns[lDirection].includes(lBuildIn)) {
                            this.pushIncident(`Built-in type "${lBuildIn}" can not be used in the ${lEndpointStage} ${lDirection} struct.`, lProperty);
                        }
                    }

                    const lHasLocation: boolean = lProperty.data.attributes.hasAttribute(AttributeListAst.attributeNames.location);

                    // Validate that the property is a build in or has a location.
                    if (lBuildIn && lHasLocation || !lBuildIn && !lHasLocation) {
                        this.pushIncident(`Property "${lProperty.data.name}" of an entry point struct must have either a built-in type or a Location attribute.`, lProperty);
                    }

                    // Get component type of property when its a vector.
                    const lComponentType: BasePgslType = (() => {
                        const lPropertyType: BasePgslType = lProperty.data.typeDeclaration.data.type;
                        if (lPropertyType instanceof PgslVectorType) {
                            return lPropertyType.componentType;
                        }

                        return lPropertyType;
                    })();

                    // Validate that an non build in integer or integer-vector must have a flat interpolation.
                    if (lIsExchangeStruct && lHasLocation && lComponentType.isKind(BasePgslTypeKind.Integer)) {
                        if (!lProperty.data.meta.interpolation || lProperty.data.meta.interpolation?.type !== PgslInterpolateTypeEnum.VALUES.Flat) {
                            this.pushIncident(`Location property "${lProperty.data.name}" with an integer type needs a flat Interpolate attribute.`, lProperty);
                        }
                    }

                    // Validate that BlendSource attributes are only used in the output struct of a fragment entry point.
                    if (lProperty.data.attributes.hasAttribute(AttributeListAst.attributeNames.blendSource)) {
                        if (!(lEndpointStage === 'fragment' && lDirection === 'output')) {
                            this.pushIncident(`BlendSource properties can only be used in the output struct of a fragment entry point.`, lProperty);
                        }
                    }
                }

                // Validate that the output struct of a Vertex entry point has a Position property.
                if (lEndpointStage === 'vertex' && lDirection === 'output' && !lUsedBuildIns.has(PgslBuildInType.typeName.position)) {
                    this.pushIncident(`The vertex entry point output struct needs a Position property.`);
                }
            }
        }

        // Nothing but a compute entry point.
        if (pData.entryPoint?.stage === 'compute') {
            // Validate that the workgroup size of a Compute entry point could be read from the attribute parameters.
            if (!pData.entryPoint.workgroupSize) {
                this.pushIncident(`All compute attribute parameters need to be constant integer expressions.`, pData.attributes);
            }

            // Validate that all Compute attribute parameters are greater than zero.
            if (pData.entryPoint.workgroupSize && (pData.entryPoint.workgroupSize.x < 1 || pData.entryPoint.workgroupSize.y < 1 || pData.entryPoint.workgroupSize.z < 1)) {
                this.pushIncident(`All compute attribute parameters need to be greater than zero.`, pData.attributes);
            }

            // Validate that a Compute entry point has no parameters.
            if (pData.parameter.length > 0) {
                this.pushIncident(`Compute entry points must not have parameters.`);
            }

            // Validate that a Compute entry point has a void return type.
            if (!(pData.returnType.data.type instanceof PgslVoidType)) {
                this.pushIncident(`Compute entry points must not have a return type.`);
            }
        }
    }
}
