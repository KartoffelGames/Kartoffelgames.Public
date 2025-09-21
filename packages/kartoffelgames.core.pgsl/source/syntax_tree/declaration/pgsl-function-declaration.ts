import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import type { PgslBlockStatement } from '../statement/pgsl-block-statement.ts';
import { BasePgslTypeDefinition } from "../type/base-pgsl-type-definition.ts";
import { BasePgslDeclaration } from './base-pgsl-declaration.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslFunctionDeclaration extends BasePgslDeclaration {
    private readonly mBlock: PgslBlockStatement;
    private readonly mConstant: boolean;
    private readonly mName: string;
    private readonly mParameter: Array<PgslFunctionDeclarationParameter>;
    private readonly mReturnType: BasePgslTypeDefinition;

    /**
     * Function block.
     */
    public get block(): PgslBlockStatement {
        return this.mBlock;
    }

    /**
     * Function declaration can be used to create constant expressions.
     */
    public get isConstant(): boolean {
        return this.mConstant;
    }

    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Function parameter list.
     */
    public get parameter(): Array<PgslFunctionDeclarationParameter> {
        return [...this.mParameter];
    }

    /**
     * Function return type.
     */
    public get returnType(): BasePgslTypeDefinition {
        return this.mReturnType;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Construction parameter.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pParameter: PgslFunctionDeclarationSyntaxTreeConstructorParameter, pAttributes: PgslAttributeList, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mConstant = pParameter.constant;
        this.mBlock = pParameter.block;
        this.mName = pParameter.name;
        this.mParameter = pParameter.parameter;
        this.mReturnType = pParameter.returnType;

        // TODO: Push parameter values to block scope.

        // Add function child trees.
        this.appendChild(pParameter.block);
        this.appendChild(pParameter.returnType);

        // Add each parameter type as child tree.
        for (const lParameter of pParameter.parameter) {
            this.appendChild(lParameter.type);
        }
    }

    /**
     * Transpile current alias declaration into a string.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        // Transpile return type.
        const lReturnType: string = this.mReturnType.transpile();

        // Transpile function parameter list.
        const lParameterList: string = this.mParameter.map((pParameter: PgslFunctionDeclarationParameter) => {
            return ` ${pParameter.name}: ${pParameter.type.transpile()}`;
        }).join(', ');

        // Transpile attribute list.
        let lResult: string = this.attributes.transpile();

        // Create function declaration head without return type.
        lResult += `fn ${this.mName}(${lParameterList})`;

        // Add return type when it is not void/empty.
        if (lReturnType !== '') {
            lResult += ` -> ${lReturnType}`;
        }

        // Add function block.
        lResult += this.mBlock.transpile();

        return lResult;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pValidationTrace - Validation trace.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): void {
        pValidationTrace.pushScopedValue(this.mName, this);

        // Validate attributes.
        this.attributes.validate(pValidationTrace);

        // Validate return type.
        this.mReturnType.validate(pValidationTrace);

        // Create a new scope to combine all parameters with the function block.
        pValidationTrace.newScope(this, () => {
            // Validate each parameters and add them to the validation scope.
            for (const lParameter of this.mParameter) {
                // Validate.
                lParameter.type.validate(pValidationTrace);

                // Push parameter as scoped value.
                pValidationTrace.pushScopedValue(lParameter.name, lParameter.type);
            }

            // Validate function block.
            this.mBlock.validate(pValidationTrace);
        });

        // TODO: Dont know what but maaaaybe need some validation return data.
    }
}

type PgslFunctionDeclarationParameter = {
    readonly type: BasePgslTypeDefinition;
    readonly name: string;
};

export type PgslFunctionDeclarationSyntaxTreeConstructorParameter = {
    name: string;
    parameter: Array<PgslFunctionDeclarationParameter>;
    returnType: BasePgslTypeDefinition;
    block: PgslBlockStatement;
    constant: boolean;
};