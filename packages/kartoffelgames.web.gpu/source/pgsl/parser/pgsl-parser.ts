import { CodeParser } from '@kartoffelgames/core.parser';
import { PgslDocument } from '../pgsl-document';
import { PgslExpression } from '../structure/expression/pgsl-expression';
import { PgslLiteralValue } from '../structure/expression/pgsl-literal-value';
import { PgslVariableExpression } from '../structure/expression/pgsl-variable-expression';
import { PgslAttributeList } from '../structure/general/pgsl-attribute-list';
import { PgslTypeDefinition } from '../structure/type/pgsl-type-definition';
import { PgslLexer } from './pgsl-lexer';
import { PgslToken } from './pgsl-token.enum';

export class PgslParser extends CodeParser<PgslToken, PgslDocument> {
    /**
     * Constructor.
     */
    public constructor() {
        super(new PgslLexer());

        // TODO: Preparse steps. Setup with #import or something.

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
     * Define core graphs used by different scopes.
     */
    private defineCore(): void {
        this.defineGraphPart('Comment', this.graph()
            .single(PgslToken.Comment),
            () => {
                return null;
            }
        );

        type AttributeListGraphData = {
            list: Array<{
                name: string;
                parameter?: {
                    first: PgslExpression;
                    additional: Array<{
                        expression: PgslExpression;
                    }>;
                };
            }>;
        };
        this.defineGraphPart('AttributeList', this.graph()
            .loop('list', this.graph()
                .single(PgslToken.AttributeIndicator)
                .single('name', PgslToken.Identifier)
                .single(PgslToken.ParenthesesStart)
                .optional('parameter', this.graph()
                    .single('first', this.partReference('Expression'))
                    .loop('additional', this.graph()
                        .single(PgslToken.Comma).single('expression', this.partReference('Expression'))
                    )
                )
                .single(PgslToken.ParenthesesEnd)
            ),
            (_pData: AttributeListGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type TypeDefinitionGraphData = {
            name: string;
            template?: {
                first: PgslExpression | PgslTypeDefinition;
                additional: Array<{
                    value: PgslExpression | PgslTypeDefinition;
                }>;
            };
        };
        this.defineGraphPart('TypeDefinition', this.graph()
            .single('name', PgslToken.Identifier)
            .optional('template', this.graph()
                .single(PgslToken.TemplateListStart)
                .branch('first', [
                    this.partReference('Expression'),
                    this.partReference('TypeDefinition')
                ])
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .branch('value', [
                        this.partReference('Expression'),
                        this.partReference('TypeDefinition')
                    ])
                )
                .single(PgslToken.TemplateListEnd)
            ),
            (_pData: TypeDefinitionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );
    }

    /**
     * Define graphs only for resolving expressions.
     */
    private defineExpression(): void {

        type LogicalExpressionGraphData = {
            leftExpression: PgslExpression;
            operation: string;
            rightExpression: PgslExpression;
        };
        this.defineGraphPart('LogicalExpression', this.graph()
            .single('leftExpression', this.partReference('Expression'))
            .branch('operation', [
                PgslToken.OperatorShortCircuitOr,
                PgslToken.OperatorShortCircuitAnd,
                PgslToken.OperatorMultiply,
                PgslToken.OperatorBinaryOr,
                PgslToken.OperatorBinaryAnd
            ])
            .single('rightExpression', this.partReference('Expression')),
            (_pData: LogicalExpressionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type ArithmeticExpressionGraphData = {
            leftExpression: PgslExpression;
            operation: string;
            rightExpression: PgslExpression;
        };
        this.defineGraphPart('ArithmeticExpression', this.graph()
            .single('leftExpression', this.partReference('Expression'))
            .branch('operation', [
                PgslToken.OperatorPlus,
                PgslToken.OperatorMinus,
                PgslToken.OperatorMultiply,
                PgslToken.OperatorDivide,
                PgslToken.OperatorModulo
            ])
            .single('rightExpression', this.partReference('Expression')),
            (_pData: ArithmeticExpressionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type ComparisonExpressionGraphData = {
            leftExpression: PgslExpression;
            comparison: string;
            rightExpression: PgslExpression;
        };
        this.defineGraphPart('ComparisonExpression', this.graph()
            .single('leftExpression', this.partReference('Expression'))
            .branch('comparison', [
                PgslToken.OperatorEqual,
                PgslToken.OperatorNotEqual,
                PgslToken.OperatorLowerThan,
                PgslToken.OperatorLowerThanEqual,
                PgslToken.OperatorGreaterThan,
                PgslToken.OperatorGreaterThanEqual
            ])
            .single('rightExpression', this.partReference('Expression')),
            (_pData: ComparisonExpressionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type BitExpressionGraphData = {
            leftExpression: PgslExpression;
            operation: string;
            rightExpression: PgslExpression;
        };
        this.defineGraphPart('BitOperationExpression', this.graph()
            .single('leftExpression', this.partReference('Expression'))
            .branch('operation', [
                PgslToken.OperatorBinaryOr,
                PgslToken.OperatorBinaryAnd,
                PgslToken.OperatorBinaryXor,
                PgslToken.OperatorShiftLeft,
                PgslToken.OperatorShiftRight
            ])
            .single('rightExpression', this.partReference('Expression')),
            (_pData: BitExpressionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type UnaryExpressionGraphData = {
            prefix: string;
            expression: PgslExpression;
        };
        this.defineGraphPart('UnaryExpression', this.graph()
            .branch('prefix', [
                PgslToken.OperatorBinaryNegate,
                PgslToken.OperatorMinus,
                PgslToken.OperatorNot
            ])
            .single('expression', this.partReference('Expression')),
            (_pData: UnaryExpressionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type ParenthesizedExpressionGraphData = {
            expression: PgslExpression;
        };
        this.defineGraphPart('ParenthesizedExpression', this.graph()
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference('Expression'))
            .single(PgslToken.ParenthesesEnd),
            (_pData: ParenthesizedExpressionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type FunctionGraphData = {
            name: string;
            parameter?: {
                first: PgslExpression;
                additional: Array<{
                    expression: PgslExpression;
                }>;
            };
            template?: {
                first: PgslExpression | PgslTypeDefinition;
                additional: Array<{
                    value: PgslExpression | PgslTypeDefinition;
                }>;
            };
        };
        this.defineGraphPart('FunctionExpression', this.graph()
            .single('name', PgslToken.Identifier)
            .optional('template', this.graph()
                .single(PgslToken.TemplateListStart)
                .branch('first', [
                    this.partReference('Expression'),
                    this.partReference('TypeDefinition')
                ])
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .branch('value', [
                        this.partReference('Expression'),
                        this.partReference('TypeDefinition')
                    ])
                )
                .single(PgslToken.TemplateListEnd)
            )
            .single(PgslToken.ParenthesesStart)
            .optional('parameter', this.graph()
                .single('first', this.partReference('Expression'))
                .loop('additional', this.graph()
                    .single(PgslToken.Comma).single('expression', this.partReference('Expression'))
                )
            )
            .single(PgslToken.ParenthesesEnd),
            (_pData: FunctionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type AddressOfGraphData = {
            variable: PgslVariableExpression;
        };
        this.defineGraphPart('AddressOfExpression', this.graph()
            .single(PgslToken.OperatorBinaryAnd)
            .single('variable', this.partReference('VariableExpression')),
            (_pData: AddressOfGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type PointerGraphData = {
            variable: PgslVariableExpression;
        };
        this.defineGraphPart('PointerExpression', this.graph()
            .single(PgslToken.OperatorMultiply)
            .single('variable', this.partReference('VariableExpression')),
            (_pData: PointerGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type LiteralValueGraphData = {
            value: {
                float: string,
                integer: string,
                boolean: string;
            };
        };
        this.defineGraphPart('LiteralValueExpression', this.graph()
            .branch('value', [
                this.graph().single('float', PgslToken.LiteralFloat),
                this.graph().single('integer', PgslToken.LiteralInteger),
                this.graph().single('boolean', PgslToken.LiteralBoolean)
            ]),
            (_pData: LiteralValueGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type ExpressionGraphData = {
            expression: PgslLiteralValue;
        };
        this.defineGraphPart('Expression', this.graph()
            .branch('expression', [
                this.partReference('VariableExpression'), // => defineVariableExpression
                this.partReference('LiteralValueExpression'),
                this.partReference('PointerExpression'),
                this.partReference('AddressOfExpression'),
                this.partReference('FunctionExpression'),
                this.partReference('UnaryExpression'),
                this.partReference('BitOperationExpression'),
                this.partReference('ComparisonExpression'),
                this.partReference('ArithmeticExpression'),
                this.partReference('LogicalExpression'),
            ]),
            (_pData: ExpressionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );
    }

    /**
     * Define all statements and flows used inside function scope.
     */
    private defineFunctionScope(): void {
        // If Statement
        //      if(<expression>)<block> 
        //      else if(<expression>)<block> *
        //      else <block> ?

        // Switch Statement
        //      switch(<expression>){<case>|<default>}
        //      case <expression>,+: <block> *
        //      default <expression>: <block> ?

        // For-Loop
        //      for(<declaration>?;<expression>;<expression>)<block>

        // While-Loop
        //      while(<expression>)<block>

        // Do-While
        //      do <block> while(<expression>);

        // Break
        //      break;

        // Continue 
        //      continue;

        // Return 
        //      return <expression>?;

        // Discard 
        //      discard;

        type FunctionScopeVariableDeclarationGraphData = {
            variableName: string,
            declarationType: string;
            type: PgslTypeDefinition;
            expression?: PgslExpression;
        };
        this.defineGraphPart('FunctionScopeVariableDeclaration', this.graph()
            .branch('declarationType', [
                PgslToken.KeywordDeclarationConst,
                PgslToken.KeywordDeclarationLet
            ])
            .single('variableName', PgslToken.Identifier).single(PgslToken.Colon)
            .single('type', this.partReference('TypeDefinition'))
            .branch([
                PgslToken.Semicolon,
                this.graph().single(PgslToken.Assignment).single('expression', this.partReference('Expression')).single(PgslToken.Semicolon)
            ]),
            (_pData: FunctionScopeVariableDeclarationGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        // Assignment Statement
        //      <compositeValue> = <expression>;
        //      _ = <expression>; //  phony assignment  ??? Eval or drop.
        //      <compositeValue> += <expression>;
        //      <compositeValue> -= <expression>;
        //      <compositeValue> *= <expression>;
        //      <compositeValue> |= <expression>;
        //      <compositeValue> %= <expression>;
        //      <compositeValue> &= <expression>;
        //      <compositeValue> |= <expression>;
        //      <compositeValue> ^= <expression>;
        //      <compositeValue> >>= <expression>;
        //      <compositeValue> <<= <expression>;

        // Increment and Decrement Statements
        //      <compositeValue>++;
        //      <compositeValue>--;
        //      Composite Value Decomposition Expressions 
        //          val.prop++
        //          val[x]++

        // Function call statement. Same as function call expression but without value.
        //       <ident><templateList>(<expression>,*)

        // Block. Can be a standalone inside function scope.
        //      { <statement>;* }
    }

    /**
     * Define all graphs used inside module scope.
     */
    private defineModuleScope(): void {
        type ModuleScopeVariableDeclarationGraphData = {
            attributes?: PgslAttributeList;
            variableName: string,
            declarationType: string;
            type: PgslTypeDefinition;
            expression?: PgslExpression;
        };
        this.defineGraphPart('ModuleScopeVariableDeclaration', this.graph()
            .optional('attributes', this.partReference('AttributeList'))
            .branch('declarationType', [
                PgslToken.KeywordDeclarationStorage,
                PgslToken.KeywordDeclarationUniform,
                PgslToken.KeywordDeclarationWorkgroup,
                PgslToken.KeywordDeclarationPrivate,
                PgslToken.KeywordDeclarationConst,
                PgslToken.KeywordDeclarationParam
            ])
            .single('variableName', PgslToken.Identifier).single(PgslToken.Colon)
            .single('type', this.partReference('TypeDefinition'))
            .branch([
                PgslToken.Semicolon,
                this.graph().single(PgslToken.Assignment).single('expression', this.partReference('Expression')).single(PgslToken.Semicolon)
            ]),
            (_pData: ModuleScopeVariableDeclarationGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type AliasDeclarationGraphData = {
            aliasName: string;
        };
        this.defineGraphPart('AliasDeclaration', this.graph()
            .single(PgslToken.KeywordAlias)
            .single('aliasName', PgslToken.Identifier).single(PgslToken.Assignment)
            .single('type', this.partReference('TypeDefinition')).single(PgslToken.Semicolon),
            (_pData: AliasDeclarationGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type EnumDeclarationGraphData = {
            name: string;
            values?: {
                first: {
                    name: string,
                    value: PgslLiteralValue;
                },
                additional: Array<{
                    name: string,
                    value: PgslLiteralValue;
                }>;
            };
        };
        this.defineGraphPart('EnumDeclaration', this.graph()
            .single(PgslToken.KeywordEnum)
            .single('name', PgslToken.Identifier)
            .single(PgslToken.BlockStart)
            .optional('values', this.graph()
                .single('name', PgslToken.Identifier)
                .single(PgslToken.Assignment)
                .branch('value', [
                    this.partReference('TypeDefinition')
                ])
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .single('name', PgslToken.Identifier)
                    .single(PgslToken.Assignment)
                    .branch('value', [
                        this.partReference('TypeDefinition')
                    ])
                )
            )
            .single(PgslToken.BlockEnd),
            (_pData: EnumDeclarationGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type StructDeclarationGraphData = {
            name: string;
            values?: {
                first: {
                    attributes?: PgslAttributeList,
                    name: string;
                    value: PgslLiteralValue;
                },
                additional: Array<{
                    attributes?: PgslAttributeList;
                    name: string;
                    value: PgslLiteralValue;
                }>;
            };
        };
        this.defineGraphPart('StructDeclaration', this.graph()
            .single(PgslToken.KeywordStruct)
            .single('name', PgslToken.Identifier)
            .single(PgslToken.BlockStart)
            .optional('values', this.graph()
                .optional('attributes', this.partReference('AttributeList'))
                .single('name', PgslToken.Identifier)
                .single(PgslToken.Assignment)
                .branch('value', [
                    this.partReference('TypeDefinition')
                ])
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .optional('attributes', this.partReference('AttributeList'))
                    .single('name', PgslToken.Identifier)
                    .single(PgslToken.Assignment)
                    .branch('value', [
                        this.partReference('TypeDefinition')
                    ])
                )
            )
            .single(PgslToken.BlockEnd),
            (_pData: StructDeclarationGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type FunctionDeclarationGraphData = {
            attributes: PgslAttributeList;
            name: string;
            parameter: {
                first: {
                    name: string;
                    type: PgslTypeDefinition;
                };
                additional: Array<{
                    name: string;
                    type: PgslTypeDefinition;
                }>;
            };
        };
        this.defineGraphPart('FunctionDeclaration', this.graph()
            .optional('attributes', this.partReference('AttributeList'))
            .single(PgslToken.KeywordFunction)
            .single('name', PgslToken.Identifier)
            .single(PgslToken.ParenthesesStart)
            .optional('parameter', this.graph()
                .single('first', this.graph()
                    .single('name', PgslToken.Identifier)
                    .single('type', this.partReference('TypeDefinition'))
                )
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .single('name', PgslToken.Identifier)
                    .single('type', this.partReference('TypeDefinition'))
                )
            )
            .single(PgslToken.ParenthesesEnd)
            .single('name', this.partReference('Block')),
            (_pData: FunctionDeclarationGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );
    }

    /**
     * Define root graph.
     */
    private defineRoot(): void {
        type PgslDocumentGraphData = {
            list: Array<{
                content: any;
            }>;
        };
        this.defineGraphPart('document', this.graph()
            .loop('list', this.graph()
                .branch('content', [
                    this.partReference('Comment'),
                    this.partReference('AliasDeclaration'),
                    this.partReference('ModuleScopeVariableDeclaration'),
                    this.partReference('EnumDeclaration'),
                    this.partReference('StructDeclaration'),
                    this.partReference('FunctionDeclaration')
                ])
            ),
            (_pData: PgslDocumentGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        // Define root part.
        this.setRootGraphPart('document');
    }

    /**
     * Define variable expressions used for assigning or reading values.
     */
    private defineVariableExpression(): void {
        type VariableNameExpressionGraphData = {
            name: string;
        };
        this.defineGraphPart('VariableNameExpression', this.graph()
            .single('name', PgslToken.Identifier),
            (pData: VariableNameExpressionGraphData) => {
                return new PgslVariableExpression(pData.name);
            }
        );

        type IndexValueExpressionGraphData = {
            valueExpression: PgslExpression;
            indexExpression: string;
        };
        this.defineGraphPart('IndexValueExpression', this.graph()
            .single('valueExpression', this.partReference('Expression'))
            .single(PgslToken.ListStart)
            .single('indexExpression', this.partReference('Expression'))
            .single(PgslToken.ListEnd),
            (_pData: IndexValueExpressionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type CompositeValueDecompositionExpressionGraphData = {
            leftExpression: PgslExpression;
            propertyName: string;
        };
        this.defineGraphPart('CompositeValueDecompositionExpression', this.graph()
            .single('leftExpression', this.partReference('Expression'))
            .single(PgslToken.MemberDelimiter)
            .single('propertyName', PgslToken.Identifier),
            (_pData: CompositeValueDecompositionExpressionGraphData) => {
                // TODO: enum.value ?? How to distinct

                // TODO: Yes this needs to be parsed.
            }
        );

        type VariableExpressionGraphData = {
            expression: PgslExpression;
        };
        this.defineGraphPart('VariableExpression', this.graph()
            .branch('content', [
                this.partReference('VariableNameExpression'),
                this.partReference('IndexValueExpression'),
                this.partReference('CompositeValueDecompositionExpression')
            ]),
            (_pData: VariableExpressionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );
    }
}