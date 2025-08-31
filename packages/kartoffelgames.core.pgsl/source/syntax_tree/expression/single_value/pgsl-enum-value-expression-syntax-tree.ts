import { Exception } from '@kartoffelgames/core';
import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslEnumDeclarationSyntaxTree, PgslEnumDeclarationSyntaxTreeValidationAttachment } from '../../declaration/pgsl-enum-declaration-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { PgslNumericTypeDefinitionSyntaxTree } from "../../type/pgsl-numeric-type-definition-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL structure holding single enum value.
 */
export class PgslEnumValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mName: string;
    private readonly mProperty: string;

    /**
     * Enum name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Enum property name.
     */
    public get property(): string {
        return this.mProperty;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pName: string, pProperty: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mName = pName;
        this.mProperty = pProperty;
    }

    /**
     * Transpile current expression to WGSL code.
     * 
     * @returns WGSL code.
     */
    protected override onTranspile(): string {
        return `ENUM__${this.mName}__${this.mProperty}`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Catch undefined enum names.
        const lReferencedEnum: BasePgslSyntaxTree = pTrace.getScopedValue(this.mName);
        if (!(lReferencedEnum instanceof PgslEnumDeclarationSyntaxTree)) {
            throw new Exception(`Enum "${this.mName}" not defined.`, this);
        }

        // Read attachment of enum.
        const lEnumAttachment: PgslEnumDeclarationSyntaxTreeValidationAttachment = pTrace.getAttachment(lReferencedEnum);

        // Catch undefined enum properties.
        const lProperty: BasePgslExpressionSyntaxTree | undefined = lEnumAttachment.values.get(this.mProperty);
        if (!lProperty) {
            pTrace.pushError(`Enum property "${this.mName}.${this.mProperty}" not defined.`, this.meta, this);

            return {
                fixedState: PgslValueFixedState.Constant,
                isStorage: false,
                resolveType: null as unknown as PgslNumericTypeDefinitionSyntaxTree // TODO: Maybe use a unknown type here?
            };
        }

        // Read the attachment of the property.
        const lPropertyAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(lProperty);

        return {
            fixedState: PgslValueFixedState.Constant,
            isStorage: false,
            resolveType: lPropertyAttachment.resolveType
        };
    }
}