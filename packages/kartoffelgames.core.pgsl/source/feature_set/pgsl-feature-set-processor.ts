import { Exception } from '@kartoffelgames/core';
import type { BaseDeclarationAst } from '../abstract_syntax_tree/declaration/base-declaration-ast.ts';
import { EnumDeclarationAst } from '../abstract_syntax_tree/declaration/enum-declaration-ast.ts';
import { FunctionDeclarationAst } from '../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import { FunctionOverloadDeclarationAst, type FunctionOverloadDeclarationAstDataParameter } from '../abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import { StructDeclarationAst } from '../abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import { StructPropertyDeclarationAst } from '../abstract_syntax_tree/declaration/struct-property-declaration-ast.ts';
import type { IExpressionAst } from '../abstract_syntax_tree/expression/i-expression-ast.interface.ts';
import { StringValueExpressionAst } from '../abstract_syntax_tree/expression/single_value/string-value-expression-ast.ts';
import { TypeDeclarationAst } from '../abstract_syntax_tree/general/type-declaration-ast.ts';
import { BlockStatementAst } from '../abstract_syntax_tree/statement/execution/block-statement-ast.ts';
import type { BasePgslType } from '../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslGenericType } from '../abstract_syntax_tree/type/definition/pgsl-generic-type.ts';
import { PgslStringType } from '../abstract_syntax_tree/type/definition/pgsl-string-type.ts';
import { PgslVoidType } from '../abstract_syntax_tree/type/definition/pgsl-void-type.ts';
import type { PgslTypeCache } from '../abstract_syntax_tree/type/pgsl-type-cache.ts';
import { PgslValueAddressSpace } from '../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../enum/pgsl-value-fixed-state.ts';
import type { PgslFeatureSet } from './pgsl-feature-set.ts';

export abstract class PgslFeatureSetProcessor {
    private readonly mDeclaredDeclaration: Array<BaseDeclarationAst>;
    private readonly mDeclaredNames: Set<string>;
    private readonly mFeatureSet: PgslFeatureSet;

    /**
     * List of global declarations.
     */
    public get declarations(): ReadonlyArray<BaseDeclarationAst> {
        return this.mDeclaredDeclaration;
    }

    /**
     * Feature sets type cache.
     */
    protected get types(): PgslTypeCache {
        return this.mFeatureSet.typeCache;
    }

    /**
     * Constructor.
     * 
     * @param pFeatureSet - Parent feature set.
     */
    public constructor(pFeatureSet: PgslFeatureSet) {
        this.mFeatureSet = pFeatureSet;

        // Init declaration lists.
        this.mDeclaredDeclaration = new Array<BaseDeclarationAst>();
        this.mDeclaredNames = new Set<string>();
    }

    /**
     * Process declaration registration.
     * 
     * @returns this instance.
     */
    public process(): this {
        this.onProcess();

        return this;
    }

    /**
     * Register a new global declaration.
     * 
     * @param pDeclaration - Declaration. 
     */
    protected registerDeclaration(pDeclaration: BaseDeclarationAst): void {
        // Check for dublicate names.
        if (this.mDeclaredNames.has(pDeclaration.name)) {
            throw new Exception(`Feature set declaration "${pDeclaration.name}" is already declared in this feature set.`, this);
        }

        // Add new declaration name and declaration.
        this.mDeclaredNames.add(pDeclaration.name);
        this.mDeclaredDeclaration.push(pDeclaration);
    }

    /**
     * Create an enum declaration with string values.
     *
     * @param pName - Enum name.
     * @param pValues - Enum values by their value name.
     *
     * @returns the processed enum declaration.
     */
    public createEnum(pName: string, pValues: PgslFeatureSetProcessorEnumValues): EnumDeclarationAst {
        // Every enum value is a constant string expression.
        const lValues: Map<string, IExpressionAst> = new Map<string, IExpressionAst>();
        for (const [lValueName, lValue] of Object.entries(pValues)) {
            lValues.set(lValueName, new StringValueExpressionAst({
                value: lValue,
                constantValue: lValue,
                fixedState: PgslValueFixedState.Constant,
                storageAddressSpace: PgslValueAddressSpace.Inherit,
                isStorage: false,
                resolveType: this.types.create(PgslStringType)
            }));
        }

        return new EnumDeclarationAst({
            name: pName,
            underlyingType: this.types.create(PgslStringType),
            values: lValues
        });
    }

    /**
     * Create a function declaration with all of its overloads.
     *
     * @param pName - Function name.
     * @param pOptions - Function options.
     * @param pOverloads - Function overloads.
     *
     * @returns the processed function declaration.
     */
    public createFunction(pName: string, pOptions: PgslFeatureSetProcessorFunctionOptions, pOverloads: Array<PgslFeatureSetProcessorOverload>): FunctionDeclarationAst {
        // Create an overload declaration for every overload definition.
        const lOverloads: Array<FunctionOverloadDeclarationAst> = pOverloads.map((pOverload: PgslFeatureSetProcessorOverload) => {
            // Create and register all generics of this overload.
            const lOverloadGenericsMapping: Map<string, TypeDeclarationAst> = new Map<string, TypeDeclarationAst>();
            for (const [lGenericName, lGenericRestrictions] of Object.entries(pOverload.generics)) {
                // Create generic type.
                const lGenericType: PgslGenericType = new PgslGenericType(lGenericName, lGenericRestrictions);

                // And register it as type declaration.
                lOverloadGenericsMapping.set(lGenericName, this.createTypeDeclaration(lGenericType));
            }

            // Helper to convert strings to internal generic or passthough the type.
            const lGetOverloadType = (pType: string | BasePgslType): TypeDeclarationAst => {
                // When the type is a string, it
                if (typeof pType === 'string') {
                    if (!lOverloadGenericsMapping.has(pType)) {
                        throw new Exception(`Generic type "${pType}" is not defined for this function overload.`, this);
                    }

                    return lOverloadGenericsMapping.get(pType)!;
                }

                return this.createTypeDeclaration(pType);
            };

            // Parameters with a generic type keep the generic name.
            const lParameters: Array<FunctionOverloadDeclarationAstDataParameter> = Object.entries(pOverload.parameters).map(([pParameterName, pParameterType]) => {
                return {
                    name: pParameterName,
                    type: lGetOverloadType(pParameterType)
                };
            });

            // Convert the generic type declaration back into the actual type.
            const lGenerics: Array<PgslGenericType> = [...lOverloadGenericsMapping.values().map((pGenericTypeDeclaration) => {
                return pGenericTypeDeclaration.data.type as PgslGenericType;
            })];

            return new FunctionOverloadDeclarationAst(pName, {
                name: pName,
                generics: lGenerics,
                parameter: lParameters,
                returnType: lGetOverloadType(pOverload.returnType),
                block: this.createEmptyBlock()
            });
        });

        return new FunctionDeclarationAst({
            name: pName,
            isConstant: pOptions.constant ?? false,
            explicitGenerics: pOptions.explicitGenerics ?? false,
            declarations: lOverloads
        });
    }

