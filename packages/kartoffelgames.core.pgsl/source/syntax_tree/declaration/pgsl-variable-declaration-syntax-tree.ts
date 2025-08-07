import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree.ts';
import type { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree.ts';
import type { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from '../type/base-pgsl-type-definition-syntax-tree.ts';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree.ts';
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslVariableDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslVariableDeclarationSyntaxTreeValidationAttachment> {
    /**
     * Mapping of declaration type to address space.
     */
    private static readonly mDeclarationAddressSpaceMapping: Dictionary<PgslDeclarationType, PgslValueAddressSpace> = (() => {
        const lAddressSpaceMapping: Dictionary<PgslDeclarationType, PgslValueAddressSpace> = new Dictionary<PgslDeclarationType, PgslValueAddressSpace>();
        lAddressSpaceMapping.set(PgslDeclarationType.Storage, PgslValueAddressSpace.Storage);
        lAddressSpaceMapping.set(PgslDeclarationType.Uniform, PgslValueAddressSpace.Uniform);
        lAddressSpaceMapping.set(PgslDeclarationType.Workgroup, PgslValueAddressSpace.Workgroup);
        lAddressSpaceMapping.set(PgslDeclarationType.Private, PgslValueAddressSpace.Private);
        lAddressSpaceMapping.set(PgslDeclarationType.Const, PgslValueAddressSpace.Private);
        lAddressSpaceMapping.set(PgslDeclarationType.Param, PgslValueAddressSpace.Private);

        return lAddressSpaceMapping;
    })();

    /**
     * List of declaration types which can be used for variable declarations.
     */
    private static readonly mDeclarationTypeSet: Set<PgslDeclarationType> = new Set([
        PgslDeclarationType.Const,
        PgslDeclarationType.Storage,
        PgslDeclarationType.Uniform,
        PgslDeclarationType.Workgroup,
        PgslDeclarationType.Private,
        PgslDeclarationType.Param,
    ]);

    private readonly mDeclarationTypeName: string;
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Value initialization expression.
     */
    public get expression(): BasePgslExpressionSyntaxTree | null {
        return this.mExpression;
    }

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Variable type.
     */
    public get type(): BasePgslTypeDefinitionSyntaxTree {
        return this.mTypeDeclaration;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslVariableDeclarationSyntaxTreeConstructorParameter, pAttributes: PgslAttributeListSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mTypeDeclaration = pData.type;
        this.mName = pData.name;
        this.mDeclarationTypeName = pData.declarationType;
        this.mExpression = pData.expression ?? null;

        // Append child trees.
        this.appendChild(this.mTypeDeclaration);
        if (this.mExpression) {
            this.appendChild(this.mExpression);
        }
    }

    protected override onTranspile(): string {
        // Try to parse declaration type.
        let lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        if (!lDeclarationType) {
            lDeclarationType = PgslDeclarationType.Private;
        }

        const lDeclarationTypeString: string = (() => {
            // TODO: Needs some better handling for texture and sampler types.

            switch (lDeclarationType) {
                case PgslDeclarationType.Const:
                    return 'const';
                case PgslDeclarationType.Storage:
                    // TODO: when read write attribute is set use another accessmode.
                    return 'var<storage, read_write>';
                case PgslDeclarationType.Uniform:
                    return 'var<uniform>';
                case PgslDeclarationType.Workgroup:
                    return 'var<workgroup>';
                case PgslDeclarationType.Private:
                    return 'var<private>';
                case PgslDeclarationType.Param:
                    return 'override';
            }

            return 'var<private>';
        })();

        // Transpile attributes and type declaration.
        const lAttributes: string = this.attributes.transpile();
        const lTypeDeclaration: string = this.mTypeDeclaration.transpile();

        // If no expression is given, return declaration without expression.
        if (!this.mExpression) {
            return `${lAttributes} ${lDeclarationTypeString} ${this.mName}: ${lTypeDeclaration};`;
        }

        return `${lAttributes} ${lDeclarationTypeString} ${this.mName}: ${lTypeDeclaration} = ${this.mExpression.transpile()};`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): PgslVariableDeclarationSyntaxTreeValidationAttachment {
        // Push variable definition to current scope.
        pValidationTrace.pushScopedValue(this.mName, this);

        // Validate attributes.
        this.attributes.validate(pValidationTrace);

        // Try to parse declaration type.
        const lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        if (!lDeclarationType) {
            throw new Exception(`Declaration type "${this.mDeclarationTypeName}" can not be used for module scope variable declarations.`, this);
        }

        // Const declaration types.
        const lConstDeclarationTypeList: Array<PgslDeclarationType> = [
            PgslDeclarationType.Const,
            PgslDeclarationType.Param,
        ];

        // Read attachments of type declaration.
        const lTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mTypeDeclaration);

        // Validate const type needs to be constructible.
        if (lConstDeclarationTypeList.includes(lDeclarationType) && !lTypeAttachment.constructible) {
            throw new Exception(`Constant variable declarations can only be of a constructible type.`, this);
        }

        // TODO: When const, param, must habe a initializer.
        // TODO: private workgroup dont need a initializer
        // TODO: Storage, Uniform shoulnt have a initializer.

        // TODO: Storage value musst be host sharable.
        // a numeric scalar type
        // a numeric vector type
        // a matrix type
        // an atomic type
        // a fixed-size array type, if it has creation-fixed footprint and its element type is host-shareable
        // a runtime-sized array type, if its element type is host-shareable
        // a structure type, if all its members are host-shareable

        // TODO: Validate if declaration type can store the type.
        // TODO: Validate if declaration type allows any initialization expression.
        // TODO: Validate if expression fits declaration type.
        // TODO: Validate if declaration is const when it is the expression part should be the same.

        // TODO: To fit all this into a readable mess: https://www.w3.org/TR/WGSL/#var-and-value
        // Write a mapping for each declaration type.

        // Determine fixed state based on declaration type.
        const lFixedState: PgslValueFixedState = (() => {
            switch (lDeclarationType) {
                case PgslDeclarationType.Const:
                    return PgslValueFixedState.Constant;
                case PgslDeclarationType.Param:
                    return PgslValueFixedState.PipelineCreationFixed;
            }

            return PgslValueFixedState.Variable;
        })();

        return {
            addressSpace: PgslVariableDeclarationSyntaxTree.mDeclarationAddressSpaceMapping.get(lDeclarationType)!,
            declarationType: lDeclarationType,
            type: this.mTypeDeclaration,
            fixedState: lFixedState
        };
    }
}

export type PgslVariableDeclarationSyntaxTreeValidationAttachment = {
    fixedState: PgslValueFixedState;
    declarationType: PgslDeclarationType;
    addressSpace: PgslValueAddressSpace;
    type: BasePgslTypeDefinitionSyntaxTree;
};

export type PgslVariableDeclarationSyntaxTreeConstructorParameter = {
    declarationType: string;
    name: string;
    type: BasePgslTypeDefinitionSyntaxTree;
    expression?: BasePgslExpressionSyntaxTree;
};