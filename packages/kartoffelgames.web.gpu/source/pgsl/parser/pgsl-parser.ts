import { EnumUtil } from '@kartoffelgames/core';
import { CodeParser, LexerToken } from '@kartoffelgames/core.parser';
import { PgslOperator } from '../enum/pgsl-operator.enum';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';
import { PgslSyntaxTreeDataStructure } from '../syntax_tree/base-pgsl-syntax-tree';
import { PgslAliasDeclaration } from '../syntax_tree/declarations/pgsl-alias-declaration';
import { PgslEnumDeclaration } from '../syntax_tree/declarations/pgsl-enum-declaration';
import { PgslAddressOfExpression } from '../syntax_tree/expression/pgsl-address-of-expression';
import { PgslArithmeticExpression } from '../syntax_tree/expression/pgsl-arithmetic-expression';
import { PgslBinaryExpression as PgslBitExpression } from '../syntax_tree/expression/pgsl-bit-expression';
import { PgslComparisonExpression } from '../syntax_tree/expression/pgsl-comparison-expression';
import { PgslExpression, PgslExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/pgsl-expression-syntax-tree';
import { PgslFunctionCallExpression } from '../syntax_tree/expression/pgsl-function-call-expression';
import { PgslLiteralValueExpressionSyntaxTreeStructureData } from '../syntax_tree/expression/pgsl-literal-value-expression-syntax-tree';
import { PgslLogicalExpression } from '../syntax_tree/expression/pgsl-logical-expression';
import { PgslParenthesizedExpression } from '../syntax_tree/expression/pgsl-parenthesized-expression';
import { PgslPointerExpression } from '../syntax_tree/expression/pgsl-pointer-expression';
import { PgslUnaryExpression } from '../syntax_tree/expression/pgsl-unary-expression';
import { PgslCompositeValueDecompositionVariableExpression } from '../syntax_tree/expression/variable/pgsl-composite-value-decomposition-variable-expression';
import { PgslVariableExpression } from '../syntax_tree/expression/variable/pgsl-variable-expression';
import { PgslVariableIndexNameExpression } from '../syntax_tree/expression/variable/pgsl-variable-index-expression';
import { PgslVariableNameExpression } from '../syntax_tree/expression/variable/pgsl-variable-name-expression';
import { PgslAttributeList } from '../syntax_tree/general/pgsl-attribute-list';
import { PgslTemplateList, PgslTemplateListSyntaxTreeStructureData } from '../syntax_tree/general/pgsl-template-list-syntax-tree';
import { PgslTypeDefinitionSyntaxTreeStructureData } from '../syntax_tree/general/pgsl-type-definition-syntax-tree';
import { PgslModuleSyntaxTree, PgslModuleSyntaxTreeStructureData } from '../syntax_tree/pgsl-module-syntax-tree';
import { PgslBlockStatement } from '../syntax_tree/statement/pgsl-block-statement';
import { PgslFunctionCallStatement } from '../syntax_tree/statement/pgsl-function-call-statement';
import { PgslIfStatement } from '../syntax_tree/statement/pgsl-if-statement';
import { PgslStatement } from '../syntax_tree/statement/pgsl-statement';
import { PgslLexer } from './pgsl-lexer';
import { PgslToken } from './pgsl-token.enum';

export class PgslParser extends CodeParser<PgslToken, PgslModuleSyntaxTree> {
    /**
     * Constructor.
     */
    public constructor() {
        super(new PgslLexer());

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


        // TODO: Build PgslDocument.
        // TODO: Insert imports. #IMPORT

        // TODO: Replace comments with same amount of spaces ans newlines.
        // TODO: Setup #IFDEF. Fill Replaced '#IFDEFs, #ENDIFDEF with same amount of spaces and newlines.

        // TODO: Remove any other # statements as they do nothing. Replace with same amount of spaces and newlines.

        // Parse document structure.
        const lDocumentStructure: PgslModuleSyntaxTreeStructureData = super.parse(pCodeText) as unknown as PgslModuleSyntaxTreeStructureData;

        // TODO: Validate document.

        // TODO: Clear old parsing buffers. 

        return new PgslModuleSyntaxTree().applyDataStructure(lDocumentStructure);
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

        this.defineGraphPart('AttributeList', this.graph()
            .loop('list', this.graph()
                .single(PgslToken.AttributeIndicator)
                .single('name', PgslToken.Identifier)
                .single(PgslToken.ParenthesesStart)
                .optional('parameter', this.graph()
                    .single('first', this.partReference<PgslExpression>('Expression'))
                    .loop('additional', this.graph()
                        .single(PgslToken.Comma).single('expression', this.partReference<PgslExpression>('Expression'))
                    )
                )
                .single(PgslToken.ParenthesesEnd)
            ),
            (pData) => {
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

        this.defineGraphPart('General-TemplateList', this.graph()
            .single(PgslToken.TemplateListStart)
            .branch('first', [
                this.partReference<PgslExpression>('Expression'),
                this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition-ForcedTemplate')
            ])
            .loop('additional', this.graph()
                .single(PgslToken.Comma)
                .branch('value', [
                    this.partReference<PgslExpression>('Expression'),
                    this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition-ForcedTemplate')
                ])
            )
            .single(PgslToken.TemplateListEnd),
            (pData): PgslTemplateListSyntaxTreeStructureData => {
                // TODO: Sometime  the expression is a type definition :(

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
            .single('leftExpression', this.partReference<PgslExpression>('Expression'))
            .branch('operation', [
                PgslToken.OperatorShortCircuitOr,
                PgslToken.OperatorShortCircuitAnd,
                PgslToken.OperatorMultiply,
                PgslToken.OperatorBinaryOr,
                PgslToken.OperatorBinaryAnd
            ])
            .single('rightExpression', this.partReference<PgslExpression>('Expression')),
            (pData): PgslLogicalExpression => {
                const lLogicalExpression: PgslLogicalExpression = new PgslLogicalExpression();
                lLogicalExpression.leftExpression = pData.leftExpression;
                lLogicalExpression.operator = EnumUtil.cast(PgslOperator, pData.operation)!;
                lLogicalExpression.rightExpression = pData.rightExpression;

                return lLogicalExpression;
            }
        );

        this.defineGraphPart('ArithmeticExpression', this.graph()
            .single('leftExpression', this.partReference<PgslExpression>('Expression'))
            .branch('operation', [
                PgslToken.OperatorPlus,
                PgslToken.OperatorMinus,
                PgslToken.OperatorMultiply,
                PgslToken.OperatorDivide,
                PgslToken.OperatorModulo
            ])
            .single('rightExpression', this.partReference<PgslExpression>('Expression')),
            (pData): PgslArithmeticExpression => {
                const lArithmeticExpression: PgslArithmeticExpression = new PgslArithmeticExpression();
                lArithmeticExpression.leftExpression = pData.leftExpression;
                lArithmeticExpression.operator = EnumUtil.cast(PgslOperator, pData.operation)!;
                lArithmeticExpression.rightExpression = pData.rightExpression;

                return lArithmeticExpression;
            }
        );

        this.defineGraphPart('ComparisonExpression', this.graph()
            .single('leftExpression', this.partReference<PgslExpression>('Expression'))
            .branch('comparison', [
                PgslToken.OperatorEqual,
                PgslToken.OperatorNotEqual,
                PgslToken.OperatorLowerThan,
                PgslToken.OperatorLowerThanEqual,
                PgslToken.OperatorGreaterThan,
                PgslToken.OperatorGreaterThanEqual
            ])
            .single('rightExpression', this.partReference<PgslExpression>('Expression')),
            (pData): PgslComparisonExpression => {
                const lComparisonExpression: PgslComparisonExpression = new PgslComparisonExpression();
                lComparisonExpression.leftExpression = pData.leftExpression;
                lComparisonExpression.comparison = EnumUtil.cast(PgslOperator, pData.comparison)!;
                lComparisonExpression.rightExpression = pData.rightExpression;

                return lComparisonExpression;
            }
        );

        this.defineGraphPart('BitOperationExpression', this.graph()
            .single('leftExpression', this.partReference<PgslExpression>('Expression'))
            .branch('operation', [
                PgslToken.OperatorBinaryOr,
                PgslToken.OperatorBinaryAnd,
                PgslToken.OperatorBinaryXor,
                PgslToken.OperatorShiftLeft,
                PgslToken.OperatorShiftRight
            ])
            .single('rightExpression', this.partReference<PgslExpression>('Expression')),
            (pData): PgslBitExpression => {
                const lUnaryExpression: PgslBitExpression = new PgslBitExpression();
                lUnaryExpression.leftExpression = pData.leftExpression;
                lUnaryExpression.operator = EnumUtil.cast(PgslOperator, pData.operation)!;
                lUnaryExpression.rightExpression = pData.rightExpression;

                return lUnaryExpression;
            }
        );

        this.defineGraphPart('UnaryExpression', this.graph()
            .branch('prefix', [
                PgslToken.OperatorBinaryNegate,
                PgslToken.OperatorMinus,
                PgslToken.OperatorNot
            ])
            .single('expression', this.partReference<PgslExpression>('Expression')),
            (pData): PgslUnaryExpression => {
                const lUnaryExpression: PgslUnaryExpression = new PgslUnaryExpression();
                lUnaryExpression.expression = pData.expression;
                lUnaryExpression.operator = EnumUtil.cast(PgslOperator, pData.prefix)!;

                return lUnaryExpression;
            }
        );

        this.defineGraphPart('ParenthesizedExpression', this.graph()
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<PgslExpression>('Expression'))
            .single(PgslToken.ParenthesesEnd),
            (pData): PgslParenthesizedExpression => {
                const lParenthesizedExpression: PgslParenthesizedExpression = new PgslParenthesizedExpression();
                lParenthesizedExpression.expression = pData.expression;

                return lParenthesizedExpression;
            }
        );

        this.defineGraphPart('FunctionExpression', this.graph()
            .single('name', PgslToken.Identifier)
            .optional('templateList', this.partReference<PgslTemplateListSyntaxTreeStructureData>('General-TemplateList'))
            .single(PgslToken.ParenthesesStart)
            .optional('parameter', this.graph()
                .single('first', this.partReference<PgslExpression>('Expression'))
                .loop('additional', this.graph()
                    .single(PgslToken.Comma).single('expression', this.partReference<PgslExpression>('Expression'))
                )
            )
            .single(PgslToken.ParenthesesEnd),
            (pData): PgslFunctionCallExpression => {
                // Build parameter list of function.
                const lParameterList: Array<PgslExpression> = new Array<PgslExpression>();
                if (pData.parameter) {
                    // Add first expression.
                    lParameterList.push(pData.parameter.first);

                    // Add additional items.
                    for (const lItem of pData.parameter.additional) {
                        lParameterList.push(lItem.expression);
                    }
                }

                // Build function structure.
                const lFunctionExpression: PgslFunctionCallExpression = new PgslFunctionCallExpression();
                lFunctionExpression.name = pData.name;
                lFunctionExpression.parameter = lParameterList;
                lFunctionExpression.templateList = pData.templateList ?? null;

                return lFunctionExpression;
            }
        );

        this.defineGraphPart('AddressOfExpression', this.graph()
            .single(PgslToken.OperatorBinaryAnd)
            .single('variable', this.partReference<PgslVariableExpression>('VariableExpression')),
            (pData): PgslAddressOfExpression => {
                const lAddressOfExpression: PgslAddressOfExpression = new PgslAddressOfExpression();
                lAddressOfExpression.variable = pData.variable;

                return lAddressOfExpression;
            }
        );

        this.defineGraphPart('PointerExpression', this.graph()
            .single(PgslToken.OperatorMultiply)
            .single('variable', this.partReference<PgslVariableExpression>('VariableExpression')),
            (pData): PgslPointerExpression => {
                const lPointerExpression: PgslPointerExpression = new PgslPointerExpression();
                lPointerExpression.variable = pData.variable;

                return lPointerExpression;
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
                        literalType: PgslTypeName.Float
                    };
                } else if ('integer' in pData.value) {
                    lData = {
                        textValue: pData.value.integer,
                        literalType: PgslTypeName.Integer
                    };
                } else if ('boolean' in pData.value) {
                    lData = {
                        textValue: pData.value.boolean,
                        literalType: PgslTypeName.Boolean
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
                this.partReference<PgslVariableExpression>('VariableExpression'), // => defineVariableExpression
                this.partReference<PgslLiteralValueExpressionSyntaxTreeStructureData>('Expression-LiteralValue'),
                this.partReference<PgslPointerExpression>('PointerExpression'),
                this.partReference<PgslAddressOfExpression>('AddressOfExpression'),
                this.partReference<PgslFunctionCallExpression>('FunctionExpression'),
                this.partReference<PgslUnaryExpression>('UnaryExpression'),
                this.partReference<PgslBitExpression>('BitOperationExpression'),
                this.partReference<PgslComparisonExpression>('ComparisonExpression'),
                this.partReference<PgslArithmeticExpression>('ArithmeticExpression'),
                this.partReference<PgslLogicalExpression>('LogicalExpression'),
                this.partReference<PgslParenthesizedExpression>('ParenthesizedExpression')
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
            .single('expression', this.partReference<PgslExpression>('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference<PgslBlockStatement>('FunctionBlock'))
            .optional('ifElse', this.graph()
                .single(PgslToken.KeywordElse)
                .single('if', this.partReference<PgslIfStatement>('IfStatement'))
            )
            .optional('else', this.graph()
                .single(PgslToken.KeywordElse)
                .single('block', this.partReference<PgslBlockStatement>('FunctionBlock'))
            ),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('SwitchStatement', this.graph()
            .single(PgslToken.KeywordSwitch)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<PgslExpression>('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single(PgslToken.BlockStart)
            .loop('cases', this.graph()
                .single(PgslToken.KeywordCase)
                .single('expression', this.partReference<PgslExpression>('Expression'))
                .loop('additionals', this.graph()
                    .single(PgslToken.Comma)
                    .single('expression', this.partReference<PgslExpression>('Expression'))
                )
                .single('block', this.partReference<PgslBlockStatement>('FunctionBlock'))
            )
            .optional('default', this.graph()
                .single(PgslToken.KeywordDefault)
                .single('block', this.partReference<PgslBlockStatement>('FunctionBlock'))
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
            .optional('expression', this.partReference<PgslBlockStatement>('Expression'))
            .single(PgslToken.Semicolon)
            .single('statement', this.partReference<PgslExpression>('Statement')) // TODO: Remove semicolon somehow.
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference<PgslBlockStatement>('FunctionBlock')),
            (_pData) => {
                // TODO: Yes this needs to be parsed.

                // TODO: Statement must eighter be a functionCall | Assignment | IncrementDecrement
            }
        );

        this.defineGraphPart('WhileStatement', this.graph()
            .single(PgslToken.KeywordWhile)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<PgslBlockStatement>('Expression'))
            .single(PgslToken.ParenthesesEnd)
            .single('block', this.partReference<PgslBlockStatement>('FunctionBlock')),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('DoWhileStatement', this.graph()
            .single(PgslToken.KeywordDo)
            .single('block', this.partReference<PgslBlockStatement>('FunctionBlock'))
            .single(PgslToken.KeywordWhile)
            .single(PgslToken.ParenthesesStart)
            .single('expression', this.partReference<PgslExpression>('Expression'))
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
            .optional('expression', this.partReference<PgslExpression>('Expression'))
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
                this.graph().single(PgslToken.Assignment).single('expression', this.partReference<PgslExpression>('Expression')).single(PgslToken.Semicolon)
            ]),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('AssignmentStatement', this.graph()
            .single('variable', this.partReference<PgslVariableExpression>('VariableExpression'))
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
            .single('expression', this.partReference<PgslExpression>('Expression'))
            .single(PgslToken.Semicolon),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('IncrementDecrementStatement', this.graph()
            .single('variable', this.partReference<PgslVariableExpression>('VariableExpression'))
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
                .single('first', this.partReference<PgslExpression>('Expression'))
                .loop('additional', this.graph()
                    .single(PgslToken.Comma).single('expression', this.partReference<PgslExpression>('Expression'))
                )
            )
            .single(PgslToken.ParenthesesEnd)
            .single(PgslToken.Semicolon),
            (pData): PgslFunctionCallStatement => {
                // Build parameter list of function.
                const lParameterList: Array<PgslExpression> = new Array<PgslExpression>();
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

        this.defineGraphPart('FunctionBlock', this.graph()
            .single(PgslToken.BlockStart)
            .loop('statements', this.partReference<PgslStatement>('Statement'))
            .single(PgslToken.BlockEnd),
            (pData): PgslBlockStatement => {
                const lBlockStatement: PgslBlockStatement = new PgslBlockStatement();

                // Add all statements.
                for (const lStatement of pData.statements) {
                    lBlockStatement.addStatement(lStatement);
                }

                return lBlockStatement;
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
                this.partReference<PgslBlockStatement>('FunctionBlock')
            ]),
            (pData): PgslStatement => {
                return pData.statement;
            }
        );
    }

    /**
     * Define all graphs used inside module scope.
     */
    private defineModuleScope(): void {

        this.defineGraphPart('ModuleScopeVariableDeclaration', this.graph()
            .optional('attributes', this.partReference<PgslAttributeList>('AttributeList'))
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
                this.graph().single(PgslToken.Assignment).single('expression', this.partReference<PgslExpression>('Expression')).single(PgslToken.Semicolon)
            ]),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('AliasDeclaration', this.graph()
            .single(PgslToken.KeywordAlias)
            .single('aliasName', PgslToken.Identifier).single(PgslToken.Assignment)
            .single('type', this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition')).single(PgslToken.Semicolon),
            (pData): PgslAliasDeclaration => {
                const lAliasDeclaration: PgslAliasDeclaration = new PgslAliasDeclaration();
                lAliasDeclaration.name = pData.aliasName;
                lAliasDeclaration.type = pData.type;

                return lAliasDeclaration;
            }
        );

        this.defineGraphPart('EnumDeclaration', this.graph()
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
            (pData): PgslEnumDeclaration => {
                const lEnumDeclaration: PgslEnumDeclaration = new PgslEnumDeclaration();
                lEnumDeclaration.name = pData.name;

                if (pData.values) {
                    // Add first value.
                    lEnumDeclaration.addValue(pData.values.name, pData.values.value.value);

                    // Add additional values.
                    for (const lValues of pData.values.additional) {
                        lEnumDeclaration.addValue(lValues.name, lValues.value.value);
                    }
                }

                return lEnumDeclaration;
            }
        );

        this.defineGraphPart('StructDeclaration', this.graph()
            .single(PgslToken.KeywordStruct)
            .single('name', PgslToken.Identifier)
            .single(PgslToken.BlockStart)
            .optional('values', this.graph()
                .optional('attributes', this.partReference<PgslAttributeList>('AttributeList'))
                .single('name', PgslToken.Identifier)
                .single(PgslToken.Colon)
                .branch('value', [
                    this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition')
                ])
                .loop('additional', this.graph()
                    .single(PgslToken.Comma)
                    .optional('attributes', this.partReference<PgslAttributeList>('AttributeList'))
                    .single('name', PgslToken.Identifier)
                    .single(PgslToken.Assignment)
                    .branch('value', [
                        this.partReference<PgslTypeDefinitionSyntaxTreeStructureData>('General-TypeDefinition')
                    ])
                )
            )
            .single(PgslToken.BlockEnd),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );

        this.defineGraphPart('FunctionDeclaration', this.graph()
            .optional('attributes', this.partReference<PgslAttributeList>('AttributeList'))
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
            .single('block', this.partReference<PgslBlockStatement>('FunctionBlock')),
            (_pData) => {
                // TODO: Yes this needs to be parsed.
            }
        );
    }

    /**
     * Define root graph.
     */
    private defineRoot(): void {

        this.defineGraphPart('document', this.graph()
            .loop('list', this.graph()
                .branch('content', [
                    this.partReference<PgslAliasDeclaration>('AliasDeclaration'),
                    this.partReference('ModuleScopeVariableDeclaration'),
                    this.partReference<PgslEnumDeclaration>('EnumDeclaration'),
                    this.partReference('StructDeclaration'),
                    this.partReference('FunctionDeclaration')
                ])
            ),
            (pData, pStartToken: LexerToken<PgslToken>, pEndToken: LexerToken<PgslToken>): PgslModuleSyntaxTreeStructureData => {
                const lData: PgslModuleSyntaxTreeStructureData['data'] = {};

                // Loop data.
                for (const lContent of pData.list) {
                    // TODO: switch case with all things.
                }

                return {
                    meta: this.createMeta('Module', pStartToken, pEndToken),
                    data: {}
                };
            }
        );

        // Define root part.
        this.setRootGraphPart('document');
    }

    /**
     * Define variable expressions used for assigning or reading values.
     */
    private defineVariableExpression(): void {

        this.defineGraphPart('VariableNameExpression', this.graph()
            .single('name', PgslToken.Identifier),
            (pData): PgslVariableNameExpression => {
                const lPgslVariableName: PgslVariableNameExpression = new PgslVariableNameExpression();
                lPgslVariableName.name = pData.name;

                return lPgslVariableName;
            }
        );

        this.defineGraphPart('IndexValueExpression', this.graph()
            .single('variableExpression', this.partReference<PgslVariableExpression>('VariableExpression'))
            .single(PgslToken.ListStart)
            .single('indexExpression', this.partReference<PgslExpression>('Expression'))
            .single(PgslToken.ListEnd),
            (pData): PgslVariableIndexNameExpression => {
                const lIndexValueExpression: PgslVariableIndexNameExpression = new PgslVariableIndexNameExpression();
                lIndexValueExpression.variable = pData.variableExpression;
                lIndexValueExpression.index = pData.indexExpression;

                return lIndexValueExpression;
            }
        );

        this.defineGraphPart('CompositeValueDecompositionExpression', this.graph()
            .single('leftExpression', this.partReference<PgslExpression>('VariableExpression'))
            .single(PgslToken.MemberDelimiter)
            .single('propertyName', PgslToken.Identifier),
            (pData) => {
                // TODO: enum.value ?? How to distinct

                const lVariableExpression: PgslCompositeValueDecompositionVariableExpression = new PgslCompositeValueDecompositionVariableExpression();
                lVariableExpression.property = pData.propertyName;
                lVariableExpression.variable = pData.leftExpression;

                return lVariableExpression;
            }
        );

        this.defineGraphPart('VariableExpression', this.graph()
            .branch('expression', [
                this.partReference<PgslVariableExpression>('VariableNameExpression'),
                this.partReference<PgslVariableExpression>('IndexValueExpression'),
                this.partReference<PgslVariableExpression>('CompositeValueDecompositionExpression')
            ]),
            (pData): PgslVariableExpression => {
                return pData.expression;
            }
        );
    }
}