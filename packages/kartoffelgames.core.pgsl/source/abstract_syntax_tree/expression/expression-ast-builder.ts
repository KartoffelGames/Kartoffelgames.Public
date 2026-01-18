import type { AddressOfExpressionCst, ArithmeticExpressionCst, BinaryExpressionCst, ComparisonExpressionCst, ExpressionCst, FunctionCallExpressionCst, IndexedValueExpressionCst, LiteralValueExpressionCst, LogicalExpressionCst, NewExpressionCst, ParenthesizedExpressionCst, PointerExpressionCst, StringValueExpressionCst, UnaryExpressionCst, ValueDecompositionExpressionCst, VariableNameExpressionCst } from '../../concrete_syntax_tree/expression.type.ts';
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
     * 
     * @returns Expression AST node or null if the type is not recognized.
     */
    public static build(pCst: ExpressionCst): IExpressionAst {
        switch (pCst.type) {
            case 'ArithmeticExpression':
                return new ArithmeticExpressionAst(pCst as ArithmeticExpressionCst);
            case 'BinaryExpression':
                return new BinaryExpressionAst(pCst as BinaryExpressionCst);
            case 'ComparisonExpression':
                return new ComparisonExpressionAst(pCst as ComparisonExpressionCst);
            case 'LogicalExpression':
                return new LogicalExpressionAst(pCst as LogicalExpressionCst);
            case 'AddressOfExpression':
                return new AddressOfExpressionAst(pCst as AddressOfExpressionCst);
            case 'LiteralValueExpression':
                return new LiteralValueExpressionAst(pCst as LiteralValueExpressionCst);
            case 'FunctionCallExpression':
                return new FunctionCallExpressionAst(pCst as FunctionCallExpressionCst);
            case 'ParenthesizedExpression':
                return new ParenthesizedExpressionAst(pCst as ParenthesizedExpressionCst);
            case 'StringValueExpression':
                return new StringValueExpressionAst(pCst as StringValueExpressionCst);
            case 'NewExpression':
                return new NewExpressionAst(pCst as NewExpressionCst);
            case 'IndexedValueExpression':
                return new IndexedValueExpressionAst(pCst as IndexedValueExpressionCst);
            case 'PointerExpression':
                return new PointerExpressionAst(pCst as PointerExpressionCst);
            case 'VariableNameExpression':
                return new VariableNameExpressionAst(pCst as VariableNameExpressionCst);
            case 'ValueDecompositionExpression':
                return new ValueDecompositionExpressionAst(pCst as ValueDecompositionExpressionCst);
            case 'UnaryExpression':
                return new UnaryExpressionAst(pCst as UnaryExpressionCst);
        }
    }
}