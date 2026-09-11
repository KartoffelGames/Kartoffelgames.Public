import { CodeParser, Graph, GraphNode, type LexerToken } from '../../source/index.ts';
import { BenchmarkLexer } from './benchmark-lexer.ts';
import type {
    BenchmarkAliasDeclarationNode, BenchmarkAssignmentStatementNode, BenchmarkAttributeNode, BenchmarkBinaryExpressionNode,
    BenchmarkBlockStatementNode, BenchmarkBreakStatementNode, BenchmarkCallExpressionNode, BenchmarkCallStatementNode,
    BenchmarkCommentNode, BenchmarkConstantDeclarationNode, BenchmarkContinueStatementNode, BenchmarkDeclarationNode,
    BenchmarkDocumentNode, BenchmarkEnumDeclarationNode, BenchmarkEnumValueNode, BenchmarkExpressionNode,
    BenchmarkForStatementNode, BenchmarkFunctionDeclarationNode, BenchmarkFunctionParameterNode, BenchmarkIfStatementNode,
    BenchmarkImportDeclarationNode, BenchmarkIncrementStatementNode, BenchmarkIndexExpressionNode,
    BenchmarkLiteralExpressionNode, BenchmarkMemberExpressionNode, BenchmarkModuleDeclarationNode,
    BenchmarkNewExpressionNode, BenchmarkParenthesizedExpressionNode, BenchmarkRange, BenchmarkRecordDeclarationNode,
    BenchmarkRecordPropertyNode, BenchmarkReturnStatementNode, BenchmarkStatementNode, BenchmarkTernaryExpressionNode,
    BenchmarkTypeNode, BenchmarkUnaryExpressionNode, BenchmarkVariableExpressionNode, BenchmarkVariableStatementNode,
    BenchmarkWhileStatementNode
} from './benchmark-syntax-tree.type.ts';
import { BenchmarkToken } from './benchmark-token.enum.ts';

/**
 * Parser of the artificial benchmark language.
 *
 * The graph set covers the constructs a real grammar is built from: recursive lists, optional
 * chains, wide branches, merge nodes, self referencing graphs, junctions for the recursive
 * expression layer and a data converter on every graph.
 */
export class BenchmarkParser extends CodeParser<BenchmarkToken, BenchmarkDocumentNode> {
    /**
     * Constructor.
     * Builds the complete graph set of the benchmark language.
     */
    public constructor() {
        super(new BenchmarkLexer());

        // Mimic object, so the expression graphs can be defined before the type graph exists.
        const lCoreGraphs: BenchmarkParserCoreGraphs = {
            type: null as any,
            attributeList: null as any
        };

        // Define the graph layers bottom up.
        const lExpressionGraphs: BenchmarkParserExpressionGraphs = this.defineExpressionGraphs(lCoreGraphs);

        // Fill the mimic object with the real core graphs.
        const lLoadedCoreGraphs: BenchmarkParserCoreGraphs = this.defineCoreGraphs(lExpressionGraphs);
        lCoreGraphs.type = lLoadedCoreGraphs.type;
        lCoreGraphs.attributeList = lLoadedCoreGraphs.attributeList;

        const lStatementGraphs: BenchmarkParserStatementGraphs = this.defineStatementGraphs(lLoadedCoreGraphs, lExpressionGraphs);
        const lDeclarationGraphs: BenchmarkParserDeclarationGraphs = this.defineDeclarationGraphs(lLoadedCoreGraphs, lExpressionGraphs, lStatementGraphs);

        // Set the document graph as root.
        this.setRootGraph(this.defineDocumentGraph(lDeclarationGraphs));
    }

    /**
     * Create a source range out of the bounding token of a graph.
     *
     * @param pStartToken - First token of the parsed structure.
     * @param pEndToken - Last token of the parsed structure.
     *
     * @returns Source range of the parsed structure.
     */
    private createRange(pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkRange {
        // No token at all.
        if (!pStartToken) {
            return [0, 0, 0, 0];
        }

        // Only a starting token.
        if (!pEndToken) {
            return [pStartToken.lineNumber, pStartToken.columnNumber, pStartToken.lineNumber, pStartToken.columnNumber];
        }

        // Solid start and end token.
        return [pStartToken.lineNumber, pStartToken.columnNumber, pEndToken.lineNumber, pEndToken.columnNumber];
    }

    /**
     * Define graphs that are used by every other graph layer.
     *
     * @param pExpressionGraphs - Already defined expression graphs.
     *
     * @returns Core graphs of the language.
     */
    private defineCoreGraphs(pExpressionGraphs: BenchmarkParserExpressionGraphs): BenchmarkParserCoreGraphs {
        /**
         * Recursive list of types separated by comma.
         * ```
         * - "<TYPE>"
         * - "<TYPE>, <TYPE>"
         * ```
         */
        const lTypeListGraph: Graph<BenchmarkToken, object, { list: Array<BenchmarkTypeNode>; }> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('list[]', lTypeGraph)
                .optional('list<-list', GraphNode.new<BenchmarkToken>()
                    .required(BenchmarkToken.Comma)
                    .required('list<-list', lTypeListGraph) // Self reference.
                );
        });

