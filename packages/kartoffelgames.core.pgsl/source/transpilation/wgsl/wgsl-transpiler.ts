import { Transpiler } from '../transpiler.ts';
import { FunctionDeclarationAstTranspilerProcessor } from './declaration/function-declaration-ast-transpiler-processor.ts';
import { StructDeclarationAstTranspilerProcessor } from './declaration/struct-declaration-ast-transpiler-processor.ts';
import { StructPropertyDeclarationAstTranspilerProcessor } from './declaration/struct-property-ast-declaration-transpiler-processor.ts';
import { VariableDeclarationAstTranspilerProcessor } from './declaration/variable-declaration-ast-transpiler-processor.ts';
import { PgslArithmeticExpressionTranspilerProcessor } from './expression/operation/pgsl-arithmetic-expression-transpiler-processor.ts';
import { PgslBinaryExpressionTranspilerProcessor } from './expression/operation/pgsl-binary-expression-transpiler-processor.ts';
import { PgslComparisonExpressionTranspilerProcessor } from './expression/operation/pgsl-comparison-expression-transpiler-processor.ts';
import { PgslLogicalExpressionTranspilerProcessor } from './expression/operation/pgsl-logical-expression-transpiler-processor.ts';
import { PgslAddressOfExpressionTranspilerProcessor } from './expression/single-value/pgsl-address-of-expression-transpiler-processor.ts';
import { PgslFunctionCallExpressionTranspilerProcessor } from './expression/single-value/pgsl-function-call-expression-transpiler-processor.ts';
import { PgslLiteralValueExpressionTranspilerProcessor } from './expression/single-value/pgsl-literal-value-expression-transpiler-processor.ts';
import { PgslNewCallExpressionTranspilerProcessor } from './expression/single-value/pgsl-new-expression-transpiler-processor.ts';
import { PgslParenthesizedExpressionTranspilerProcessor } from './expression/single-value/pgsl-parenthesized-expression-transpiler-processor.ts';
import { PgslStringValueExpressionTranspilerProcessor } from './expression/single-value/pgsl-string-value-expression-transpiler-processor.ts';
import { PgslIndexedValueExpressionTranspilerProcessor } from './expression/storage/pgsl-indexed-value-expression-transpiler-processor.ts';
import { PgslPointerExpressionTranspilerProcessor } from './expression/storage/pgsl-pointer-expression-transpiler-processor.ts';
import { PgslValueDecompositionExpressionTranspilerProcessor } from './expression/storage/pgsl-value-decomposition-expression-transpiler-processor.ts';
import { PgslVariableNameExpressionTranspilerProcessor } from './expression/storage/pgsl-variable-name-expression-transpiler-processor.ts';
import { PgslUnaryExpressionTranspilerProcessor } from './expression/unary/pgsl-unary-expression-transpiler-processor.ts';
import { DocumentAstTranspilerProcessor } from './document-ast-transpiler-processor.ts';
import { TypeDeclarationAstTranspilerProcessor } from './type-declaration-ast-transpiler-processor.ts';
import { TypeAstTranspilerProcessor } from './type-ast-transpiler-processor.ts';
import { PgslDoWhileStatementTranspilerProcessor } from './statement/branch/pgsl-do-while-statement-transpiler-processor.ts';
import { PgslForStatementTranspilerProcessor } from './statement/branch/pgsl-for-statement-transpiler-processor.ts';
import { PgslIfStatementTranspilerProcessor } from './statement/branch/pgsl-if-statement-transpiler-processor.ts';
import { PgslSwitchStatementTranspilerProcessor } from './statement/branch/pgsl-switch-statement-transpiler-processor.ts';
import { PgslWhileStatementTranspilerProcessor } from './statement/branch/pgsl-while-statement-transpiler-processor.ts';
import { PgslAssignmentStatementTranspilerProcessor } from './statement/execution/pgsl-assignment-statement-transpiler-processor.ts';
import { PgslBlockStatementTranspilerProcessor } from './statement/execution/pgsl-block-statement-transpiler-processor.ts';
import { PgslFunctionCallStatementTranspilerProcessor } from './statement/execution/pgsl-function-call-statement-transpiler-processor.ts';
import { PgslIncrementDecrementStatementTranspilerProcessor } from './statement/execution/pgsl-increment-decrement-statement-transpiler-processor.ts';
import { PgslVariableDeclarationStatementTranspilerProcessor } from './statement/execution/pgsl-variable-declaration-statement-transpiler-processor.ts';
import { PgslBreakStatementTranspilerProcessor } from './statement/single/pgsl-break-statement-transpiler-processor.ts';
import { PgslContinueStatementTranspilerProcessor } from './statement/single/pgsl-continue-statement-transpiler-processor.ts';
import { PgslDiscardStatementTranspilerProcessor } from './statement/single/pgsl-discard-statement-transpiler-processor.ts';
import { PgslReturnStatementTranspilerProcessor } from './statement/single/pgsl-return-statement-transpiler-processor.ts';

