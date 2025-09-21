import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslEnumDeclaration, PgslEnumDeclarationSyntaxTreeValidationAttachment } from '../../declaration/pgsl-enum-declaration.ts';
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { PgslNumericTypeDefinition } from "../../type/pgsl-numeric-type-definition.ts";
import { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression.ts';

/**
 * PGSL structure holding single enum value.
 */
export class PgslEnumValueExpression extends BasePgslExpression {
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
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        // Catch undefined enum names.
        const lReferencedEnum: BasePgslSyntaxTree = pTrace.getScopedValue(this.mName);
        if (!(lReferencedEnum instanceof PgslEnumDeclaration)) { // TODO: Cant do this, as alias types could be that as well.
            pTrace.pushError(`Enum "${this.mName}" not defined.`, this.meta, this);

            return {
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: null as unknown as PgslNumericTypeDefinition // TODO: Maybe use a unknown type here?
            };
        }

        // Read attachment of enum.
        const lEnumAttachment: PgslEnumDeclarationSyntaxTreeValidationAttachment = pTrace.getAttachment(lReferencedEnum);

        // Catch undefined enum properties.
        const lProperty: BasePgslExpression | undefined = lEnumAttachment.values.get(this.mProperty);
        if (!lProperty) {
            pTrace.pushError(`Enum property "${this.mName}.${this.mProperty}" not defined.`, this.meta, this);

            return {
                fixedState: PgslValueFixedState.Constant,
                isStorage: false,
                resolveType: null as unknown as PgslNumericTypeDefinition // TODO: Maybe use a unknown type here?
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