        /**
         * Type with an optional generic list.
         * ```
         * - "<IDENTIFIER>"
         * - "<IDENTIFIER><<TYPE_LIST>>"
         * ```
         */
        const lTypeGraph: Graph<BenchmarkToken, object, BenchmarkTypeNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('name', BenchmarkToken.Identifier)
                .optional('generics<-list', GraphNode.new<BenchmarkToken>()
                    .required(BenchmarkToken.GenericStart)
                    .required('list<-list', lTypeListGraph)
                    .required(BenchmarkToken.GenericEnd)
                );
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkTypeNode => {
            return {
                type: 'Type',
                range: this.createRange(pStartToken, pEndToken),
                name: pData.name,
                generics: pData.generics ?? []
            } satisfies BenchmarkTypeNode;
        });

        /**
         * Single attribute with an optional parameter list.
         * ```
         * - "@<IDENTIFIER>()"
         * - "@<IDENTIFIER>(<EXPRESSION_LIST>)"
         * ```
         */
        const lAttributeGraph: Graph<BenchmarkToken, object, BenchmarkAttributeNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.AttributeMarker)
                .required('name', BenchmarkToken.Identifier)
                .required(BenchmarkToken.ParenthesesStart)
                .optional('parameters<-list', pExpressionGraphs.expressionList)
                .required(BenchmarkToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkAttributeNode => {
            return {
                type: 'Attribute',
                range: this.createRange(pStartToken, pEndToken),
                name: pData.name,
                parameters: pData.parameters ?? []
            } satisfies BenchmarkAttributeNode;
        });

        /**
         * Recursive list of attributes without a separator.
         * ```
         * - "<ATTRIBUTE>"
         * - "<ATTRIBUTE><ATTRIBUTE>"
         * ```
         */
        const lAttributeListGraph: Graph<BenchmarkToken, object, { list: Array<BenchmarkAttributeNode>; }> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('list[]', lAttributeGraph)
                .optional('list<-list', lAttributeListGraph); // Self reference.
        });

        return {
            type: lTypeGraph,
            attributeList: lAttributeListGraph
        };
    }

    /**
     * Define every declaration graph of the module scope.
     *
     * @param pCoreGraphs - Core graphs of the language.
     * @param pExpressionGraphs - Expression graphs of the language.
     * @param pStatementGraphs - Statement graphs of the language.
     *
     * @returns Declaration graphs of the language.
     */
    private defineDeclarationGraphs(pCoreGraphs: BenchmarkParserCoreGraphs, pExpressionGraphs: BenchmarkParserExpressionGraphs, pStatementGraphs: BenchmarkParserStatementGraphs): BenchmarkParserDeclarationGraphs {
        /**
         * Module declaration.
         * ```
         * - "module <IDENTIFIER>;"
         * ```
         */
        const lModuleDeclarationGraph: Graph<BenchmarkToken, object, BenchmarkModuleDeclarationNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.KeywordModule)
                .required('name', BenchmarkToken.Identifier)
                .required(BenchmarkToken.Semicolon);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkModuleDeclarationNode => {
            return {
                type: 'ModuleDeclaration',
                range: this.createRange(pStartToken, pEndToken),
                name: pData.name
            } satisfies BenchmarkModuleDeclarationNode;
        });

        /**
         * Import declaration.
         * ```
         * - "import "<PATH>" as <IDENTIFIER>;"
         * ```
         */
        const lImportDeclarationGraph: Graph<BenchmarkToken, object, BenchmarkImportDeclarationNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.KeywordImport)
                .required('path', BenchmarkToken.LiteralString)
                .required(BenchmarkToken.KeywordAs)
                .required('alias', BenchmarkToken.Identifier)
                .required(BenchmarkToken.Semicolon);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkImportDeclarationNode => {
            return {
                type: 'ImportDeclaration',
                range: this.createRange(pStartToken, pEndToken),
                path: pData.path,
                alias: pData.alias
            } satisfies BenchmarkImportDeclarationNode;
        });

        /**
         * Alias declaration.
         * ```
         * - "alias <IDENTIFIER> = <TYPE>;"
         * ```
         */
        const lAliasDeclarationGraph: Graph<BenchmarkToken, object, BenchmarkAliasDeclarationNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.KeywordAlias)
                .required('name', BenchmarkToken.Identifier)
                .required(BenchmarkToken.Assignment)
                .required('aliasType', pCoreGraphs.type)
                .required(BenchmarkToken.Semicolon);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkAliasDeclarationNode => {
            return {
                type: 'AliasDeclaration',
                range: this.createRange(pStartToken, pEndToken),
                name: pData.name,
                aliasType: pData.aliasType
            } satisfies BenchmarkAliasDeclarationNode;
        });

        /**
         * Single enum value.
         * ```
         * - "<IDENTIFIER> = <EXPRESSION>"
         * ```
         */
        const lEnumValueGraph: Graph<BenchmarkToken, object, BenchmarkEnumValueNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('name', BenchmarkToken.Identifier)
                .required(BenchmarkToken.Assignment)
                .required('value', pExpressionGraphs.expression);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkEnumValueNode => {
            return {
                type: 'EnumValue',
                range: this.createRange(pStartToken, pEndToken),
                name: pData.name,
                value: pData.value
            } satisfies BenchmarkEnumValueNode;
        });

        /**
         * Recursive list of enum values separated by comma.
         */
        const lEnumValueListGraph: Graph<BenchmarkToken, object, { list: Array<BenchmarkEnumValueNode>; }> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('list[]', lEnumValueGraph)
                .optional('list<-list', GraphNode.new<BenchmarkToken>()
                    .required(BenchmarkToken.Comma)
                    .required('list<-list', lEnumValueListGraph) // Self reference.
                );
        });

        /**
         * Enum declaration.
         * ```
         * - "enum <IDENTIFIER> { <ENUM_VALUE_LIST> }"
         * ```
         */
        const lEnumDeclarationGraph: Graph<BenchmarkToken, object, BenchmarkEnumDeclarationNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.KeywordEnum)
                .required('name', BenchmarkToken.Identifier)
                .required(BenchmarkToken.BlockStart)
                .optional('values<-list', lEnumValueListGraph)
                .required(BenchmarkToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkEnumDeclarationNode => {
            return {
                type: 'EnumDeclaration',
                range: this.createRange(pStartToken, pEndToken),
                name: pData.name,
                values: pData.values ?? []
            } satisfies BenchmarkEnumDeclarationNode;
        });

        /**
         * Single record property with optional attributes.
         * ```
         * - "<IDENTIFIER>: <TYPE>"
         * - "<ATTRIBUTE_LIST><IDENTIFIER>: <TYPE>"
         * ```
         */
        const lRecordPropertyGraph: Graph<BenchmarkToken, object, BenchmarkRecordPropertyNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .optional('attributes<-list', pCoreGraphs.attributeList)
                .required('name', BenchmarkToken.Identifier)
                .required(BenchmarkToken.Colon)
                .required('propertyType', pCoreGraphs.type);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkRecordPropertyNode => {
            return {
                type: 'RecordProperty',
                range: this.createRange(pStartToken, pEndToken),
                attributes: pData.attributes ?? [],
                name: pData.name,
                propertyType: pData.propertyType
            } satisfies BenchmarkRecordPropertyNode;
        });

        /**
         * Recursive list of record properties separated by comma.
         */
        const lRecordPropertyListGraph: Graph<BenchmarkToken, object, { list: Array<BenchmarkRecordPropertyNode>; }> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('list[]', lRecordPropertyGraph)
                .optional('list<-list', GraphNode.new<BenchmarkToken>()
                    .required(BenchmarkToken.Comma)
                    .required('list<-list', lRecordPropertyListGraph) // Self reference.
                );
        });

        /**
         * Record declaration.
         * ```
         * - "record <IDENTIFIER> { <RECORD_PROPERTY_LIST> }"
         * ```
         */
        const lRecordDeclarationGraph: Graph<BenchmarkToken, object, BenchmarkRecordDeclarationNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .optional('attributes<-list', pCoreGraphs.attributeList)
                .required(BenchmarkToken.KeywordRecord)
                .required('name', BenchmarkToken.Identifier)
                .required(BenchmarkToken.BlockStart)
                .optional('properties<-list', lRecordPropertyListGraph)
                .required(BenchmarkToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkRecordDeclarationNode => {
            return {
                type: 'RecordDeclaration',
                range: this.createRange(pStartToken, pEndToken),
                attributes: pData.attributes ?? [],
                name: pData.name,
                properties: pData.properties ?? []
            } satisfies BenchmarkRecordDeclarationNode;
        });

        /**
         * Module scope constant declaration.
         * ```
         * - "const <IDENTIFIER>: <TYPE> = <EXPRESSION>;"
         * ```
         */
        const lConstantDeclarationGraph: Graph<BenchmarkToken, object, BenchmarkConstantDeclarationNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .optional('attributes<-list', pCoreGraphs.attributeList)
                .required(BenchmarkToken.KeywordConst)
                .required('name', BenchmarkToken.Identifier)
                .required(BenchmarkToken.Colon)
                .required('constantType', pCoreGraphs.type)
                .required(BenchmarkToken.Assignment)
                .required('expression', pExpressionGraphs.expression)
                .required(BenchmarkToken.Semicolon);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkConstantDeclarationNode => {
            return {
                type: 'ConstantDeclaration',
                range: this.createRange(pStartToken, pEndToken),
                attributes: pData.attributes ?? [],
                name: pData.name,
                constantType: pData.constantType,
                expression: pData.expression
            } satisfies BenchmarkConstantDeclarationNode;
        });

        /**
         * Single function parameter.
         * ```
         * - "<IDENTIFIER>: <TYPE>"
         * ```
         */
        const lFunctionParameterGraph: Graph<BenchmarkToken, object, BenchmarkFunctionParameterNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('name', BenchmarkToken.Identifier)
                .required(BenchmarkToken.Colon)
                .required('parameterType', pCoreGraphs.type);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkFunctionParameterNode => {
            return {
                type: 'FunctionParameter',
                range: this.createRange(pStartToken, pEndToken),
                name: pData.name,
                parameterType: pData.parameterType
            } satisfies BenchmarkFunctionParameterNode;
        });

        /**
         * Recursive list of function parameters separated by comma.
         */
        const lFunctionParameterListGraph: Graph<BenchmarkToken, object, { list: Array<BenchmarkFunctionParameterNode>; }> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('list[]', lFunctionParameterGraph)
                .optional('list<-list', GraphNode.new<BenchmarkToken>()
                    .required(BenchmarkToken.Comma)
                    .required('list<-list', lFunctionParameterListGraph) // Self reference.
                );
        });

        /**
         * Function declaration.
         * ```
         * - "function <IDENTIFIER>(<PARAMETER_LIST>): <TYPE> <BLOCK>"
         * ```
         */
        const lFunctionDeclarationGraph: Graph<BenchmarkToken, object, BenchmarkFunctionDeclarationNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .optional('attributes<-list', pCoreGraphs.attributeList)
                .required(BenchmarkToken.KeywordFunction)
                .required('name', BenchmarkToken.Identifier)
                .required(BenchmarkToken.ParenthesesStart)
                .optional('parameters<-list', lFunctionParameterListGraph)
                .required(BenchmarkToken.ParenthesesEnd)
                .required(BenchmarkToken.Colon)
                .required('returnType', pCoreGraphs.type)
                .required('block', pStatementGraphs.block);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkFunctionDeclarationNode => {
            return {
                type: 'FunctionDeclaration',
                range: this.createRange(pStartToken, pEndToken),
                attributes: pData.attributes ?? [],
                name: pData.name,
                parameters: pData.parameters ?? [],
                returnType: pData.returnType,
                block: pData.block
            } satisfies BenchmarkFunctionDeclarationNode;
        });

        return {
            moduleDeclaration: lModuleDeclarationGraph,
            importDeclaration: lImportDeclarationGraph,
            aliasDeclaration: lAliasDeclarationGraph,
            enumDeclaration: lEnumDeclarationGraph,
            recordDeclaration: lRecordDeclarationGraph,
            constantDeclaration: lConstantDeclarationGraph,
            functionDeclaration: lFunctionDeclarationGraph,
            comment: pStatementGraphs.comment
        };
    }

    /**
     * Define the root graph of the language.
     *
     * @param pDeclarationGraphs - Declaration graphs of the language.
     *
     * @returns Document graph of the language.
     */
    private defineDocumentGraph(pDeclarationGraphs: BenchmarkParserDeclarationGraphs): Graph<BenchmarkToken, object, BenchmarkDocumentNode> {
        /**
         * Recursive list of module scope declarations.
         */
        const lDeclarationListGraph: Graph<BenchmarkToken, object, { list: Array<BenchmarkDeclarationNode>; }> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('list[]', [
                    pDeclarationGraphs.comment as Graph<BenchmarkToken, object, BenchmarkDeclarationNode>,
                    pDeclarationGraphs.moduleDeclaration as Graph<BenchmarkToken, object, BenchmarkDeclarationNode>,
                    pDeclarationGraphs.importDeclaration as Graph<BenchmarkToken, object, BenchmarkDeclarationNode>,
                    pDeclarationGraphs.aliasDeclaration as Graph<BenchmarkToken, object, BenchmarkDeclarationNode>,
                    pDeclarationGraphs.enumDeclaration as Graph<BenchmarkToken, object, BenchmarkDeclarationNode>,
                    pDeclarationGraphs.recordDeclaration as Graph<BenchmarkToken, object, BenchmarkDeclarationNode>,
                    pDeclarationGraphs.constantDeclaration as Graph<BenchmarkToken, object, BenchmarkDeclarationNode>,
                    pDeclarationGraphs.functionDeclaration as Graph<BenchmarkToken, object, BenchmarkDeclarationNode>
                ])
                .optional('list<-list', lDeclarationListGraph); // Self reference.
        });

        /**
         * Document graph. Wraps the declaration list.
         */
        return Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('list<-list', lDeclarationListGraph);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkDocumentNode => {
            return {
                type: 'Document',
                range: this.createRange(pStartToken, pEndToken),
                declarations: pData.list
            } satisfies BenchmarkDocumentNode;
        });
    }

    /**
     * Define every expression graph of the language.
     *
     * @param pCoreGraphs - Mimic object of the core graphs, filled in after this call.
     *
     * @returns Expression graphs of the language.
     */
    private defineExpressionGraphs(pCoreGraphs: BenchmarkParserCoreGraphs): BenchmarkParserExpressionGraphs {
        /**
         * Literal value expression.
         * ```
         * - "<LITERAL>"
         * ```
         */
        const lLiteralExpressionGraph: Graph<BenchmarkToken, object, BenchmarkLiteralExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('value', [
                    BenchmarkToken.LiteralFloat,
                    BenchmarkToken.LiteralInteger,
                    BenchmarkToken.LiteralString,
                    BenchmarkToken.LiteralBoolean,
                    BenchmarkToken.KeywordNull
                ]);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkLiteralExpressionNode => {
            return {
                type: 'LiteralExpression',
                range: this.createRange(pStartToken, pEndToken),
                value: pData.value
            } satisfies BenchmarkLiteralExpressionNode;
        });

        /**
         * Variable name expression.
         * ```
         * - "<IDENTIFIER>"
         * ```
         */
        const lVariableExpressionGraph: Graph<BenchmarkToken, object, BenchmarkVariableExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('name', BenchmarkToken.Identifier);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkVariableExpressionNode => {
            return {
                type: 'VariableExpression',
                range: this.createRange(pStartToken, pEndToken),
                name: pData.name
            } satisfies BenchmarkVariableExpressionNode;
        });

        /**
         * Parenthesized expression.
         * ```
         * - "(<EXPRESSION>)"
         * ```
         */
        const lParenthesizedExpressionGraph: Graph<BenchmarkToken, object, BenchmarkParenthesizedExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.ParenthesesStart)
                .required('expression', lExpressionGraph)
                .required(BenchmarkToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkParenthesizedExpressionNode => {
            return {
                type: 'ParenthesizedExpression',
                range: this.createRange(pStartToken, pEndToken),
                expression: pData.expression
            } satisfies BenchmarkParenthesizedExpressionNode;
        });

        /**
         * Unary expression.
         * ```
         * - "-<EXPRESSION>"
         * - "!<EXPRESSION>"
         * ```
         */
        const lUnaryExpressionGraph: Graph<BenchmarkToken, object, BenchmarkUnaryExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('operator', [
                    BenchmarkToken.OperatorMinus,
                    BenchmarkToken.OperatorNot
                ])
                .required('expression', lSimpleExpressionGraph);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkUnaryExpressionNode => {
            return {
                type: 'UnaryExpression',
                range: this.createRange(pStartToken, pEndToken),
                operator: pData.operator,
                expression: pData.expression
            } satisfies BenchmarkUnaryExpressionNode;
        });

        /**
         * Recursive list of expressions separated by comma.
         */
        const lExpressionListGraph: Graph<BenchmarkToken, object, { list: Array<BenchmarkExpressionNode>; }> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('list[]', lExpressionGraph)
                .optional('list<-list', GraphNode.new<BenchmarkToken>()
                    .required(BenchmarkToken.Comma)
                    .required('list<-list', lExpressionListGraph) // Self reference.
                );
        });

        /**
         * Function call expression. The called name can be qualified by a namespace or a record.
         * ```
         * - "<IDENTIFIER>()"
         * - "<IDENTIFIER>.<IDENTIFIER>(<EXPRESSION_LIST>)"
         * - "<IDENTIFIER><<TYPE_LIST>>(<EXPRESSION_LIST>)"
         * ```
         */
        const lCallExpressionGraph: Graph<BenchmarkToken, object, BenchmarkCallExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('name', BenchmarkToken.Identifier)
                .optional('qualifier<-names', lMemberNameListGraph)
                .optional('generics<-list', GraphNode.new<BenchmarkToken>()
                    .required(BenchmarkToken.GenericStart)
                    .required('list<-list', lCallGenericListGraph)
                    .required(BenchmarkToken.GenericEnd)
                )
                .required(BenchmarkToken.ParenthesesStart)
                .optional('parameters<-list', lExpressionListGraph)
                .required(BenchmarkToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkCallExpressionNode => {
            // Join the qualified name back into a single dotted name.
            const lQualifiedName: string = [pData.name, ...(pData.qualifier ?? [])].join('.');

            return {
                type: 'CallExpression',
                range: this.createRange(pStartToken, pEndToken),
                name: lQualifiedName,
                generics: pData.generics ?? [],
                parameters: pData.parameters ?? []
            } satisfies BenchmarkCallExpressionNode;
        });

        /**
         * Recursive list of types used as call generics.
         */
        const lCallGenericListGraph: Graph<BenchmarkToken, object, { list: Array<BenchmarkTypeNode>; }> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('list[]', pCoreGraphs.type)
                .optional('list<-list', GraphNode.new<BenchmarkToken>()
                    .required(BenchmarkToken.Comma)
                    .required('list<-list', lCallGenericListGraph) // Self reference.
                );
        });

        /**
         * New expression. Creates an instance of a type.
         * ```
         * - "new <CALL_EXPRESSION>"
         * ```
         */
        const lNewExpressionGraph: Graph<BenchmarkToken, object, BenchmarkNewExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.KeywordNew)
                .required('call', lCallExpressionGraph);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkNewExpressionNode => {
            return {
                type: 'NewExpression',
                range: this.createRange(pStartToken, pEndToken),
                typeName: pData.call.name,
                generics: pData.call.generics,
                parameters: pData.call.parameters
            } satisfies BenchmarkNewExpressionNode;
        });

        /**
         * Recursive list of member names.
         * ```
         * - ".<IDENTIFIER>"
         * - ".<IDENTIFIER>.<IDENTIFIER>"
         * ```
         */
        const lMemberNameListGraph: Graph<BenchmarkToken, object, { names: Array<string>; }> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.MemberDelimiter)
                .required('names[]', BenchmarkToken.Identifier)
                .optional('names<-names', lMemberNameListGraph); // Self reference.
        });

        /**
         * Single member accessor of an accessor chain.
         * ```
         * - ".<IDENTIFIER>"
         * ```
         */
        const lMemberAccessorGraph: Graph<BenchmarkToken, object, BenchmarkParserAccessor> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.MemberDelimiter)
                .required('name', BenchmarkToken.Identifier);
        }).converter((pData): BenchmarkParserAccessor => {
            return {
                property: pData.name,
                index: null
            } satisfies BenchmarkParserAccessor;
        });

        /**
         * Single index accessor of an accessor chain.
         * ```
         * - "[<EXPRESSION>]"
         * ```
         */
        const lIndexAccessorGraph: Graph<BenchmarkToken, object, BenchmarkParserAccessor> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.ListStart)
                .required('index', lExpressionGraph)
                .required(BenchmarkToken.ListEnd);
        }).converter((pData): BenchmarkParserAccessor => {
            return {
                property: null,
                index: pData.index
            } satisfies BenchmarkParserAccessor;
        });

        /**
         * Recursive list of accessors.
         * ```
         * - ".<IDENTIFIER>"
         * - "[<EXPRESSION>].<IDENTIFIER>[<EXPRESSION>]"
         * ```
         */
        const lAccessorListGraph: Graph<BenchmarkToken, object, { list: Array<BenchmarkParserAccessor>; }> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('list[]', [
                    lMemberAccessorGraph,
                    lIndexAccessorGraph
                ])
                .optional('list<-list', lAccessorListGraph); // Self reference.
        });

        /**
         * A base expression followed by at least one member or index accessor.
         * Chaining the accessors as a postfix list keeps the expression graph free of left recursion.
         * ```
         * - "<EXPRESSION>.<IDENTIFIER>"
         * - "<EXPRESSION>[<EXPRESSION>]"
         * - "<EXPRESSION>.<IDENTIFIER>[<EXPRESSION>].<IDENTIFIER>"
         * ```
         */
        const lChainExpressionGraph: Graph<BenchmarkToken, object, BenchmarkExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('base', lBaseExpressionGraph)
                .required('accessors<-list', lAccessorListGraph);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkExpressionNode => {
            // Nest one expression per read accessor.
            let lNestedExpression: BenchmarkExpressionNode = pData.base;
            for (const lAccessor of pData.accessors) {
                // Index accessor.
                if (lAccessor.index !== null) {
                    const lIndexExpression: BenchmarkIndexExpressionNode = {
                        type: 'IndexExpression',
                        range: this.createRange(pStartToken, pEndToken),
                        value: lNestedExpression,
                        index: lAccessor.index
                    };
                    lNestedExpression = lIndexExpression;
                    continue;
                }

                // Member accessor.
                const lMemberExpression: BenchmarkMemberExpressionNode = {
                    type: 'MemberExpression',
                    range: this.createRange(pStartToken, pEndToken),
                    value: lNestedExpression,
                    property: lAccessor.property!
                };
                lNestedExpression = lMemberExpression;
            }

            return lNestedExpression;
        });

        /**
         * Arithmetic expression.
         * ```
         * - "<EXPRESSION> + <EXPRESSION>"
         * ```
         */
        const lArithmeticExpressionGraph: Graph<BenchmarkToken, object, BenchmarkBinaryExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('leftExpression', lSimpleExpressionGraph)
                .required('operator', [
                    BenchmarkToken.OperatorPlus,
                    BenchmarkToken.OperatorMinus,
                    BenchmarkToken.OperatorMultiply,
                    BenchmarkToken.OperatorDivide,
                    BenchmarkToken.OperatorModulo
                ])
                .required('rightExpression', lExpressionGraph);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkBinaryExpressionNode => {
            return {
                type: 'BinaryExpression',
                range: this.createRange(pStartToken, pEndToken),
                operator: pData.operator,
                leftExpression: pData.leftExpression,
                rightExpression: pData.rightExpression
            } satisfies BenchmarkBinaryExpressionNode;
        });

        /**
         * Comparison expression.
         * ```
         * - "<EXPRESSION> == <EXPRESSION>"
         * ```
         */
        const lComparisonExpressionGraph: Graph<BenchmarkToken, object, BenchmarkBinaryExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('leftExpression', lSimpleExpressionGraph)
                .required('operator', [
                    BenchmarkToken.OperatorEqual,
                    BenchmarkToken.OperatorNotEqual,
                    BenchmarkToken.OperatorGreaterThanEqual,
                    BenchmarkToken.OperatorLowerThanEqual,
                    BenchmarkToken.OperatorGreaterThan,
                    BenchmarkToken.OperatorLowerThan
                ])
                .required('rightExpression', lExpressionGraph);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkBinaryExpressionNode => {
            return {
                type: 'BinaryExpression',
                range: this.createRange(pStartToken, pEndToken),
                operator: pData.operator,
                leftExpression: pData.leftExpression,
                rightExpression: pData.rightExpression
            } satisfies BenchmarkBinaryExpressionNode;
        });

        /**
         * Logical expression.
         * ```
         * - "<EXPRESSION> && <EXPRESSION>"
         * ```
         */
        const lLogicalExpressionGraph: Graph<BenchmarkToken, object, BenchmarkBinaryExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('leftExpression', lSimpleExpressionGraph)
                .required('operator', [
                    BenchmarkToken.OperatorAnd,
                    BenchmarkToken.OperatorOr
                ])
                .required('rightExpression', lExpressionGraph);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkBinaryExpressionNode => {
            return {
                type: 'BinaryExpression',
                range: this.createRange(pStartToken, pEndToken),
                operator: pData.operator,
                leftExpression: pData.leftExpression,
                rightExpression: pData.rightExpression
            } satisfies BenchmarkBinaryExpressionNode;
        });

        /**
         * Ternary expression.
         * ```
         * - "<EXPRESSION> ? <EXPRESSION> : <EXPRESSION>"
         * ```
         */
        const lTernaryExpressionGraph: Graph<BenchmarkToken, object, BenchmarkTernaryExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('condition', lSimpleExpressionGraph)
                .required(BenchmarkToken.QuestionMark)
                .required('trueExpression', lExpressionGraph)
                .required(BenchmarkToken.Colon)
                .required('falseExpression', lExpressionGraph);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkTernaryExpressionNode => {
            return {
                type: 'TernaryExpression',
                range: this.createRange(pStartToken, pEndToken),
                condition: pData.condition,
                trueExpression: pData.trueExpression,
                falseExpression: pData.falseExpression
            } satisfies BenchmarkTernaryExpressionNode;
        });

        /**
         * Every expression that can not be extended by an accessor.
         * Used as the entry of an accessor chain and as a fallback of every expression layer.
         */
        const lBaseExpressionGraph: Graph<BenchmarkToken, object, BenchmarkExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('expression', [
                    // Expressions that add something in front of another expression.
                    lUnaryExpressionGraph,
                    lParenthesizedExpressionGraph,
                    lNewExpressionGraph,

                    // Self contained expressions.
                    lCallExpressionGraph,
                    lLiteralExpressionGraph,

                    // Just a name.
                    lVariableExpressionGraph
                ]);
        }).converter((pData): BenchmarkExpressionNode => {
            return pData.expression;
        });

        /**
         * Every expression that can be used as the left hand side of a combining expression.
         * Combining expressions are left out to prevent an endless left recursion.
         */
        const lSimpleExpressionGraph: Graph<BenchmarkToken, object, BenchmarkExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('expression', [
                    // The longer accessor chain before its own base expression.
                    lChainExpressionGraph,
                    lBaseExpressionGraph
                ]);
        }, true).converter((pData): BenchmarkExpressionNode => {
            return pData.expression;
        });

        /**
         * Every expression of the language.
         */
        const lExpressionGraph: Graph<BenchmarkToken, object, BenchmarkExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('expression', [
                    // Expressions combining two or three expressions.
                    lTernaryExpressionGraph,
                    lComparisonExpressionGraph,
                    lArithmeticExpressionGraph,
                    lLogicalExpressionGraph,

                    // The longer accessor chain before its own base expression.
                    lChainExpressionGraph,
                    lBaseExpressionGraph
                ]);
        }, true).converter((pData): BenchmarkExpressionNode => {
            return pData.expression;
        });

        return {
            expression: lExpressionGraph,
            simpleExpression: lSimpleExpressionGraph,
            expressionList: lExpressionListGraph,
            callExpression: lCallExpressionGraph
        };
    }

    /**
     * Define every statement graph of the language.
     *
     * @param pCoreGraphs - Core graphs of the language.
     * @param pExpressionGraphs - Expression graphs of the language.
     *
     * @returns Statement graphs of the language.
     */
    private defineStatementGraphs(pCoreGraphs: BenchmarkParserCoreGraphs, pExpressionGraphs: BenchmarkParserExpressionGraphs): BenchmarkParserStatementGraphs {
        /**
         * Comment. Comments are token of the language and are kept in the syntax tree.
         */
        const lCommentGraph: Graph<BenchmarkToken, object, BenchmarkCommentNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('text', BenchmarkToken.Comment);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkCommentNode => {
            return {
                type: 'Comment',
                range: this.createRange(pStartToken, pEndToken),
                text: pData.text
            } satisfies BenchmarkCommentNode;
        });

        /**
         * Local variable declaration statement.
         * ```
         * - "let <IDENTIFIER>: <TYPE>;"
         * - "const <IDENTIFIER>: <TYPE> = <EXPRESSION>;"
         * ```
         */
        const lVariableStatementGraph: Graph<BenchmarkToken, object, BenchmarkVariableStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('declarationType', [
                    BenchmarkToken.KeywordLet,
                    BenchmarkToken.KeywordConst
                ])
                .required('name', BenchmarkToken.Identifier)
                .required(BenchmarkToken.Colon)
                .required('valueType', pCoreGraphs.type)
                .optional('expression', GraphNode.new<BenchmarkToken>()
                    .required(BenchmarkToken.Assignment)
                    .required('value', pExpressionGraphs.expression)
                )
                .required(BenchmarkToken.Semicolon);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkVariableStatementNode => {
            return {
                type: 'VariableStatement',
                range: this.createRange(pStartToken, pEndToken),
                declarationType: pData.declarationType,
                name: pData.name,
                valueType: pData.valueType,
                expression: pData.expression?.value ?? null
            } satisfies BenchmarkVariableStatementNode;
        });

        /**
         * Target of an assignment.
         * ```
         * - "<IDENTIFIER>"
         * - "<IDENTIFIER>.<IDENTIFIER>"
         * - "<IDENTIFIER>[<EXPRESSION>]"
         * ```
         */
        const lAssignmentTargetGraph: Graph<BenchmarkToken, object, BenchmarkExpressionNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('target', pExpressionGraphs.simpleExpression);
        }).converter((pData): BenchmarkExpressionNode => {
            return pData.target;
        });

        /**
         * Assignment without its closing semicolon, so it can be reused inside a for statement.
         */
        const lAssignmentCoreGraph: Graph<BenchmarkToken, object, BenchmarkAssignmentStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('target', lAssignmentTargetGraph)
                .required('operator', [
                    BenchmarkToken.Assignment,
                    BenchmarkToken.AssignmentPlus,
                    BenchmarkToken.AssignmentMinus,
                    BenchmarkToken.AssignmentMultiply,
                    BenchmarkToken.AssignmentDivide,
                    BenchmarkToken.AssignmentModulo
                ])
                .required('expression', pExpressionGraphs.expression);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkAssignmentStatementNode => {
            return {
                type: 'AssignmentStatement',
                range: this.createRange(pStartToken, pEndToken),
                target: pData.target,
                operator: pData.operator,
                expression: pData.expression
            } satisfies BenchmarkAssignmentStatementNode;
        });

        /**
         * Assignment statement.
         * ```
         * - "<TARGET> = <EXPRESSION>;"
         * ```
         */
        const lAssignmentStatementGraph: Graph<BenchmarkToken, object, BenchmarkAssignmentStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('assignment', lAssignmentCoreGraph)
                .required(BenchmarkToken.Semicolon);
        }).converter((pData): BenchmarkAssignmentStatementNode => {
            return pData.assignment;
        });

        /**
         * Increment without its closing semicolon, so it can be reused inside a for statement.
         */
        const lIncrementCoreGraph: Graph<BenchmarkToken, object, BenchmarkIncrementStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('target', lAssignmentTargetGraph)
                .required('operator', [
                    BenchmarkToken.OperatorIncrement,
                    BenchmarkToken.OperatorDecrement
                ]);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkIncrementStatementNode => {
            return {
                type: 'IncrementStatement',
                range: this.createRange(pStartToken, pEndToken),
                target: pData.target,
                operator: pData.operator
            } satisfies BenchmarkIncrementStatementNode;
        });

        /**
         * Increment statement.
         * ```
         * - "<TARGET>++;"
         * ```
         */
        const lIncrementStatementGraph: Graph<BenchmarkToken, object, BenchmarkIncrementStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('increment', lIncrementCoreGraph)
                .required(BenchmarkToken.Semicolon);
        }).converter((pData): BenchmarkIncrementStatementNode => {
            return pData.increment;
        });

        /**
         * Function call statement.
         * ```
         * - "<CALL_EXPRESSION>;"
         * ```
         */
        const lCallStatementGraph: Graph<BenchmarkToken, object, BenchmarkCallStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('expression', pExpressionGraphs.callExpression)
                .required(BenchmarkToken.Semicolon);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkCallStatementNode => {
            return {
                type: 'CallStatement',
                range: this.createRange(pStartToken, pEndToken),
                expression: pData.expression
            } satisfies BenchmarkCallStatementNode;
        });

        /**
         * Return statement.
         * ```
         * - "return;"
         * - "return <EXPRESSION>;"
         * ```
         */
        const lReturnStatementGraph: Graph<BenchmarkToken, object, BenchmarkReturnStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.KeywordReturn)
                .optional('expression', pExpressionGraphs.expression)
                .required(BenchmarkToken.Semicolon);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkReturnStatementNode => {
            return {
                type: 'ReturnStatement',
                range: this.createRange(pStartToken, pEndToken),
                expression: pData.expression ?? null
            } satisfies BenchmarkReturnStatementNode;
        });

        /**
         * Break statement.
         */
        const lBreakStatementGraph: Graph<BenchmarkToken, object, BenchmarkBreakStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.KeywordBreak)
                .required(BenchmarkToken.Semicolon);
        }).converter((_pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkBreakStatementNode => {
            return {
                type: 'BreakStatement',
                range: this.createRange(pStartToken, pEndToken)
            } satisfies BenchmarkBreakStatementNode;
        });

        /**
         * Continue statement.
         */
        const lContinueStatementGraph: Graph<BenchmarkToken, object, BenchmarkContinueStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.KeywordContinue)
                .required(BenchmarkToken.Semicolon);
        }).converter((_pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkContinueStatementNode => {
            return {
                type: 'ContinueStatement',
                range: this.createRange(pStartToken, pEndToken)
            } satisfies BenchmarkContinueStatementNode;
        });

        /**
         * If statement with an optional else branch.
         * ```
         * - "if (<EXPRESSION>) <BLOCK>"
         * - "if (<EXPRESSION>) <BLOCK> else <BLOCK>"
         * - "if (<EXPRESSION>) <BLOCK> else <IF_STATEMENT>"
         * ```
         */
        const lIfStatementGraph: Graph<BenchmarkToken, object, BenchmarkIfStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.KeywordIf)
                .required(BenchmarkToken.ParenthesesStart)
                .required('condition', pExpressionGraphs.expression)
                .required(BenchmarkToken.ParenthesesEnd)
                .required('block', lBlockStatementGraph)
                .optional('elseStatement', GraphNode.new<BenchmarkToken>()
                    .required(BenchmarkToken.KeywordElse)
                    .required('statement', [
                        lIfStatementGraph, // Self reference.
                        lBlockStatementGraph
                    ])
                );
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkIfStatementNode => {
            return {
                type: 'IfStatement',
                range: this.createRange(pStartToken, pEndToken),
                condition: pData.condition,
                block: pData.block,
                elseStatement: pData.elseStatement?.statement ?? null
            } satisfies BenchmarkIfStatementNode;
        });

        /**
         * While statement.
         * ```
         * - "while (<EXPRESSION>) <BLOCK>"
         * ```
         */
        const lWhileStatementGraph: Graph<BenchmarkToken, object, BenchmarkWhileStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.KeywordWhile)
                .required(BenchmarkToken.ParenthesesStart)
                .required('condition', pExpressionGraphs.expression)
                .required(BenchmarkToken.ParenthesesEnd)
                .required('block', lBlockStatementGraph);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkWhileStatementNode => {
            return {
                type: 'WhileStatement',
                range: this.createRange(pStartToken, pEndToken),
                condition: pData.condition,
                block: pData.block
            } satisfies BenchmarkWhileStatementNode;
        });

        /**
         * For statement.
         * ```
         * - "for (<VARIABLE_STATEMENT> <EXPRESSION>; <UPDATE>) <BLOCK>"
         * ```
         */
        const lForStatementGraph: Graph<BenchmarkToken, object, BenchmarkForStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.KeywordFor)
                .required(BenchmarkToken.ParenthesesStart)
                .required('init', lVariableStatementGraph)
                .required('condition', pExpressionGraphs.expression)
                .required(BenchmarkToken.Semicolon)
                .required('update', [
                    lIncrementCoreGraph,
                    lAssignmentCoreGraph
                ])
                .required(BenchmarkToken.ParenthesesEnd)
                .required('block', lBlockStatementGraph);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkForStatementNode => {
            return {
                type: 'ForStatement',
                range: this.createRange(pStartToken, pEndToken),
                init: pData.init,
                condition: pData.condition,
                update: pData.update,
                block: pData.block
            } satisfies BenchmarkForStatementNode;
        });

        /**
         * Recursive list of statements.
         */
        const lStatementListGraph: Graph<BenchmarkToken, object, { list: Array<BenchmarkStatementNode>; }> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required('list[]', [
                    lCommentGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>,
                    lVariableStatementGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>,
                    lIfStatementGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>,
                    lWhileStatementGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>,
                    lForStatementGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>,
                    lReturnStatementGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>,
                    lBreakStatementGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>,
                    lContinueStatementGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>,
                    lIncrementStatementGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>,
                    lAssignmentStatementGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>,
                    lCallStatementGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>,
                    lBlockStatementGraph as Graph<BenchmarkToken, object, BenchmarkStatementNode>
                ])
                .optional('list<-list', lStatementListGraph); // Self reference.
        });

        /**
         * Block of statements.
         * ```
         * - "{ <STATEMENT_LIST> }"
         * ```
         */
        const lBlockStatementGraph: Graph<BenchmarkToken, object, BenchmarkBlockStatementNode> = Graph.define(() => {
            return GraphNode.new<BenchmarkToken>()
                .required(BenchmarkToken.BlockStart)
                .optional('statements<-list', lStatementListGraph)
                .required(BenchmarkToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<BenchmarkToken>, pEndToken?: LexerToken<BenchmarkToken>): BenchmarkBlockStatementNode => {
            return {
                type: 'BlockStatement',
                range: this.createRange(pStartToken, pEndToken),
                statements: pData.statements ?? []
            } satisfies BenchmarkBlockStatementNode;
        });

        return {
            block: lBlockStatementGraph,
            comment: lCommentGraph
        };
    }
}

