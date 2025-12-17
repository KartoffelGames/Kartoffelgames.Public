import { Exception } from '@kartoffelgames/core';
import { CodeParser, Graph, GraphNode, type LexerToken } from '@kartoffelgames/core-parser';
import { DocumentAst } from '../abstract_syntax_tree/document-ast.ts';
import { AttributeListAst } from '../abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslInterpolateTypeEnum } from "../buildin/pgsl-interpolate-type-enum.ts";
import { PgslTexelFormatEnum } from "../buildin/pgsl-texel-format-enum.ts";
import type { AliasDeclarationCst, DeclarationCst, DeclarationCstType, EnumDeclarationCst, EnumDeclarationValueCst, FunctionDeclarationCst, FunctionDeclarationHeaderCst, FunctionDeclarationParameterCst, StructDeclarationCst, StructPropertyDeclarationCst, VariableDeclarationCst } from '../concrete_syntax_tree/declaration.type.ts';
import type { AddressOfExpressionCst, ArithmeticExpressionCst, BinaryExpressionCst, ComparisonExpressionCst, ExpressionCst, ExpressionCstType, FunctionCallExpressionCst, IndexedValueExpressionCst, LiteralValueExpressionCst, LogicalExpressionCst, NewExpressionCst, ParenthesizedExpressionCst, PointerExpressionCst, StringValueExpressionCst, UnaryExpressionCst, ValueDecompositionExpressionCst, VariableNameExpressionCst } from '../concrete_syntax_tree/expression.type.ts';
import type { AttributeCst, AttributeListCst, CstRange, DocumentCst, TypeDeclarationCst } from '../concrete_syntax_tree/general.type.ts';
import type { AssignmentStatementCst, BlockStatementCst, BreakStatementCst, ContinueStatementCst, DiscardStatementCst, DoWhileStatementCst, ForStatementCst, FunctionCallStatementCst, IfStatementCst, IncrementDecrementStatementCst, ReturnStatementCst, StatementCst, StatementCstType, SwitchCaseCst, SwitchStatementCst, VariableDeclarationStatementCst, WhileStatementCst } from '../concrete_syntax_tree/statement.type.ts';
import { PgslParserResult } from '../parser_result/pgsl-parser-result.ts';
import type { PgslTranspilation, PgslTranspilationResult } from '../transpilation/pgsl-transpilation.ts';
import { PgslArrayType } from "../type/pgsl-array-type.ts";
import { PgslBooleanType } from "../type/pgsl-boolean-type.ts";
import { PgslBuildInType } from "../type/pgsl-build-in-type.ts";
import { PgslMatrixType } from "../type/pgsl-matrix-type.ts";
import { PgslNumericType } from "../type/pgsl-numeric-type.ts";
import { PgslSamplerType } from "../type/pgsl-sampler-type.ts";
import { PgslTextureType } from "../type/pgsl-texture-type.ts";
import { PgslVectorType } from "../type/pgsl-vector-type.ts";
import { PgslLexer } from './pgsl-lexer.ts';
import { PgslToken } from './pgsl-token.enum.ts';
import { PgslInterpolateSamplingEnum } from "../buildin/pgsl-interpolate-sampling-enum.ts";
import { PgslAccessModeEnum } from "../buildin/pgsl-access-mode-enum.ts";
import { PgslTranspilationMeta } from "../transpilation/pgsl-transpilation-meta.ts";

export class PgslParser extends CodeParser<PgslToken, DocumentCst> {
    private static readonly STATIC_TYPE_NAMES: Set<string> = new Set<string>([
        // Scalar types.
        PgslNumericType.typeName.float16,
        PgslNumericType.typeName.float32,
        PgslNumericType.typeName.signedInteger,
        PgslNumericType.typeName.unsignedInteger,
        PgslBooleanType.typeName.boolean,

        // Vector and matrix types.
        PgslVectorType.typeName.vector2,
        PgslVectorType.typeName.vector3,
        PgslVectorType.typeName.vector4,
        PgslMatrixType.typeName.matrix22,
        PgslMatrixType.typeName.matrix23,
        PgslMatrixType.typeName.matrix24,
        PgslMatrixType.typeName.matrix32,
        PgslMatrixType.typeName.matrix33,
        PgslMatrixType.typeName.matrix34,
        PgslMatrixType.typeName.matrix42,
        PgslMatrixType.typeName.matrix43,
        PgslMatrixType.typeName.matrix44,

        // Array type.
        PgslArrayType.typeName.array,

        // Build in types.
        PgslBuildInType.typeName.vertexIndex,
        PgslBuildInType.typeName.instanceIndex,
        PgslBuildInType.typeName.position,
        PgslBuildInType.typeName.frontFacing,
        PgslBuildInType.typeName.fragDepth,
        PgslBuildInType.typeName.sampleIndex,
        PgslBuildInType.typeName.sampleMask,
        PgslBuildInType.typeName.localInvocationId,
        PgslBuildInType.typeName.localInvocationIndex,
        PgslBuildInType.typeName.globalInvocationId,
        PgslBuildInType.typeName.workgroupId,
        PgslBuildInType.typeName.numWorkgroups,
        PgslBuildInType.typeName.clipDistances,

        // Sampler types.
        PgslSamplerType.typeName.sampler,
        PgslSamplerType.typeName.samplerComparison,

        // Texture types.
        PgslTextureType.typeName.texture1d,
        PgslTextureType.typeName.texture2d,
        PgslTextureType.typeName.texture2dArray,
        PgslTextureType.typeName.texture3d,
        PgslTextureType.typeName.textureCube,
        PgslTextureType.typeName.textureCubeArray,
        PgslTextureType.typeName.textureMultisampled2d,
        PgslTextureType.typeName.textureExternal,
        PgslTextureType.typeName.textureDepth2d,
        PgslTextureType.typeName.textureDepth2dArray,
        PgslTextureType.typeName.textureDepthCube,
        PgslTextureType.typeName.textureDepthCubeArray,
        PgslTextureType.typeName.textureDepthMultisampled2d,
        PgslTextureType.typeName.textureStorage1d,
        PgslTextureType.typeName.textureStorage2d,
        PgslTextureType.typeName.textureStorage2dArray,
        PgslTextureType.typeName.textureStorage3d,
    ]);

