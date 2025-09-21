import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/base-pgsl-expression-syntax-tree.ts';
import type { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree.ts';
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from '../type/base-pgsl-type-definition-syntax-tree.ts';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree.ts';
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { PgslBaseTypeName } from "../type/enum/pgsl-base-type-name.enum.ts";

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

    private readonly mDeclarationTypeName: string;
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Declaration type name.
     */
    public get declarationType(): PgslDeclarationType {
        const lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        return lDeclarationType ?? PgslDeclarationType.Private;
    }

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
        let lAttributes: string = this.attributes.transpile();
        if (lAttributes.length > 0) {
            lAttributes += ' ';
        }

        const lTypeDeclaration: string = this.mTypeDeclaration.transpile();

        // If no expression is given, return declaration without expression.
        if (!this.mExpression) {
            return `${lAttributes}${lDeclarationTypeString} ${this.mName}: ${lTypeDeclaration};`;
        }

        return `${lAttributes}${lDeclarationTypeString} ${this.mName}: ${lTypeDeclaration} = ${this.mExpression.transpile()};`;
    }

    /**
     * Validate data of current structure.
     * https://www.w3.org/TR/WGSL/#var-and-value
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): PgslVariableDeclarationSyntaxTreeValidationAttachment {
        // Push variable definition to current scope.
        pValidationTrace.pushScopedValue(this.mName, this);

        // Validate attributes and type declaration.
        this.attributes.validate(pValidationTrace);
        this.mTypeDeclaration.validate(pValidationTrace);

        // Validate optional expression when set.
        if (this.mExpression) {
            this.mExpression.validate(pValidationTrace);
        }

        // Try to parse declaration type.
        let lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        if (!lDeclarationType) {
            pValidationTrace.pushError(`Declaration type "${this.mDeclarationTypeName}" can not be used for module scope variable declarations.`, this.meta, this);

            // Set default declaration type to avoid further errors.
            // Private is a good default as it has the least restrictions.
            lDeclarationType = PgslDeclarationType.Private;
        }

        // Read attachments of type declaration.
        const lTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mTypeDeclaration);

        // Read optional expression attachment.
        let lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment | null = null;
        if (this.mExpression) {
            lExpressionAttachment = pValidationTrace.getAttachment(this.mExpression);
        }

        // A bunch of specific validation function to easy build a validation for each declaration type.
        const lMustBeConstructible = () => {
            if (!lTypeAttachment.constructible) {
                pValidationTrace.pushError(`The type of declaration type "${this.mDeclarationTypeName}" must be constructible.`, this.meta, this);
            }
        };
        const lMustBeScalar = () => {
            if (!lTypeAttachment.scalar) {
                pValidationTrace.pushError(`The type of declaration type "${this.mDeclarationTypeName}" must be a scalar type.`, this.meta, this);
            }
        };
        const lMustHaveAnInitializer = () => {
            if (!this.mExpression) {
                pValidationTrace.pushError(`Declaration type "${this.mDeclarationTypeName}" must have an initializer.`, this.meta, this);
            }
        };
        const lMustNotHaveAnInitializer = () => {
            if (this.mExpression) {
                pValidationTrace.pushError(`Declaration type "${this.mDeclarationTypeName}" must not have an initializer.`, this.meta, this);
            }
        };
        const lMustBeHostShareable = () => {
            if (!lTypeAttachment.hostShareable) {
                pValidationTrace.pushError(`The type of declaration type "${this.mDeclarationTypeName}" must be host shareable.`, this.meta, this);
            }
        };
        const lMustHaveAFixedFootprint = () => {
            if (!lTypeAttachment.fixedFootprint) {
                pValidationTrace.pushError(`The type of declaration type "${this.mDeclarationTypeName}" must have a fixed footprint.`, this.meta, this);
            }
        };
        const lExpressionMustBeConst = () => {
            if (lExpressionAttachment && lExpressionAttachment.fixedState !== PgslValueFixedState.Constant) {
                pValidationTrace.pushError(`The expression of declaration type "${this.mDeclarationTypeName}" must be a constant expression.`, this.meta, this);
            }
        };
        const lMustBePlain = () => {
            if (!lTypeAttachment.plain) {
                pValidationTrace.pushError(`The type of declaration type "${this.mDeclarationTypeName}" must be a plain type.`, this.meta, this);
                return;
            }
        };

        switch (lDeclarationType) {
            case PgslDeclarationType.Const: {
                lMustBeConstructible();
                lMustHaveAnInitializer();
                lExpressionMustBeConst();
                break;
            }
            case PgslDeclarationType.Storage: {
                lMustNotHaveAnInitializer();
                lMustBeHostShareable();
                break;
            }
            case PgslDeclarationType.Uniform: {
                lMustNotHaveAnInitializer();
                lMustBeConstructible();
                lMustBeHostShareable();
                break;
            }
            case PgslDeclarationType.Workgroup: {
                lMustHaveAFixedFootprint();
                lMustBePlain();
                break;
            }
            case PgslDeclarationType.Private: {
                lMustBeConstructible();
                break;
            }
            case PgslDeclarationType.Param: {
                lMustBeConstructible();
                lMustBeScalar();
                lMustHaveAnInitializer();
                break;
            }
            default: {
                // Unknown declaration type.
                pValidationTrace.pushError(`Declaration type "${this.mDeclarationTypeName}" can not be used for module scope variable declarations.`, this.meta, this);
            }
        }

        // Validate if expression fits declaration type.
        if(lExpressionAttachment && !lExpressionAttachment.resolveType.isImplicitCastableInto(pValidationTrace, this.mTypeDeclaration)) {
            // Read the attachment of the expression type.
            const lExpressionTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lExpressionAttachment.resolveType);

            // Expression type is not castable into declaration type.
            pValidationTrace.pushError(`Initializing value of type "${lExpressionTypeAttachment.baseType}" can't be assigned to "${lTypeAttachment.baseType}"`, this.meta, this);
        }

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