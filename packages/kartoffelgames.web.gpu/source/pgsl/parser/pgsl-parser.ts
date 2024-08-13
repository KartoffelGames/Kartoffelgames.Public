import { EnumUtil } from '@kartoffelgames/core';
import { CodeParser } from '@kartoffelgames/core.parser';
import { PgslOperator } from '../enum/pgsl-operator.enum';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';
import { PgslDocument } from '../pgsl-document';
import { PgslAddressOfExpression } from '../structure/expression/pgsl-address-of-expression';
import { PgslArithmeticExpression } from '../structure/expression/pgsl-arithmetic-expression';
import { PgslBinaryExpression as PgslBitExpression } from '../structure/expression/pgsl-bit-expression';
import { PgslComparisonExpression } from '../structure/expression/pgsl-comparison-expression';
import { PgslExpression } from '../structure/expression/pgsl-expression';
import { PgslLiteralValue } from '../structure/expression/pgsl-literal-value';
import { PgslParenthesizedExpression } from '../structure/expression/pgsl-parenthesized-expression';
import { PgslPointerExpression } from '../structure/expression/pgsl-pointer-expression';
import { PgslUnaryExpression } from '../structure/expression/pgsl-unary-expression';
import { PgslVariableExpression } from '../structure/expression/variable/pgsl-variable-expression';
import { PgslVariableIndexNameExpression } from '../structure/expression/variable/pgsl-variable-index-expression';
import { PgslVariableNameExpression } from '../structure/expression/variable/pgsl-variable-name-expression';
import { PgslAttributeList } from '../structure/general/pgsl-attribute-list';
import { PgslTemplateList } from '../structure/general/pgsl-template-list';
import { PgslBlockStatement } from '../structure/statement/pgsl-block-statement';
import { PgslIfStatement } from '../structure/statement/pgsl-if-statement';
import { PgslStatement } from '../structure/statement/pgsl-statement';
import { PgslTypeDefinition } from '../structure/type/pgsl-type-definition';
import { PgslLexer } from './pgsl-lexer';
import { PgslToken } from './pgsl-token.enum';
import { PgslLogicalExpression } from '../structure/expression/pgsl-logical-expression';
import { PgslCompositeValueDecompositionVariableExpression } from '../structure/expression/variable/pgsl-composite-value-decomposition-variable-expression';
import { PgslEnumDeclaration } from '../structure/declarations/pgsl-enum-declaration';

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
        // TODO: Build PgslDocument and let it fill.

        return super.parse(pCodeText);
    }

    /**
     * Define core graphs used by different scopes.
     */
    private defineCore(): void {
        this.defineGraphPart('Comment', this.graph()
            .single(PgslToken.Comment),
            (): null => {
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
            (pData: AttributeListGraphData) => {
                // Create attribute list.
                const lAttributeList: PgslAttributeList = new PgslAttributeList();
                for (const lAttribute of pData.list) {
                    // Build parameter list of attribute.
                    const lParameterList: Array<PgslExpression> = new Array<PgslExpression>();
                    if (lAttribute.parameter) {
                        // Add first expression.
                        lParameterList.push(lAttribute.parameter?.first);

                        // Add additional items.
                        for (const lItem of lAttribute.parameter.additional) {
                            lParameterList.push(lItem.expression);
                        }
                    }

                    // Add each attribute with parameters.
                    lAttributeList.addAttribute(lAttribute.name, lParameterList);
                }

                return lAttributeList;
            }
        );

        type ForcedTemplateTypeDefinitionGraphData = {
            name: string;
            templateList: PgslTemplateList;
        };
        this.defineGraphPart('TypeDefinition-ForcedTemplate', this.graph()
            .single('name', PgslToken.Identifier)
            .single('templateList', this.partReference('TemplateList')),
            (_pData: ForcedTemplateTypeDefinitionGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type TemplateListGraphData = {
            first: PgslExpression | PgslTypeDefinition;
            additional: Array<{
                value: PgslExpression | PgslTypeDefinition;
            }>;
        };
        this.defineGraphPart('TemplateList', this.graph()
            .single(PgslToken.TemplateListStart)
            .branch('first', [
                this.partReference('Expression'),
                this.partReference('TypeDefinition-ForcedTemplate')
            ])
            .loop('additional', this.graph()
                .single(PgslToken.Comma)
                .branch('value', [
                    this.partReference('Expression'),
                    this.partReference('TypeDefinition-ForcedTemplate')
                ])
            )
            .single(PgslToken.TemplateListEnd),
            (pData: TemplateListGraphData) => {
                const lTemplateList: PgslTemplateList = new PgslTemplateList();

                // Add first expression.
                lTemplateList.setItem(pData.first);

                // Add additional items.
                for (const lItem of pData.additional) {
                    lTemplateList.setItem(lItem.value);
                }

                return lTemplateList;
            }
        );

        type TypeDefinitionGraphData = {
            name: string;
            templateList?: PgslTemplateList;
        };
        this.defineGraphPart('TypeDefinition', this.graph()
            .single('name', PgslToken.Identifier)
            .optional('templateList', this.partReference('TemplateList')),
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
            (pData: LogicalExpressionGraphData) => {
                const lLogicalExpression: PgslLogicalExpression = new PgslLogicalExpression();
                lLogicalExpression.leftExpression = pData.leftExpression;
                lLogicalExpression.operator = EnumUtil.cast(PgslOperator, pData.operation)!;
                lLogicalExpression.rightExpression = pData.rightExpression;

                return lLogicalExpression;
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
            (pData: ArithmeticExpressionGraphData) => {
                const lArithmeticExpression: PgslArithmeticExpression = new PgslArithmeticExpression();
                lArithmeticExpression.leftExpression = pData.leftExpression;
                lArithmeticExpression.operator = EnumUtil.cast(PgslOperator, pData.operation)!;
                lArithmeticExpression.rightExpression = pData.rightExpression;

                return lArithmeticExpression;
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
            (pData: ComparisonExpressionGraphData) => {
                const lComparisonExpression: PgslComparisonExpression = new PgslComparisonExpression();
                lComparisonExpression.leftExpression = pData.leftExpression;
                lComparisonExpression.comparison = EnumUtil.cast(PgslOperator, pData.comparison)!;
                lComparisonExpression.rightExpression = pData.rightExpression;

                return lComparisonExpression;
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
            (pData: BitExpressionGraphData) => {
                const lUnaryExpression: PgslBitExpression = new PgslBitExpression();
                lUnaryExpression.leftExpression = pData.leftExpression;
                lUnaryExpression.operator = EnumUtil.cast(PgslOperator, pData.operation)!;
                lUnaryExpression.rightExpression = pData.rightExpression;

                return lUnaryExpression;
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
            (pData: UnaryExpressionGraphData) => {
                const lUnaryExpression: PgslUnaryExpression = new PgslUnaryExpression();
                lUnaryExpression.expression = pData.expression;
                lUnaryExpression.operator = EnumUtil.cast(PgslOperator, pData.prefix)!;

                return lUnaryExpression;
            }
        );

        type ParenthesizedExpressionGraphData = {
            expression: PgslExpression;
        };
        this.defineGraphPart('ParenthesizedExpression', this.graph()
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference('Expression'))
            .single(PgslToken.ParenthesesEnd),
            (pData: ParenthesizedExpressionGraphData) => {
                const lParenthesizedExpression: PgslParenthesizedExpression = new PgslParenthesizedExpression();
                lParenthesizedExpression.expression = pData.expression;

                return lParenthesizedExpression;
            }
        );

        type FunctionGraphData = {
            name: string;
            templateList?: PgslTemplateList;
            parameter?: {
                first: PgslExpression;
                additional: Array<{
                    expression: PgslExpression;
                }>;
            };
        };
        this.defineGraphPart('FunctionExpression', this.graph()
            .single('name', PgslToken.Identifier)
            .optional('templateList', this.partReference('TemplateList'))
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
            (pData: AddressOfGraphData): PgslAddressOfExpression => {
                const lAddressOfExpression: PgslAddressOfExpression = new PgslAddressOfExpression();
                lAddressOfExpression.variable = pData.variable;

                return lAddressOfExpression;
            }
        );

        type PointerGraphData = {
            variable: PgslVariableExpression;
        };
        this.defineGraphPart('PointerExpression', this.graph()
            .single(PgslToken.OperatorMultiply)
            .single('variable', this.partReference('VariableExpression')),
            (pData: PointerGraphData): PgslPointerExpression => {
                const lPointerExpression: PgslPointerExpression = new PgslPointerExpression();
                lPointerExpression.variable = pData.variable;

                return lPointerExpression;
            }
        );

        type LiteralValueGraphData = {
            value: {
                float?: string,
                integer?: string,
                boolean?: string;
            };
        };
        this.defineGraphPart('LiteralValueExpression', this.graph()
            .branch('value', [
                this.graph().single('float', PgslToken.LiteralFloat),
                this.graph().single('integer', PgslToken.LiteralInteger),
                this.graph().single('boolean', PgslToken.LiteralBoolean)
            ]),
            (pData: LiteralValueGraphData): PgslLiteralValue => {
                const lPgslLiteralValue: PgslLiteralValue = new PgslLiteralValue();

                if ('float' in pData.value) {
                    lPgslLiteralValue.setFromText(pData.value.float, PgslTypeName.Float);
                } else if ('integer' in pData.value) {
                    lPgslLiteralValue.setFromText(pData.value.integer, PgslTypeName.Integer);
                } else if ('boolean' in pData.value) {
                    lPgslLiteralValue.setFromText(pData.value.boolean, PgslTypeName.Boolean);
                }

                return lPgslLiteralValue;
            }
        );

        type ExpressionGraphData = {
            expression: PgslExpression;
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
            (pData: ExpressionGraphData): PgslExpression => {
                return pData.expression;
            }
        );
    }

    /**
     * Define all statements and flows used inside function scope.
     */
    private defineFunctionScope(): void {
        type IfStatementGraphData = {
            block: PgslBlockStatement;
            expression: PgslExpression;
            ifElse?: {
                if: PgslIfStatement;
            };
            else?: {
                block: PgslBlockStatement;
            };
        };
        this.defineGraphPart('IfStatement', this.graph()
            .single(PgslToken.KeywordIf)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference('FunctionBlock'))
            .optional('ifElse', this.graph()
                .single(PgslToken.KeywordElse)
                .single('if', this.partReference('IfStatement'))
            )
            .optional('else', this.graph()
                .single(PgslToken.KeywordElse)
                .single('block', this.partReference('FunctionBlock'))
            ),
            (_pData: IfStatementGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type SwitchStatementGraphData = {
            expression: PgslExpression,
            cases: Array<{
                expression: PgslExpression,
                additionals: Array<{
                    expression: PgslExpression;
                }>;
                block: PgslBlockStatement;
            }>,
            default?: {
                block: PgslBlockStatement;
            };
        };
        this.defineGraphPart('SwitchStatement', this.graph()
            .single(PgslToken.KeywordSwitch)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single(PgslToken.BlockStart)
            .loop('cases', this.graph()
                .single(PgslToken.KeywordCase)
                .single('expression', this.partReference('Expression'))
                .loop('additionals', this.graph()
                    .single(PgslToken.Comma)
                    .single('expression', this.partReference('Expression'))
                )
                .single('block', this.partReference('FunctionBlock'))
            )
            .optional('default', this.graph()
                .single(PgslToken.KeywordDefault)
                .single('block', this.partReference('FunctionBlock'))
            )
            .single(PgslToken.BlockEnd),
            (_pData: SwitchStatementGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type ForStatementGraphData = {
            declaration: PgslStatement | string;
            expression?: PgslExpression;
            statement?: PgslStatement;
            block: PgslBlockStatement;
        };
        this.defineGraphPart('ForStatement', this.graph()
            .single(PgslToken.KeywordFor)
            .single(PgslToken.ParenthesesStart)
            .branch('declaration', [
                this.partReference('FunctionScopeVariableDeclaration'), // Includes semicolon
                PgslToken.Semicolon
            ])
            .optional('expression', this.partReference('Expression'))
            .single(PgslToken.Semicolon)
            .single('statement', this.partReference('Statement')) // TODO: Remove semicolon somehow.
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference('FunctionBlock')),
            (_pData: ForStatementGraphData) => {
                // TODO: Yes this needs to be parsed.

                // TODO: Statement must eighter be a functionCall | Assignment | IncrementDecrement
            }
        );

        type WhileStatementGraphData = {
            block: PgslBlockStatement;
            expression: PgslExpression;
        };
        this.defineGraphPart('WhileStatement', this.graph()
            .single(PgslToken.KeywordWhile)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference('FunctionBlock')),
            (_pData: WhileStatementGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type DoWhileStatementGraphData = {
            block: PgslBlockStatement;
            expression: PgslExpression;
        };
        this.defineGraphPart('DoWhileStatement', this.graph()
            .single(PgslToken.KeywordDo)
            .single('block', this.partReference('FunctionBlock'))
            .single(PgslToken.KeywordWhile)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single(PgslToken.Semicolon),
            (_pData: DoWhileStatementGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type BreakStatementGraphData = {};
        this.defineGraphPart('BreakStatement', this.graph()
            .single(PgslToken.KeywordBreak)
            .single(PgslToken.Semicolon),
            (_pData: BreakStatementGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type ContinueStatementGraphData = {};
        this.defineGraphPart('ContinueStatement', this.graph()
            .single(PgslToken.KeywordContinue)
            .single(PgslToken.Semicolon),
            (_pData: ContinueStatementGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type ReturnStatementGraphData = {
            expression: PgslExpression;
        };
        this.defineGraphPart('ReturnStatement', this.graph()
            .single(PgslToken.KeywordContinue)
            .optional('expression', this.partReference('Expression'))
            .single(PgslToken.Semicolon),
            (_pData: ReturnStatementGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type DiscardStatementGraphData = {};
        this.defineGraphPart('DiscardStatement', this.graph()
            .single(PgslToken.KeywordDiscard)
            .single(PgslToken.Semicolon),
            (_pData: DiscardStatementGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

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

        type AssignmentStatementGraphData = {
            variable: PgslVariableExpression;
            assignment: string;
            expression: PgslExpression;
        };
        this.defineGraphPart('AssignmentStatement', this.graph()
            .single('variable', this.partReference('VariableExpression'))
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
            .single('expression', this.partReference('Expression'))
            .single(PgslToken.Semicolon),
            (_pData: AssignmentStatementGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type IncrementDecrementStatementGraphData = {
            variable: PgslVariableExpression;
            operation: string;
        };
        this.defineGraphPart('IncrementDecrementStatement', this.graph()
            .single('variable', this.partReference('VariableExpression'))
            .branch('', [
                PgslToken.OperatorIncrement,
                PgslToken.OperatorDecrement
            ]),
            (_pData: IncrementDecrementStatementGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type FunctionCallStatementGraphData = {
            name: string;
            templateList?: PgslTemplateList;
            parameter?: {
                first: PgslExpression;
                additional: Array<{
                    expression: PgslExpression;
                }>;
            };
        };
        this.defineGraphPart('FunctionCallStatement', this.graph()
            .single('name', PgslToken.Identifier)
            .optional('templateList', this.partReference('TemplateList'))
            .single(PgslToken.ParenthesesStart)
            .optional('parameter', this.graph()
                .single('first', this.partReference('Expression'))
                .loop('additional', this.graph()
                    .single(PgslToken.Comma).single('expression', this.partReference('Expression'))
                )
            )
            .single(PgslToken.ParenthesesEnd)
            .single(PgslToken.Semicolon),
            (_pData: FunctionCallStatementGraphData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        type FunctionBlockGraphData = {
            statements: Array<PgslStatement>;
        };
        this.defineGraphPart('FunctionBlock', this.graph()
            .single(PgslToken.BlockStart)
            .loop('statements', this.partReference('Statement'))
            .single(PgslToken.BlockEnd),
            (pData: FunctionBlockGraphData) => {
                const lBlockStatement: PgslBlockStatement = new PgslBlockStatement();

                // Add all statements.
                for (const lStatement of pData.statements) {
                    lBlockStatement.addStatement(lStatement);
                }

                return lBlockStatement;
            }
        );

        type StatementGraphData = {
            statement: PgslStatement;
        };
        this.defineGraphPart('Statement', this.graph()
            .branch('statement', [
                this.partReference('IfStatement'),
                this.partReference('SwitchStatement'),
                this.partReference('ForStatement'),
                this.partReference('WhileStatement'),
                this.partReference('DoWhileStatement'),
                this.partReference('BreakStatement'),
                this.partReference('ContinueStatement'),
                this.partReference('ReturnStatement'),
                this.partReference('DiscardStatement'),
                this.partReference('FunctionScopeVariableDeclaration'),
                this.partReference('AssignmentStatement'),
                this.partReference('IncrementDecrementStatement'),
                this.partReference('FunctionCallStatement'),
                this.partReference('FunctionBlock')
            ]),
            (pData: StatementGraphData): PgslStatement => {
                return pData.statement;
            }
        );
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
            (pData: EnumDeclarationGraphData) => {
                const lEnumDeclaration: PgslEnumDeclaration = new PgslEnumDeclaration();
                lEnumDeclaration.name = pData.name;

                if (pData.values) {
                    // Add first value.
                    lEnumDeclaration.addValue(pData.values.first.name, pData.values.first.value.value);

                    // Add additional values.
                    for (const lValues of pData.values.additional) {
                        lEnumDeclaration.addValue(lValues.name, lValues.value.value);
                    }
                }

                return lEnumDeclaration;
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
                .single(PgslToken.Colon)
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
            returnType: PgslTypeDefinition;
            block: PgslBlockStatement;
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
            .single(PgslToken.Colon)
            .single('returnType', this.partReference('TypeDefinition'))
            .single('block', this.partReference('FunctionBlock')),
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
            (pData: VariableNameExpressionGraphData): PgslVariableNameExpression => {
                const lPgslVariableName: PgslVariableNameExpression = new PgslVariableNameExpression();
                lPgslVariableName.name = pData.name;

                return lPgslVariableName;
            }
        );

        type VariableIndexExpressionGraphData = {
            variableExpression: PgslVariableExpression;
            indexExpression: PgslExpression;
        };
        this.defineGraphPart('IndexValueExpression', this.graph()
            .single('variableExpression', this.partReference('VariableExpression'))
            .single(PgslToken.ListStart)
            .single('indexExpression', this.partReference('Expression'))
            .single(PgslToken.ListEnd),
            (pData: VariableIndexExpressionGraphData): PgslVariableIndexNameExpression => {
                const lIndexValueExpression: PgslVariableIndexNameExpression = new PgslVariableIndexNameExpression();
                lIndexValueExpression.variable = pData.variableExpression;
                lIndexValueExpression.index = pData.indexExpression;

                return lIndexValueExpression;
            }
        );

        type CompositeValueDecompositionExpressionGraphData = {
            leftExpression: PgslExpression;
            propertyName: string;
        };
        this.defineGraphPart('CompositeValueDecompositionExpression', this.graph()
            .single('leftExpression', this.partReference('VariableExpression'))
            .single(PgslToken.MemberDelimiter)
            .single('propertyName', PgslToken.Identifier),
            (pData: CompositeValueDecompositionExpressionGraphData) => {
                // TODO: enum.value ?? How to distinct

                const lVariableExpression: PgslCompositeValueDecompositionVariableExpression = new PgslCompositeValueDecompositionVariableExpression();
                lVariableExpression.property = pData.propertyName;
                lVariableExpression.variable = pData.leftExpression;

                return lVariableExpression;
            }
        );

        type VariableExpressionGraphData = {
            expression: PgslVariableExpression;
        };
        this.defineGraphPart('VariableExpression', this.graph()
            .branch('expression', [
                this.partReference('VariableNameExpression'),
                this.partReference('IndexValueExpression'),
                this.partReference('CompositeValueDecompositionExpression')
            ]),
            (pData: VariableExpressionGraphData): PgslVariableExpression => {
                return pData.expression;
            }
        );
    }
}