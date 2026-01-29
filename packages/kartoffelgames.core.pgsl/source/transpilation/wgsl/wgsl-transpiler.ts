import { Transpiler } from '../transpiler.ts';
import { FunctionDeclarationAstTranspilerProcessor } from './declaration/function-declaration-ast-transpiler-processor.ts';
import { StructDeclarationAstTranspilerProcessor } from './declaration/struct-declaration-ast-transpiler-processor.ts';
import { StructPropertyDeclarationAstTranspilerProcessor } from './declaration/struct-property-declaration-ast-transpiler-processor.ts';
import { VariableDeclarationAstTranspilerProcessor } from './declaration/variable-declaration-ast-transpiler-processor.ts';
import { DocumentAstTranspilerProcessor } from './document-ast-transpiler-processor.ts';
import { ArithmeticExpressionAstTranspilerProcessor } from './expression/operation/arithmetic-expression-ast-transpiler-processor.ts';
import { BinaryExpressionAstTranspilerProcessor } from './expression/operation/binary-expression-ast-transpiler-processor.ts';
import { ComparisonExpressionAstTranspilerProcessor } from './expression/operation/comparison-expression-ast-transpiler-processor.ts';
import { LogicalExpressionAstTranspilerProcessor } from './expression/operation/logical-expression-ast-transpiler-processor.ts';
import { AddressOfExpressionAstTranspilerProcessor } from './expression/single-value/address-of-expression-ast-transpiler-processor.ts';
import { FunctionCallExpressionAstTranspilerProcessor } from './expression/single-value/function-call-expression-ast-transpiler-processor.ts';
import { LiteralValueExpressionAstTranspilerProcessor } from './expression/single-value/literal-value-expression-ast-transpiler-processor.ts';
import { NewCallExpressionAstTranspilerProcessor } from './expression/single-value/new-expression-ast-transpiler-processor.ts';
import { ParenthesizedExpressionAstTranspilerProcessor } from './expression/single-value/parenthesized-expression-ast-transpiler-processor.ts';
import { StringValueExpressionAstTranspilerProcessor } from './expression/single-value/string-value-expression-ast-transpiler-processor.ts';
import { IndexedValueExpressionAstTranspilerProcessor } from './expression/storage/indexed-value-expression-ast-transpiler-processor.ts';
import { PointerExpressionAstTranspilerProcessor } from './expression/storage/pointer-expression-ast-transpiler-processor.ts';
import { ValueDecompositionExpressionAstTranspilerProcessor } from './expression/storage/value-decomposition-expression-ast-transpiler-processor.ts';
import { VariableNameExpressionAstTranspilerProcessor } from './expression/storage/variable-name-expression-ast-transpiler-processor.ts';
import { UnaryExpressionAstTranspilerProcessor } from './expression/unary/unary-expression-ast-transpiler-processor.ts';
import { DoWhileStatementAstTranspilerProcessor } from './statement/branch/do-while-statement-ast-transpiler-processor.ts';
import { ForStatementAstTranspilerProcessor } from './statement/branch/for-statement-ast-transpiler-processor.ts';
import { IfStatementAstTranspilerProcessor } from './statement/branch/if-statement-ast-transpiler-processor.ts';
import { SwitchStatementAstTranspilerProcessor } from './statement/branch/switch-statement-ast-transpiler-processor.ts';
import { WhileStatementAstTranspilerProcessor } from './statement/branch/while-statement-ast-transpiler-processor.ts';
import { AssignmentStatementAstTranspilerProcessor } from './statement/execution/assignment-statement-ast-transpiler-processor.ts';
import { BlockStatementAstTranspilerProcessor } from './statement/execution/block-statement-ast-transpiler-processor.ts';
import { FunctionCallStatementAstTranspilerProcessor } from './statement/execution/function-call-statement-ast-transpiler-processor.ts';
import { IncrementDecrementStatementAstTranspilerProcessor } from './statement/execution/increment-decrement-statement-ast-transpiler-processor.ts';
import { VariableDeclarationStatementAstTranspilerProcessor } from './statement/execution/variable-declaration-statement-ast-transpiler-processor.ts';
import { BreakStatementAstTranspilerProcessor } from './statement/single/break-statement-ast-transpiler-processor.ts';
import { ContinueStatementAstTranspilerProcessor } from './statement/single/continue-statement-ast-transpiler-processor.ts';
import { DiscardStatementAstTranspilerProcessor } from './statement/single/discard-statement-ast-transpiler-processor.ts';
import { ReturnStatementAstTranspilerProcessor } from './statement/single/return-statement-ast-transpiler-processor.ts';
import { TypeAstTranspilerProcessor } from './type-ast-transpiler-processor.ts';
import { TypeDeclarationAstTranspilerProcessor } from './type-declaration-ast-transpiler-processor.ts';

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
        this.addProcessor(new ArithmeticExpressionAstTranspilerProcessor());
        this.addProcessor(new BinaryExpressionAstTranspilerProcessor());
        this.addProcessor(new ComparisonExpressionAstTranspilerProcessor());
        this.addProcessor(new LogicalExpressionAstTranspilerProcessor());

        // Expressions - Single Values
        this.addProcessor(new AddressOfExpressionAstTranspilerProcessor());
        this.addProcessor(new FunctionCallExpressionAstTranspilerProcessor());
        this.addProcessor(new LiteralValueExpressionAstTranspilerProcessor());
        this.addProcessor(new NewCallExpressionAstTranspilerProcessor());
        this.addProcessor(new ParenthesizedExpressionAstTranspilerProcessor());
        this.addProcessor(new StringValueExpressionAstTranspilerProcessor());

        // Expressions - Storage
        this.addProcessor(new IndexedValueExpressionAstTranspilerProcessor());
        this.addProcessor(new PointerExpressionAstTranspilerProcessor());
        this.addProcessor(new ValueDecompositionExpressionAstTranspilerProcessor());
        this.addProcessor(new VariableNameExpressionAstTranspilerProcessor());

        // Expressions - Unary
        this.addProcessor(new UnaryExpressionAstTranspilerProcessor());

        // Statements - Execution
        this.addProcessor(new AssignmentStatementAstTranspilerProcessor());
        this.addProcessor(new BlockStatementAstTranspilerProcessor());
        this.addProcessor(new FunctionCallStatementAstTranspilerProcessor());
        this.addProcessor(new IncrementDecrementStatementAstTranspilerProcessor());
        this.addProcessor(new VariableDeclarationStatementAstTranspilerProcessor());

        // Statements - Branch
        this.addProcessor(new DoWhileStatementAstTranspilerProcessor());
        this.addProcessor(new ForStatementAstTranspilerProcessor());
        this.addProcessor(new IfStatementAstTranspilerProcessor());
        this.addProcessor(new SwitchStatementAstTranspilerProcessor());
        this.addProcessor(new WhileStatementAstTranspilerProcessor());

        // Statements - Single
        this.addProcessor(new BreakStatementAstTranspilerProcessor());
        this.addProcessor(new ContinueStatementAstTranspilerProcessor());
        this.addProcessor(new DiscardStatementAstTranspilerProcessor());
        this.addProcessor(new ReturnStatementAstTranspilerProcessor());
    }
}