/**
 * WGSL (WebGPU Shading Language) transpiler for PGSL syntax trees.
 * Converts PGSL abstract syntax trees into WGSL shader code that can be
 * executed on WebGPU-compatible devices.
 */
export class WgslTranspiler extends Transpiler {
    /**
     * Creates a new WGSL transpiler instance.
     * Initializes all transpilation processors specific to WGSL code generation.
     */
    public constructor() {
        super();

        // Define transpilation processors for all node types.
        this.addProcessor(new DocumentAstTranspilerProcessor());

        // Declarations. Alias has no transpilation processor, it is only used during trace.
        this.addProcessor(new VariableDeclarationAstTranspilerProcessor());
        this.addProcessor(new FunctionDeclarationAstTranspilerProcessor());
        this.addProcessor(new StructDeclarationAstTranspilerProcessor());
        this.addProcessor(new StructPropertyDeclarationAstTranspilerProcessor());

        // General. Attributes have no transpilation processor, they are only used during trace.
        this.addProcessor(new TypeDeclarationAstTranspilerProcessor());
        this.addProcessor(new TypeAstTranspilerProcessor());

        // Expressions - Operations
        this.addProcessor(new PgslArithmeticExpressionTranspilerProcessor());
        this.addProcessor(new PgslBinaryExpressionTranspilerProcessor());
        this.addProcessor(new PgslComparisonExpressionTranspilerProcessor());
        this.addProcessor(new PgslLogicalExpressionTranspilerProcessor());

        // Expressions - Single Values
        this.addProcessor(new PgslAddressOfExpressionTranspilerProcessor());
        this.addProcessor(new PgslFunctionCallExpressionTranspilerProcessor());
        this.addProcessor(new PgslLiteralValueExpressionTranspilerProcessor());
        this.addProcessor(new PgslNewCallExpressionTranspilerProcessor());
        this.addProcessor(new PgslParenthesizedExpressionTranspilerProcessor());
        this.addProcessor(new PgslStringValueExpressionTranspilerProcessor());

        // Expressions - Storage
        this.addProcessor(new PgslIndexedValueExpressionTranspilerProcessor());
        this.addProcessor(new PgslPointerExpressionTranspilerProcessor());
        this.addProcessor(new PgslValueDecompositionExpressionTranspilerProcessor());
        this.addProcessor(new PgslVariableNameExpressionTranspilerProcessor());

        // Expressions - Unary
        this.addProcessor(new PgslUnaryExpressionTranspilerProcessor());

        // Statements - Execution
        this.addProcessor(new PgslAssignmentStatementTranspilerProcessor());
        this.addProcessor(new PgslBlockStatementTranspilerProcessor());
        this.addProcessor(new PgslFunctionCallStatementTranspilerProcessor());
        this.addProcessor(new PgslIncrementDecrementStatementTranspilerProcessor());
        this.addProcessor(new PgslVariableDeclarationStatementTranspilerProcessor());

        // Statements - Branch
        this.addProcessor(new PgslDoWhileStatementTranspilerProcessor());
        this.addProcessor(new PgslForStatementTranspilerProcessor());
        this.addProcessor(new PgslIfStatementTranspilerProcessor());
        this.addProcessor(new PgslSwitchStatementTranspilerProcessor());
        this.addProcessor(new PgslWhileStatementTranspilerProcessor());

        // Statements - Single
        this.addProcessor(new PgslBreakStatementTranspilerProcessor());
        this.addProcessor(new PgslContinueStatementTranspilerProcessor());
        this.addProcessor(new PgslDiscardStatementTranspilerProcessor());
        this.addProcessor(new PgslReturnStatementTranspilerProcessor());
    }
}