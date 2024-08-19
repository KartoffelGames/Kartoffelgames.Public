import { EnumUtil } from '@kartoffelgames/core';
import { CodeParser, LexerToken } from '@kartoffelgames/core.parser';
import { PgslOperator } from '../enum/pgsl-operator.enum';
import { PgslBuildInTypeName } from '../enum/pgsl-type-name.enum';
import { PgslSyntaxTreeDataStructure } from '../syntax_tree/base-pgsl-syntax-tree';
import { PgslAliasDeclarationSyntaxTreeStructureData } from '../syntax_tree/declarations/pgsl-alias-declaration-syntax-tree';
import { PgslEnumDeclarationSyntaxTreeStructureData } from '../syntax_tree/declarations/pgsl-enum-declaration-syntax-tree';
import { PgslFunctionCallExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/parenthesized/pgsl-function-call-expression-syntax-tree';
import { PgslParenthesizedExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/parenthesized/pgsl-parenthesized-expression';
import { PgslArithmeticExpression } from '../syntax_tree/expression/pgsl-arithmetic-expression';
import { PgslBinaryExpression as PgslBitExpression } from '../syntax_tree/expression/pgsl-bit-expression';
import { PgslComparisonExpression } from '../syntax_tree/expression/pgsl-comparison-expression';
import { PgslExpressionSyntaxTreeStructureData, PgslVariableExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/pgsl-expression-syntax-tree-factory';
import { PgslLiteralValueExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/pgsl-literal-value-expression-syntax-tree';
import { PgslLogicalExpression } from '../syntax_tree/expression/pgsl-logical-expression';
import { PgslAddressOfExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/unary/pgsl-address-of-expression-syntax-tree';
import { PgslPointerExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/unary/pgsl-pointer-expression-syntax-tree';
import { PgslUnaryExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/unary/pgsl-unary-expression-syntax-tree';
import { PgslEnumValueExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/variable/pgsl-enum-value-expression-syntax-tree';
import { PgslIndexedValueExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/variable/pgsl-indexed-value-expression-syntax-tree';
import { PgslValueDecompositionExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/variable/pgsl-value-decomposition-expression-syntax-tree';
import { PgslVariableNameExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/variable/pgsl-variable-name-expression-syntax-tree';
import { PgslAttributeListSyntaxTreeStructureData } from '../syntax_tree/general/pgsl-attribute-list-syntax-tree';
import { PgslTemplateListSyntaxTreeStructureData } from '../syntax_tree/general/pgsl-template-list-syntax-tree';
import { PgslTypeDefinitionSyntaxTreeStructureData } from '../syntax_tree/general/pgsl-type-definition-syntax-tree';
import { PgslModuleSyntaxTree, PgslModuleSyntaxTreeStructureData } from '../syntax_tree/pgsl-module-syntax-tree';
import { PgslBlockStatementSyntaxTreeStructureData } from '../syntax_tree/statement/pgsl-block-statement-syntax-tree';
import { PgslFunctionCallStatement } from '../syntax_tree/statement/pgsl-function-call-statement';
import { PgslIfStatement } from '../syntax_tree/statement/pgsl-if-statement';
import { PgslLexer } from './pgsl-lexer';
import { PgslToken } from './pgsl-token.enum';
import { PgslStatementSyntaxTreeStructureData } from '../syntax_tree/statement/pgsl-statement-factory';

export class PgslParser extends CodeParser<PgslToken, PgslModuleSyntaxTree> {
    private mParserBuffer: ParserBuffer;

    /**
     * Constructor.
     */
    public constructor() {
        super(new PgslLexer());

        // Setup buffer.
        this.mParserBuffer = {
            aliasDeclarations: new Set<string>(),
            enumDeclaration: new Set<string>(),
            structDeclaration: new Set<string>()
        };

        // Define helper graphs.
        this.defineCore();
        this.defineVariableExpression();
        this.defineExpression();
        this.defineModuleScope();

        this.defineFunctionScope();

        // Set root.
        this.defineRoot();
    }

    /**
     * Parse a text with the set syntax from CodeParser.setRootGraphPart into a sytnax tree or custom data structure.
     * 
     * @param pCodeText - Code as text.
     *
     * @returns The code as TTokenType data structure.
     *
     * @throws {@link ParserException} 
     * When the graph could not be resolved with the set code text. Or Exception when no tokenizeable text should be parsed.
     */
    public override parse(pCodeText: string): PgslModuleSyntaxTree {
        // Build PgslDocument.
        const lDocument: PgslModuleSyntaxTree = new PgslModuleSyntaxTree();

        // TODO: Insert imports. #IMPORT
        // TODO: Fill in buffers with imported declarations.

        // TODO: Replace comments with same amount of spaces ans newlines.
        // TODO: Setup #IFDEF. Fill Replaced '#IFDEFs, #ENDIFDEF with same amount of spaces and newlines.

        // TODO: Remove any other # statements as they do nothing. Replace with same amount of spaces and newlines.

        // Parse document structure.
        const lDocumentStructure: PgslModuleSyntaxTreeStructureData = super.parse(pCodeText) as unknown as PgslModuleSyntaxTreeStructureData;

        // TODO: Validate document.

        // Clear old parsing buffers.
        this.mParserBuffer = {
            aliasDeclarations: new Set<string>(),
            enumDeclaration: new Set<string>(),
            structDeclaration: new Set<string>()
        };

        return lDocument.applyDataStructure(lDocumentStructure, null);
    }

    /**
     * Create meta data structure for a syntax tree.
     * 
     * @param pType - Structure type.
     * @param pStartToken - Parsed structure start token.
     * @param pEndToken - Parsed structure end token.
     * 
     * @returns meta data structure of syntax tree. 
     */
    private createMeta<TType extends string>(pType: TType, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslSyntaxTreeDataStructure<TType, object>['meta'] {
        return {
            file: '<NO-FILE>', // TODO: Current file name?
            type: pType,
            position: {
                start: {
                    column: pStartToken.columnNumber,
                    line: pStartToken.lineNumber
                },
                end: {
                    column: pEndToken.columnNumber,
                    line: pEndToken.lineNumber
                }
            }
        };
    }

    /**
     * Define core graphs used by different scopes.
     */
    private defineCore(): void {

        this.defineGraphPart('General-AttributeList', this.graph()
            .loop('list', this.graph()
                .single(PgslToken.AttributeIndicator)
                .single('name', PgslToken.Identifier)
                .single(PgslToken.ParenthesesStart)
                .optional('parameter', this.graph()
                    .single('first', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
                    .loop('additional', this.graph()
                        .single(PgslToken.Comma).single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
                    )
                )
                .single(PgslToken.ParenthesesEnd)
            ),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslAttributeListSyntaxTreeStructureData => {
                // Create attribute list.
                const lAttributeList: PgslAttributeListSyntaxTreeStructureData = {
                    meta: this.createMeta('General-AttributeList', pStartToken, pEndToken),
                    data: {
                        attributes: new Array<{ name: string; parameter: Array<PgslExpressionSyntaxTreeStructureData>; }>()
                    }
                };

                // Add each attribute to list.
                for (const lAttribute of pData.list) {
                    // Build parameter list of attribute.
                    const lParameterList: Array<PgslExpressionSyntaxTreeStructureData> = new Array<PgslExpressionSyntaxTreeStructureData>();
                    if (lAttribute.parameter) {
                        // Add first expression.
                        lParameterList.push(lAttribute.parameter?.first);

                        // Add additional items.
                        for (const lItem of lAttribute.parameter.additional) {
                            lParameterList.push(lItem.expression);
                        }
                    }

                    // Add each attribute with parameters.
                    lAttributeList.data.attributes.push({
                        name: lAttribute.name,
                        parameter: lParameterList
                    });
                }

                return lAttributeList;
            }
        );

        this.defineGraphPart('General-TemplateList', this.graph()
            .single(PgslToken.TemplateListStart)
            .branch('first', [
                this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'),
                this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition-ForcedTemplate')
            ])
            .loop('additional', this.graph()
                .single(PgslToken.Comma)
                .branch('value', [
                    this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'),
                    this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition-ForcedTemplate')
                ])
            )
            .single(PgslToken.TemplateListEnd),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslTemplateListSyntaxTreeStructureData => {
                // Build Parameter list
                const lParameterList: Array<PgslTypeDefinitionSyntaxTreeStructureData | PgslExpressionSyntaxTreeStructureData> = [pData.first, ...pData.additional.map((pParameter) => { return pParameter.value; })];

                // Sometimes a variable name expression is a type definition :(
                // So we need to filter it.
                for (let lIndex: number = 0; lIndex < lParameterList.length; lIndex++) {
                    const lParameter: PgslTypeDefinitionSyntaxTreeStructureData | PgslExpressionSyntaxTreeStructureData = lParameterList[lIndex];
                    if (lParameter.meta.type === 'Expression-VariableName') {
                        const lVariableNameExpression: PgslVariableNameExpressionSyntaxTreeStructureData = lParameter as PgslVariableNameExpressionSyntaxTreeStructureData;

                        // Replace variable name expression with type expression.
                        if (EnumUtil.exists(PgslBuildInTypeName, lVariableNameExpression.data.name) || this.mParserBuffer.structDeclaration.has(lVariableNameExpression.data.name)) {
                            lParameterList[lIndex] = {
                                meta: { ...lVariableNameExpression.meta, type: 'General-TypeDefinition' },
                                data: {
                                    name: lVariableNameExpression.data.name
                                }
                            };
                        }
                    }
                }

                return {
                    meta: this.createMeta('General-TemplateList', pStartToken, pEndToken),
                    data: {
                        parameterList: lParameterList
                    }
                };
            }
        );

        this.defineGraphPart('General-TypeDefinition', this.graph()
            .single('name', PgslToken.Identifier)
            .optional('templateList', this.partReference<PgslTemplateListSyntaxTreeStructureData>('General-TemplateList')),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslTypeDefinitionSyntaxTreeStructureData => {
                // Define root structure of type definition syntax tree structure data and apply type name.
                const lData: PgslTypeDefinitionSyntaxTreeStructureData = {
                    meta: this.createMeta('General-TypeDefinition', pStartToken, pEndToken),
                    data: {
                        name: pData.name
                    }
                };

                // Append optional template list.
                if (pData.templateList) {
                    lData.data.templateList = pData.templateList;
                }

                return lData;
            }
        );

        this.defineGraphPart('General-TypeDefinition-ForcedTemplate', this.graph()
            .single('name', PgslToken.Identifier)
            .single('templateList', this.partReference<PgslTemplateListSyntaxTreeStructureData>('General-TemplateList')),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslTypeDefinitionSyntaxTreeStructureData => {
                // Define root structure of type definition syntax tree structure data and apply type name.
                const lData: PgslTypeDefinitionSyntaxTreeStructureData = {
                    meta: this.createMeta('General-TypeDefinition', pStartToken, pEndToken),
                    data: {
                        name: pData.name
                    }
                };

                // Append optional template list.
                if (pData.templateList) {
                    lData.data.templateList = pData.templateList;
                }

                return lData;
            }
        );
    }

    /**
     * Define graphs only for resolving expressions.
     */
    private defineExpression(): void {

        this.defineGraphPart('LogicalExpression', this.graph()
            .single('leftExpression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
            .branch('operation', [
                PgslToken.OperatorShortCircuitOr,
                PgslToken.OperatorShortCircuitAnd,
                PgslToken.OperatorMultiply,
                PgslToken.OperatorBinaryOr,
                PgslToken.OperatorBinaryAnd
            ])
            .single('rightExpression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression')),
            (pData): PgslLogicalExpression => {
                const lLogicalExpression: PgslLogicalExpression = new PgslLogicalExpression();
                lLogicalExpression.leftExpression = pData.leftExpression;
                lLogicalExpression.operator = EnumUtil.cast(PgslOperator, pData.operation)!;
                lLogicalExpression.rightExpression = pData.rightExpression;

                return lLogicalExpression;
            }
        );

        this.defineGraphPart('ArithmeticExpression', this.graph()
            .single('leftExpression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
            .branch('operation', [
                PgslToken.OperatorPlus,
                PgslToken.OperatorMinus,
                PgslToken.OperatorMultiply,
                PgslToken.OperatorDivide,
                PgslToken.OperatorModulo
            ])
            .single('rightExpression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression')),
            (pData): PgslArithmeticExpression => {
                const lArithmeticExpression: PgslArithmeticExpression = new PgslArithmeticExpression();
                lArithmeticExpression.leftExpression = pData.leftExpression;
                lArithmeticExpression.operator = EnumUtil.cast(PgslOperator, pData.operation)!;
                lArithmeticExpression.rightExpression = pData.rightExpression;

                return lArithmeticExpression;
            }
        );

        this.defineGraphPart('ComparisonExpression', this.graph()
            .single('leftExpression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
            .branch('comparison', [
                PgslToken.OperatorEqual,
                PgslToken.OperatorNotEqual,
                PgslToken.OperatorLowerThan,
                PgslToken.OperatorLowerThanEqual,
                PgslToken.OperatorGreaterThan,
                PgslToken.OperatorGreaterThanEqual
            ])
            .single('rightExpression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression')),
            (pData): PgslComparisonExpression => {
                const lComparisonExpression: PgslComparisonExpression = new PgslComparisonExpression();
                lComparisonExpression.leftExpression = pData.leftExpression;
                lComparisonExpression.comparison = EnumUtil.cast(PgslOperator, pData.comparison)!;
                lComparisonExpression.rightExpression = pData.rightExpression;

                return lComparisonExpression;
            }
        );

        this.defineGraphPart('BitOperationExpression', this.graph()
            .single('leftExpression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
            .branch('operation', [
                PgslToken.OperatorBinaryOr,
                PgslToken.OperatorBinaryAnd,
                PgslToken.OperatorBinaryXor,
                PgslToken.OperatorShiftLeft,
                PgslToken.OperatorShiftRight
            ])
            .single('rightExpression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression')),
            (pData): PgslBitExpression => {
                const lUnaryExpression: PgslBitExpression = new PgslBitExpression();
                lUnaryExpression.leftExpression = pData.leftExpression;
                lUnaryExpression.operator = EnumUtil.cast(PgslOperator, pData.operation)!;
                lUnaryExpression.rightExpression = pData.rightExpression;

                return lUnaryExpression;
            }
        );

        this.defineGraphPart('Expression-Unary', this.graph()
            .branch('prefix', [
                PgslToken.OperatorBinaryNegate,
                PgslToken.OperatorMinus,
                PgslToken.OperatorNot
            ])
            .single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression')),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslUnaryExpressionSyntaxTreeStructureData => {
                return {
                    meta: this.createMeta('Expression-Unary', pStartToken, pEndToken),
                    data: {
                        expression: pData.expression,
                        operator: pData.prefix
                    }
                };
            }
        );

        this.defineGraphPart('Expression-Parenthesized', this.graph()
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
            .single(PgslToken.ParenthesesEnd),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslParenthesizedExpressionSyntaxTreeStructureData => {
                return {
                    meta: this.createMeta('Expression-Parenthesized', pStartToken, pEndToken),
                    data: {
                        expression: pData.expression
                    }
                };
            }
        );

        this.defineGraphPart('Expression-FunctionCall', this.graph()
            .single('name', PgslToken.Identifier)
            .optional('templateList', this.partReference<PgslTemplateListSyntaxTreeStructureData>('General-TemplateList'))
            .single(PgslToken.ParenthesesStart)
            .optional('parameter', this.graph()
                .single('first', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
                .loop('additional', this.graph()
                    .single(PgslToken.Comma).single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
                )
            )
            .single(PgslToken.ParenthesesEnd),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslFunctionCallExpressionSyntaxTreeStructureData => {
                // Build parameter list of function.
                const lParameterList: Array<PgslExpressionSyntaxTreeStructureData> = new Array<PgslExpressionSyntaxTreeStructureData>();
                if (pData.parameter) {
                    // Add first expression.
                    lParameterList.push(pData.parameter.first);

                    // Add additional items.
                    for (const lItem of pData.parameter.additional) {
                        lParameterList.push(lItem.expression);
                    }
                }

                // Build function structure.
                const lData: PgslFunctionCallExpressionSyntaxTreeStructureData = {
                    meta: this.createMeta('Expression-FunctionCall', pStartToken, pEndToken),
                    data: {
                        name: pData.name,
                        parameterList: lParameterList
                    }
                };

                // Optional template.
                if (pData.templateList) {
                    lData.data.template = pData.templateList;
                }

                return lData;
            }
        );

        this.defineGraphPart('Expression-AddressOf', this.graph()
            .single(PgslToken.OperatorBinaryAnd)
            .single('variable', this.partReference<PgslVariableExpressionSyntaxTreeStructureData>('Expression-Variable')),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslAddressOfExpressionSyntaxTreeStructureData => {
                return {
                    meta: this.createMeta('Expression-AddressOf', pStartToken, pEndToken),
                    data: {
                        variable: pData.variable
                    }
                };
            }
        );

        this.defineGraphPart('Expression-Pointer', this.graph()
            .single(PgslToken.OperatorMultiply)
            .single('variable', this.partReference<PgslVariableExpressionSyntaxTreeStructureData>('Expression-Variable')),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslPointerExpressionSyntaxTreeStructureData => {
                return {
                    meta: this.createMeta('Expression-Pointer', pStartToken, pEndToken),
                    data: {
                        variable: pData.variable
                    }
                };
            }
        );

        this.defineGraphPart('Expression-LiteralValue', this.graph()
            .branch('value', [
                this.graph().single('float', PgslToken.LiteralFloat),
                this.graph().single('integer', PgslToken.LiteralInteger),
                this.graph().single('boolean', PgslToken.LiteralBoolean)
            ]),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslLiteralValueExpressionSyntaxTreeStructureData => {
                // Define different types of data for the different literals.
                let lData: PgslLiteralValueExpressionSyntaxTreeStructureData['data'];
                if ('float' in pData.value) {
                    lData = {
                        textValue: pData.value.float,
                        literalType: PgslBuildInTypeName.Float
                    };
                } else if ('integer' in pData.value) {
                    lData = {
                        textValue: pData.value.integer,
                        literalType: PgslBuildInTypeName.Integer
                    };
                } else if ('boolean' in pData.value) {
                    lData = {
                        textValue: pData.value.boolean,
                        literalType: PgslBuildInTypeName.Boolean
                    };
                }

                return {
                    meta: this.createMeta('Expression-LiteralValue', pStartToken, pEndToken),
                    data: lData!
                };
            }
        );

        this.defineGraphPart('Expression', this.graph()
            .branch('expression', [
                this.partReference<PgslVariableExpressionSyntaxTreeStructureData>('Expression-Variable'), // => defineVariableExpression
                this.partReference<PgslLiteralValueExpressionSyntaxTreeStructureData>('Expression-LiteralValue'),
                this.partReference<PgslUnaryExpressionSyntaxTreeStructureData>('Expression-Unary'),
                this.partReference<PgslPointerExpressionSyntaxTreeStructureData>('Expression-Pointer'),
                this.partReference<PgslAddressOfExpressionSyntaxTreeStructureData>('Expression-AddressOf'),
                this.partReference<PgslFunctionCallExpressionSyntaxTreeStructureData>('Expression-FunctionCall'),
                this.partReference<PgslParenthesizedExpressionSyntaxTreeStructureData>('Expression-Parenthesized'),
                this.partReference<PgslBitExpression>('BitOperationExpression'),
                this.partReference<PgslComparisonExpression>('ComparisonExpression'),
                this.partReference<PgslArithmeticExpression>('ArithmeticExpression'),
                this.partReference<PgslLogicalExpression>('LogicalExpression')
            ]),
            (pData): PgslExpressionSyntaxTreeStructureData => {
                return pData.expression;
            }
        );
    }

    /**
     * Define all statements and flows used inside function scope.
     */
    private defineFunctionScope(): void {

        this.defineGraphPart('IfStatement', this.graph()
            .single(PgslToken.KeywordIf)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference<PgslBlockStatementSyntaxTreeStructureData>('Statement-Block'))
            .optional('ifElse', this.graph()
                .single(PgslToken.KeywordElse)
                .single('if', this.partReference<PgslIfStatement>('IfStatement'))
            )
            .optional('else', this.graph()
                .single(PgslToken.KeywordElse)
                .single('block', this.partReference<PgslBlockStatementSyntaxTreeStructureData>('Statement-Block'))
            ),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('SwitchStatement', this.graph()
            .single(PgslToken.KeywordSwitch)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single(PgslToken.BlockStart)
            .loop('cases', this.graph()
                .single(PgslToken.KeywordCase)
                .single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
                .loop('additionals', this.graph()
                    .single(PgslToken.Comma)
                    .single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
                )
                .single('block', this.partReference<PgslBlockStatementSyntaxTreeStructureData>('Statement-Block'))
            )
            .optional('default', this.graph()
                .single(PgslToken.KeywordDefault)
                .single('block', this.partReference<PgslBlockStatementSyntaxTreeStructureData>('Statement-Block'))
            )
            .single(PgslToken.BlockEnd),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('ForStatement', this.graph()
            .single(PgslToken.KeywordFor)
            .single(PgslToken.ParenthesesStart)
            .branch('declaration', [
                this.partReference<unknown>('FunctionScopeVariableDeclaration'), // Includes semicolon
                PgslToken.Semicolon
            ])
            .optional('expression', this.partReference<PgslBlockStatementSyntaxTreeStructureData>('Expression'))
            .single(PgslToken.Semicolon)
            .single('statement', this.partReference<PgslExpressionSyntaxTreeStructureData>('Statement')) // TODO: Remove semicolon somehow.
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference<PgslBlockStatementSyntaxTreeStructureData>('Statement-Block')),
            (_pData) => {
                // TODO: Yes this needs to be parsed.

                // TODO: Statement must eighter be a functionCall | Assignment | IncrementDecrement
            }
        );

        this.defineGraphPart('WhileStatement', this.graph()
            .single(PgslToken.KeywordWhile)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<PgslBlockStatementSyntaxTreeStructureData>('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference<PgslBlockStatementSyntaxTreeStructureData>('Statement-Block')),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('DoWhileStatement', this.graph()
            .single(PgslToken.KeywordDo)
            .single('block', this.partReference<PgslBlockStatementSyntaxTreeStructureData>('Statement-Block'))
            .single(PgslToken.KeywordWhile)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single(PgslToken.Semicolon),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('BreakStatement', this.graph()
            .single(PgslToken.KeywordBreak)
            .single(PgslToken.Semicolon),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('ContinueStatement', this.graph()
            .single(PgslToken.KeywordContinue)
            .single(PgslToken.Semicolon),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('ReturnStatement', this.graph()
            .single(PgslToken.KeywordContinue)
            .optional('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
            .single(PgslToken.Semicolon),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('DiscardStatement', this.graph()
            .single(PgslToken.KeywordDiscard)
            .single(PgslToken.Semicolon),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('FunctionScopeVariableDeclaration', this.graph()
            .branch('declarationType', [
                PgslToken.KeywordDeclarationConst,
                PgslToken.KeywordDeclarationLet
            ])
            .single('variableName', PgslToken.Identifier).single(PgslToken.Colon)
            .single('type', this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition'))
            .branch([
                PgslToken.Semicolon,
                this.graph().single(PgslToken.Assignment).single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression')).single(PgslToken.Semicolon)
            ]),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('AssignmentStatement', this.graph()
            .single('variable', this.partReference<PgslVariableExpressionSyntaxTreeStructureData>('Expression-Variable'))
            .branch('assignment', [
                PgslToken.Assignment,
                PgslToken.AssignmentPlus,
                PgslToken.AssignmentMinus,
                PgslToken.AssignmentMultiply,
                PgslToken.AssignmentDivide,
                PgslToken.AssignmentModulo,
                PgslToken.AssignmentBinaryAnd,
                PgslToken.AssignmentBinaryOr,
                PgslToken.AssignmentBinaryXor,
                PgslToken.AssignmentShiftRight,
                PgslToken.AssignmentShiftLeft,
            ])
            .single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
            .single(PgslToken.Semicolon),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('IncrementDecrementStatement', this.graph()
            .single('variable', this.partReference<PgslVariableExpressionSyntaxTreeStructureData>('Expression-Variable'))
            .branch('', [
                PgslToken.OperatorIncrement,
                PgslToken.OperatorDecrement
            ]),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('FunctionCallStatement', this.graph()
            .single('name', PgslToken.Identifier)
            .optional('templateList', this.partReference<PgslTemplateListSyntaxTreeStructureData>('General-TemplateList'))
            .single(PgslToken.ParenthesesStart)
            .optional('parameter', this.graph()
                .single('first', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
                .loop('additional', this.graph()
                    .single(PgslToken.Comma).single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
                )
            )
            .single(PgslToken.ParenthesesEnd)
            .single(PgslToken.Semicolon),
            (pData): PgslFunctionCallStatement => {
                // Build parameter list of function.
                const lParameterList: Array<PgslExpressionSyntaxTreeStructureData> = new Array<PgslExpressionSyntaxTreeStructureData>();
                if (pData.parameter) {
                    // Add first expression.
                    lParameterList.push(pData.parameter.first);

                    // Add additional items.
                    for (const lItem of pData.parameter.additional) {
                        lParameterList.push(lItem.expression);
                    }
                }

                // Build function structure.
                const lFunctionStatement: PgslFunctionCallStatement = new PgslFunctionCallStatement();
                lFunctionStatement.name = pData.name;
                lFunctionStatement.parameter = lParameterList;
                lFunctionStatement.templateList = pData.templateList ?? null;

                return lFunctionStatement;
            }
        );

        this.defineGraphPart('Statement-Block', this.graph()
            .single(PgslToken.BlockStart)
            .loop('statements', this.partReference<PgslStatementSyntaxTreeStructureData>('Statement'))
            .single(PgslToken.BlockEnd),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslBlockStatementSyntaxTreeStructureData => {
                return {
                    meta: this.createMeta('Statement-Block', pStartToken, pEndToken),
                    data: {
                        statements: pData.statements
                    }
                };
            }
        );

        this.defineGraphPart('Statement', this.graph()
            .branch('statement', [
                this.partReference<any /* TODO: */>('IfStatement'),
                this.partReference<any /* TODO: */>('SwitchStatement'),
                this.partReference<any /* TODO: */>('ForStatement'),
                this.partReference<any /* TODO: */>('WhileStatement'),
                this.partReference<any /* TODO: */>('DoWhileStatement'),
                this.partReference<any /* TODO: */>('BreakStatement'),
                this.partReference<any /* TODO: */>('ContinueStatement'),
                this.partReference<any /* TODO: */>('ReturnStatement'),
                this.partReference<any /* TODO: */>('DiscardStatement'),
                this.partReference<any /* TODO: */>('FunctionScopeVariableDeclaration'),
                this.partReference<any /* TODO: */>('AssignmentStatement'),
                this.partReference<any /* TODO: */>('IncrementDecrementStatement'),
                this.partReference<PgslFunctionCallStatement>('FunctionCallStatement'),
                this.partReference<PgslBlockStatementSyntaxTreeStructureData>('Statement-Block')
            ]),
            (pData): PgslStatementSyntaxTreeStructureData => {
                return pData.statement;
            }
        );
    }

    /**
     * Define all graphs used inside module scope.
     */
    private defineModuleScope(): void {

        this.defineGraphPart('ModuleScopeVariableDeclaration', this.graph()
            .optional('attributes', this.partReference<PgslAttributeListSyntaxTreeStructureData>('General-AttributeList'))
            .branch('declarationType', [
                PgslToken.KeywordDeclarationStorage,
                PgslToken.KeywordDeclarationUniform,
                PgslToken.KeywordDeclarationWorkgroup,
                PgslToken.KeywordDeclarationPrivate,
                PgslToken.KeywordDeclarationConst,
                PgslToken.KeywordDeclarationParam
            ])
            .single('variableName', PgslToken.Identifier).single(PgslToken.Colon)
            .single('type', this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition'))
            .branch([
                PgslToken.Semicolon,
                this.graph().single(PgslToken.Assignment).single('expression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression')).single(PgslToken.Semicolon)
            ]),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('Declaration-Alias', this.graph()
            .single(PgslToken.KeywordAlias)
            .single('name', PgslToken.Identifier).single(PgslToken.Assignment)
            .single('type', this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition')).single(PgslToken.Semicolon),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslAliasDeclarationSyntaxTreeStructureData => {
                // Add alias name to parser buffer. Used for identifying type definitions over alias declarations.
                this.mParserBuffer.aliasDeclarations.add(pData.name);

                // Create structure.
                return {
                    meta: this.createMeta('Declaration-Alias', pStartToken, pEndToken),
                    data: {
                        name: pData.name,
                        type: pData.type
                    }
                };
            }
        );

        this.defineGraphPart('Declaration-Enum', this.graph()
            .single(PgslToken.KeywordEnum)
            .single('name', PgslToken.Identifier)
            .single(PgslToken.BlockStart)
            .optional('values', this.graph()
                .single('name', PgslToken.Identifier)
                .single(PgslToken.Assignment)
                .branch('value', [
                    this.partReference<PgslLiteralValueExpressionSyntaxTreeStructureData>('Expression-LiteralValue')
                ])
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .single('name', PgslToken.Identifier)
                    .single(PgslToken.Assignment)
                    .branch('value', [
                        this.partReference<PgslLiteralValueExpressionSyntaxTreeStructureData>('Expression-LiteralValue')
                    ])
                )
            )
            .single(PgslToken.BlockEnd),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslEnumDeclarationSyntaxTreeStructureData => {
                // Add enum name to buffer.
                this.mParserBuffer.enumDeclaration.add(pData.name);

                // Build struct data structure.
                const lData: PgslEnumDeclarationSyntaxTreeStructureData = {
                    meta: this.createMeta('Declaration-Enum', pStartToken, pEndToken),
                    data: {
                        name: pData.name,
                        items: new Array<{ name: string, value?: string | number; }>()
                    }
                };

                // Only add values when they exist.
                if (pData.values) {
                    lData.data.items.push({
                        name: pData.values.name,
                        value: parseInt(pData.values.value.data.textValue)
                    });

                    // Add each value to data structure.
                    for (const lItem of pData.values.additional) {
                        lData.data.items.push({
                            name: lItem.name, value: parseInt(lItem.value.data.textValue)
                        });
                    }
                }

                return lData;
            }
        );

        this.defineGraphPart('StructDeclaration', this.graph()
            .single(PgslToken.KeywordStruct)
            .single('name', PgslToken.Identifier)
            .single(PgslToken.BlockStart)
            .optional('values', this.graph()
                .optional('attributes', this.partReference<PgslAttributeListSyntaxTreeStructureData>('General-AttributeList'))
                .single('name', PgslToken.Identifier)
                .single(PgslToken.Colon)
                .branch('value', [
                    this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition')
                ])
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .optional('attributes', this.partReference<PgslAttributeListSyntaxTreeStructureData>('General-AttributeList'))
                    .single('name', PgslToken.Identifier)
                    .single(PgslToken.Assignment)
                    .branch('value', [
                        this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition')
                    ])
                )
            )
            .single(PgslToken.BlockEnd),
            (pData) => {
                // Add struct name to struct buffer.
                this.mParserBuffer.structDeclaration.add(pData.name);

                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('FunctionDeclaration', this.graph()
            .optional('attributes', this.partReference<PgslAttributeListSyntaxTreeStructureData>('General-AttributeList'))
            .single(PgslToken.KeywordFunction)
            .single('name', PgslToken.Identifier)
            .single(PgslToken.ParenthesesStart)
            .optional('parameter', this.graph()
                .single('first', this.graph()
                    .single('name', PgslToken.Identifier)
                    .single('type', this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition'))
                )
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .single('name', PgslToken.Identifier)
                    .single('type', this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition'))
                )
            )
            .single(PgslToken.ParenthesesEnd)
            .single(PgslToken.Colon)
            .single('returnType', this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition'))
            .single('block', this.partReference<PgslBlockStatementSyntaxTreeStructureData>('Statement-Block')),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );
    }

    /**
     * Define root graph.
     */
    private defineRoot(): void {

        this.defineGraphPart('Module', this.graph()
            .loop('list', this.graph()
                .branch('content', [
                    this.partReference<PgslAliasDeclarationSyntaxTreeStructureData>('Declaration-Alias'),
                    this.partReference('ModuleScopeVariableDeclaration'),
                    this.partReference<PgslEnumDeclarationSyntaxTreeStructureData>('Declaration-Enum'),
                    this.partReference('StructDeclaration'),
                    this.partReference('FunctionDeclaration')
                ])
            ),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslModuleSyntaxTreeStructureData => {
                const lData: PgslModuleSyntaxTreeStructureData['data'] = {
                    alias: new Array<PgslAliasDeclarationSyntaxTreeStructureData>(),
                    enum: new Array<PgslEnumDeclarationSyntaxTreeStructureData>()
                };

                // Loop data.
                for (const lContent of pData.list) {
                    // Set data to correct buckets.
                    switch (lContent.content.meta.type) {
                        case 'Declaration-Alias': {
                            lData.alias.push(lContent);
                            break;
                        }
                        case 'Declaration-Enum': {
                            lData.enum.push(lContent);
                            break;
                        }
                    }

                    // TODO: switch case with all things.
                }

                return {
                    meta: this.createMeta('Module', pStartToken, pEndToken),
                    data: lData
                };
            }
        );

        // Define root part.
        this.setRootGraphPart('Module');
    }

    /**
     * Define variable expressions used for assigning or reading values.
     */
    private defineVariableExpression(): void {
        this.defineGraphPart('Expression-VariableName', this.graph()
            .single('name', PgslToken.Identifier),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslVariableNameExpressionSyntaxTreeStructureData => {
                return {
                    meta: this.createMeta('Expression-VariableName', pStartToken, pEndToken),
                    data: {
                        name: pData.name
                    }
                };
            }
        );

        this.defineGraphPart('Expression-IndexedValue', this.graph()
            .single('value', this.partReference<PgslVariableExpressionSyntaxTreeStructureData>('Expression-Variable'))
            .single(PgslToken.ListStart)
            .single('indexExpression', this.partReference<PgslExpressionSyntaxTreeStructureData>('Expression'))
            .single(PgslToken.ListEnd),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslIndexedValueExpressionSyntaxTreeStructureData => {
                return {
                    meta: this.createMeta('Expression-IndexedValue', pStartToken, pEndToken),
                    data: {
                        value: pData.value,
                        index: pData.indexExpression
                    }
                };
            }
        );

        this.defineGraphPart('Expression-ValueDecomposition', this.graph()
            .single('leftExpression', this.partReference<PgslVariableExpressionSyntaxTreeStructureData>('Expression-Variable'))
            .single(PgslToken.MemberDelimiter)
            .single('propertyName', PgslToken.Identifier),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslEnumValueExpressionSyntaxTreeStructureData | PgslValueDecompositionExpressionSyntaxTreeStructureData => {
                // When left expression is a single name, it can be a enum value.
                if (pData.leftExpression.meta.type === 'Expression-VariableName') {
                    // Check variable name with the currently existing declared enums. 
                    const lVariableName: string = (<PgslVariableNameExpressionSyntaxTreeStructureData>pData.leftExpression).data.name;
                    if (this.mParserBuffer.enumDeclaration.has(lVariableName)) {
                        // Return enum value structure data instead.
                        return {
                            meta: this.createMeta('Expression-EnumValue', pStartToken, pEndToken),
                            data: {
                                name: lVariableName,
                                property: pData.propertyName
                            }
                        };
                    }
                }

                // When not a enum than it can only be a decomposition.
                return {
                    meta: this.createMeta('Expression-ValueDecomposition', pStartToken, pEndToken),
                    data: {
                        value: pData.leftExpression,
                        property: pData.propertyName
                    }
                };
            }
        );

        this.defineGraphPart('Expression-Variable', this.graph()
            .branch('expression', [
                this.partReference<PgslVariableNameExpressionSyntaxTreeStructureData>('Expression-VariableName'),
                this.partReference<PgslIndexedValueExpressionSyntaxTreeStructureData>('Expression-IndexedValue'),
                this.partReference<PgslValueDecompositionExpressionSyntaxTreeStructureData | PgslEnumValueExpressionSyntaxTreeStructureData>('Expression-ValueDecomposition')
            ]),
            (pData): PgslVariableExpressionSyntaxTreeStructureData => {
                return pData.expression;
            }
        );
    }
}

type ParserBuffer = {
    aliasDeclarations: Set<string>;
    enumDeclaration: Set<string>;
    structDeclaration: Set<string>;
};