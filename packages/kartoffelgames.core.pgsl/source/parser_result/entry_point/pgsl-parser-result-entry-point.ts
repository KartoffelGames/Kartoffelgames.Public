import type { FunctionDeclarationAstDataDeclaration } from '../../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import { PgslParserResultObject } from '../pgsl-parser-result-object.ts';

/**
 * Represents a entry point result from PGSL parser with parameter and return information.
 */
export class PgslParserResultEntryPoint extends PgslParserResultObject{
    private readonly mName: string;
    private readonly mType: PgslParserResultEntryPointType;

    /**
     * Gets the name of the entry point.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Gets the type of the entry point.
     */
    public get type(): PgslParserResultEntryPointType {
        return this.mType;
    }

    /**
     * Creates a new instance of PgslParserResultEntryPoint.
     * 
     * @param pType - Type of the entry point.
     * @param pFunctionDeclaration - The function declaration AST containing entry point information.
     */
    public constructor(pType: PgslParserResultEntryPointType, pFunctionDeclaration: FunctionDeclarationAstDataDeclaration) {
        super(pFunctionDeclaration.attributes.data.metaValues);

        this.mType = pType;
        this.mName = pFunctionDeclaration.name;
    }
}

export type PgslParserResultEntryPointType = 'vertex' | 'fragment' | 'compute';