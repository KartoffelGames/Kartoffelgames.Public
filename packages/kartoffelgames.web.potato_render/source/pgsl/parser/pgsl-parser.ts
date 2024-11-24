import { EnumUtil, Exception } from '@kartoffelgames/core';
import { CodeParser, LexerToken } from '@kartoffelgames/core.parser';
import { BasePgslSyntaxTreeMeta } from '../syntax_tree/base-pgsl-syntax-tree';
import { PgslAliasDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-alias-declaration-syntax-tree';
import { PgslEnumDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-enum-declaration-syntax-tree';
import { PgslFunctionDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-function-declaration-syntax-tree';
import { PgslStructDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-struct-declaration-syntax-tree';
import { PgslStructPropertyDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-struct-property-declaration-syntax-tree';
import { PgslVariableDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-variable-declaration-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../syntax_tree/expression/base-pgsl-expression-syntax-tree';
import { PgslArithmeticExpressionSyntaxTree } from '../syntax_tree/expression/operation/pgsl-arithmetic-expression-syntax-tree';
import { PgslBinaryExpressionSyntaxTree } from '../syntax_tree/expression/operation/pgsl-bit-expression-syntax-tree';
import { PgslComparisonExpressionSyntaxTree } from '../syntax_tree/expression/operation/pgsl-comparison-expression-syntax-tree';
import { PgslLogicalExpressionSyntaxTree } from '../syntax_tree/expression/operation/pgsl-logical-expression-syntax-tree';
import { PgslAddressOfExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-address-of-expression-syntax-tree';
import { PgslEnumValueExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-enum-value-expression-syntax-tree';
import { PgslFunctionCallExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-function-call-expression-syntax-tree';
import { PgslLiteralValueExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-literal-value-expression-syntax-tree';
import { PgslNewCallExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-new-expression-syntax-tree';
import { PgslParenthesizedExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-parenthesized-expression-syntax-tree';
import { PgslStringValueExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-string-value-expression-syntax-tree';
import { PgslIndexedValueExpressionSyntaxTree } from '../syntax_tree/expression/storage/pgsl-indexed-value-expression-syntax-tree';
import { PgslPointerExpressionSyntaxTree } from '../syntax_tree/expression/storage/pgsl-pointer-expression-syntax-tree';
import { PgslValueDecompositionExpressionSyntaxTree } from '../syntax_tree/expression/storage/pgsl-value-decomposition-expression-syntax-tree';
import { PgslVariableNameExpressionSyntaxTree } from '../syntax_tree/expression/storage/pgsl-variable-name-expression-syntax-tree';
import { PgslUnaryExpressionSyntaxTree } from '../syntax_tree/expression/unary/pgsl-unary-expression-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../syntax_tree/general/pgsl-attribute-list-syntax-tree';
import { PgslModuleSyntaxTree } from '../syntax_tree/pgsl-module-syntax-tree';
import { BasePgslStatementSyntaxTree } from '../syntax_tree/statement/base-pgsl-statement-syntax-tree';
import { PgslDoWhileStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-do-while-statement-syntax-tree';
import { PgslForStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-for-statement-syntax-tree';
import { PgslIfStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-if-statement-syntax-tree';
import { PgslSwitchStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-switch-statement-syntax-tree';
import { PgslWhileStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-while-statement-syntax-tree';
import { PgslAssignmentStatementSyntaxTree } from '../syntax_tree/statement/pgsl-assignment-statement-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../syntax_tree/statement/pgsl-block-statement-syntax-tree';
import { PgslFunctionCallStatementSyntaxTree } from '../syntax_tree/statement/pgsl-function-call-statement-syntax-tree';
import { PgslIncrementDecrementStatementSyntaxTree } from '../syntax_tree/statement/pgsl-increment-decrement-statement-syntax-tree';
import { PgslReturnStatementSyntaxTree } from '../syntax_tree/statement/pgsl-return-statement-syntax-tree';
import { PgslVariableDeclarationStatementSyntaxTree } from '../syntax_tree/statement/pgsl-variable-declaration-statement-syntax-tree';
import { PgslBreakStatementSyntaxTree } from '../syntax_tree/statement/single/pgsl-break-statement-syntax-tree';
import { PgslContinueStatementSyntaxTree } from '../syntax_tree/statement/single/pgsl-continue-statement-syntax-tree';
import { PgslDiscardStatementSyntaxTree } from '../syntax_tree/statement/single/pgsl-discard-statement-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../syntax_tree/type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslBaseTypeName } from '../syntax_tree/type/enum/pgsl-base-type-name.enum';
import { PgslBuildInTypeName } from '../syntax_tree/type/enum/pgsl-build-in-type-name.enum';
import { PgslMatrixTypeName } from '../syntax_tree/type/enum/pgsl-matrix-type-name.enum';
import { PgslNumericTypeName } from '../syntax_tree/type/enum/pgsl-numeric-type-name.enum';
import { PgslSamplerTypeName } from '../syntax_tree/type/enum/pgsl-sampler-build-name.enum';
import { PgslTextureTypeName } from '../syntax_tree/type/enum/pgsl-texture-type-name.enum';
import { PgslVectorTypeName } from '../syntax_tree/type/enum/pgsl-vector-type-name.enum';
import { PgslTypeDeclarationSyntaxTreeFactory } from '../syntax_tree/type/pgsl-type-definition-syntax-tree-factory';
import { PgslLexer } from './pgsl-lexer';
import { PgslToken } from './pgsl-token.enum';

export class PgslParser extends CodeParser<PgslToken, PgslModuleSyntaxTree> {
    private mTypeFactory: PgslTypeDeclarationSyntaxTreeFactory;

    /**
     * Constructor.
     */
    public constructor() {
        super(new PgslLexer());

        // Setup buffer.
        this.mTypeFactory = new PgslTypeDeclarationSyntaxTreeFactory();

        // Define helper graphs.
        this.defineCore();
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

        // TODO: On second layer only not the parser.
        // Insert imports. #IMPORT
        // Fill in buffers with imported declarations.
        // Setup #IFDEF. Fill Replaced '#IFDEFs, #ENDIFDEF with same amount of spaces and newlines.
        // Remove any other # statements as they do nothing. Replace with same amount of spaces and newlines.

        // TODO: How to generate a sourcemap. https://sourcemaps.info/spec.html

        // TODO: Replace comments with same amount of spaces ans newlines.

        // Parse document structure.
        const lDocument: PgslModuleSyntaxTree = super.parse(pCodeText);

        // Validate document.
        lDocument.setup();
        lDocument.validateIntegrity();

        // Clear old parsing buffers.
        this.mTypeFactory = new PgslTypeDeclarationSyntaxTreeFactory();

        return lDocument;
    }

    /**
     * Create start and end token information parameter for syntax tree creations.
     * 
     * @param pStartToken - Parsed structure start token.
     * @param pEndToken - Parsed structure end token.
     * 
     * @returns parameter of start and end token as a four number tuple.
     */
    private createTokenBoundParameter(pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): BasePgslSyntaxTreeMeta {
        // No token.
        if (!pStartToken && !pEndToken) {
            return {
                range: [0, 0, 0, 0]
            };
        }

        // Catch some alien behaviour.
        if (!pStartToken) {
            throw new Exception('Something wrong happened. Start token musst be present when endtoken exists.', this);
        }

        // Only starting token.
        if (!pEndToken) {
            return {
                range: [
                    pStartToken.lineNumber,
                    pStartToken.columnNumber,
                    pStartToken.lineNumber,
                    pStartToken.columnNumber
                ]
            };
        }

        // Solid start and end token.
        return {
            range: [
                pStartToken.lineNumber,
                pStartToken.columnNumber,
                pEndToken.lineNumber,
                pEndToken.columnNumber
            ]
        };
    }

    /**
     * Define core graphs used by different scopes.
     */
    private defineCore(): void {

        this.defineGraphPart('General-AttributeList', this.graph()
            .loop('list', this.graph()
                .single(PgslToken.ListStart)
                .single('name', PgslToken.Identifier)
                .single(PgslToken.ParenthesesStart)
                .optional('parameter', this.graph()
                    .single('first', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
                    .loop('additional', this.graph()
                        .single(PgslToken.Comma).single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
                    )
                )
                .single(PgslToken.ParenthesesEnd)
                .single(PgslToken.ListEnd)
            ),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAttributeListSyntaxTree => {
                // Create attribute list.
                const lAttributeList: ConstructorParameters<typeof PgslAttributeListSyntaxTree>[0] = new Array<{ name: string; parameter: Array<BasePgslExpressionSyntaxTree>; }>();

                // Add each attribute to list.
                for (const lAttribute of pData.list) {
                    // Build parameter list of attribute.
                    const lParameterList: Array<BasePgslExpressionSyntaxTree> = new Array<BasePgslExpressionSyntaxTree>();
                    if (lAttribute.parameter) {
                        // Add attribute parameter to parameter list.
                        lParameterList.push(lAttribute.parameter.first, ...lAttribute.parameter.additional.map((pParameter) => { return pParameter.expression; }));
                    }

                    // Add each attribute with parameters.
                    lAttributeList.push({
                        name: lAttribute.name,
                        parameter: lParameterList
                    });
                }

                // Create attribute list syntax tree.
                return new PgslAttributeListSyntaxTree(lAttributeList, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('General-TypeDeclaration', this.graph()
            .optional('pointer', PgslToken.OperatorMultiply)
            .single('name', PgslToken.Identifier)
            .optional('templateList', this.graph()
                .single(PgslToken.TemplateListStart)
                .branch('first', [
                    this.partReference<BasePgslExpressionSyntaxTree>('Expression'),
                    this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration-ForcedTemplate')
                ])
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .branch('value', [
                        this.partReference<BasePgslExpressionSyntaxTree>('Expression'),
                        this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration-ForcedTemplate')
                    ])
                )
                .single(PgslToken.TemplateListEnd)
            ),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): BasePgslTypeDefinitionSyntaxTree => {
                // Define root structure of type definition syntax tree structure data and apply type name.
                const lTemplateList: Array<BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree> = new Array<BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree>();

                // Append optional template list.
                if (pData.templateList) {
                    // Build Parameter list
                    lTemplateList.push(pData.templateList.first);
                    lTemplateList.push(...pData.templateList.additional.map((pParameter) => { return pParameter.value; }));

                    // Sometimes a variable name expression is a type definition :(
                    // So we need to filter it.
                    for (let lIndex: number = 0; lIndex < lTemplateList.length; lIndex++) {
                        const lParameter: BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree = lTemplateList[lIndex];
                        if (lParameter instanceof PgslVariableNameExpressionSyntaxTree) {
                            // Replace variable name expression with type expression.
                            if (this.nameIsType(lParameter.name)) {
                                // Replace variable name with a type definition of the same name.
                                lTemplateList[lIndex] = this.mTypeFactory.generate(lParameter.name, false, [], {
                                    range: [
                                        lParameter.meta.position.start.line,
                                        lParameter.meta.position.start.column,
                                        lParameter.meta.position.end.line,
                                        lParameter.meta.position.end.column,
                                    ]
                                });
                            }
                        }
                    }
                }

                // Create type definition syntax tree.
                return this.mTypeFactory.generate(pData.name, !!pData.pointer, lTemplateList, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('General-TypeDeclaration-ForcedTemplate', this.graph()
            .optional('pointer', PgslToken.OperatorMultiply)
            .single('name', PgslToken.Identifier)
            .single('templateList', this.graph()
                .single(PgslToken.TemplateListStart)
                .branch('first', [
                    this.partReference<BasePgslExpressionSyntaxTree>('Expression'),
                    this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration-ForcedTemplate')
                ])
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .branch('value', [
                        this.partReference<BasePgslExpressionSyntaxTree>('Expression'),
                        this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration-ForcedTemplate')
                    ])
                )
                .single(PgslToken.TemplateListEnd)
            ),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): BasePgslTypeDefinitionSyntaxTree => {
                // Build Parameter list
                const lParameterList: Array<BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree> = [pData.templateList.first, ...pData.templateList.additional.map((pParameter) => { return pParameter.value; })];

                // Sometimes a variable name expression is a type definition :(
                // So we need to filter it.
                for (let lIndex: number = 0; lIndex < lParameterList.length; lIndex++) {
                    const lParameter: BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree = lParameterList[lIndex];
                    if (lParameter instanceof PgslVariableNameExpressionSyntaxTree) {
                        // Replace variable name expression with type expression.
                        if (this.nameIsType(lParameter.name)) {
                            // Replace variable name with a type definition of the same name.
                            lParameterList[lIndex] = this.mTypeFactory.generate(lParameter.name, false, [], {
                                range: [
                                    lParameter.meta.position.start.line,
                                    lParameter.meta.position.start.column,
                                    lParameter.meta.position.end.line,
                                    lParameter.meta.position.end.column,
                                ]
                            });
                        }
                    }
                }

                // Create type definition syntax tree.
                return this.mTypeFactory.generate(pData.name, !!pData.pointer, lParameterList, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );
    }

    /**
     * Define graphs only for resolving expressions.
     */
    private defineExpression(): void {

        this.defineGraphPart('Expression-Logical', this.graph()
            .single('leftExpression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .branch('operation', [
                PgslToken.OperatorShortCircuitOr,
                PgslToken.OperatorShortCircuitAnd
            ])
            .single('rightExpression', this.partReference<BasePgslExpressionSyntaxTree>('Expression')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslLogicalExpressionSyntaxTree => {
                return new PgslLogicalExpressionSyntaxTree(pData.leftExpression, pData.operation, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-Arithmetic', this.graph()
            .single('leftExpression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .branch('operation', [
                PgslToken.OperatorPlus,
                PgslToken.OperatorMinus,
                PgslToken.OperatorMultiply,
                PgslToken.OperatorDivide,
                PgslToken.OperatorModulo
            ])
            .single('rightExpression', this.partReference<BasePgslExpressionSyntaxTree>('Expression')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslArithmeticExpressionSyntaxTree => {
                return new PgslArithmeticExpressionSyntaxTree(pData.leftExpression, pData.operation, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-Comparison', this.graph()
            .single('leftExpression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .branch('comparison', [
                PgslToken.OperatorEqual,
                PgslToken.OperatorNotEqual,
                PgslToken.OperatorLowerThan,
                PgslToken.OperatorLowerThanEqual,
                PgslToken.OperatorGreaterThan,
                PgslToken.OperatorGreaterThanEqual
            ])
            .single('rightExpression', this.partReference<BasePgslExpressionSyntaxTree>('Expression')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslComparisonExpressionSyntaxTree => {
                return new PgslComparisonExpressionSyntaxTree(pData.leftExpression, pData.comparison, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-BitOperation', this.graph()
            .single('leftExpression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .branch('operation', [
                PgslToken.OperatorBinaryOr,
                PgslToken.OperatorBinaryAnd,
                PgslToken.OperatorBinaryXor,
                PgslToken.OperatorShiftLeft,
                PgslToken.OperatorShiftRight
            ])
            .single('rightExpression', this.partReference<BasePgslExpressionSyntaxTree>('Expression')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslBinaryExpressionSyntaxTree => {
                return new PgslBinaryExpressionSyntaxTree(pData.leftExpression, pData.operation, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-Unary', this.graph()
            .branch('prefix', [
                PgslToken.OperatorBinaryNegate,
                PgslToken.OperatorMinus,
                PgslToken.OperatorNot
            ])
            .single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslUnaryExpressionSyntaxTree => {
                return new PgslUnaryExpressionSyntaxTree(pData.expression, pData.prefix, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-VariableName', this.graph()
            .single('name', PgslToken.Identifier),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslVariableNameExpressionSyntaxTree => {
                return new PgslVariableNameExpressionSyntaxTree(pData.name, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-IndexedValue', this.graph()
            .single('value', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .single(PgslToken.ListStart)
            .single('indexExpression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .single(PgslToken.ListEnd),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslIndexedValueExpressionSyntaxTree => {
                return new PgslIndexedValueExpressionSyntaxTree(pData.value, pData.indexExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-ValueDecomposition', this.graph()
            .single('leftExpression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .single(PgslToken.MemberDelimiter)
            .single('propertyName', PgslToken.Identifier),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslEnumValueExpressionSyntaxTree | PgslValueDecompositionExpressionSyntaxTree => {
                // When left expression is a single name, it can be a enum value.
                if (pData.leftExpression instanceof PgslVariableNameExpressionSyntaxTree) {
                    // Check variable name with the currently existing declared enums. 
                    const lVariableName: string = pData.leftExpression.name;
                    if (this.mTypeFactory.enumNames.has(lVariableName)) {
                        // Return enum value structure data instead.
                        return new PgslEnumValueExpressionSyntaxTree(lVariableName, pData.propertyName, this.createTokenBoundParameter(pStartToken, pEndToken));
                    }
                }

                // When not a enum than it can only be a decomposition.
                return new PgslValueDecompositionExpressionSyntaxTree(pData.leftExpression, pData.propertyName, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-FunctionCall', this.graph()
            .single('name', PgslToken.Identifier)
            .single(PgslToken.ParenthesesStart)
            .optional('parameter', this.graph()
                .single('first', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
                .loop('additional', this.graph()
                    .single(PgslToken.Comma).single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
                )
            )
            .single(PgslToken.ParenthesesEnd),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslFunctionCallExpressionSyntaxTree => {
                // Build parameter list of function.
                const lParameterList: Array<BasePgslExpressionSyntaxTree> = new Array<BasePgslExpressionSyntaxTree>();
                if (pData.parameter) {
                    // Add parameter expressions.
                    lParameterList.push(
                        // Add first expression.
                        pData.parameter.first,
                        // Add optional appending expressions.
                        ...(pData.parameter ?? []).additional.map((pAdditional) => { return pAdditional.expression; })
                    );
                }

                // Create function call expression syntax tree.
                return new PgslFunctionCallExpressionSyntaxTree(pData.name, lParameterList, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-Parenthesized', this.graph()
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .single(PgslToken.ParenthesesEnd),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslParenthesizedExpressionSyntaxTree => {
                return new PgslParenthesizedExpressionSyntaxTree(pData.expression, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-LiteralValue', this.graph()
            .branch('value', [
                PgslToken.LiteralFloat,
                PgslToken.LiteralInteger,
                PgslToken.LiteralBoolean
            ]),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslLiteralValueExpressionSyntaxTree => {
                return new PgslLiteralValueExpressionSyntaxTree(pData.value, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-StringValue', this.graph()
            .single('string', PgslToken.LiteralString),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslStringValueExpressionSyntaxTree => {
                return new PgslStringValueExpressionSyntaxTree(pData.string, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-AddressOf', this.graph()
            .single(PgslToken.OperatorBinaryAnd)
            .single('variable', this.partReference<BasePgslExpressionSyntaxTree>('Expression')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAddressOfExpressionSyntaxTree => {
                return new PgslAddressOfExpressionSyntaxTree(pData.variable, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-Pointer', this.graph()
            .single(PgslToken.OperatorMultiply)
            .single('variable', this.partReference<BasePgslExpressionSyntaxTree>('Expression')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslPointerExpressionSyntaxTree => {
                return new PgslPointerExpressionSyntaxTree(pData.variable, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression-New', this.graph()
            .single(PgslToken.KeywordNew)
            .single('type', this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration'))
            .single(PgslToken.ParenthesesStart)
            .optional('parameter', this.graph()
                .single('first', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
                .loop('additional', this.graph()
                    .single(PgslToken.Comma).single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
                )
            )
            .single(PgslToken.ParenthesesEnd),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslNewCallExpressionSyntaxTree => {
                // Build parameter list of function.
                const lParameterList: Array<BasePgslExpressionSyntaxTree> = new Array<BasePgslExpressionSyntaxTree>();
                if (pData.parameter) {
                    // Add parameter expressions.
                    lParameterList.push(
                        // Add first expression.
                        pData.parameter.first,
                        // Add optional appending expressions.
                        ...(pData.parameter ?? []).additional.map((pAdditional) => { return pAdditional.expression; })
                    );
                }

                // Create function call expression syntax tree.
                return new PgslNewCallExpressionSyntaxTree(pData.type, lParameterList, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Expression', this.graph()
            .branch('expression', [
                this.partReference<PgslLiteralValueExpressionSyntaxTree>('Expression-LiteralValue'),
                this.partReference<PgslParenthesizedExpressionSyntaxTree>('Expression-Parenthesized'),
                this.partReference<PgslFunctionCallExpressionSyntaxTree>('Expression-FunctionCall'),
                this.partReference<PgslVariableNameExpressionSyntaxTree>('Expression-VariableName'),
                this.partReference<PgslIndexedValueExpressionSyntaxTree>('Expression-IndexedValue'),
                this.partReference<PgslStringValueExpressionSyntaxTree>('Expression-StringValue'),
                this.partReference<PgslAddressOfExpressionSyntaxTree>('Expression-AddressOf'),
                this.partReference<PgslValueDecompositionExpressionSyntaxTree | PgslEnumValueExpressionSyntaxTree>('Expression-ValueDecomposition'),
                this.partReference<PgslPointerExpressionSyntaxTree>('Expression-Pointer'),
                this.partReference<PgslNewCallExpressionSyntaxTree>('Expression-New'),
                this.partReference<PgslUnaryExpressionSyntaxTree>('Expression-Unary'),
                this.partReference<PgslBinaryExpressionSyntaxTree>('Expression-BitOperation'),
                this.partReference<PgslComparisonExpressionSyntaxTree>('Expression-Comparison'),
                this.partReference<PgslArithmeticExpressionSyntaxTree>('Expression-Arithmetic'),
                this.partReference<PgslLogicalExpressionSyntaxTree>('Expression-Logical')
            ]),
            (pData): BasePgslExpressionSyntaxTree => {
                return pData.expression;
            }
        );
    }

    /**
     * Define all statements and flows used inside function scope.
     */
    private defineFunctionScope(): void {

        this.defineGraphPart('Statement-If', this.graph()
            .single(PgslToken.KeywordIf)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference<PgslBlockStatementSyntaxTree>('Statement-Block'))
            .optional('else', this.graph()
                .single(PgslToken.KeywordElse)
                .branch('block', [
                    this.partReference<PgslBlockStatementSyntaxTree>('Statement-Block'),
                    this.partReference<PgslIfStatementSyntaxTree>('Statement-If')
                ])
            ),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslIfStatementSyntaxTree => {
                // Create data.
                const lData: ConstructorParameters<typeof PgslIfStatementSyntaxTree>[0] = {
                    expression: pData.expression,
                    block: pData.block,
                    else: null
                };

                // Optional else block.
                if (pData.else) {
                    lData.else = pData.else.block;
                }

                // Create if statement syntax tree.
                return new PgslIfStatementSyntaxTree(lData, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-Switch', this.graph()
            .single(PgslToken.KeywordSwitch)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single(PgslToken.BlockStart)
            .loop('cases', this.graph()
                .single(PgslToken.KeywordCase)
                .single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
                .loop('additionals', this.graph()
                    .single(PgslToken.Comma)
                    .single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
                )
                .single('block', this.partReference<PgslBlockStatementSyntaxTree>('Statement-Block'))
            )
            .optional('default', this.graph()
                .single(PgslToken.KeywordDefault)
                .single('block', this.partReference<PgslBlockStatementSyntaxTree>('Statement-Block'))
            )
            .single(PgslToken.BlockEnd),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslSwitchStatementSyntaxTree => {
                // Build switch data structure.
                const lData: ConstructorParameters<typeof PgslSwitchStatementSyntaxTree>[0] = {
                    expression: pData.expression,
                    cases: new Array<ConstructorParameters<typeof PgslSwitchStatementSyntaxTree>[0]['cases'][number]>(),
                    default: null
                };

                // Add each case.
                for (const lCase of pData.cases) {
                    lData.cases.push({
                        block: lCase.block,
                        cases: [lCase.expression, ...lCase.additionals.map((pCase) => { return pCase.expression; })]
                    });
                }

                // Add optional default case.
                if (pData.default) {
                    lData.default = pData.default.block;
                }

                return new PgslSwitchStatementSyntaxTree(lData, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-For', this.graph()
            .single(PgslToken.KeywordFor)
            .single(PgslToken.ParenthesesStart)
            .optional('init', this.partReference<PgslVariableDeclarationStatementSyntaxTree>('Statement-VariableDeclaration'))
            .single(PgslToken.Semicolon)
            .optional('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .single(PgslToken.Semicolon)
            .optionalBranch('update', [
                this.partReference<PgslAssignmentStatementSyntaxTree>('Statement-Assignment'),
                this.partReference<PgslIncrementDecrementStatementSyntaxTree>('Statement-IncrementDecrement'),
                this.partReference<PgslFunctionCallStatementSyntaxTree>('Statement-FunctionCall')
            ])
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference<PgslBlockStatementSyntaxTree>('Statement-Block')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslForStatementSyntaxTree => {
                // Build switch data structure.
                const lData: ConstructorParameters<typeof PgslForStatementSyntaxTree>[0] = {
                    block: pData.block,
                    init: null,
                    expression: null,
                    update: null
                };

                // Optional initial declaration.
                if (pData.init) {
                    lData.init = pData.init;
                }

                // Optional expression.
                if (pData.expression) {
                    lData.expression = pData.expression;
                }

                // Optional expression.
                if (pData.update) {
                    lData.update = pData.update;
                }

                return new PgslForStatementSyntaxTree(lData, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-While', this.graph()
            .single(PgslToken.KeywordWhile)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference<PgslBlockStatementSyntaxTree>('Statement-Block')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslWhileStatementSyntaxTree => {
                return new PgslWhileStatementSyntaxTree(pData.expression, pData.block, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-DoWhile', this.graph()
            .single(PgslToken.KeywordDo)
            .single('block', this.partReference<PgslBlockStatementSyntaxTree>('Statement-Block'))
            .single(PgslToken.KeywordWhile)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .single(PgslToken.ParenthesesEnd),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslDoWhileStatementSyntaxTree => {
                return new PgslDoWhileStatementSyntaxTree(pData.expression, pData.block, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-Break', this.graph()
            .single(PgslToken.KeywordBreak),
            (_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslBreakStatementSyntaxTree => {
                return new PgslBreakStatementSyntaxTree(this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-Continue', this.graph()
            .single(PgslToken.KeywordContinue),
            (_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslContinueStatementSyntaxTree => {
                return new PgslContinueStatementSyntaxTree(this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-Return', this.graph()
            .single(PgslToken.KeywordContinue)
            .optional('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslReturnStatementSyntaxTree => {
                return new PgslReturnStatementSyntaxTree(pData.expression ?? null, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-Discard', this.graph()
            .single(PgslToken.KeywordDiscard),
            (_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslDiscardStatementSyntaxTree => {
                return new PgslDiscardStatementSyntaxTree(this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-VariableDeclaration', this.graph()
            .branch('declarationType', [
                PgslToken.KeywordDeclarationConst,
                PgslToken.KeywordDeclarationLet
            ])
            .single('variableName', PgslToken.Identifier).single(PgslToken.Colon)
            .single('type', this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration'))
            .optional('initial',
                this.graph().single(PgslToken.Assignment).single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            ),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslVariableDeclarationStatementSyntaxTree => {
                // Build enum data structure.
                const lData: ConstructorParameters<typeof PgslVariableDeclarationStatementSyntaxTree>[0] = {
                    declarationType: pData.declarationType,
                    name: pData.variableName,
                    type: pData.type,
                    expression: null
                };

                // Set inial value expression.
                if (pData.initial) {
                    lData.expression = pData.initial.expression;
                }

                return new PgslVariableDeclarationStatementSyntaxTree(lData, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-Assignment', this.graph()
            .single('variable', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
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
            .single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAssignmentStatementSyntaxTree => {
                return new PgslAssignmentStatementSyntaxTree({
                    expression: pData.expression,
                    assignment: pData.assignment,
                    variable: pData.variable
                }, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-IncrementDecrement', this.graph()
            .single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
            .branch('operator', [
                PgslToken.OperatorIncrement,
                PgslToken.OperatorDecrement
            ]),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslIncrementDecrementStatementSyntaxTree => {
                return new PgslIncrementDecrementStatementSyntaxTree(pData.operator, pData.expression, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-FunctionCall', this.graph()
            .single('name', PgslToken.Identifier)
            .single(PgslToken.ParenthesesStart)
            .optional('parameter', this.graph()
                .single('first', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
                .loop('additional', this.graph()
                    .single(PgslToken.Comma).single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression'))
                )
            )
            .single(PgslToken.ParenthesesEnd),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslFunctionCallStatementSyntaxTree => {
                // Build parameter list of function.
                const lParameterList: Array<BasePgslExpressionSyntaxTree> = new Array<BasePgslExpressionSyntaxTree>();
                if (pData.parameter) {
                    // Add parameter expressions.
                    lParameterList.push(
                        // Add first expression.
                        pData.parameter.first,
                        // Add optional appending expressions.
                        ...(pData.parameter ?? []).additional.map((pAdditional) => { return pAdditional.expression; })
                    );
                }

                // Create function call expression syntax tree.
                return new PgslFunctionCallStatementSyntaxTree(pData.name, lParameterList, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement-Block', this.graph()
            .single(PgslToken.BlockStart)
            .loop('statements', this.partReference<BasePgslStatementSyntaxTree>('Statement'))
            .single(PgslToken.BlockEnd),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslBlockStatementSyntaxTree => {
                return new PgslBlockStatementSyntaxTree(pData.statements, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Statement', this.graph()
            .branch('item', [
                this.graph().single('statement', this.partReference<PgslIfStatementSyntaxTree>('Statement-If')),
                this.graph().single('statement', this.partReference<PgslSwitchStatementSyntaxTree>('Statement-Switch')),
                this.graph().single('statement', this.partReference<PgslForStatementSyntaxTree>('Statement-For')),
                this.graph().single('statement', this.partReference<PgslWhileStatementSyntaxTree>('Statement-While')),
                this.graph().single('statement', this.partReference<PgslDoWhileStatementSyntaxTree>('Statement-DoWhile')),
                this.graph().single('statement', this.partReference<PgslBreakStatementSyntaxTree>('Statement-Break')).single(PgslToken.Semicolon),
                this.graph().single('statement', this.partReference<PgslContinueStatementSyntaxTree>('Statement-Continue')).single(PgslToken.Semicolon),
                this.graph().single('statement', this.partReference<PgslDiscardStatementSyntaxTree>('Statement-Discard')).single(PgslToken.Semicolon),
                this.graph().single('statement', this.partReference<PgslReturnStatementSyntaxTree>('Statement-Return')).single(PgslToken.Semicolon),
                this.graph().single('statement', this.partReference<PgslVariableDeclarationStatementSyntaxTree>('Statement-VariableDeclaration')).single(PgslToken.Semicolon),
                this.graph().single('statement', this.partReference<PgslAssignmentStatementSyntaxTree>('Statement-Assignment')).single(PgslToken.Semicolon),
                this.graph().single('statement', this.partReference<PgslIncrementDecrementStatementSyntaxTree>('Statement-IncrementDecrement')).single(PgslToken.Semicolon),
                this.graph().single('statement', this.partReference<PgslFunctionCallStatementSyntaxTree>('Statement-FunctionCall')).single(PgslToken.Semicolon),
                this.graph().single('statement', this.partReference<PgslBlockStatementSyntaxTree>('Statement-Block'))
            ]),
            (pData): BasePgslStatementSyntaxTree => {
                return pData.item.statement;
            }
        );
    }

    /**
     * Define all graphs used inside module scope.
     */
    private defineModuleScope(): void {

        this.defineGraphPart('Declaration-Variable', this.graph()
            .single('attributes', this.partReference<PgslAttributeListSyntaxTree>('General-AttributeList'))
            .branch('declarationType', [
                PgslToken.KeywordDeclarationStorage,
                PgslToken.KeywordDeclarationUniform,
                PgslToken.KeywordDeclarationWorkgroup,
                PgslToken.KeywordDeclarationPrivate,
                PgslToken.KeywordDeclarationConst,
                PgslToken.KeywordDeclarationParam
            ])
            .single('variableName', PgslToken.Identifier).single(PgslToken.Colon)
            .single('type', this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration'))
            .branch('initialization', [
                PgslToken.Semicolon,
                this.graph().single(PgslToken.Assignment).single('expression', this.partReference<BasePgslExpressionSyntaxTree>('Expression')).single(PgslToken.Semicolon)
            ]),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslVariableDeclarationSyntaxTree => {
                // Build data structure.
                const lData: ConstructorParameters<typeof PgslVariableDeclarationSyntaxTree>[0] = {
                    name: pData.variableName,
                    type: pData.type,
                    declarationType: pData.declarationType
                };

                // Optional attributes.
                if (typeof pData.initialization !== 'string') {
                    lData.expression = pData.initialization.expression;
                }

                return new PgslVariableDeclarationSyntaxTree(lData, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Declaration-Alias', this.graph()
            .single('attributes', this.partReference<PgslAttributeListSyntaxTree>('General-AttributeList'))
            .single(PgslToken.KeywordAlias)
            .single('name', PgslToken.Identifier).single(PgslToken.Assignment)
            .single('type', this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration')).single(PgslToken.Semicolon),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAliasDeclarationSyntaxTree => {
                // Add alias name to parser buffer. Used for identifying type definitions over alias declarations.
                this.mTypeFactory.addAliasPredefinition(pData.name);

                // Create structure.
                return new PgslAliasDeclarationSyntaxTree(pData.name, pData.type, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Declaration-Enum', this.graph()
            .single('attributes', this.partReference<PgslAttributeListSyntaxTree>('General-AttributeList'))
            .single(PgslToken.KeywordEnum)
            .single('name', PgslToken.Identifier)
            .single(PgslToken.BlockStart)
            .optional('values', this.graph()
                .single('name', PgslToken.Identifier)
                .single(PgslToken.Assignment)
                .branch('value', [
                    this.partReference<PgslLiteralValueExpressionSyntaxTree>('Expression-LiteralValue'),
                    this.partReference<PgslStringValueExpressionSyntaxTree>('Expression-StringValue')
                ])
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .single('name', PgslToken.Identifier)
                    .single(PgslToken.Assignment)
                    .branch('value', [
                        this.partReference<PgslLiteralValueExpressionSyntaxTree>('Expression-LiteralValue'),
                        this.partReference<PgslStringValueExpressionSyntaxTree>('Expression-StringValue')
                    ])
                )
            )
            .single(PgslToken.BlockEnd),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslEnumDeclarationSyntaxTree => {
                // Add enum name to buffer.
                this.mTypeFactory.addEnumPredefinition(pData.name);

                // Only add values when they exist.
                const lEnumValueList = new Array<{ name: string, value: PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree; }>();
                if (pData.values) {
                    lEnumValueList.push(pData.values, ...pData.values.additional);
                }

                return new PgslEnumDeclarationSyntaxTree(pData.name, lEnumValueList, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Declaration-StructProperty', this.graph()
            .single('attributes', this.partReference<PgslAttributeListSyntaxTree>('General-AttributeList'))
            .single('name', PgslToken.Identifier)
            .single(PgslToken.Colon)
            .single('type', this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslStructPropertyDeclarationSyntaxTree => {
                // Create structure.
                return new PgslStructPropertyDeclarationSyntaxTree(pData.name, pData.type, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Declaration-Struct', this.graph()
            .single('attributes', this.partReference<PgslAttributeListSyntaxTree>('General-AttributeList'))
            .single(PgslToken.KeywordStruct)
            .single('name', PgslToken.Identifier)
            .single(PgslToken.BlockStart)
            .optional('properties', this.graph()
                .single('first', this.partReference<PgslStructPropertyDeclarationSyntaxTree>('Declaration-StructProperty'))
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .single('property', this.partReference<PgslStructPropertyDeclarationSyntaxTree>('Declaration-StructProperty'))
                )
            )
            .single(PgslToken.BlockEnd),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslStructDeclarationSyntaxTree => {
                // Add struct name to struct buffer.
                this.mTypeFactory.addStructPredefinition(pData.name);

                // Read and insert property data.
                const lPropertyList: Array<PgslStructPropertyDeclarationSyntaxTree> = new Array<PgslStructPropertyDeclarationSyntaxTree>();
                if (pData.properties) {
                    // Add property to property list.
                    lPropertyList.push(pData.properties.first, ...pData.properties.additional.map((pItem) => { return pItem.property; }));
                }

                // Create struct syntax tree.
                return new PgslStructDeclarationSyntaxTree(pData.name, lPropertyList, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        this.defineGraphPart('Declaration-Function', this.graph()
            .single('attributes', this.partReference<PgslAttributeListSyntaxTree>('General-AttributeList'))
            .single(PgslToken.KeywordFunction)
            .single('name', PgslToken.Identifier)
            .single(PgslToken.ParenthesesStart)
            .optional('parameter', this.graph()
                .single('first', this.graph()
                    .single('name', PgslToken.Identifier)
                    .single('type', this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration'))
                )
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .single('name', PgslToken.Identifier)
                    .single('type', this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration'))
                )
            )
            .single(PgslToken.ParenthesesEnd)
            .single(PgslToken.Colon)
            .single('returnType', this.partReference<BasePgslTypeDefinitionSyntaxTree>('General-TypeDeclaration'))
            .single('block', this.partReference<PgslBlockStatementSyntaxTree>('Statement-Block')),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslFunctionDeclarationSyntaxTree => {
                // Create base data.
                const lData: ConstructorParameters<typeof PgslFunctionDeclarationSyntaxTree>[0] = {
                    name: pData.name,
                    parameter: new Array<ConstructorParameters<typeof PgslFunctionDeclarationSyntaxTree>[0]['parameter'][number]>(),
                    returnType: pData.returnType,
                    block: pData.block,
                    constant: false
                };

                // Read and insert parameter data.
                if (pData.parameter) {
                    // Add parameter to parameter list.
                    lData.parameter.push(pData.parameter.first, ...pData.parameter.additional);
                }

                return new PgslFunctionDeclarationSyntaxTree(lData, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );
    }

    /**
     * Define root graph.
     */
    private defineRoot(): void {

        this.defineGraphPart('Module', this.graph()
            .loop('list', this.graph()
                .branch('tree', [
                    this.partReference<PgslAliasDeclarationSyntaxTree>('Declaration-Alias'),
                    this.partReference<PgslVariableDeclarationSyntaxTree>('Declaration-Variable'),
                    this.partReference<PgslEnumDeclarationSyntaxTree>('Declaration-Enum'),
                    this.partReference<PgslStructDeclarationSyntaxTree>('Declaration-Struct'),
                    this.partReference<PgslFunctionDeclarationSyntaxTree>('Declaration-Function')
                ])
            ),
            (pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslModuleSyntaxTree => {
                // Read inner trees of content.
                const lContentList = pData.list.map((pContent) => {
                    return pContent.tree;
                });

                return new PgslModuleSyntaxTree(lContentList, this.createTokenBoundParameter(pStartToken, pEndToken));
            }
        );

        // Define root part.
        this.setRootGraphPart('Module');
    }

    /**
     * Check if name is associated with any type.
     */
    private nameIsType(pName: string): boolean {
        return EnumUtil.exists(PgslBaseTypeName, pName) ||
            EnumUtil.exists(PgslBuildInTypeName, pName) ||
            EnumUtil.exists(PgslMatrixTypeName, pName) ||
            EnumUtil.exists(PgslNumericTypeName, pName) ||
            EnumUtil.exists(PgslSamplerTypeName, pName) ||
            EnumUtil.exists(PgslTextureTypeName, pName) ||
            EnumUtil.exists(PgslVectorTypeName, pName) ||
            this.mTypeFactory.enumNames.has(pName) ||
            this.mTypeFactory.structNames.has(pName);
    }
}