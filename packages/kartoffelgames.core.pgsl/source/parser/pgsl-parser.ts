import { Exception } from '@kartoffelgames/core';
import { CodeParser, Graph, GraphNode, type LexerToken } from '@kartoffelgames/core-parser';
import type { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../syntax_tree/base-pgsl-syntax-tree.ts';
import { PgslAccessModeEnumDeclaration } from "../syntax_tree/buildin/pgsl-access-mode-enum-declaration.ts";
import type { PgslDeclaration } from '../syntax_tree/declaration/pgsl-declaration.ts';
import { PgslAliasDeclaration } from '../syntax_tree/declaration/pgsl-alias-declaration.ts';
import { PgslEnumDeclaration } from '../syntax_tree/declaration/pgsl-enum-declaration.ts';
import { PgslFunctionDeclaration } from '../syntax_tree/declaration/pgsl-function-declaration.ts';
import { PgslStructDeclaration } from '../syntax_tree/declaration/pgsl-struct-declaration.ts';
import { PgslStructPropertyDeclaration } from '../syntax_tree/declaration/pgsl-struct-property-declaration.ts';
import { PgslVariableDeclaration } from '../syntax_tree/declaration/pgsl-variable-declaration.ts';
import type { BasePgslExpression } from '../syntax_tree/expression/base-pgsl-expression.ts';
import { PgslArithmeticExpression } from '../syntax_tree/expression/operation/pgsl-arithmetic-expression.ts';
import { PgslBinaryExpression } from '../syntax_tree/expression/operation/pgsl-binary-expression.ts';
import { PgslComparisonExpression } from '../syntax_tree/expression/operation/pgsl-comparison-expression.ts';
import { PgslLogicalExpression } from '../syntax_tree/expression/operation/pgsl-logical-expression.ts';
import { PgslAddressOfExpression } from '../syntax_tree/expression/single_value/pgsl-address-of-expression.ts';
import { PgslFunctionCallExpression } from '../syntax_tree/expression/single_value/pgsl-function-call-expression.ts';
import { PgslLiteralValueExpression } from '../syntax_tree/expression/single_value/pgsl-literal-value-expression.ts';
import { PgslNewCallExpression } from '../syntax_tree/expression/single_value/pgsl-new-expression.ts';
import { PgslParenthesizedExpression } from '../syntax_tree/expression/single_value/pgsl-parenthesized-expression.ts';
import { PgslStringValueExpression } from '../syntax_tree/expression/single_value/pgsl-string-value-expression.ts';
import { PgslIndexedValueExpression } from '../syntax_tree/expression/storage/pgsl-indexed-value-expression.ts';
import { PgslPointerExpression } from '../syntax_tree/expression/storage/pgsl-pointer-expression.ts';
import { PgslValueDecompositionExpression } from '../syntax_tree/expression/storage/pgsl-value-decomposition-expression.ts';
import { PgslVariableNameExpression } from '../syntax_tree/expression/storage/pgsl-variable-name-expression.ts';
import { PgslUnaryExpression } from '../syntax_tree/expression/unary/pgsl-unary-expression.ts';
import { PgslAttributeList } from '../syntax_tree/general/pgsl-attribute-list.ts';

import { PgslDocument } from '../syntax_tree/pgsl-document.ts';
import type { BasePgslStatement } from '../syntax_tree/statement/base-pgsl-statement.ts';
import { PgslDoWhileStatement } from '../syntax_tree/statement/branch/pgsl-do-while-statement.ts';
import { PgslForStatement } from '../syntax_tree/statement/branch/pgsl-for-statement.ts';
import { PgslIfStatement } from '../syntax_tree/statement/branch/pgsl-if-statement.ts';
import { PgslSwitchStatement, type PgslSwitchStatementSwitchCase } from '../syntax_tree/statement/branch/pgsl-switch-statement.ts';
import { PgslWhileStatement } from '../syntax_tree/statement/branch/pgsl-while-statement.ts';
import { PgslAssignmentStatement } from '../syntax_tree/statement/pgsl-assignment-statement.ts';
import { PgslBlockStatement } from '../syntax_tree/statement/pgsl-block-statement.ts';
import { PgslFunctionCallStatement } from '../syntax_tree/statement/pgsl-function-call-statement.ts';
import { PgslIncrementDecrementStatement } from '../syntax_tree/statement/pgsl-increment-decrement-statement.ts';
import { PgslReturnStatement } from '../syntax_tree/statement/pgsl-return-statement.ts';
import { PgslVariableDeclarationStatement } from '../syntax_tree/statement/pgsl-variable-declaration-statement.ts';
import { PgslBreakStatement } from '../syntax_tree/statement/single/pgsl-break-statement.ts';
import { PgslContinueStatement } from '../syntax_tree/statement/single/pgsl-continue-statement.ts';
import { PgslDiscardStatement } from '../syntax_tree/statement/single/pgsl-discard-statement.ts';
import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslLexer } from '../lexer/pgsl-lexer.ts';
import { PgslToken } from '../lexer/pgsl-token.enum.ts';
import { PgslTypeDefinition } from "../syntax_tree/general/pgsl-type-definition.ts";