/*
 * Graph collections that are passed between the graph definition layers.
 */

type BenchmarkParserAccessor = {
    property: string | null;
    index: BenchmarkExpressionNode | null;
};

type BenchmarkParserCoreGraphs = {
    type: Graph<BenchmarkToken, object, BenchmarkTypeNode>;
    attributeList: Graph<BenchmarkToken, object, { list: Array<BenchmarkAttributeNode>; }>;
};

type BenchmarkParserExpressionGraphs = {
    expression: Graph<BenchmarkToken, object, BenchmarkExpressionNode>;
    simpleExpression: Graph<BenchmarkToken, object, BenchmarkExpressionNode>;
    expressionList: Graph<BenchmarkToken, object, { list: Array<BenchmarkExpressionNode>; }>;
    callExpression: Graph<BenchmarkToken, object, BenchmarkCallExpressionNode>;
};

type BenchmarkParserStatementGraphs = {
    block: Graph<BenchmarkToken, object, BenchmarkBlockStatementNode>;
    comment: Graph<BenchmarkToken, object, BenchmarkCommentNode>;
};

type BenchmarkParserDeclarationGraphs = {
    moduleDeclaration: Graph<BenchmarkToken, object, BenchmarkModuleDeclarationNode>;
    importDeclaration: Graph<BenchmarkToken, object, BenchmarkImportDeclarationNode>;
    aliasDeclaration: Graph<BenchmarkToken, object, BenchmarkAliasDeclarationNode>;
    enumDeclaration: Graph<BenchmarkToken, object, BenchmarkEnumDeclarationNode>;
    recordDeclaration: Graph<BenchmarkToken, object, BenchmarkRecordDeclarationNode>;
    constantDeclaration: Graph<BenchmarkToken, object, BenchmarkConstantDeclarationNode>;
    functionDeclaration: Graph<BenchmarkToken, object, BenchmarkFunctionDeclarationNode>;
    comment: Graph<BenchmarkToken, object, BenchmarkCommentNode>;
};