    /**
     * Create a struct declaration.
     *
     * @param pName - Struct name.
     * @param pProperties - Struct property types by their property name.
     *
     * @returns the processed struct declaration.
     */
    protected createStruct(pName: string, pProperties: PgslFeatureSetProcessorStructProperties): StructDeclarationAst {
        // Properties need their struct, so they are added after the struct is created.
        const lProperties: Array<StructPropertyDeclarationAst> = new Array<StructPropertyDeclarationAst>();

        const lStruct: StructDeclarationAst = new StructDeclarationAst({
            name: pName,
            properties: lProperties
        });

        // Create every property.
        for (const [lPropertyName, lPropertyType] of Object.entries(pProperties)) {
            // Create new 
            const lStructProperty: StructPropertyDeclarationAst = new StructPropertyDeclarationAst({
                name: lPropertyName,
                typeDeclaration: new TypeDeclarationAst({ type: lPropertyType }),
                meta: {}
            }, lStruct);

            lProperties.push(lStructProperty);
        }

        return lStruct;
    }

    /**
     * Get a struct declaration that is already registered in the feature set.
     *
     * @param pName - Struct name.
     *
     * @returns the registered struct declaration.
     *
     * @throws {@link Exception} When no struct with this name is registered in the feature set.
     */
    protected getStruct(pName: string): StructDeclarationAst {
        // Search the already registered declarations of the feature set.
        const lDeclaration: BaseDeclarationAst = this.mFeatureSet.declarationOf(pName);
        if (!(lDeclaration instanceof StructDeclarationAst)) {
            throw new Exception(`Feature set struct "${pName}" is not registered.`, this);
        }

        return lDeclaration;
    }

    /**
     * Define a function overload.
     *
     * @param pGenerics - Overload generics with their type restrictions.
     * @param pParameters - Overload parameters. A string references a generic by its name.
     * @param pReturnType - Overload return type. A string references a generic by its name.
     *
     * @returns the overload definition.
     */
    public createOverload(pGenerics: PgslFeatureSetProcessorOverloadGenerics, pParameters: PgslFeatureSetProcessorOverloadParameters, pReturnType: BasePgslType | string): PgslFeatureSetProcessorOverload {
        return {
            generics: pGenerics,
            parameters: pParameters,
            returnType: pReturnType
        };
    }

    /**
     * Process declaration creations.
     */
    protected abstract onProcess(): void;

    /**
     * Create a type declaration of a type. Generic names are kept as they are.
     *
     * @param pType - Type or generic name.
     *
     * @returns the processed type declaration or the generic name.
     */
    private createTypeDeclaration(pType: BasePgslType): TypeDeclarationAst {
        return new TypeDeclarationAst({ type: pType });
    }

    /**
     * Create an empty block..
     *
     * @returns the processed empty block.
     */
    private createEmptyBlock(): BlockStatementAst {
        return new BlockStatementAst({
            statementList: [],
            returnType: this.types.create(PgslVoidType),
            isContinuing: false,
            isBreaking: false
        });
    }
}

/**
 * Struct property types by their property name.
 */
export type PgslFeatureSetProcessorStructProperties = {
    [name: string]: BasePgslType;
};

/**
 * Enum values by their value name.
 */
export type PgslFeatureSetProcessorEnumValues = {
    [name: string]: string;
};

/**
 * Function options.
 */
export type PgslFeatureSetProcessorFunctionOptions = {
    /**
     * Function can be used to create constant expressions.
     */
    constant?: true;

    /**
     * Generics must be written into the call and are never infered.
     */
    explicitGenerics?: true;
};

/**
 * Function overload definition.
 */
export type PgslFeatureSetProcessorOverload = {
    generics: PgslFeatureSetProcessorOverloadGenerics;
    parameters: PgslFeatureSetProcessorOverloadParameters;
    returnType: BasePgslType | string;
};

/**
 * Generic type definition for an function overload.
 */
export type PgslFeatureSetProcessorOverloadGenerics = {
    [name: string]: Array<BasePgslType>;
};

/**
 * Overload parameter types by their parameter name. A string references a generic by its name.
 */
export type PgslFeatureSetProcessorOverloadParameters = {
    [name: string]: BasePgslType | string;
};

/**
 * Constructor of a feature set processor.
 */
export type PgslFeatureSetProcessorConstructor = {
    new(pFeatureSet: PgslFeatureSet): PgslFeatureSetProcessor;
};