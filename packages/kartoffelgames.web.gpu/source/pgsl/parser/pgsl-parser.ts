import { CodeParser } from '@kartoffelgames/core.parser';
import { PgslDocument } from '../pgsl-document';
import { PgslExpression } from '../structure/expression/pgsl-expression';
import { PgslAttributeList } from '../structure/general/pgsl-attribute-list';
import { PgslTypeDefinition } from '../structure/type/pgsl-type-definition';
import { PgslLexer } from './pgsl-lexer';
import { PgslToken } from './pgsl-token.enum';
import { PgslLiteralValue } from '../structure/expression/pgsl-literal-value';

export class PgslParser extends CodeParser<PgslToken, PgslDocument> {
    /**
     * Constructor.
     */
    public constructor() {
        super(new PgslLexer());

        // TODO: Preparse steps. Setup with #import or something.

        // Define helper graphs.
        this.defineCore();
        this.defineExpression();
        this.defineModuleScope();
        this.defineFlow();
        this.defineFunctionScope();

        // Set root.
        this.defineRoot();
    }

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

        // Block. Can be a standalone inside function scope.
        //      { <statement>;* }
    }

    private defineExpression(): void {
        // Variable expression
        //      <ident>

        // Composite Value Decomposition Expressions
        //      value[1]
        //      something.other
        //      vec3<f32>(1., 2., 3.).xyz
        //          => Maybe <expression>[x] and <expression>.prop
        //      enum.value ?? How to distinct

        // Logical Expressions
        //      <expression> || <expression>
        //      <expression> && <expression>
        //      <expression> | <expression>
        //      <expression> & <expression>

        // Arithmetic Expressions

        //      <expression> + <expression>
        //      <expression> - <expression>
        //      <expression> * <expression>
        //      <expression> / <expression>
        //      <expression> % <expression>

        // Comparison Expressions
        //      <expression> == <expression>
        //      <expression> != <expression>
        //      <expression> < <expression>
        //      <expression> <= <expression>
        //      <expression> > <expression>
        //      <expression> >= <expression>

        // Bit Expressions
        //      <expression> | <expression>
        //      <expression> & <expression>
        //      <expression> ^ <expression>
        //      <expression> << <expression>
        //      <expression> >> <expression>

        // Unary expressions
        //      ~<expression>
        //      -<expression>
        //      !<expression>

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
            name: string;
        };
        this.defineGraphPart('AddressOfExpression', this.graph()
            .single(PgslToken.OperatorBinaryAnd)
            .single('name', PgslToken.Identifier),
            (_pData: AddressOfGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type PointerGraphData = {
            name: string;
        };
        this.defineGraphPart('PointerExpression', this.graph()
            .single(PgslToken.OperatorMultiply)
            .single('name', PgslToken.Identifier),
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
                this.partReference('LiteralValueExpression'),
                this.partReference('PointerExpression'),
                this.partReference('AddressOfExpression'),
                this.partReference('FunctionExpression')
            ]),
            (_pData: ExpressionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );
    }

    private defineFlow(): void {
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
    }

    private defineFunctionScope(): void {
        // declaration expression.
        //      let <ident>: <ident>;
        //      const <ident>: <ident> = <expression>;

        // Assignment Statement
        //      <ident> = <expression>;
        //      _ = <expression>; //  phony assignment  ??? Eval or drop.
        //      <ident> += <expression>;
        //      <ident> -= <expression>;
        //      <ident> *= <expression>;
        //      <ident> |= <expression>;
        //      <ident> %= <expression>;
        //      <ident> &= <expression>;
        //      <ident> |= <expression>;
        //      <ident> ^= <expression>;
        //      <ident> >>= <expression>;
        //      <ident> <<= <expression>;
        //      Composite Value Decomposition Expressions 
        //          val.prop += 1
        //          val[x] += 1

        // Increment and Decrement Statements
        //      <ident>++;
        //      <ident>--;
        //      Composite Value Decomposition Expressions 
        //          val.prop++
        //          val[x]++

        // Function call statement. Same as function call expression but without value.
        //       <ident><templateList>(<expression>,*)

        // Block. Can be a standalone inside function scope.
        //      { <statement>;* }
    }

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

        // Structs . Dont forgett <paramlist>
        type StructDeclarationGraphData = {
            name: string;
            values?: {
                first: {
                    attributes: PgslAttributeList,
                    name: string;
                    value: PgslLiteralValue;
                },
                additional: Array<{
                    attributes: PgslAttributeList;
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

        // Function flow
        //      <paramlist> function <ident>(<paramlist> ident:type,*): <paramlist> type? <block>
    }

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
                    this.partReference('ModuleScopeVariableDeclaration'),
                    this.partReference('EnumDeclaration'),
                ])
            ),
            (_pData: PgslDocumentGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        // Define root part.
        this.setRootGraphPart('document');
    }
}