    private mUserDefinedTypeNames: Set<string>;

    /**
     * Constructor.
     */
    public constructor() {
        super(new PgslLexer());

        // Initialize user defined type name set.
        this.mUserDefinedTypeNames = new Set<string>();

        // Define expression graphs use the mime object of core graph for defining.
        const lExpressionGraphs: PgslParserExpressionGraphs = this.defineExpressionGraphs();

        // Create actual core graphs and assign them to the mime object.
        const lCoreGraphs: PgslParserCoreGraphs = this.defineCoreGraphs(lExpressionGraphs);

        const lStatementGraphs: PgslParserStatementGraphs = this.defineStatementGraphs(lCoreGraphs, lExpressionGraphs);

        // Define declaration graphs.
        const lDeclarationGraphs: PgslParserDeclarationGraphs = this.defineDeclarationGraphs(lCoreGraphs, lExpressionGraphs, lStatementGraphs);

        // Set root.
        const lModuleScopeGraph: Graph<PgslToken, object, DocumentCst> = this.defineModuleScopeGraph(lDeclarationGraphs);

        // Set root.
        this.setRootGraph(lModuleScopeGraph);
    }

    /**
     * Parse a text with the set syntax into a concrete sytnax tree.
     * 
     * @param pCodeText - Code as text.
     *
     * @returns The code as concrete syntax tree.
     *
     * @throws {@link ParserException} 
     * When the graph could not be resolved with the set code text. Or Exception when no tokenizeable text should be parsed.
     */
    public override parse(pCodeText: string): DocumentCst {
        // TODO: On second layer only not the parser.
        // Insert imports. #IMPORT
        // Fill in buffers with imported declarations.
        // Setup #IFDEF. Fill Replaced '#IFDEFs, #ENDIFDEF with same amount of spaces and newlines.
        // Remove any other # statements as they do nothing. Replace with same amount of spaces and newlines.

        // TODO: Replace comments with same amount of spaces ans newlines.

        // Clear user defined type names.
        this.mUserDefinedTypeNames = new Set<string>();

        return this.parse(pCodeText);
    }

    /**
     * Parse a text with the set syntax from into an abstract syntax tree.
     * 
     * @param pCodeText - Code as text.
     *
     * @returns The code as abstract syntax tree.
     *
     * @throws {@link ParserException} 
     * When the graph could not be resolved with the set code text. Or Exception when no tokenizeable text should be parsed.
     */
    public parseAst(pCodeText: string): DocumentAst {
        // Parse document structure into a concrete syntax tree.
        const lDocumentCst: DocumentCst = super.parse(pCodeText);

        // Define buildin enums.
        const lBuildInEnumList: Array<DeclarationCst<DeclarationCstType>> = [
            PgslAccessModeEnum.cst,
            PgslInterpolateSamplingEnum.cst,
            PgslInterpolateTypeEnum.cst,
            PgslTexelFormatEnum.cst
        ];

        // Append buildin declarations to the document.
        lDocumentCst.buildInDeclarations.push(...lBuildInEnumList);

        // Build and return PgslParserResult.
        return new DocumentAst(lDocumentCst);
    }

    /**
     * Transpile Pgsl code text into target code with source map and meta information.
     * 
     * @param pCodeText - Pgsl code as text.
     * @param pTranspiler - Transpiler instance.
     * 
     * @returns PgslParserResult containing transpiled code, source map and meta. 
     */
    public transpile(pCodeText: string, pTranspiler: PgslTranspilation): PgslParserResult {
        // Parse document structure.
        const lDocument: DocumentAst = this.parseAst(pCodeText);

        // Skip transpilation if there are incidents.
        let lTranspilationResult: PgslTranspilationResult;
        if (lDocument.data.incidents.length === 0) {
            // Start transpilation process.
            lTranspilationResult = pTranspiler.transpile(lDocument);
        } else {
            // Create empty result.
            lTranspilationResult = {
                code: '',
                sourceMap: null,
                meta: new PgslTranspilationMeta()
            };
        }

        // Build and return PgslParserResult.
        return new PgslParserResult(lTranspilationResult.code, lTranspilationResult.sourceMap, lDocument);
    }

