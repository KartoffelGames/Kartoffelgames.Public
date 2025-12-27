import type { AddressOfExpressionCst, ArithmeticExpressionCst, BinaryExpressionCst, ComparisonExpressionCst, ExpressionCst, FunctionCallExpressionCst, IndexedValueExpressionCst, LiteralValueExpressionCst, LogicalExpressionCst, NewExpressionCst, ParenthesizedExpressionCst, PointerExpressionCst, StringValueExpressionCst, UnaryExpressionCst, ValueDecompositionExpressionCst, VariableNameExpressionCst } from '../../concrete_syntax_tree/expression.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import type { IExpressionAst } from './i-expression-ast.interface.ts';
import { ArithmeticExpressionAst } from './operation/arithmetic-expression-ast.ts';
import { BinaryExpressionAst } from './operation/binary-expression-ast.ts';
import { ComparisonExpressionAst } from './operation/comparison-expression-ast.ts';
import { LogicalExpressionAst } from './operation/logical-expression-ast.ts';
import { AddressOfExpressionAst } from './single_value/address-of-expression-ast.ts';
import { FunctionCallExpressionAst } from './single_value/function-call-expression-ast.ts';
import { LiteralValueExpressionAst } from './single_value/literal-value-expression-ast.ts';
import { NewExpressionAst } from './single_value/new-expression-ast.ts';
import { ParenthesizedExpressionAst } from './single_value/parenthesized-expression-ast.ts';
import { StringValueExpressionAst } from './single_value/string-value-expression-ast.ts';
import { IndexedValueExpressionAst } from './storage/indexed-value-expression-ast.ts';
import { PointerExpressionAst } from './storage/pointer-expression-ast.ts';
import { ValueDecompositionExpressionAst } from './storage/value-decomposition-expression-ast.ts';
import { VariableNameExpressionAst } from './storage/variable-name-expression-ast.ts';
import { UnaryExpressionAst } from './unary/unary-expression-ast.ts';

export class ExpressionAstBuilder {
    /**
     * Build a expression AST node from a concrete syntax tree node.
     * 
     * @param pCst - Concreate sytax tree.
     * @param pContext - Abstract syntax tree build context.
     * 
     * @returns Expression AST node or null if the type is not recognized.
     */
    public static build(pCst: ExpressionCst, pContext: AbstractSyntaxTreeContext): IExpressionAst {
        switch (pCst.type) {
            case 'ArithmeticExpression':
                return new ArithmeticExpressionAst(pCst as ArithmeticExpressionCst).process(pContext);
            case 'BinaryExpression':
                return new BinaryExpressionAst(pCst as BinaryExpressionCst).process(pContext);
            case 'ComparisonExpression':
                return new ComparisonExpressionAst(pCst as ComparisonExpressionCst).process(pContext);
            case 'LogicalExpression':
                return new LogicalExpressionAst(pCst as LogicalExpressionCst).process(pContext);
            case 'AddressOfExpression':
                return new AddressOfExpressionAst(pCst as AddressOfExpressionCst).process(pContext);
            case 'LiteralValueExpression':
                return new LiteralValueExpressionAst(pCst as LiteralValueExpressionCst).process(pContext);
            case 'FunctionCallExpression':
                return new FunctionCallExpressionAst(pCst as FunctionCallExpressionCst).process(pContext);
            case 'ParenthesizedExpression':
                return new ParenthesizedExpressionAst(pCst as ParenthesizedExpressionCst).process(pContext);
            case 'StringValueExpression':
                return new StringValueExpressionAst(pCst as StringValueExpressionCst).process(pContext);
            case 'NewExpression':
                return new NewExpressionAst(pCst as NewExpressionCst).process(pContext);
            case 'IndexedValueExpression':
                return new IndexedValueExpressionAst(pCst as IndexedValueExpressionCst).process(pContext);
            case 'PointerExpression':
                return new PointerExpressionAst(pCst as PointerExpressionCst).process(pContext);
            case 'VariableNameExpression':
                return new VariableNameExpressionAst(pCst as VariableNameExpressionCst).process(pContext);
            case 'ValueDecompositionExpression':
                return new ValueDecompositionExpressionAst(pCst as ValueDecompositionExpressionCst).process(pContext);
            case 'UnaryExpression':
                return new UnaryExpressionAst(pCst as UnaryExpressionCst).process(pContext);
        }
    }
}