export class PgslParser extends CodeParser<PgslToken, PgslDocument> {
    /**
     * Constructor.
     */
    public constructor() {
        super(new PgslLexer());

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
    public override parse(pCodeText: string): PgslDocument {
        // TODO: On second layer only not the parser.
        // Insert imports. #IMPORT
        // Fill in buffers with imported declarations.
        // Setup #IFDEF. Fill Replaced '#IFDEFs, #ENDIFDEF with same amount of spaces and newlines.
        // Remove any other # statements as they do nothing. Replace with same amount of spaces and newlines.

        // TODO: How to generate a sourcemap. https://sourcemaps.info/spec.html

        // TODO: Replace comments with same amount of spaces ans newlines.

        // Define buildin enums.
        const lBuildInEnumList: Array<PgslEnumDeclaration> = [
            new PgslAccessModeEnumDeclaration()
        ];

        // Parse document structure.
        // We know the internal parse returns a document, so we cast it, even if TS said no :(
        const lDocument: PgslDocument = super.parse(pCodeText) as PgslDocument; // TODO: Should be changed to to PgslBuildResult or some other named shit.

        // Create new empty trace.
        const lTrace: PgslTrace = new PgslTrace();

        // Append buildin enums to document.
        for (const lEnum of lBuildInEnumList) {
            lDocument.addBuildInContent(lEnum);
        }

        // Trace document structure.
        lDocument.trace(lTrace);

        // TODO: Build PgslBuildResult

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
        const lAttributeListGraph: Graph<PgslToken, object, { list: Array<ConstructorParameters<typeof PgslAttributeList>[1][number]>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', lAttributeItemGraph)
                .optional('list<-list', lAttributeListGraph); // Self reference
        });

        /**
         * Attribute list.
         * Converts the internal attribute list into a {@link PgslAttributeList}
         */
        const lAttributeListSyntaxTreeGraph = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .optional('list<-list', lAttributeListGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAttributeList => {
            // Create attribute list syntax tree.
            return new PgslAttributeList(this.createTokenBoundParameter(pStartToken, pEndToken), pData.list ?? []);
        });

        /**
         * Template list for a type declaration seperated by comma.
         * ```
         * - "<EXPRESSION|TYPE_DECLARATION>"
         * - "<EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>"
         * - "<EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>"
         * ```
         */
        const lTypeDeclarationTemplateListGraph: Graph<PgslToken, object, { list: Array<BasePgslSyntaxTree>; }> = Graph.define(() => {
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
        const lTypeDeclarationSyntaxTreeGraph: Graph<PgslToken, object, PgslTypeDefinition> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .optional('pointer', PgslToken.OperatorMultiply)
                .required('name', PgslToken.Identifier)
                .optional('templateList<-list', GraphNode.new<PgslToken>()
                    .required(PgslToken.TemplateListStart)
                    .required('list<-list', lTypeDeclarationTemplateListGraph)
                    .required(PgslToken.TemplateListEnd)
                );
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslTypeDefinition => {
            // Define root structure of type definition syntax tree structure data and apply type name.
            const lTemplateList: Array<BasePgslSyntaxTree> = pData.templateList ?? [];

            // Create type definition syntax tree.
            return new PgslTypeDefinition(pData.name, lTemplateList, !!pData.pointer, this.createTokenBoundParameter(pStartToken, pEndToken));
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
        const lLogicalExpressionGraph: Graph<PgslToken, object, PgslLogicalExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('leftExpression', lExpressionSyntaxTreeGraph)
                .required('operation', [
                    PgslToken.OperatorShortCircuitOr,
                    PgslToken.OperatorShortCircuitAnd
                ])
                .required('rightExpression', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslLogicalExpression => {
            return new PgslLogicalExpression(pData.leftExpression, pData.operation, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
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
        const lArithmeticExpressionGraph: Graph<PgslToken, object, PgslArithmeticExpression> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslArithmeticExpression => {
            return new PgslArithmeticExpression(pData.leftExpression, pData.operation, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
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
        const lComparisonExpressionGraph: Graph<PgslToken, object, PgslComparisonExpression> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslComparisonExpression => {
            return new PgslComparisonExpression(pData.leftExpression, pData.comparison, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
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
        const lBitOperationExpressionGraph: Graph<PgslToken, object, PgslBinaryExpression> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslBinaryExpression => {
            return new PgslBinaryExpression(pData.leftExpression, pData.operation, pData.rightExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Unary expression. Prefixed modifier for a single expression.
         * ```
         * - "~<EXPRESSION>"
         * - "-<EXPRESSION>"
         * - "!<EXPRESSION>"
         * ```
         */
        const lUnaryExpressionGraph: Graph<PgslToken, object, PgslUnaryExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('prefix', [
                    PgslToken.OperatorBinaryNegate,
                    PgslToken.OperatorMinus,
                    PgslToken.OperatorNot
                ])
                .required('expression', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslUnaryExpression => {
            return new PgslUnaryExpression(pData.expression, pData.prefix, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Variable name expression. Just an identifier.
         * ```
         * - "<IDENTIFIER>"
         * ```
         */
        const lVariableNameExpressionGraph: Graph<PgslToken, object, PgslVariableNameExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslVariableNameExpression => {
            return new PgslVariableNameExpression(pData.name, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Indexed value expression. An expressions value accessed through another expression.
         * ```
         * - "<EXPRESSION>[<EXPRESSION>]"
         * ```
         */
        const lIndexedValueExpressionGraph: Graph<PgslToken, object, PgslIndexedValueExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('value', lExpressionSyntaxTreeGraph)
                .required(PgslToken.ListStart)
                .required('indexExpression', lExpressionSyntaxTreeGraph)
                .required(PgslToken.ListEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslIndexedValueExpression => {
            return new PgslIndexedValueExpression(pData.value, pData.indexExpression, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Value decomposition expression. An expressions value accessed through an identifier.
         * Can be eighter a value decomposition or a enum decomposition.
         * ```
         * - "<EXPRESSION>.<IDENTIFIER>"
         * ```
         */
        const lValueDecompositionExpressionGraph: Graph<PgslToken, object, PgslValueDecompositionExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('leftExpression', lExpressionSyntaxTreeGraph)
                .required(PgslToken.MemberDelimiter)
                .required('propertyName', PgslToken.Identifier);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslValueDecompositionExpression => {
            return new PgslValueDecompositionExpression(pData.leftExpression, pData.propertyName, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Parenthesized expression. An expressions value wrapped with parentheses.
         * ```
         * - "(<EXPRESSION>)"
         * ```
         */
        const lParenthesizedExpressionGraph: Graph<PgslToken, object, PgslParenthesizedExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.ParenthesesStart)
                .required('expression', lExpressionSyntaxTreeGraph)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslParenthesizedExpression => {
            return new PgslParenthesizedExpression(pData.expression, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Literal number or boolean expression.
         * ```
         * - "<LITERAL_NUMBER>"
         * - "<LITERAL_BOOLEAN>"
         * ```
         */
        const lLiteralValueExpressionGraph: Graph<PgslToken, object, PgslLiteralValueExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('value', [
                    PgslToken.LiteralFloat,
                    PgslToken.LiteralInteger,
                    PgslToken.LiteralBoolean
                ]);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslLiteralValueExpression => {
            return new PgslLiteralValueExpression(pData.value, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Literal string expression.
         * ```
         * - "<LITERAL_STRING>"
         * ```
         */
        const lStringValueExpressionGraph: Graph<PgslToken, object, PgslStringValueExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('string', PgslToken.LiteralString);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslStringValueExpression => {
            return new PgslStringValueExpression(pData.string, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * AddressOf expression. Expression prefixed with a ampersand.
         * ```
         * - "&<EXPRESSION>"
         * ```
         */
        const lAddressOfExpressionGraph: Graph<PgslToken, object, PgslAddressOfExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.OperatorBinaryAnd)
                .required('variable', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAddressOfExpression => {
            return new PgslAddressOfExpression(pData.variable, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Pointer expression. Expression prefixed with a star.
         * ```
         * - "*<EXPRESSION>"
         * ```
         */
        const lPointerExpressionGraph: Graph<PgslToken, object, PgslPointerExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.OperatorMultiply)
                .required('variable', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslPointerExpression => {
            return new PgslPointerExpression(pData.variable, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /** 
         * Recursive list of expressions seperated with comma.
         * ```
         * - "<EXPRESSION>"
         * - "<EXPRESSION>, <EXPRESSION>"
         * - "<EXPRESSION>, <EXPRESSION>, <EXPRESSION>"
         * ```
         */
        const lExpressionListGraph: Graph<PgslToken, object, { list: Array<BasePgslExpression>; }> = Graph.define(() => {
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
        const lFunctionCallExpressionGraph: Graph<PgslToken, object, PgslFunctionCallExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier)
                .required(PgslToken.ParenthesesStart)
                .optional('parameters<-list', lExpressionListGraph)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslFunctionCallExpression => {
            // Create function call expression syntax tree.
            return new PgslFunctionCallExpression(pData.name, pData.parameters ?? [], this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * New expression. Create instance of a type declaration with a list of Expression.
         * ```
         * - "new <TYPE_DECLARATION>()"
         * - "new <TYPE_DECLARATION>(<EXPRESSION_LIST>)"
         * ```
         */
        const lNewExpressionGraph: Graph<PgslToken, object, PgslNewCallExpression> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordNew)
                .required('type', pCoreGraphs.typeDeclaration)
                .required(PgslToken.ParenthesesStart)
                .optional('parameters<-list', lExpressionListGraph)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslNewCallExpression => {
            // Create function call expression syntax tree.
            return new PgslNewCallExpression(pData.type, pData.parameters ?? [], this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Expression graph. 
         * Bundles the different expressions into a single graph.
         */
        const lExpressionSyntaxTreeGraph: Graph<PgslToken, object, BasePgslExpression> = Graph.define(() => {
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
        }).converter((pData): BasePgslExpression => {
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
        const lIfStatementGraph: Graph<PgslToken, object, PgslIfStatement> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslIfStatement => {
            // Create data.
            const lData: ConstructorParameters<typeof PgslIfStatement>[0] = {
                expression: pData.expression,
                block: pData.block,
                else: pData.elseBlock ?? null
            };

            // Create if statement syntax tree.
            return new PgslIfStatement(lData, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * List of statements graph.
         * ```
         * - "<STATEMENT>"
         * - "<STATEMENT><STATEMENT>"
         * - "<STATEMENT><STATEMENT><STATEMENT>"
         * ```
         */
        const lStatementListGraph: Graph<PgslToken, object, { list: Array<BasePgslStatement>; }> = Graph.define(() => {
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
        const lBlockStatementGraph: Graph<PgslToken, object, PgslBlockStatement> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.BlockStart)
                .optional('statements<-list', lStatementListGraph)
                .required(PgslToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslBlockStatement => {
            return new PgslBlockStatement(pData.statements ?? [], this.createTokenBoundParameter(pStartToken, pEndToken));
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
        const lSwitchStatementGraph: Graph<PgslToken, object, PgslSwitchStatement> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslSwitchStatement => {
            // Build switch data structure.
            return new PgslSwitchStatement(this.createTokenBoundParameter(pStartToken, pEndToken), {
                expression: pData.expression,
                cases: pData.cases ?? [],
                default: pData.defaultBlock ?? null
            });
        });

        /**
         * While statement graph. A while loop with condition and block.
         * ```
         * - "while(<EXPRESSION>)<BLOCK>"
         * ```
         */
        const lWhileStatementGraph: Graph<PgslToken, object, PgslWhileStatement> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordWhile)
                .required(PgslToken.ParenthesesStart)
                .required('expression', pExpressionGraphs.expression)
                .required(PgslToken.ParenthesesEnd)
                .required('block', lBlockStatementGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslWhileStatement => {
            return new PgslWhileStatement(pData.expression, pData.block, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Do-while statement graph. A do-while loop with block and condition.
         * ```
         * - "do <BLOCK> while(<EXPRESSION>)"
         * ```
         */
        const lDoWhileStatementGraph: Graph<PgslToken, object, PgslDoWhileStatement> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordDo)
                .required('block', lBlockStatementGraph)
                .required(PgslToken.KeywordWhile)
                .required(PgslToken.ParenthesesStart)
                .required('expression', pExpressionGraphs.expression)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslDoWhileStatement => {
            return new PgslDoWhileStatement(pData.expression, pData.block, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Break statement graph. Break statement.
         * ```
         * - "break"
         * ```
         */
        const lBreakStatementGraph: Graph<PgslToken, object, PgslBreakStatement> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordBreak);
        }).converter((_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslBreakStatement => {
            return new PgslBreakStatement(this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Continue statement graph. Continue statement.
         * ```
         * - "continue"
         * ```
         */
        const lContinueStatementGraph: Graph<PgslToken, object, PgslContinueStatement> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordContinue);
        }).converter((_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslContinueStatement => {
            return new PgslContinueStatement(this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Return statement graph. Return statement with optional expression.
         * ```
         * - "return"
         * - "return <EXPRESSION>"
         * ```
         */
        const lReturnStatementGraph: Graph<PgslToken, object, PgslReturnStatement> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordReturn)
                .optional('expression', pExpressionGraphs.expression);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslReturnStatement => {
            return new PgslReturnStatement(pData.expression ?? null, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Discard statement graph. Discard statement.
         * ```
         * - "discard"
         * ```
         */
        const lDiscardStatementGraph: Graph<PgslToken, object, PgslDiscardStatement> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordDiscard);
        }).converter((_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslDiscardStatement => {
            return new PgslDiscardStatement(this.createTokenBoundParameter(pStartToken, pEndToken));
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
        const lVariableDeclarationStatementGraph: Graph<PgslToken, object, PgslVariableDeclarationStatement> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslVariableDeclarationStatement => {
            // Build variable declaration data structure.
            const lData: ConstructorParameters<typeof PgslVariableDeclarationStatement>[0] = {
                declarationType: pData.declarationType,
                name: pData.variableName,
                type: pData.type,
                expression: pData.initialExpression ?? null
            };

            return new PgslVariableDeclarationStatement(lData, this.createTokenBoundParameter(pStartToken, pEndToken));
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
        const lForStatementGraph: Graph<PgslToken, object, PgslForStatement> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslForStatement => {
            // Build for statement data structure.
            const lData: ConstructorParameters<typeof PgslForStatement>[0] = {
                block: pData.block,
                init: pData.init ?? null,
                expression: pData.expression ?? null,
                update: pData.update ?? null
            };

            return new PgslForStatement(lData, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Assignment statement graph. Assignment of a value to a variable.
         * ```
         * - "<EXPRESSION> = <EXPRESSION>"
         * - "<EXPRESSION> += <EXPRESSION>"
         * - "<EXPRESSION> -= <EXPRESSION>"
         * ```
         */
        const lAssignmentStatementGraph: Graph<PgslToken, object, PgslAssignmentStatement> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAssignmentStatement => {
            return new PgslAssignmentStatement(this.createTokenBoundParameter(pStartToken, pEndToken), {
                expression: pData.expression,
                assignment: pData.assignment,
                variable: pData.variable
            });
        });

        /**
         * Increment/Decrement statement graph. Post-increment or post-decrement operation.
         * ```
         * - "<EXPRESSION>++"
         * - "<EXPRESSION>--"
         * ```
         */
        const lIncrementDecrementStatementGraph: Graph<PgslToken, object, PgslIncrementDecrementStatement> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('expression', pExpressionGraphs.expression)
                .required('operator', [
                    PgslToken.OperatorIncrement,
                    PgslToken.OperatorDecrement
                ]);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslIncrementDecrementStatement => {
            return new PgslIncrementDecrementStatement(pData.operator, pData.expression, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Function call statement graph. Function call as a statement.
         * ```
         * - "<IDENTIFIER>()"
         * - "<IDENTIFIER>(<EXPRESSION_LIST>)"
         * ```
         */
        const lFunctionCallStatementGraph: Graph<PgslToken, object, PgslFunctionCallStatement> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier)
                .required(PgslToken.ParenthesesStart)
                .optional('parameters<-list', pExpressionGraphs.expressionList)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslFunctionCallStatement => {
            return new PgslFunctionCallStatement(this.createTokenBoundParameter(pStartToken, pEndToken), pData.name, pData.parameters ?? []);
        });

        /**
         * Statement graph. 
         * Bundles the different statements into a single graph.
         */
        const lStatementSyntaxTreeGraph: Graph<PgslToken, object, BasePgslStatement> = Graph.define(() => {
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
        }).converter((pData): BasePgslStatement => {
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
        const lVariableDeclarationGraph: Graph<PgslToken, object, PgslVariableDeclaration> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslVariableDeclaration => {
            // Build data structure.
            const lData: ConstructorParameters<typeof PgslVariableDeclaration>[0] = {
                name: pData.variableName,
                type: pData.type,
                declarationType: pData.declarationType
            };

            // Optional expression
            if (typeof pData.initialization !== 'string') {
                lData.expression = pData.initialization.expression;
            }

            return new PgslVariableDeclaration(lData, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Alias declaration graph. Type alias declaration.
         * ```
         * - "<ATTRIBUTE_LIST> alias <IDENTIFIER> = <TYPE>;"
         * ```
         */
        const lAliasDeclarationGraph: Graph<PgslToken, object, PgslAliasDeclaration> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required(PgslToken.KeywordAlias)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.Assignment)
                .required('type', pCoreGraphs.typeDeclaration)
                .required(PgslToken.Semicolon);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslAliasDeclaration => {
            return new PgslAliasDeclaration(pData.name, pData.type, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * Struct property declaration graph. Single property within a struct.
         * ```
         * - "[<ATTRIBUTES>] <IDENTIFIER>: <TYPE>"
         * ```
         */
        const lStructPropertyDeclarationGraph: Graph<PgslToken, object, PgslStructPropertyDeclaration> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.Colon)
                .required('type', pCoreGraphs.typeDeclaration);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslStructPropertyDeclaration => {
            // Create structure.
            return new PgslStructPropertyDeclaration(pData.name, pData.type, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
        });

        /**
         * List of struct properties separated by comma.
         */
        const lStructPropertyListGraph: Graph<PgslToken, object, { list: Array<PgslStructPropertyDeclaration>; }> = Graph.define(() => {
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
        const lStructDeclarationGraph: Graph<PgslToken, object, PgslStructDeclaration> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required(PgslToken.KeywordStruct)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.BlockStart)
                .optional('properties<-list', lStructPropertyListGraph)
                .required(PgslToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslStructDeclaration => {
            return new PgslStructDeclaration(pData.name, pData.properties ?? [], pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
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
        const lEnumValueListGraph: Graph<PgslToken, object, { list: Array<{ name: string; value: PgslLiteralValueExpression | PgslStringValueExpression; }>; }> = Graph.define(() => {
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
        const lEnumDeclarationGraph: Graph<PgslToken, object, PgslEnumDeclaration> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required(PgslToken.KeywordEnum)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.BlockStart)
                .optional('values<-list', lEnumValueListGraph)
                .required(PgslToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslEnumDeclaration => {
            // Process enum values - filter to only literal/string values
            const lEnumValueList = new Array<{ name: string, value: PgslLiteralValueExpression | PgslStringValueExpression; }>();
            if (pData.values) {
                for (const lValue of pData.values) {
                    if (lValue.value instanceof PgslLiteralValueExpression || lValue.value instanceof PgslStringValueExpression) {
                        lEnumValueList.push({ name: lValue.name, value: lValue.value });
                    }
                }
            }

            return new PgslEnumDeclaration(pData.name, lEnumValueList, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
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
        const lFunctionParameterListGraph: Graph<PgslToken, object, { list: Array<{ name: string; type: PgslTypeDefinition; }>; }> = Graph.define(() => {
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
        const lFunctionDeclarationGraph: Graph<PgslToken, object, PgslFunctionDeclaration> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslFunctionDeclaration => {
            // Create base data.
            const lData: ConstructorParameters<typeof PgslFunctionDeclaration>[0] = {
                name: pData.name,
                parameter: pData.parameters ?? [],
                returnType: pData.returnType,
                block: pData.block,
                constant: false
            };

            return new PgslFunctionDeclaration(lData, pData.attributes, this.createTokenBoundParameter(pStartToken, pEndToken));
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
    private defineModuleScopeGraph(pDeclarationGraphs: PgslParserDeclarationGraphs): Graph<PgslToken, object, PgslDocument> {
        /**
         * List of declaration graphs.
         */
        const lModuleScopeDeclarationListGraph: Graph<PgslToken, object, { list: Array<BasePgslSyntaxTree>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', [
                    pDeclarationGraphs.aliasDeclaration,
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PgslDocument => {
            return new PgslDocument(this.createTokenBoundParameter(pStartToken, pEndToken), pData.list ?? []);
        });

        // Return module scope graph.
        return lModuleScopeGraph;
    }
}

type PgslParserCoreGraphs = {
    attributeList: Graph<PgslToken, object, PgslAttributeList>;
    typeDeclaration: Graph<PgslToken, object, PgslTypeDefinition>;
};

type PgslParserExpressionGraphs = {
    expression: Graph<PgslToken, object, BasePgslExpression>;
    expressionList: Graph<PgslToken, object, {
        list: Array<BasePgslExpression>;
    }>;
    literalExpression: Graph<PgslToken, object, PgslLiteralValueExpression>;
    stringExpression: Graph<PgslToken, object, PgslStringValueExpression>;
};

type PgslParserStatementGraphs = {
    statement: Graph<PgslToken, object, BasePgslStatement>;
    blockStatement: Graph<PgslToken, object, PgslBlockStatement>;
};

type PgslParserDeclarationGraphs = {
    variableDeclaration: Graph<PgslToken, object, PgslVariableDeclaration>;
    aliasDeclaration: Graph<PgslToken, object, PgslAliasDeclaration>;
    enumDeclaration: Graph<PgslToken, object, PgslEnumDeclaration>;
    structDeclaration: Graph<PgslToken, object, PgslStructDeclaration>;
    functionDeclaration: Graph<PgslToken, object, PgslFunctionDeclaration>;
};