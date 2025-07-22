import { EnumUtil, Exception } from '@kartoffelgames/core';
import { CodeParser, Graph, GraphNode, LexerToken } from '@kartoffelgames/core-parser';
import { BasePgslSyntaxTreeMeta } from '../syntax_tree/base-pgsl-syntax-tree.ts';
import { PgslAliasDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-alias-declaration-syntax-tree.ts';
import { PgslEnumDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-enum-declaration-syntax-tree.ts';
import { PgslFunctionDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-function-declaration-syntax-tree.ts';
import { PgslStructDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-struct-declaration-syntax-tree.ts';
import { PgslStructPropertyDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-struct-property-declaration-syntax-tree.ts';
import { PgslVariableDeclarationSyntaxTree } from '../syntax_tree/declaration/pgsl-variable-declaration-syntax-tree.ts';
import { BasePgslExpressionSyntaxTree } from '../syntax_tree/expression/base-pgsl-expression-syntax-tree.ts';
import { PgslArithmeticExpressionSyntaxTree } from '../syntax_tree/expression/operation/pgsl-arithmetic-expression-syntax-tree.ts';
import { PgslBinaryExpressionSyntaxTree } from '../syntax_tree/expression/operation/pgsl-bit-expression-syntax-tree.ts';
import { PgslComparisonExpressionSyntaxTree } from '../syntax_tree/expression/operation/pgsl-comparison-expression-syntax-tree.ts';
import { PgslLogicalExpressionSyntaxTree } from '../syntax_tree/expression/operation/pgsl-logical-expression-syntax-tree.ts';
import { PgslAddressOfExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-address-of-expression-syntax-tree.ts';
import { PgslEnumValueExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-enum-value-expression-syntax-tree.ts';
import { PgslFunctionCallExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-function-call-expression-syntax-tree.ts';
import { PgslLiteralValueExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-literal-value-expression-syntax-tree.ts';
import { PgslNewCallExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-new-expression-syntax-tree.ts';
import { PgslParenthesizedExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-parenthesized-expression-syntax-tree.ts';
import { PgslStringValueExpressionSyntaxTree } from '../syntax_tree/expression/single_value/pgsl-string-value-expression-syntax-tree.ts';
import { PgslIndexedValueExpressionSyntaxTree } from '../syntax_tree/expression/storage/pgsl-indexed-value-expression-syntax-tree.ts';
import { PgslPointerExpressionSyntaxTree } from '../syntax_tree/expression/storage/pgsl-pointer-expression-syntax-tree.ts';
import { PgslValueDecompositionExpressionSyntaxTree } from '../syntax_tree/expression/storage/pgsl-value-decomposition-expression-syntax-tree.ts';
import { PgslVariableNameExpressionSyntaxTree } from '../syntax_tree/expression/storage/pgsl-variable-name-expression-syntax-tree.ts';
import { PgslUnaryExpressionSyntaxTree } from '../syntax_tree/expression/unary/pgsl-unary-expression-syntax-tree.ts';
import { PgslAttributeListSyntaxTree } from '../syntax_tree/general/pgsl-attribute-list-syntax-tree.ts';
import { PgslModuleSyntaxTree } from '../syntax_tree/pgsl-module-syntax-tree.ts';
import { BasePgslStatementSyntaxTree } from '../syntax_tree/statement/base-pgsl-statement-syntax-tree.ts';
import { PgslDoWhileStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-do-while-statement-syntax-tree.ts';
import { PgslForStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-for-statement-syntax-tree.ts';
import { PgslIfStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-if-statement-syntax-tree.ts';
import { PgslSwitchStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-switch-statement-syntax-tree.ts';
import { PgslWhileStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-while-statement-syntax-tree.ts';
import { PgslAssignmentStatementSyntaxTree } from '../syntax_tree/statement/pgsl-assignment-statement-syntax-tree.ts';
import { PgslBlockStatementSyntaxTree } from '../syntax_tree/statement/pgsl-block-statement-syntax-tree.ts';
import { PgslFunctionCallStatementSyntaxTree } from '../syntax_tree/statement/pgsl-function-call-statement-syntax-tree.ts';
import { PgslIncrementDecrementStatementSyntaxTree } from '../syntax_tree/statement/pgsl-increment-decrement-statement-syntax-tree.ts';
import { PgslReturnStatementSyntaxTree } from '../syntax_tree/statement/pgsl-return-statement-syntax-tree.ts';
import { PgslVariableDeclarationStatementSyntaxTree } from '../syntax_tree/statement/pgsl-variable-declaration-statement-syntax-tree.ts';
import { PgslBreakStatementSyntaxTree } from '../syntax_tree/statement/single/pgsl-break-statement-syntax-tree.ts';
import { PgslContinueStatementSyntaxTree } from '../syntax_tree/statement/single/pgsl-continue-statement-syntax-tree.ts';
import { PgslDiscardStatementSyntaxTree } from '../syntax_tree/statement/single/pgsl-discard-statement-syntax-tree.ts';
import { BasePgslTypeDefinitionSyntaxTree } from '../syntax_tree/type/definition/base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from '../syntax_tree/type/enum/pgsl-base-type-name.enum.ts';
import { PgslBuildInTypeName } from '../syntax_tree/type/enum/pgsl-build-in-type-name.enum.ts';
import { PgslMatrixTypeName } from '../syntax_tree/type/enum/pgsl-matrix-type-name.enum.ts';
import { PgslNumericTypeName } from '../syntax_tree/type/enum/pgsl-numeric-type-name.enum.ts';
import { PgslSamplerTypeName } from '../syntax_tree/type/enum/pgsl-sampler-build-name.enum.ts';
import { PgslTextureTypeName } from '../syntax_tree/type/enum/pgsl-texture-type-name.enum.ts';
import { PgslVectorTypeName } from '../syntax_tree/type/enum/pgsl-vector-type-name.enum.ts';
import { PgslTypeDeclarationSyntaxTreeFactory } from '../syntax_tree/type/pgsl-type-definition-syntax-tree-factory.ts';
import { PgslLexer } from './pgsl-lexer.ts';
import { PgslToken } from './pgsl-token.enum.ts';

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
        const lExpressionGraphs: PgslParserExpressionGraphs = this.defineExpressionGraphs(lCoreGraphs);
        const lCoreGraphs: PgslParserCoreGraphs = this.defineCoreGraphs(lExpressionGraphs);
        const lStatementGraphs: PgslParserStatementGraphs = this.defineStatementGraphs(lExpressionGraphs);

        
        this.defineModuleScope();

        

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
    private defineCoreGraphs(pExpressionGraphs: PgslParserExpressionGraphs): PgslParserCoreGraphs {
        /**
         * Single attribute item with optional parameter.
         * ```
         * - "[<IDENTIFIER>()]"
         * - "[<IDENTIFIER>(<EXPRESSION_LIST>)]"
         * ```
         */
        const lAttributeItemGraph = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.ListStart)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.ParenthesesStart)
                .optional('parameter<-list', pExpressionGraphs.expressionList)
                .required(PgslToken.ParenthesesEnd)
                .required(PgslToken.ListEnd);
        });

        /**
         * Attribute item list.
         * ```
         * - "<ATTRIBUTE_ITEM>"
         * - "<ATTRIBUTE_ITEM><ATTRIBUTE_ITEM>"
         * ```
         */
        const lAttributeListGraph = Graph.define(() => {
            const lSelfReference: Graph<PgslToken, object, { list: Array<ConstructorParameters<typeof PgslAttributeListSyntaxTree>[0][number]>; }> = lAttributeListGraph;

            return GraphNode.new<PgslToken>()
                .required('list[]', lAttributeItemGraph).optional('list<-list', lSelfReference);
        });

        /**
         * Attribute list.
         * Converts the internal attribute list into a {@link PgslAttributeListSyntaxTree}
         */
        const lAttributeListSyntaxTreeGraph = Graph.define(() => {
            return GraphNode.new<PgslToken>().required('list<-list', lAttributeListGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAttributeListSyntaxTree => {
            // Create attribute list syntax tree.
            return new PgslAttributeListSyntaxTree(pData.list, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Template list for a type declaration seperated by comma.
         * ```
         * - "<EXPRESSION|TYPE_DECLARATION>"
         * - "<EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>"
         * - "<EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>"
         * ```
         */
        const lTypeDeclarationTemplateListGraph = Graph.define(() => {
            const lSelfReference: Graph<PgslToken, object, { list: Array<BasePgslExpressionSyntaxTree | BasePgslTypeDefinitionSyntaxTree>; }> = lTypeDeclarationTemplateListGraph;

            return GraphNode.new<PgslToken>()
                .required('list[]', [
                    pExpressionGraphs.expression,
                    lTypeDeclarationSyntaxTreeGraph
                ]).optional('list<-list',
                    GraphNode.new<PgslToken>().required(PgslToken.Comma).required('list<-list', lSelfReference)
                );
        });

        /**
         * Type declaration with a optional pointer icon and optional type template list.
         * ```
         * - "<IDENTIFIER>"
         * - "<IDENTIFIER><<TEMPLATE_LIST>>"
         * - "*<IDENTIFIER>"
         * - "*<IDENTIFIER><<TEMPLATE_LIST>>"
         * ```
         */
        const lTypeDeclarationSyntaxTreeGraph: Graph<PgslToken, object, BasePgslTypeDefinitionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .optional('pointer', PgslToken.OperatorMultiply)
                .required('name', PgslToken.Identifier)
                .optional('templateList<-list', GraphNode.new<PgslToken>()
                    .required(PgslToken.TemplateListStart)
                    .required('list<-list', lTypeDeclarationTemplateListGraph)
                    .required(PgslToken.TemplateListEnd)
                );
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): BasePgslTypeDefinitionSyntaxTree => {
            // Define root structure of type definition syntax tree structure data and apply type name.
            const lTemplateList: Array<BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree> = pData.templateList ?? [];

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

            // Create type definition syntax tree.
            return this.mTypeFactory.generate(pData.name, !!pData.pointer, lTemplateList, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        return {
            attributeList: lAttributeListSyntaxTreeGraph,
            typeDeclaration: lTypeDeclarationSyntaxTreeGraph
        };
    }

    /**
     * Define graphs only for resolving expressions.
     */
    private defineExpressionGraphs(pCoreGraphs: PgslParserCoreGraphs): PgslParserExpressionGraphs {
        // lExpressionSyntaxTreeGraph

        /**
         * Logical expression. Logical connection between two expressions.
         * ```
         * - "<EXPRESSION> && <EXPRESSION>"
         * - "<EXPRESSION> || <EXPRESSION>"
         * ```
         */
        const lLogicalExpressionGraph: Graph<PgslToken, object, PgslLogicalExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('leftExpression', lExpressionSyntaxTreeGraph)
                .required('operation', [
                    PgslToken.OperatorShortCircuitOr,
                    PgslToken.OperatorShortCircuitAnd
                ])
                .required('rightExpression', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslLogicalExpressionSyntaxTree => {
            return new PgslLogicalExpressionSyntaxTree(pData.leftExpression, pData.operation, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Arithmetic expression. Arithmetic connection between two expressions.
         * ```
         * - "<EXPRESSION> + <EXPRESSION>"
         * - "<EXPRESSION> - <EXPRESSION>"
         * - "<EXPRESSION> * <EXPRESSION>"
         * - "<EXPRESSION> / <EXPRESSION>"
         * - "<EXPRESSION> % <EXPRESSION>"
         * ```
         */
        const lArithmeticExpressionGraph: Graph<PgslToken, object, PgslArithmeticExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('leftExpression', lExpressionSyntaxTreeGraph)
                .required('operation', [
                    PgslToken.OperatorPlus,
                    PgslToken.OperatorMinus,
                    PgslToken.OperatorMultiply,
                    PgslToken.OperatorDivide,
                    PgslToken.OperatorModulo
                ])
                .required('rightExpression', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslArithmeticExpressionSyntaxTree => {
            return new PgslArithmeticExpressionSyntaxTree(pData.leftExpression, pData.operation, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Comparison expression. Comparison connection between two expressions.
         * ```
         * - "<EXPRESSION> == <EXPRESSION>"
         * - "<EXPRESSION> != <EXPRESSION>"
         * - "<EXPRESSION> < <EXPRESSION>"
         * - "<EXPRESSION> <= <EXPRESSION>"
         * - "<EXPRESSION> > <EXPRESSION>"
         * - "<EXPRESSION> >= <EXPRESSION>"
         * ```
         */
        const lComparisonExpressionGraph: Graph<PgslToken, object, PgslComparisonExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('leftExpression', lExpressionSyntaxTreeGraph)
                .required('comparison', [
                    PgslToken.OperatorEqual,
                    PgslToken.OperatorNotEqual,
                    PgslToken.OperatorLowerThan,
                    PgslToken.OperatorLowerThanEqual,
                    PgslToken.OperatorGreaterThan,
                    PgslToken.OperatorGreaterThanEqual
                ])
                .required('rightExpression', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslComparisonExpressionSyntaxTree => {
            return new PgslComparisonExpressionSyntaxTree(pData.leftExpression, pData.comparison, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * BitOperation expression. BitOperation connection between two expressions.
         * ```
         * - "<EXPRESSION> | <EXPRESSION>"
         * - "<EXPRESSION> & <EXPRESSION>"
         * - "<EXPRESSION> ^ <EXPRESSION>"
         * - "<EXPRESSION> << <EXPRESSION>"
         * - "<EXPRESSION> >> <EXPRESSION>"
         * ```
         */
        const lBitOperationExpressionGraph: Graph<PgslToken, object, PgslBinaryExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('leftExpression', lExpressionSyntaxTreeGraph)
                .required('operation', [
                    PgslToken.OperatorBinaryOr,
                    PgslToken.OperatorBinaryAnd,
                    PgslToken.OperatorBinaryXor,
                    PgslToken.OperatorShiftLeft,
                    PgslToken.OperatorShiftRight
                ])
                .required('rightExpression', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslBinaryExpressionSyntaxTree => {
            return new PgslBinaryExpressionSyntaxTree(pData.leftExpression, pData.operation, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Unary expression. Prefixed modifier for a single expression.
         * ```
         * - "~<EXPRESSION>"
         * - "-<EXPRESSION>"
         * - "!<EXPRESSION>"
         * ```
         */
        const lUnaryExpressionGraph: Graph<PgslToken, object, PgslUnaryExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('prefix', [
                    PgslToken.OperatorBinaryNegate,
                    PgslToken.OperatorMinus,
                    PgslToken.OperatorNot
                ])
                .required('expression', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslUnaryExpressionSyntaxTree => {
            return new PgslUnaryExpressionSyntaxTree(pData.expression, pData.prefix, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Variable name expression. Just an identifier.
         * ```
         * - "<IDENTIFIER>"
         * ```
         */
        const lVariableNameExpressionGraph: Graph<PgslToken, object, PgslVariableNameExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslVariableNameExpressionSyntaxTree => {
            return new PgslVariableNameExpressionSyntaxTree(pData.name, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Indexed value expression. An expressions value accessed through another expression.
         * ```
         * - "<EXPRESSION>[<EXPRESSION>]"
         * ```
         */
        const lIndexedValueExpressionGraph: Graph<PgslToken, object, PgslIndexedValueExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('value', lExpressionSyntaxTreeGraph)
                .required(PgslToken.ListStart)
                .required('indexExpression', lExpressionSyntaxTreeGraph)
                .required(PgslToken.ListEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslIndexedValueExpressionSyntaxTree => {
            return new PgslIndexedValueExpressionSyntaxTree(pData.value, pData.indexExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Value decomposition expression. An expressions value accessed through an identifier.
         * Can be eighter a value decomposition or a enum decomposition.
         * ```
         * - "<EXPRESSION>.<IDENTIFIER>"
         * ```
         */
        const lValueDecompositionExpressionGraph: Graph<PgslToken, object, PgslEnumValueExpressionSyntaxTree | PgslValueDecompositionExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('leftExpression', lExpressionSyntaxTreeGraph)
                .required(PgslToken.MemberDelimiter)
                .required('propertyName', PgslToken.Identifier);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslEnumValueExpressionSyntaxTree | PgslValueDecompositionExpressionSyntaxTree => {
            // When left expression is a single name, it can be a enum value.
            if (pData.leftExpression instanceof PgslVariableNameExpressionSyntaxTree) {
                // Check variable name with the currently list of declared enums. 
                const lVariableName: string = pData.leftExpression.name;
                if (this.mTypeFactory.enumNames.has(lVariableName)) {
                    // Return enum value structure data instead.
                    return new PgslEnumValueExpressionSyntaxTree(lVariableName, pData.propertyName, this.createTokenBoundParameter(pStartToken, pEndToken));
                }
            }

            // When not a enum than it can only be a decomposition.
            return new PgslValueDecompositionExpressionSyntaxTree(pData.leftExpression, pData.propertyName, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Parenthesized expression. An expressions value wrapped with parentheses.
         * ```
         * - "(<EXPRESSION>)"
         * ```
         */
        const lParenthesizedExpressionGraph: Graph<PgslToken, object, PgslParenthesizedExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.ParenthesesStart)
                .required('expression', lExpressionSyntaxTreeGraph)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslParenthesizedExpressionSyntaxTree => {
            return new PgslParenthesizedExpressionSyntaxTree(pData.expression, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Literal number or boolean expression.
         * ```
         * - "<LITERAL_NUMBER>"
         * - "<LITERAL_BOOLEAN>"
         * ```
         */
        const lLiteralValueExpressionGraph: Graph<PgslToken, object, PgslLiteralValueExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('value', [
                    PgslToken.LiteralFloat,
                    PgslToken.LiteralInteger,
                    PgslToken.LiteralBoolean
                ]);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslLiteralValueExpressionSyntaxTree => {
            return new PgslLiteralValueExpressionSyntaxTree(pData.value, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Literal string expression.
         * ```
         * - "<LITERAL_STRING>"
         * ```
         */
        const lStringValueExpressionGraph: Graph<PgslToken, object, PgslStringValueExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('string', PgslToken.LiteralString);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslStringValueExpressionSyntaxTree => {
            return new PgslStringValueExpressionSyntaxTree(pData.string, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * AddressOf expression. Expression prefixed with a ampersand.
         * ```
         * - "&<EXPRESSION>"
         * ```
         */
        const lAddressOfExpressionGraph: Graph<PgslToken, object, PgslAddressOfExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.OperatorBinaryAnd)
                .required('variable', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAddressOfExpressionSyntaxTree => {
            return new PgslAddressOfExpressionSyntaxTree(pData.variable, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Pointer expression. Expression prefixed with a star.
         * ```
         * - "*<EXPRESSION>"
         * ```
         */
        const lPointerExpressionGraph: Graph<PgslToken, object, PgslPointerExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.OperatorMultiply)
                .required('variable', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslPointerExpressionSyntaxTree => {
            return new PgslPointerExpressionSyntaxTree(pData.variable, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /** 
         * Recursive list of expressions seperated with comma.
         * ```
         * - "<EXPRESSION>"
         * - "<EXPRESSION>, <EXPRESSION>"
         * - "<EXPRESSION>, <EXPRESSION>, <EXPRESSION>"
         * ```
         */
        const lExpressionListGraph = Graph.define(() => {
            const lSelfReference: Graph<PgslToken, object, { list: Array<BasePgslExpressionSyntaxTree>; }> = lExpressionListGraph;

            return GraphNode.new<PgslToken>()
                .required('list[]', lExpressionSyntaxTreeGraph).optional('list<-list',
                    GraphNode.new<PgslToken>().required(PgslToken.Comma).required('list<-list', lSelfReference)
                );
        });

        /**
         * Function call expression. Expression called as function.
         * ```
         * - "<EXPRESSION>()"
         * - "<EXPRESSION>(<EXPRESSION_LIST>)"
         * ```
         */
        const lFunctionCallExpressionGraph: Graph<PgslToken, object, PgslFunctionCallExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier)
                .required(PgslToken.ParenthesesStart)
                .optional('parameters<-list', lExpressionListGraph)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslFunctionCallExpressionSyntaxTree => {
            // Create function call expression syntax tree.
            return new PgslFunctionCallExpressionSyntaxTree(pData.name, pData.parameters ?? [], this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * New expression. Create instance of a type declaration with a list of Expression.
         * ```
         * - "new <TYPE_DECLARATION>()"
         * - "new <TYPE_DECLARATION>(<EXPRESSION_LIST>)"
         * ```
         */
        const lNewExpressionGraph: Graph<PgslToken, object, PgslNewCallExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordNew)
                .required('type', pCoreGraphs.typeDeclaration)
                .required(PgslToken.ParenthesesStart)
                .optional('parameters<-list', lExpressionListGraph)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslNewCallExpressionSyntaxTree => {
            // Create function call expression syntax tree.
            return new PgslNewCallExpressionSyntaxTree(pData.type, pData.parameters ?? [], this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Expression graph. 
         * Bundles the different expressions into a single graph.
         */
        const lExpressionSyntaxTreeGraph: Graph<PgslToken, object, BasePgslExpressionSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('expression', [
                    lLiteralValueExpressionGraph,
                    lParenthesizedExpressionGraph,
                    lFunctionCallExpressionGraph,
                    lVariableNameExpressionGraph,
                    lIndexedValueExpressionGraph,
                    lStringValueExpressionGraph,
                    lAddressOfExpressionGraph,
                    lValueDecompositionExpressionGraph,
                    lPointerExpressionGraph,
                    lNewExpressionGraph,
                    lUnaryExpressionGraph,
                    lBitOperationExpressionGraph,
                    lComparisonExpressionGraph,
                    lArithmeticExpressionGraph,
                    lLogicalExpressionGraph
                ]);
        }).converter((pData): BasePgslExpressionSyntaxTree => {
            return pData.expression;
        });

        return {
            expression: lExpressionSyntaxTreeGraph,
            expressionList: lExpressionListGraph
        };
    }

    /**
     * Define all statements and flows used inside function scope.
     */
    private defineStatementGraphs(pExpressionGraphs: PgslParserExpressionGraphs): PgslParserStatementGraphs {
        /**
         * If statement graph. wrapped expression with an block expression 
         * and optional self chaining with else.
         * ```
         * - "if(<EXPRESSION>)<BLOCK>"
         * - "if(<EXPRESSION>)<BLOCK> else <BLOCK>"
         * - "if(<EXPRESSION>)<BLOCK> else <SELF>"
         * ```
         */
        const lIfStatementGraph = Graph.define(() => {
            const lSelfReference: Graph<PgslToken, object, PgslIfStatementSyntaxTree> = lIfStatementGraph;

            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordIf)
                .required(PgslToken.ParenthesesStart)
                .required('expression', pExpressionGraphs.expression)
                .required(PgslToken.ParenthesesEnd)
                .required('block', lBlockStatementGraph)
                .optional('elseBlock<-block', GraphNode.new<PgslToken>()
                    .required(PgslToken.KeywordElse)
                    .required('block', [
                        lBlockStatementGraph,
                        lSelfReference
                    ])
                );
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslIfStatementSyntaxTree => {
            // Create data.
            const lData: ConstructorParameters<typeof PgslIfStatementSyntaxTree>[0] = {
                expression: pData.expression,
                block: pData.block,
                else: pData.elseBlock ?? null
            };

            // Create if statement syntax tree.
            return new PgslIfStatementSyntaxTree(lData, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * List of statements graph.
         * ```
         * - "<STATEMENT>"
         * - "<STATEMENT><STATEMENT>"
         * - "<STATEMENT><STATEMENT><STATEMENT>"
         * ```
         */
        const lStatementListGraph = Graph.define(() => {
            const lSelfReference: Graph<PgslToken, object, { list: Array<BasePgslStatementSyntaxTree>; }> = lStatementListGraph;

            return GraphNode.new<PgslToken>()
                .required('list[]', lStatementSyntaxTreeGraph).optional('list<-list', lSelfReference);
        });

        /**
         * Block statement graph. Optional list of statements wrapped with clamps.
         * ```
         * - "{}"
         * - "{<STATEMENT_LIST>}"
         * ```
         */
        const lBlockStatementGraph: Graph<PgslToken, object, PgslBlockStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.BlockStart)
                .optional('statements<-list', lStatementListGraph)
                .required(PgslToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslBlockStatementSyntaxTree => {
            return new PgslBlockStatementSyntaxTree(pData.statements ?? [], this.createTokenBoundParameter(pStartToken, pEndToken));
        });

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

        /**
         * Statement graph. 
         * Bundles the different statements into a single graph.
         */
        const lStatementSyntaxTreeGraph: Graph<PgslToken, object, BasePgslStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('statement<-statement', [
                    GraphNode.new<PgslToken>().required('statement', lIfStatementGraph),
                    GraphNode.new<PgslToken>().required('statement', lSwitchStatementGraph),
                    GraphNode.new<PgslToken>().required('statement', lForStatementGraph),
                    GraphNode.new<PgslToken>().required('statement', lWhileStatementGraph),
                    GraphNode.new<PgslToken>().required('statement', lDoWhileStatementGraph),
                    GraphNode.new<PgslToken>().required('statement', lBreakStatementGraph).required(PgslToken.Semicolon),
                    GraphNode.new<PgslToken>().required('statement', lContinueStatementGraph).required(PgslToken.Semicolon),
                    GraphNode.new<PgslToken>().required('statement', lDiscardStatementGraph).required(PgslToken.Semicolon),
                    GraphNode.new<PgslToken>().required('statement', lReturnStatementGraph).required(PgslToken.Semicolon),
                    GraphNode.new<PgslToken>().required('statement', lVariableDeclarationStatementGraph).required(PgslToken.Semicolon),
                    GraphNode.new<PgslToken>().required('statement', lAssignmentStatementGraph).required(PgslToken.Semicolon),
                    GraphNode.new<PgslToken>().required('statement', lIncrementDecrementStatementGraph).required(PgslToken.Semicolon),
                    GraphNode.new<PgslToken>().required('statement', lFunctionCallStatementGraph).required(PgslToken.Semicolon),
                    GraphNode.new<PgslToken>().required('statement', lBlockStatementGraph)
                ]);
        }).converter((pData): BasePgslStatementSyntaxTree => {
            return pData.statement;
        });

        return {
            statement: lStatementSyntaxTreeGraph
        };
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

type PgslParserCoreGraphs = {
    attributeList: Graph<PgslToken, object, PgslAttributeListSyntaxTree>;
    typeDeclaration: Graph<PgslToken, object, BasePgslTypeDefinitionSyntaxTree>;
};

type PgslParserExpressionGraphs = {
    expression: Graph<PgslToken, object, BasePgslExpressionSyntaxTree>;
    expressionList: Graph<PgslToken, object, {
        list: Array<BasePgslExpressionSyntaxTree>;
    }>;
};

type PgslParserStatementGraphs = {
    statement: Graph<PgslToken, object, BasePgslStatementSyntaxTree>;
};