    /**
     * Create start and end token information parameter for syntax tree creations.
     * 
     * @param pStartToken - Parsed structure start token.
     * @param pEndToken - Parsed structure end token.
     * 
     * @returns parameter of start and end token as a four number tuple.
     */
    private createTokenBoundParameter(pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): CstRange {
        // No token.
        if (!pStartToken && !pEndToken) {
            return [0, 0, 0, 0];
        }

        // Catch some alien behaviour.
        if (!pStartToken) {
            throw new Exception('Something wrong happened. Start token musst be present when endtoken exists.', this);
        }

        // Only starting token.
        if (!pEndToken) {
            return [
                pStartToken.lineNumber,
                pStartToken.columnNumber,
                pStartToken.lineNumber,
                pStartToken.columnNumber
            ];
        }

        // Solid start and end token.
        return [
            pStartToken.lineNumber,
            pStartToken.columnNumber,
            pEndToken.lineNumber,
            pEndToken.columnNumber
        ];
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): AttributeCst => {
            return {
                type: 'Attribute',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                name: pData.name,
                parameters: pData.parameter ?? []
            } satisfies AttributeCst;
        });

        /**
         * Attribute item list.
         * ```
         * - "<ATTRIBUTE_ITEM>"
         * - "<ATTRIBUTE_ITEM><ATTRIBUTE_ITEM>"
         * ```
         */
        const lAttributeListGraph: Graph<PgslToken, object, { list: Array<AttributeCst>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', lAttributeItemGraph)
                .optional('list<-list', lAttributeListGraph); // Self reference
        });

        /**
         * Attribute list.
         * Converts the internal attribute list into a {@link AttributeListAst}
         */
        const lAttributeListSyntaxTreeGraph = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .optional('list<-list', lAttributeListGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): AttributeListCst => {
            // Create attribute list syntax tree.
            return {
                type: 'AttributeList',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                attributes: pData.list ?? []
            } satisfies AttributeListCst;
        });

        /**
         * Template list for a type declaration seperated by comma.
         * ```
         * - "<EXPRESSION|TYPE_DECLARATION>"
         * - "<EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>"
         * - "<EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>, <EXPRESSION|TYPE_DECLARATION>"
         * ```
         */
        const lTypeDeclarationTemplateListGraph: Graph<PgslToken, object, { list: Array<ExpressionCst<ExpressionCstType> | TypeDeclarationCst>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', [
                    pExpressionGraphs.expression,
                    lTypeDeclarationSyntaxTreeGraph,
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
        const lTypeDeclarationSyntaxTreeGraph: Graph<PgslToken, object, TypeDeclarationCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .optional('pointer', PgslToken.OperatorMultiply)
                .required('name', PgslToken.Identifier)
                .optional('templateList<-list', GraphNode.new<PgslToken>()
                    .required(PgslToken.TemplateListStart)
                    .required('list<-list', lTypeDeclarationTemplateListGraph)
                    .required(PgslToken.TemplateListEnd)
                );
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): TypeDeclarationCst => {
            // Define root structure of type definition syntax tree structure data and apply type name.
            const lTemplateList: Array<ExpressionCst<ExpressionCstType> | TypeDeclarationCst> = pData.templateList ?? [];

            // Create type definition syntax tree.
            return {
                type: 'TypeDeclaration',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                typeName: pData.name,
                template: lTemplateList,
                isPointer: !!pData.pointer
            } satisfies TypeDeclarationCst;
        });

        return {
            attributeList: lAttributeListSyntaxTreeGraph,
            typeDeclaration: lTypeDeclarationSyntaxTreeGraph
        };
    }

    /**
     * Define graphs only for resolving expressions.
     */
    private defineExpressionGraphs(): PgslParserExpressionGraphs {
        // lExpressionSyntaxTreeGraph

        /**
         * Logical expression. Logical connection between two expressions.
         * ```
         * - "<EXPRESSION> && <EXPRESSION>"
         * - "<EXPRESSION> || <EXPRESSION>"
         * ```
         */
        const lLogicalExpressionGraph: Graph<PgslToken, object, LogicalExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('leftExpression', lExpressionSyntaxTreeGraph)
                .required('operation', [
                    PgslToken.OperatorShortCircuitOr,
                    PgslToken.OperatorShortCircuitAnd
                ])
                .required('rightExpression', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): LogicalExpressionCst => {
            return {
                type: 'LogicalExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                left: pData.leftExpression,
                operator: pData.operation,
                right: pData.rightExpression
            } satisfies LogicalExpressionCst;
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
        const lArithmeticExpressionGraph: Graph<PgslToken, object, ArithmeticExpressionCst> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): ArithmeticExpressionCst => {
            return {
                type: 'ArithmeticExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                left: pData.leftExpression,
                operator: pData.operation,
                right: pData.rightExpression
            } satisfies ArithmeticExpressionCst;
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
        const lComparisonExpressionGraph: Graph<PgslToken, object, ComparisonExpressionCst> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): ComparisonExpressionCst => {
            return {
                type: 'ComparisonExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                left: pData.leftExpression,
                operator: pData.comparison,
                right: pData.rightExpression
            } satisfies ComparisonExpressionCst;
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
        const lBitOperationExpressionGraph: Graph<PgslToken, object, BinaryExpressionCst> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): BinaryExpressionCst => {
            return {
                type: 'BinaryExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                left: pData.leftExpression,
                operator: pData.operation,
                right: pData.rightExpression
            } satisfies BinaryExpressionCst;
        });

        /**
         * Unary expression. Prefixed modifier for a single expression.
         * ```
         * - "~<EXPRESSION>"
         * - "-<EXPRESSION>"
         * - "!<EXPRESSION>"
         * ```
         */
        const lUnaryExpressionGraph: Graph<PgslToken, object, UnaryExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('prefix', [
                    PgslToken.OperatorBinaryNegate,
                    PgslToken.OperatorMinus,
                    PgslToken.OperatorNot
                ])
                .required('expression', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): UnaryExpressionCst => {
            return {
                type: 'UnaryExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                expression: pData.expression,
                operator: pData.prefix
            } satisfies UnaryExpressionCst;
        });

        /**
         * Variable name expression. Just an identifier.
         * ```
         * - "<IDENTIFIER>"
         * ```
         */
        const lVariableNameExpressionGraph: Graph<PgslToken, object, VariableNameExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): VariableNameExpressionCst => {
            // Identifier must be a defined type. If we dont check this here, a normal variable name could be parsed as type.
            if (PgslParser.STATIC_TYPE_NAMES.has(pData.name) || this.mUserDefinedTypeNames.has(pData.name)) {
                return Symbol(`Identifier '${pData.name}' recognized as a type.`) as any;
            }

            return {
                type: 'VariableNameExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                variableName: pData.name
            } satisfies VariableNameExpressionCst;
        });

        /**
         * Indexed value expression. An expressions value accessed through another expression.
         * ```
         * - "<EXPRESSION>[<EXPRESSION>]"
         * ```
         */
        const lIndexedValueExpressionGraph: Graph<PgslToken, object, IndexedValueExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('value', lExpressionSyntaxTreeGraph)
                .required(PgslToken.ListStart)
                .required('indexExpression', lExpressionSyntaxTreeGraph)
                .required(PgslToken.ListEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): IndexedValueExpressionCst => {
            return {
                type: 'IndexedValueExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                value: pData.value,
                index: pData.indexExpression
            } satisfies IndexedValueExpressionCst;
        });

        /**
         * Value decomposition expression. An expressions value accessed through an identifier.
         * Can be eighter a value decomposition or a enum decomposition.
         * ```
         * - "<EXPRESSION>.<IDENTIFIER>"
         * ```
         */
        const lValueDecompositionExpressionGraph: Graph<PgslToken, object, ValueDecompositionExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('leftExpression', lExpressionSyntaxTreeGraph)
                .required(PgslToken.MemberDelimiter)
                .required('propertyName', PgslToken.Identifier);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): ValueDecompositionExpressionCst => {
            return {
                type: 'ValueDecompositionExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                value: pData.leftExpression,
                property: pData.propertyName
            } satisfies ValueDecompositionExpressionCst;
        });

        /**
         * Parenthesized expression. An expressions value wrapped with parentheses.
         * ```
         * - "(<EXPRESSION>)"
         * ```
         */
        const lParenthesizedExpressionGraph: Graph<PgslToken, object, ParenthesizedExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.ParenthesesStart)
                .required('expression', lExpressionSyntaxTreeGraph)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): ParenthesizedExpressionCst => {
            return {
                type: 'ParenthesizedExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                expression: pData.expression
            } satisfies ParenthesizedExpressionCst;
        });

        /**
         * Literal number or boolean expression.
         * ```
         * - "<LITERAL_NUMBER>"
         * - "<LITERAL_BOOLEAN>"
         * ```
         */
        const lLiteralValueExpressionGraph: Graph<PgslToken, object, LiteralValueExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('value', [
                    PgslToken.LiteralFloat,
                    PgslToken.LiteralInteger,
                    PgslToken.LiteralBoolean
                ]);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): LiteralValueExpressionCst => {
            return {
                type: 'LiteralValueExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                textValue: pData.value
            } satisfies LiteralValueExpressionCst;
        });

        /**
         * Literal string expression.
         * ```
         * - "<LITERAL_STRING>"
         * ```
         */
        const lStringValueExpressionGraph: Graph<PgslToken, object, StringValueExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('string', PgslToken.LiteralString);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): StringValueExpressionCst => {
            return {
                type: 'StringValueExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                textValue: pData.string.substring(1, pData.string.length - 1)
            } satisfies StringValueExpressionCst;
        });

        /**
         * AddressOf expression. Expression prefixed with a ampersand.
         * ```
         * - "&<EXPRESSION>"
         * ```
         */
        const lAddressOfExpressionGraph: Graph<PgslToken, object, AddressOfExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.OperatorBinaryAnd)
                .required('variable', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): AddressOfExpressionCst => {
            return {
                type: 'AddressOfExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                expression: pData.variable
            } satisfies AddressOfExpressionCst;
        });

        /**
         * Pointer expression. Expression prefixed with a star.
         * ```
         * - "*<EXPRESSION>"
         * ```
         */
        const lPointerExpressionGraph: Graph<PgslToken, object, PointerExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.OperatorMultiply)
                .required('variable', lExpressionSyntaxTreeGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): PointerExpressionCst => {
            return {
                type: 'PointerExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                expression: pData.variable
            } satisfies PointerExpressionCst;
        });

        /** 
         * Recursive list of expressions seperated with comma.
         * ```
         * - "<EXPRESSION>"
         * - "<EXPRESSION>, <EXPRESSION>"
         * - "<EXPRESSION>, <EXPRESSION>, <EXPRESSION>"
         * ```
         */
        const lExpressionListGraph: Graph<PgslToken, object, { list: Array<ExpressionCst<ExpressionCstType>>; }> = Graph.define(() => {
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
        const lFunctionCallExpressionGraph: Graph<PgslToken, object, FunctionCallExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier)
                .required(PgslToken.ParenthesesStart)
                .optional('parameters<-list', lExpressionListGraph)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): FunctionCallExpressionCst => {
            // Create function call expression syntax tree.
            return {
                type: 'FunctionCallExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                functionName: pData.name,
                parameterList: pData.parameters ?? []
            } satisfies FunctionCallExpressionCst;
        });

        /**
         * New expression. Create instance of a type declaration with a list of Expression.
         * ```
         * - "new <TYPE_DECLARATION>()"
         * - "new <TYPE_DECLARATION>(<EXPRESSION_LIST>)"
         * ```
         */
        const lNewExpressionGraph: Graph<PgslToken, object, NewExpressionCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordNew)
                .required('type', PgslToken.Identifier)
                .required(PgslToken.ParenthesesStart)
                .optional('parameters<-list', lExpressionListGraph)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): NewExpressionCst => {
            // Create function call expression syntax tree.
            return {
                type: 'NewExpression',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                typeName: pData.type,
                parameterList: pData.parameters ?? []
            } satisfies NewExpressionCst;
        });

        /**
         * Expression graph. 
         * Bundles the different expressions into a single graph.
         */
        const lExpressionSyntaxTreeGraph: Graph<PgslToken, object, ExpressionCst<ExpressionCstType>> = Graph.define(() => {
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
        }).converter((pData): ExpressionCst<ExpressionCstType> => {
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
        const lIfStatementGraph: Graph<PgslToken, object, IfStatementCst> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): IfStatementCst => {
            // Create if statement syntax tree.
            return {
                type: 'IfStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                expression: pData.expression,
                block: pData.block,
                else: pData.elseBlock ?? null
            } satisfies IfStatementCst;
        });

        /**
         * List of statements graph.
         * ```
         * - "<STATEMENT>"
         * - "<STATEMENT><STATEMENT>"
         * - "<STATEMENT><STATEMENT><STATEMENT>"
         * ```
         */
        const lStatementListGraph: Graph<PgslToken, object, { list: Array<StatementCst<StatementCstType>>; }> = Graph.define(() => {
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
        const lBlockStatementGraph: Graph<PgslToken, object, BlockStatementCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.BlockStart)
                .optional('statements<-list', lStatementListGraph)
                .required(PgslToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): BlockStatementCst => {
            return {
                type: 'BlockStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                statements: pData.statements ?? []
            } satisfies BlockStatementCst;
        });

        /**
         * Single case of a switch statement graph. Containing a case with a list of expressions devided by comma and a block.
         * ```
         * - "case <EXPRESSION>: <BLOCK>"
         * - "case <EXPRESSION>, <EXPRESSION>: <BLOCK>"
         * - "case <EXPRESSION>, <EXPRESSION>, <EXPRESSION>: <BLOCK>"
         * ```
         */
        const lSwitchCaseStatementGraph: Graph<PgslToken, object, SwitchCaseCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordCase)
                .required('cases<-list', pExpressionGraphs.expressionList)
                .required(PgslToken.MemberDelimiter)
                .required('block', lBlockStatementGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): SwitchCaseCst => {
            return {
                type: 'SwitchCase',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                expressions: pData.cases,
                block: pData.block
            } satisfies SwitchCaseCst;
        });

        /**
         * List of cases of a switch statement graph.
         */
        const lSwitchCaseStatementListGraph: Graph<PgslToken, object, { list: Array<SwitchCaseCst>; }> = Graph.define(() => {
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
        const lSwitchStatementGraph: Graph<PgslToken, object, SwitchStatementCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordSwitch)
                .required(PgslToken.ParenthesesStart)
                .required('expression', pExpressionGraphs.expression)
                .required(PgslToken.ParenthesesEnd)
                .required(PgslToken.BlockStart)
                .optional('cases<-list', lSwitchCaseStatementListGraph)
                .required('defaultBlock<-block', GraphNode.new<PgslToken>()
                    .required(PgslToken.KeywordDefault)
                    .required('block', lBlockStatementGraph)
                )
                .required(PgslToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): SwitchStatementCst => {
            // Build switch data structure.
            return {
                type: 'SwitchStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                expression: pData.expression,
                cases: pData.cases ?? [],
                default: pData.defaultBlock
            } satisfies SwitchStatementCst;
        });

        /**
         * While statement graph. A while loop with condition and block.
         * ```
         * - "while(<EXPRESSION>)<BLOCK>"
         * ```
         */
        const lWhileStatementGraph: Graph<PgslToken, object, WhileStatementCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordWhile)
                .required(PgslToken.ParenthesesStart)
                .required('expression', pExpressionGraphs.expression)
                .required(PgslToken.ParenthesesEnd)
                .required('block', lBlockStatementGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): WhileStatementCst => {
            return {
                type: 'WhileStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                expression: pData.expression,
                block: pData.block
            } satisfies WhileStatementCst;
        });

        /**
         * Do-while statement graph. A do-while loop with block and condition.
         * ```
         * - "do <BLOCK> while(<EXPRESSION>)"
         * ```
         */
        const lDoWhileStatementGraph: Graph<PgslToken, object, DoWhileStatementCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordDo)
                .required('block', lBlockStatementGraph)
                .required(PgslToken.KeywordWhile)
                .required(PgslToken.ParenthesesStart)
                .required('expression', pExpressionGraphs.expression)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): DoWhileStatementCst => {
            return {
                type: 'DoWhileStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                expression: pData.expression,
                block: pData.block
            } satisfies DoWhileStatementCst;
        });

        /**
         * Break statement graph. Break statement.
         * ```
         * - "break"
         * ```
         */
        const lBreakStatementGraph: Graph<PgslToken, object, BreakStatementCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordBreak);
        }).converter((_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): BreakStatementCst => {
            return {
                type: 'BreakStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken)
            } satisfies BreakStatementCst;
        });

        /**
         * Continue statement graph. Continue statement.
         * ```
         * - "continue"
         * ```
         */
        const lContinueStatementGraph: Graph<PgslToken, object, ContinueStatementCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordContinue);
        }).converter((_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): ContinueStatementCst => {
            return {
                type: 'ContinueStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken)
            } satisfies ContinueStatementCst;
        });

        /**
         * Return statement graph. Return statement with optional expression.
         * ```
         * - "return"
         * - "return <EXPRESSION>"
         * ```
         */
        const lReturnStatementGraph: Graph<PgslToken, object, ReturnStatementCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordReturn)
                .optional('expression', pExpressionGraphs.expression);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): ReturnStatementCst => {
            return {
                type: 'ReturnStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                expression: pData.expression ?? null
            } satisfies ReturnStatementCst;
        });

        /**
         * Discard statement graph. Discard statement.
         * ```
         * - "discard"
         * ```
         */
        const lDiscardStatementGraph: Graph<PgslToken, object, DiscardStatementCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.KeywordDiscard);
        }).converter((_pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): DiscardStatementCst => {
            return {
                type: 'DiscardStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken)
            } satisfies DiscardStatementCst;
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
        const lVariableDeclarationStatementGraph: Graph<PgslToken, object, VariableDeclarationStatementCst> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): VariableDeclarationStatementCst => {
            return {
                type: 'VariableDeclarationStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                name: pData.variableName,
                declarationType: pData.declarationType,
                typeDeclaration: pData.type,
                expression: pData.initialExpression ?? null
            } satisfies VariableDeclarationStatementCst;
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
        const lForStatementGraph: Graph<PgslToken, object, ForStatementCst> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): ForStatementCst => {
            return {
                type: 'ForStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                init: pData.init ?? null,
                expression: pData.expression ?? null,
                update: pData.update ?? null,
                block: pData.block
            } satisfies ForStatementCst;
        });

        /**
         * Assignment statement graph. Assignment of a value to a variable.
         * ```
         * - "<EXPRESSION> = <EXPRESSION>"
         * - "<EXPRESSION> += <EXPRESSION>"
         * - "<EXPRESSION> -= <EXPRESSION>"
         * ```
         */
        const lAssignmentStatementGraph: Graph<PgslToken, object, AssignmentStatementCst> = Graph.define(() => {
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): AssignmentStatementCst => {
            return {
                type: 'AssignmentStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                variable: pData.variable,
                assignment: pData.assignment,
                expression: pData.expression
            } satisfies AssignmentStatementCst;
        });

        /**
         * Increment/Decrement statement graph. Post-increment or post-decrement operation.
         * ```
         * - "<EXPRESSION>++"
         * - "<EXPRESSION>--"
         * ```
         */
        const lIncrementDecrementStatementGraph: Graph<PgslToken, object, IncrementDecrementStatementCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('expression', pExpressionGraphs.expression)
                .required('operator', [
                    PgslToken.OperatorIncrement,
                    PgslToken.OperatorDecrement
                ]);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): IncrementDecrementStatementCst => {
            return {
                type: 'IncrementDecrementStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                operator: pData.operator,
                expression: pData.expression
            } satisfies IncrementDecrementStatementCst;
        });

        /**
         * Function call statement graph. Function call as a statement.
         * ```
         * - "<IDENTIFIER>()"
         * - "<IDENTIFIER>(<EXPRESSION_LIST>)"
         * ```
         */
        const lFunctionCallStatementGraph: Graph<PgslToken, object, FunctionCallStatementCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier)
                .required(PgslToken.ParenthesesStart)
                .optional('parameters<-list', pExpressionGraphs.expressionList)
                .required(PgslToken.ParenthesesEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): FunctionCallStatementCst => {
            return {
                type: 'FunctionCallStatement',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                functionName: pData.name,
                parameterList: pData.parameters ?? []
            } satisfies FunctionCallStatementCst;
        });

        /**
         * Statement graph. 
         * Bundles the different statements into a single graph.
         */
        const lStatementSyntaxTreeGraph: Graph<PgslToken, object, StatementCst<StatementCstType>> = Graph.define(() => {
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
        }).converter((pData): StatementCst<StatementCstType> => {
            return pData.branch.statement;
        });

        return {
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
        const lVariableDeclarationGraph: Graph<PgslToken, object, VariableDeclarationCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required('declarationType', [
                    PgslToken.KeywordDeclarationStorage,
                    PgslToken.KeywordDeclarationUniform,
                    PgslToken.KeywordDeclarationWorkgroup,
                    PgslToken.KeywordDeclarationPrivate,
                    PgslToken.KeywordDeclarationConst,
                    PgslToken.KeywordDeclarationParam,
                    PgslToken.KeywordDeclarationLet,
                    PgslToken.KeywordDeclarationVar
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
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): VariableDeclarationCst => {
            return {
                type: 'VariableDeclaration',
                buildIn: false,
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                name: pData.variableName,
                declarationType: pData.declarationType,
                typeDeclaration: pData.type,
                expression: typeof pData.initialization !== 'string' ? pData.initialization.expression : null,
                attributeList: pData.attributes
            } satisfies VariableDeclarationCst;
        });

        /**
         * Alias declaration graph. Type alias declaration.
         * ```
         * - "<ATTRIBUTE_LIST> alias <IDENTIFIER> = <TYPE>;"
         * ```
         */
        const lAliasDeclarationGraph: Graph<PgslToken, object, AliasDeclarationCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required(PgslToken.KeywordAlias)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.Assignment)
                .required('type', pCoreGraphs.typeDeclaration)
                .required(PgslToken.Semicolon);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): AliasDeclarationCst => {
            // Save alias as a user defined type.
            this.mUserDefinedTypeNames.add(pData.name);

            return {
                type: 'AliasDeclaration',
                buildIn: false,
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                name: pData.name,
                typeDefinition: pData.type,
                attributeList: pData.attributes
            } satisfies AliasDeclarationCst;
        });

        /**
         * Struct property declaration graph. Single property within a struct.
         * ```
         * - "[<ATTRIBUTES>] <IDENTIFIER>: <TYPE>"
         * ```
         */
        const lStructPropertyDeclarationGraph: Graph<PgslToken, object, StructPropertyDeclarationCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.Colon)
                .required('type', pCoreGraphs.typeDeclaration);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): StructPropertyDeclarationCst => {
            return {
                type: 'StructPropertyDeclaration',
                buildIn: false,
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                name: pData.name,
                typeDeclaration: pData.type,
                attributeList: pData.attributes
            } satisfies StructPropertyDeclarationCst;
        });

        /**
         * List of struct properties separated by comma.
         */
        const lStructPropertyListGraph: Graph<PgslToken, object, { list: Array<StructPropertyDeclarationCst>; }> = Graph.define(() => {
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
        const lStructDeclarationGraph: Graph<PgslToken, object, StructDeclarationCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required(PgslToken.KeywordStruct)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.BlockStart)
                .optional('properties<-list', lStructPropertyListGraph)
                .required(PgslToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): StructDeclarationCst => {
            // Save struct as a user defined type.
            this.mUserDefinedTypeNames.add(pData.name);

            return {
                type: 'StructDeclaration',
                buildIn: false,
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                name: pData.name,
                properties: pData.properties ?? [],
                attributeList: pData.attributes
            } satisfies StructDeclarationCst;
        });

        /**
         * Single enum value with name and value.
         */
        const lEnumValueGraph: Graph<PgslToken, object, EnumDeclarationValueCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier)
                .required(PgslToken.Assignment)
                .required('value', [
                    pExpressionGraphs.literalExpression,
                    pExpressionGraphs.stringExpression
                ]);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): EnumDeclarationValueCst => {
            return {
                type: 'EnumDeclarationValue',
                buildIn: false,
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                name: pData.name,
                value: pData.value
            } satisfies EnumDeclarationValueCst;
        });

        /**
         * List of enum values separated by comma.
         */
        const lEnumValueListGraph: Graph<PgslToken, object, { list: Array<EnumDeclarationValueCst>; }> = Graph.define(() => {
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
        const lEnumDeclarationGraph: Graph<PgslToken, object, EnumDeclarationCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required(PgslToken.KeywordEnum)
                .required('name', PgslToken.Identifier)
                .required(PgslToken.BlockStart)
                .optional('values<-list', lEnumValueListGraph)
                .required(PgslToken.BlockEnd);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): EnumDeclarationCst => {
            // Save enum as a user defined type.
            this.mUserDefinedTypeNames.add(pData.name);

            return {
                type: 'EnumDeclaration',
                buildIn: false,
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                name: pData.name,
                values: pData.values ?? [],
                attributeList: pData.attributes
            } satisfies EnumDeclarationCst;
        });

        /**
         * Function parameter with name and type.
         */
        const lFunctionParameterGraph: Graph<PgslToken, object, FunctionDeclarationParameterCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('name', PgslToken.Identifier)
                .required(PgslToken.Colon)
                .required('type', pCoreGraphs.typeDeclaration);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): FunctionDeclarationParameterCst => {
            return {
                type: 'FunctionDeclarationParameter',
                buildIn: false,
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                name: pData.name,
                typeDeclaration: pData.type
            } satisfies FunctionDeclarationParameterCst;
        });

        /**
         * List of function parameters separated by comma.
         */
        const lFunctionParameterListGraph: Graph<PgslToken, object, { list: Array<FunctionDeclarationParameterCst>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', lFunctionParameterGraph)
                .optional('list<-list', GraphNode.new<PgslToken>()
                    .required(PgslToken.Comma)
                    .required('list<-list', lFunctionParameterListGraph) // Self reference.
                );
        });

        const lFunctionHeaderGraph: Graph<PgslToken, object, FunctionDeclarationHeaderCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required(PgslToken.ParenthesesStart)
                .optional('parameters<-list', lFunctionParameterListGraph)
                .required(PgslToken.ParenthesesEnd)
                .required(PgslToken.Colon)
                .required('returnType', pCoreGraphs.typeDeclaration);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): FunctionDeclarationHeaderCst => {
            return {
                type: 'FunctionDeclarationHeader',
                buildIn: false,
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                parameters: pData.parameters ?? [],
                returnType: pData.returnType
            } satisfies FunctionDeclarationHeaderCst;
        });

        /**
         * Function declaration graph. Function with parameters and body.
         * ```
         * - "[<ATTRIBUTES>] fn <IDENTIFIER>(): <TYPE> <BLOCK>"
         * - "[<ATTRIBUTES>] fn <IDENTIFIER>(<PARAMETER_LIST>): <TYPE> <BLOCK>"
         * ```
         */
        const lFunctionDeclarationGraph: Graph<PgslToken, object, FunctionDeclarationCst> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('attributes', pCoreGraphs.attributeList)
                .required(PgslToken.KeywordFunction)
                .required('name', PgslToken.Identifier)
                .required('header', lFunctionHeaderGraph)
                .required('block', pStatementGraphs.blockStatement);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): FunctionDeclarationCst => {
            // Save function as a user defined type.
            this.mUserDefinedTypeNames.add(pData.name);

            return {
                type: 'FunctionDeclaration',
                isConstant: false,
                isGeneric: false,
                buildIn: false,
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                name: pData.name,
                headers: [pData.header],
                block: pData.block,
                attributeList: pData.attributes
            } satisfies FunctionDeclarationCst;
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
    private defineModuleScopeGraph(pDeclarationGraphs: PgslParserDeclarationGraphs): Graph<PgslToken, object, DocumentCst> {
        /**
         * List of declaration graphs.
         */
        const lModuleScopeDeclarationListGraph: Graph<PgslToken, object, { list: Array<DeclarationCst<DeclarationCstType>>; }> = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list[]', [
                    pDeclarationGraphs.aliasDeclaration as Graph<PgslToken, object, DeclarationCst<DeclarationCstType>>,
                    pDeclarationGraphs.variableDeclaration as Graph<PgslToken, object, DeclarationCst<DeclarationCstType>>,
                    pDeclarationGraphs.enumDeclaration as Graph<PgslToken, object, DeclarationCst<DeclarationCstType>>,
                    pDeclarationGraphs.structDeclaration as Graph<PgslToken, object, DeclarationCst<DeclarationCstType>>,
                    pDeclarationGraphs.functionDeclaration as Graph<PgslToken, object, DeclarationCst<DeclarationCstType>>
                ])
                .optional('list<-list', lModuleScopeDeclarationListGraph); // Self reference.
        });

        /**
         * Root graph. Wrapps all valid declaration graphs.
         */
        const lModuleScopeGraph = Graph.define(() => {
            return GraphNode.new<PgslToken>()
                .required('list<-list', lModuleScopeDeclarationListGraph);
        }).converter((pData, pStartToken?: LexerToken<PgslToken>, pEndToken?: LexerToken<PgslToken>): DocumentCst => {
            return {
                type: 'Document',
                range: this.createTokenBoundParameter(pStartToken, pEndToken),
                buildInDeclarations: [],
                declarations: pData.list ?? []
            } satisfies DocumentCst;
        });

        // Return module scope graph.
        return lModuleScopeGraph;
    }
}

type PgslParserCoreGraphs = {
    attributeList: Graph<PgslToken, object, AttributeListCst>;
    typeDeclaration: Graph<PgslToken, object, TypeDeclarationCst>;
};

type PgslParserExpressionGraphs = {
    expression: Graph<PgslToken, object, ExpressionCst<ExpressionCstType>>;
    expressionList: Graph<PgslToken, object, { list: Array<ExpressionCst<ExpressionCstType>>; }>;
    literalExpression: Graph<PgslToken, object, LiteralValueExpressionCst>;
    stringExpression: Graph<PgslToken, object, StringValueExpressionCst>;
};

type PgslParserStatementGraphs = {
    blockStatement: Graph<PgslToken, object, BlockStatementCst>;
};

type PgslParserDeclarationGraphs = {
    variableDeclaration: Graph<PgslToken, object, VariableDeclarationCst>;
    aliasDeclaration: Graph<PgslToken, object, AliasDeclarationCst>;
    enumDeclaration: Graph<PgslToken, object, EnumDeclarationCst>;
    structDeclaration: Graph<PgslToken, object, StructDeclarationCst>;
    functionDeclaration: Graph<PgslToken, object, FunctionDeclarationCst>;
};