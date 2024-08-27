import { Exception } from '@kartoffelgames/core';
import { PgslBuildInTypeName } from '../../../enum/pgsl-build-in-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree } from '../../type/base-pgsl-type-definition-syntax-tree';
import { PgslStringTypeDefinitionSyntaxTree } from '../../type/pgsl-string-type-definition-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

/**
 * PGSL syntax tree for a single string value of boolean, float, integer or uinteger.
 */
export class PgslStringValueExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslStringValueExpressionSyntaxTreeStructureData> {
    private readonly mValue: string;

    /**
     * Never resolve to any type.
     */
    public override get resolveType(): never {
        throw new Exception(`String type cant have a resolve type.`, this);
    }

    /**
     * Type name of literal value.
     */
    public get type(): PgslBuildInTypeName {
        return PgslBuildInTypeName.String;
    }

    /**
     * Value of literal.
     */
    public get value(): string {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslStringValueExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mValue = pData.textValue.substring(1, pData.textValue.length - 1);
    }

    /**
     * On constant state request.
     */
    protected determinateIsConstant(): boolean {
        // A string is allways a constant.
        return true;
    }

    /**
     * On type resolve of expression
     */
    protected determinateResolveType(): BasePgslTypeDefinitionSyntaxTree {
        // Create type declaration.
        const lTypeDeclaration: PgslStringTypeDefinitionSyntaxTree = new PgslStringTypeDefinitionSyntaxTree({}, 0, 0, 0, 0);

        // Set parent to this tree.
        lTypeDeclaration.setParent(this);

        // Validate type.
        lTypeDeclaration.validateIntegrity();

        return lTypeDeclaration;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate.
    }
}

export type PgslStringValueExpressionSyntaxTreeStructureData = {
    textValue: string;
};