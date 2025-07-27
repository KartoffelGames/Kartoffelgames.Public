import { EnumUtil, Exception } from '@kartoffelgames/core';
import { CodeParser, Graph, GraphNode, LexerToken } from '@kartoffelgames/core-parser';
import { BasePgslSyntaxTreeMeta } from '../syntax_tree/base-pgsl-syntax-tree.ts';
import { BasePgslDeclarationSyntaxTree } from "../syntax_tree/declaration/base-pgsl-declaration-syntax-tree.ts";
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
import { BasePgslStatementSyntaxTree } from '../syntax_tree/statement/base-pgsl-statement-syntax-tree.ts';
import { PgslDoWhileStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-do-while-statement-syntax-tree.ts';
import { PgslForStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-for-statement-syntax-tree.ts';
import { PgslIfStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-if-statement-syntax-tree.ts';
import { PgslSwitchStatementSwitchCase, PgslSwitchStatementSyntaxTree } from '../syntax_tree/statement/branch/pgsl-switch-statement-syntax-tree.ts';
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
import { PgslSyntaxDocument } from "../syntax_tree/pgsl-syntax-document.ts";
import { PgslSyntaxTreeScope } from "../syntax_tree/pgsl-syntax-tree-scope.ts";

export class PgslParser extends CodeParser<PgslToken, PgslSyntaxDocument> {
    private mTypeFactory: PgslTypeDeclarationSyntaxTreeFactory;

    /**
     * Constructor.
     */
    public constructor() {
        super(new PgslLexer());

        // Setup buffer.
        this.mTypeFactory = new PgslTypeDeclarationSyntaxTreeFactory();

        // Create empty core graph reference.
        const lCoreGraphs: PgslParserCoreGraphs = {
            attributeList: null as any,
            typeDeclaration: null as any,
        };

        // Define expression graphs use the mime object of core graph for defining.
        const lExpressionGraphs: PgslParserExpressionGraphs = this.defineExpressionGraphs(lCoreGraphs);

        // Create actual core graphs and assign them to the mime object.
        const lDefinedCoreGraphs: PgslParserCoreGraphs = this.defineCoreGraphs(lExpressionGraphs);
        lCoreGraphs.attributeList = lDefinedCoreGraphs.attributeList;
        lCoreGraphs.typeDeclaration = lDefinedCoreGraphs.typeDeclaration;

        const lStatementGraphs: PgslParserStatementGraphs = this.defineStatementGraphs(lCoreGraphs, lExpressionGraphs);

        // Define declaration graphs.
        const lDeclarationGraphs: PgslParserDeclarationGraphs = this.defineDeclarationGraphs(lCoreGraphs, lExpressionGraphs, lStatementGraphs);

        // Set root.
        const lModuleScopeGraph = this.defineModuleScopeGraph(lDeclarationGraphs);

        // Set root.
        this.setRootGraph(lModuleScopeGraph);
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
    public override parse(pCodeText: string): PgslSyntaxDocument {

        // TODO: On second layer only not the parser.
        // Insert imports. #IMPORT
        // Fill in buffers with imported declarations.
        // Setup #IFDEF. Fill Replaced '#IFDEFs, #ENDIFDEF with same amount of spaces and newlines.
        // Remove any other # statements as they do nothing. Replace with same amount of spaces and newlines.

        // TODO: How to generate a sourcemap. https://sourcemaps.info/spec.html

        // TODO: Replace comments with same amount of spaces ans newlines.

        // Parse document structure.
        const lDocument: PgslSyntaxDocument = super.parse(pCodeText);

        const lValidationScope: PgslSyntaxTreeScope = new PgslSyntaxTreeScope();

        // Validate document.
        lDocument.validate(lValidationScope);

        if( lValidationScope.errors.length > 0) {
            throw lValidationScope.errors[0];
        }

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
        const lAttributeListGraph: Graph<PgslToken, object, { list: Array<ConstructorParameters<typeof PgslAttributeListSyntaxTree>[1][number]>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', lAttributeItemGraph)
                .optional('list<-list', lAttributeListGraph); // Self reference
        });

        /**
         * Attribute list.
         * Converts the internal attribute list into a {@link PgslAttributeListSyntaxTree}
         */
        const lAttributeListSyntaxTreeGraph = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .optional('list<-list', lAttributeListGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAttributeListSyntaxTree => {
            // Create attribute list syntax tree.
            return new PgslAttributeListSyntaxTree(this.createTokenBoundParameter(pStartToken, pEndToken), pData.list ?? []);
        });

        /**
         * Template list for a type declaration seperated by comma.
         * ```
         * - "<EXPRESSION|TYPE_DECLARATION>"
         * - "<EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>"
         * - "<EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>"
         * ```
         */
        const lTypeDeclarationTemplateListGraph: Graph<PgslToken, object, { list: Array<BasePgslExpressionSyntaxTree | BasePgslTypeDefinitionSyntaxTree>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', [
                    pExpressionGraphs.expression,
                    lTypeDeclarationSyntaxTreeGraph
                ]).optional('list<-list', GraphNode.new<PgslToken>()
                    .required(PgslToken.Comma)
                    .required('list<-list', lTypeDeclarationTemplateListGraph) // Self reference.
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
        const lExpressionListGraph: Graph<PgslToken, object, { list: Array<BasePgslExpressionSyntaxTree>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', lExpressionSyntaxTreeGraph)
                .optional('list<-list', GraphNode.new<PgslToken>()
                    .required(PgslToken.Comma)
                    .required('list<-list', lExpressionListGraph) // Self reference
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
                    // Combination expressions, combining two expressions.
                    lValueDecompositionExpressionGraph,
                    lComparisonExpressionGraph,
                    lArithmeticExpressionGraph,
                    lLogicalExpressionGraph,
                    lBitOperationExpressionGraph,

                    // Extending expressions. Extending a expression another expression.
                    lFunctionCallExpressionGraph,  
                    lIndexedValueExpressionGraph,

                    // Expression additives. Add something before after.
                    lAddressOfExpressionGraph,
                    lPointerExpressionGraph,
                    lUnaryExpressionGraph,
                    lParenthesizedExpressionGraph,

                    // Single value expressions.
                    lNewExpressionGraph,
                    lLiteralValueExpressionGraph,
                    lStringValueExpressionGraph,
                    lVariableNameExpressionGraph,
                ]);
        }).converter((pData): BasePgslExpressionSyntaxTree => {
            return pData.expression;
        });

        return {
            expression: lExpressionSyntaxTreeGraph,
            expressionList: lExpressionListGraph,
            literalExpression: lLiteralValueExpressionGraph,
            stringExpression: lStringValueExpressionGraph
        };
    }

    /**
     * Define all statements and flows used inside function scope.
     */
    private defineStatementGraphs(pCoreGraphs: PgslParserCoreGraphs, pExpressionGraphs: PgslParserExpressionGraphs): PgslParserStatementGraphs {
        /**
         * If statement graph. wrapped expression with an block expression 
         * and optional self chaining with else.
         * ```
         * - "if(<EXPRESSION>)<BLOCK>"
         * - "if(<EXPRESSION>)<BLOCK> else <BLOCK>"
         * - "if(<EXPRESSION>)<BLOCK> else <SELF>"
         * ```
         */
        const lIfStatementGraph: Graph<PgslToken, object, PgslIfStatementSyntaxTree> = Graph.define(() => {
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
                        lIfStatementGraph // Self reference.
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
        const lStatementListGraph: Graph<PgslToken, object, { list: Array<BasePgslStatementSyntaxTree>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', lStatementSyntaxTreeGraph)
                .optional('list<-list', lStatementListGraph); // Self reference.
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

        /**
         * Single case of a switch statement graph. Containing a case with a list of expressions devided by comma and a block.
         * ```
         * - "case <EXPRESSION> <BLOCK>"
         * - "case <EXPRESSION>, <EXPRESSION> <BLOCK>"
         * - "case <EXPRESSION>, <EXPRESSION>, <EXPRESSION> <BLOCK>"
         * ```
         */
        const lSwitchCaseStatementGraph: Graph<PgslToken, object, PgslSwitchStatementSwitchCase> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordCase)
                .required('cases<-list', pExpressionGraphs.expressionList)
                .required('block', lBlockStatementGraph);
        });

        /**
         * List of cases of a switch statement graph.
         */
        const lSwitchCaseStatementListGraph: Graph<PgslToken, object, { list: Array<PgslSwitchStatementSwitchCase>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', lSwitchCaseStatementGraph)
                .optional('list<-list', lSwitchCaseStatementListGraph); // Self reference.
        });

        /**
         * Switch statement graph. A switch expression with a list of cases and a optional default block.
         * '''
         * - "switch(<EXPRESSION>){} "
         * - "switch(<EXPRESSION>){<CASE_LIST>} "
         * - "switch(<EXPRESSION>){default <BLOCK>} "
         * - "switch(<EXPRESSION>){<CASE_LIST> default <BLOCK>} "
         * '''
         */
        const lSwitchStatementGraph: Graph<PgslToken, object, PgslSwitchStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordSwitch)
                .required(PgslToken.ParenthesesStart)
                .required('expression', pExpressionGraphs.expression)
                .required(PgslToken.ParenthesesEnd)
                .required(PgslToken.BlockStart)
                .optional('cases<-list', lSwitchCaseStatementListGraph)
                .optional('defaultBlock<-block', GraphNode.new<PgslToken>()
                    .required(PgslToken.KeywordDefault)
                    .required('block', lBlockStatementGraph)
                )
                .required(PgslToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslSwitchStatementSyntaxTree => {
            // Build switch data structure.
            const lData: ConstructorParameters<typeof PgslSwitchStatementSyntaxTree>[0] = {
                expression: pData.expression,
                cases: pData.cases ?? [],
                default: pData.defaultBlock ?? null
            };

            return new PgslSwitchStatementSyntaxTree(lData, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * While statement graph. A while loop with condition and block.
         * ```
         * - "while(<EXPRESSION>)<BLOCK>"
         * ```
         */
        const lWhileStatementGraph: Graph<PgslToken, object, PgslWhileStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordWhile)
                .required(PgslToken.ParenthesesStart)
                .required('expression', pExpressionGraphs.expression)
                .required(PgslToken.ParenthesesEnd)
                .required('block', lBlockStatementGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslWhileStatementSyntaxTree => {
            return new PgslWhileStatementSyntaxTree(pData.expression, pData.block, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Do-while statement graph. A do-while loop with block and condition.
         * ```
         * - "do <BLOCK> while(<EXPRESSION>)"
         * ```
         */
        const lDoWhileStatementGraph: Graph<PgslToken, object, PgslDoWhileStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordDo)
                .required('block', lBlockStatementGraph)
                .required(PgslToken.KeywordWhile)
                .required(PgslToken.ParenthesesStart)
                .required('expression', pExpressionGraphs.expression)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslDoWhileStatementSyntaxTree => {
            return new PgslDoWhileStatementSyntaxTree(pData.expression, pData.block, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Break statement graph. Break statement.
         * ```
         * - "break"
         * ```
         */
        const lBreakStatementGraph: Graph<PgslToken, object, PgslBreakStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordBreak);
        }).converter((_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslBreakStatementSyntaxTree => {
            return new PgslBreakStatementSyntaxTree(this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Continue statement graph. Continue statement.
         * ```
         * - "continue"
         * ```
         */
        const lContinueStatementGraph: Graph<PgslToken, object, PgslContinueStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordContinue);
        }).converter((_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslContinueStatementSyntaxTree => {
            return new PgslContinueStatementSyntaxTree(this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Return statement graph. Return statement with optional expression.
         * ```
         * - "return"
         * - "return <EXPRESSION>"
         * ```
         */
        const lReturnStatementGraph: Graph<PgslToken, object, PgslReturnStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordReturn)
                .optional('expression', pExpressionGraphs.expression);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslReturnStatementSyntaxTree => {
            return new PgslReturnStatementSyntaxTree(pData.expression ?? null, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Discard statement graph. Discard statement.
         * ```
         * - "discard"
         * ```
         */
        const lDiscardStatementGraph: Graph<PgslToken, object, PgslDiscardStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordDiscard);
        }).converter((_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslDiscardStatementSyntaxTree => {
            return new PgslDiscardStatementSyntaxTree(this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Variable declaration statement graph. Declaration of a variable with type and optional initialization.
         * ```
         * - "let <IDENTIFIER>: <TYPE_DECLARATION>;"
         * - "const <IDENTIFIER>: <TYPE_DECLARATION>;"
         * - "let <IDENTIFIER>: <TYPE_DECLARATION> = <EXPRESSION>;"
         * - "const <IDENTIFIER>: <TYPE_DECLARATION> = <EXPRESSION>;"
         * ```
         */
        const lVariableDeclarationStatementGraph: Graph<PgslToken, object, PgslVariableDeclarationStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('declarationType', [
                    PgslToken.KeywordDeclarationConst,
                    PgslToken.KeywordDeclarationLet
                ])
                .required('variableName', PgslToken.Identifier)
                .required(PgslToken.Colon)
                .required('type', pCoreGraphs.typeDeclaration)
                .optional('initialExpression<-expression', GraphNode.new<PgslToken>()
                    .required(PgslToken.Assignment)
                    .required('expression', pExpressionGraphs.expression)
                );
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslVariableDeclarationStatementSyntaxTree => {
            // Build variable declaration data structure.
            const lData: ConstructorParameters<typeof PgslVariableDeclarationStatementSyntaxTree>[0] = {
                declarationType: pData.declarationType,
                name: pData.variableName,
                type: pData.type,
                expression: pData.initialExpression ?? null
            };

            return new PgslVariableDeclarationStatementSyntaxTree(lData, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * For statement graph. A for loop with optional initialization, condition, and update.
         * ```
         * - "for(;;)<BLOCK>"
         * - "for(<VARIABLE_DECLARATION>; <EXPRESSION>; <UPDATE>)<BLOCK>"
         * - "for(; <EXPRESSION>; <UPDATE>)<BLOCK>"
         * - "for(<VARIABLE_DECLARATION>;; <UPDATE>)<BLOCK>"
         * - "for(<VARIABLE_DECLARATION>; <EXPRESSION>;)<BLOCK>"
         * - "for(<VARIABLE_DECLARATION>;;)<BLOCK>"
         * - "for(;<EXPRESSION>;)<BLOCK>"
         * - "for(;;<UPDATE>)<BLOCK>"
         * ```
         */
        const lForStatementGraph: Graph<PgslToken, object, PgslForStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordFor)
                .required(PgslToken.ParenthesesStart)
                .optional('init', lVariableDeclarationStatementGraph)
                .required(PgslToken.Semicolon)
                .optional('expression', pExpressionGraphs.expression)
                .required(PgslToken.Semicolon)
                .optional('update', [
                    lAssignmentStatementGraph,
                    lIncrementDecrementStatementGraph,
                    lFunctionCallStatementGraph
                ])
                .required(PgslToken.ParenthesesEnd)
                .required('block', lBlockStatementGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslForStatementSyntaxTree => {
            // Build for statement data structure.
            const lData: ConstructorParameters<typeof PgslForStatementSyntaxTree>[0] = {
                block: pData.block,
                init: pData.init ?? null,
                expression: pData.expression ?? null,
                update: pData.update ?? null
            };

            return new PgslForStatementSyntaxTree(lData, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Assignment statement graph. Assignment of a value to a variable.
         * ```
         * - "<EXPRESSION> = <EXPRESSION>"
         * - "<EXPRESSION> += <EXPRESSION>"
         * - "<EXPRESSION> -= <EXPRESSION>"
         * ```
         */
        const lAssignmentStatementGraph: Graph<PgslToken, object, PgslAssignmentStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('variable', pExpressionGraphs.expression)
                .required('assignment', [
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
                .required('expression', pExpressionGraphs.expression);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAssignmentStatementSyntaxTree => {
            return new PgslAssignmentStatementSyntaxTree({
                expression: pData.expression,
                assignment: pData.assignment,
                variable: pData.variable
            }, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Increment/Decrement statement graph. Post-increment or post-decrement operation.
         * ```
         * - "<EXPRESSION>++"
         * - "<EXPRESSION>--"
         * ```
         */
        const lIncrementDecrementStatementGraph: Graph<PgslToken, object, PgslIncrementDecrementStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('expression', pExpressionGraphs.expression)
                .required('operator', [
                    PgslToken.OperatorIncrement,
                    PgslToken.OperatorDecrement
                ]);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslIncrementDecrementStatementSyntaxTree => {
            return new PgslIncrementDecrementStatementSyntaxTree(pData.operator, pData.expression, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Function call statement graph. Function call as a statement.
         * ```
         * - "<IDENTIFIER>()"
         * - "<IDENTIFIER>(<EXPRESSION_LIST>)"
         * ```
         */
        const lFunctionCallStatementGraph: Graph<PgslToken, object, PgslFunctionCallStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier)
                .required(PgslToken.ParenthesesStart)
                .optional('parameters<-list', pExpressionGraphs.expressionList)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslFunctionCallStatementSyntaxTree => {
            return new PgslFunctionCallStatementSyntaxTree(pData.name, pData.parameters ?? [], this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Statement graph. 
         * Bundles the different statements into a single graph.
         */
        const lStatementSyntaxTreeGraph: Graph<PgslToken, object, BasePgslStatementSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('branch', [
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
            return pData.branch.statement;
        });

        return {
            statement: lStatementSyntaxTreeGraph,
            blockStatement: lBlockStatementGraph
        };
    }

    /**
     * Define all declaration graphs used at module scope.
     */
    private defineDeclarationGraphs(pCoreGraphs: PgslParserCoreGraphs, pExpressionGraphs: PgslParserExpressionGraphs, pStatementGraphs: PgslParserStatementGraphs): PgslParserDeclarationGraphs {
        /**
         * Variable declaration graph. Module-level variable declaration with attributes.
         * ```
         * - "<ATTRIBUTE_LIST> storage <IDENTIFIER>: <TYPE>;"
         * - "<ATTRIBUTE_LIST> uniform <IDENTIFIER>: <TYPE>;"
         * - "<ATTRIBUTE_LIST> workgroup <IDENTIFIER>: <TYPE>;"
         * - "<ATTRIBUTE_LIST> private <IDENTIFIER>: <TYPE>;"
         * - "<ATTRIBUTE_LIST> const <IDENTIFIER>: <TYPE>;"
         * - "<ATTRIBUTE_LIST> param <IDENTIFIER>: <TYPE>;"
         * - "<ATTRIBUTE_LIST> storage <IDENTIFIER>: <TYPE> = <EXPRESSION>;"
         * - "<ATTRIBUTE_LIST> uniform <IDENTIFIER>: <TYPE> = <EXPRESSION>;"
         * - "<ATTRIBUTE_LIST> workgroup <IDENTIFIER>: <TYPE> = <EXPRESSION>;"
         * - "<ATTRIBUTE_LIST> private <IDENTIFIER>: <TYPE> = <EXPRESSION>;"
         * - "<ATTRIBUTE_LIST> const <IDENTIFIER>: <TYPE> = <EXPRESSION>;"
         * - "<ATTRIBUTE_LIST> param <IDENTIFIER>: <TYPE> = <EXPRESSION>;"
         * ```
         */
        const lVariableDeclarationGraph: Graph<PgslToken, object, PgslVariableDeclarationSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required('declarationType', [
                    PgslToken.KeywordDeclarationStorage,
                    PgslToken.KeywordDeclarationUniform,
                    PgslToken.KeywordDeclarationWorkgroup,
                    PgslToken.KeywordDeclarationPrivate,
                    PgslToken.KeywordDeclarationConst,
                    PgslToken.KeywordDeclarationParam
                ])
                .required('variableName', PgslToken.Identifier)
                .required(PgslToken.Colon)
                .required('type', pCoreGraphs.typeDeclaration)
                .required('initialization', [
                    PgslToken.Semicolon,
                    GraphNode.new<PgslToken>()
                        .required(PgslToken.Assignment)
                        .required('expression', pExpressionGraphs.expression)
                        .required(PgslToken.Semicolon)
                ]);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslVariableDeclarationSyntaxTree => {
            // Build data structure.
            const lData: ConstructorParameters<typeof PgslVariableDeclarationSyntaxTree>[0] = {
                name: pData.variableName,
                type: pData.type,
                declarationType: pData.declarationType
            };

            // Optional expression
            if (typeof pData.initialization !== 'string') {
                lData.expression = pData.initialization.expression;
            }

            return new PgslVariableDeclarationSyntaxTree(lData, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Alias declaration graph. Type alias declaration.
         * ```
         * - "<ATTRIBUTE_LIST> alias <IDENTIFIER> = <TYPE>;"
         * ```
         */
        const lAliasDeclarationGraph: Graph<PgslToken, object, PgslAliasDeclarationSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required(PgslToken.KeywordAlias)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.Assignment)
                .required('type', pCoreGraphs.typeDeclaration)
                .required(PgslToken.Semicolon);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAliasDeclarationSyntaxTree => {
            // Add alias name to parser buffer. Used for identifying type definitions over alias declarations.
            this.mTypeFactory.addAliasPredefinition(pData.name);

            // Create structure.
            return new PgslAliasDeclarationSyntaxTree(pData.name, pData.type, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Struct property declaration graph. Single property within a struct.
         * ```
         * - "[<ATTRIBUTES>] <IDENTIFIER>: <TYPE>"
         * ```
         */
        const lStructPropertyDeclarationGraph: Graph<PgslToken, object, PgslStructPropertyDeclarationSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.Colon)
                .required('type', pCoreGraphs.typeDeclaration);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslStructPropertyDeclarationSyntaxTree => {
            // Create structure.
            return new PgslStructPropertyDeclarationSyntaxTree(pData.name, pData.type, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * List of struct properties separated by comma.
         */
        const lStructPropertyListGraph: Graph<PgslToken, object, { list: Array<PgslStructPropertyDeclarationSyntaxTree>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', lStructPropertyDeclarationGraph)
                .optional('list<-list', GraphNode.new<PgslToken>()
                    .required(PgslToken.Comma)
                    .required('list<-list', lStructPropertyListGraph) // Self reference.
                );
        });

        /**
         * Struct declaration graph. Struct with properties.
         * ```
         * - "[<ATTRIBUTES>] struct <IDENTIFIER> { }"
         * - "[<ATTRIBUTES>] struct <IDENTIFIER> { <PROPERTY_LIST> }"
         * ```
         */
        const lStructDeclarationGraph: Graph<PgslToken, object, PgslStructDeclarationSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required(PgslToken.KeywordStruct)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.BlockStart)
                .optional('properties<-list', lStructPropertyListGraph)
                .required(PgslToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslStructDeclarationSyntaxTree => {
            // Add struct name to struct buffer.
            this.mTypeFactory.addStructPredefinition(pData.name);

            // Create struct syntax tree.
            return new PgslStructDeclarationSyntaxTree(pData.name, pData.properties ?? [], pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Single enum value with name and value.
         */
        const lEnumValueGraph = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier)
                .required(PgslToken.Assignment)
                .required('value', [
                    pExpressionGraphs.literalExpression,
                    pExpressionGraphs.stringExpression
                ]);
        });

        /**
         * List of enum values separated by comma.
         */
        const lEnumValueListGraph: Graph<PgslToken, object, { list: Array<{ name: string; value: PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree; }>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', lEnumValueGraph)
                .optional('list<-list', GraphNode.new<PgslToken>()
                    .required(PgslToken.Comma)
                    .required('list<-list', lEnumValueListGraph) // Self reference.
                );
        });

        /**
         * Enum declaration graph. Enum with values.
         * ```
         * - "[<ATTRIBUTES>] enum <IDENTIFIER> { <VALUE_LIST> }"
         * ```
         */
        const lEnumDeclarationGraph: Graph<PgslToken, object, PgslEnumDeclarationSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required(PgslToken.KeywordEnum)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.BlockStart)
                .optional('values<-list', lEnumValueListGraph)
                .required(PgslToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslEnumDeclarationSyntaxTree => {
            // Add enum name to buffer.
            this.mTypeFactory.addEnumPredefinition(pData.name);

            // Process enum values - filter to only literal/string values
            const lEnumValueList = new Array<{ name: string, value: PgslLiteralValueExpressionSyntaxTree | PgslStringValueExpressionSyntaxTree; }>();
            if (pData.values) {
                for (const lValue of pData.values) {
                    if (lValue.value instanceof PgslLiteralValueExpressionSyntaxTree || lValue.value instanceof PgslStringValueExpressionSyntaxTree) {
                        lEnumValueList.push({ name: lValue.name, value: lValue.value });
                    }
                }
            }

            return new PgslEnumDeclarationSyntaxTree(pData.name, lEnumValueList, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Function parameter with name and type.
         */
        const lFunctionParameterGraph = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier)
                .required(PgslToken.Colon)
                .required('type', pCoreGraphs.typeDeclaration);
        });

        /**
         * List of function parameters separated by comma.
         */
        const lFunctionParameterListGraph: Graph<PgslToken, object, { list: Array<{ name: string; type: BasePgslTypeDefinitionSyntaxTree; }>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', lFunctionParameterGraph)
                .optional('list<-list', GraphNode.new<PgslToken>()
                    .required(PgslToken.Comma)
                    .required('list<-list', lFunctionParameterListGraph) // Self reference.
                );
        });

        /**
         * Function declaration graph. Function with parameters and body.
         * ```
         * - "[<ATTRIBUTES>] fn <IDENTIFIER>(): <TYPE> <BLOCK>"
         * - "[<ATTRIBUTES>] fn <IDENTIFIER>(<PARAMETER_LIST>): <TYPE> <BLOCK>"
         * ```
         */
        const lFunctionDeclarationGraph: Graph<PgslToken, object, PgslFunctionDeclarationSyntaxTree> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required(PgslToken.KeywordFunction)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.ParenthesesStart)
                .optional('parameters<-list', lFunctionParameterListGraph)
                .required(PgslToken.ParenthesesEnd)
                .required(PgslToken.Colon)
                .required('returnType', pCoreGraphs.typeDeclaration)
                .required('block', pStatementGraphs.blockStatement);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslFunctionDeclarationSyntaxTree => {
            // Create base data.
            const lData: ConstructorParameters<typeof PgslFunctionDeclarationSyntaxTree>[0] = {
                name: pData.name,
                parameter: pData.parameters ?? [],
                returnType: pData.returnType,
                block: pData.block,
                constant: false
            };

            return new PgslFunctionDeclarationSyntaxTree(lData, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        return {
            variableDeclaration: lVariableDeclarationGraph,
            aliasDeclaration: lAliasDeclarationGraph,
            enumDeclaration: lEnumDeclarationGraph,
            structDeclaration: lStructDeclarationGraph,
            functionDeclaration: lFunctionDeclarationGraph
        };
    }

    /**
     * Define root graph.
     */
    private defineModuleScopeGraph(pDeclarationGraphs: PgslParserDeclarationGraphs): Graph<PgslToken, object, PgslSyntaxDocument> {
        /**
         * List of declaration graphs.
         */
        const lModuleScopeDeclarationListGraph: Graph<PgslToken, object, { list: Array<BasePgslDeclarationSyntaxTree<any>>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', [
                    pDeclarationGraphs.aliasDeclaration as Graph<PgslToken, object, BasePgslDeclarationSyntaxTree>,
                    pDeclarationGraphs.variableDeclaration,
                    pDeclarationGraphs.enumDeclaration,
                    pDeclarationGraphs.structDeclaration,
                    pDeclarationGraphs.functionDeclaration
                ])
                .optional('list<-list', lModuleScopeDeclarationListGraph); // Self reference.
        });

        /**
         * Root graph. Wrapps all valid declaration graphs.
         */
        const lModuleScopeGraph = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list<-list', lModuleScopeDeclarationListGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslSyntaxDocument => {
            return new PgslSyntaxDocument(this.createTokenBoundParameter(pStartToken, pEndToken), pData.list ?? []);
        });

        // Return module scope graph.
        return lModuleScopeGraph;
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
    literalExpression: Graph<PgslToken, object, PgslLiteralValueExpressionSyntaxTree>;
    stringExpression: Graph<PgslToken, object, PgslStringValueExpressionSyntaxTree>;
};

type PgslParserStatementGraphs = {
    statement: Graph<PgslToken, object, BasePgslStatementSyntaxTree>;
    blockStatement: Graph<PgslToken, object, PgslBlockStatementSyntaxTree>;
};

type PgslParserDeclarationGraphs = {
    variableDeclaration: Graph<PgslToken, object, PgslVariableDeclarationSyntaxTree>;
    aliasDeclaration: Graph<PgslToken, object, PgslAliasDeclarationSyntaxTree>;
    enumDeclaration: Graph<PgslToken, object, PgslEnumDeclarationSyntaxTree>;
    structDeclaration: Graph<PgslToken, object, PgslStructDeclarationSyntaxTree>;
    functionDeclaration: Graph<PgslToken, object, PgslFunctionDeclarationSyntaxTree>;
};