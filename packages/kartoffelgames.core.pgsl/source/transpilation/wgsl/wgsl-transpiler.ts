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
import { TypeDeclarationAstTranspilerProcessor } from './type/type-declaration-ast-transpiler-processor.ts';

/**
 * WGSL (WebGPU Shading Language) transpiler for PGSL syntax trees.
 * Converts PGSL abstract syntax trees into WGSL shader code that can be
 * executed on WebGPU-compatible devices.
 */
export class WgslTranspiler extends Transpiler {
    /**
     * WGSL types and keywords that should not be used as names.
     */
    private static readonly WgslReservedNames: Set<string> = new Set<string>([
        // Scalar, vector, matrix, array, atomic and pointer types.
        'bool', 'f16', 'f32', 'i32', 'u32', 'vec2', 'vec3', 'vec4', 'mat2x2', 'mat2x3', 'mat2x4', 'mat3x2', 'mat3x3', 'mat3x4', 'mat4x2', 'mat4x3', 'mat4x4', 'array', 'atomic', 'ptr',

        // Vector and matrix type aliases.
        'vec2i', 'vec3i', 'vec4i', 'vec2u', 'vec3u', 'vec4u', 'vec2f', 'vec3f', 'vec4f', 'vec2h', 'vec3h', 'vec4h',
        'mat2x2f', 'mat2x3f', 'mat2x4f', 'mat3x2f', 'mat3x3f', 'mat3x4f', 'mat4x2f', 'mat4x3f', 'mat4x4f',
        'mat2x2h', 'mat2x3h', 'mat2x4h', 'mat3x2h', 'mat3x3h', 'mat3x4h', 'mat4x2h', 'mat4x3h', 'mat4x4h',

        // Sampler and texture types.
        'sampler', 'sampler_comparison', 'texture_1d', 'texture_2d', 'texture_2d_array', 'texture_3d', 'texture_cube', 'texture_cube_array', 'texture_multisampled_2d',
        'texture_depth_2d', 'texture_depth_2d_array', 'texture_depth_cube', 'texture_depth_cube_array', 'texture_depth_multisampled_2d', 'texture_external',
        'texture_storage_1d', 'texture_storage_2d', 'texture_storage_2d_array', 'texture_storage_3d',

        // Access mode and address space enumerants.
        'read', 'write', 'read_write', 'function', 'private', 'workgroup', 'uniform', 'storage',

        // Texel format enumerants.
        'rgba8unorm', 'rgba8snorm', 'rgba8uint', 'rgba8sint', 'rgba16unorm', 'rgba16snorm', 'rgba16uint', 'rgba16sint', 'rgba16float', 'rgba32uint', 'rgba32sint', 'rgba32float', 'bgra8unorm',
        'rg8unorm', 'rg8snorm', 'rg8uint', 'rg8sint', 'rg16unorm', 'rg16snorm', 'rg16uint', 'rg16sint', 'rg16float', 'rg32uint', 'rg32sint', 'rg32float',
        'r8unorm', 'r8snorm', 'r8uint', 'r8sint', 'r16unorm', 'r16snorm', 'r16uint', 'r16sint', 'r16float', 'r32uint', 'r32sint', 'r32float',
        'rgb10a2unorm', 'rgb10a2uint', 'rg11b10ufloat',

        // Reserved words.
        'fn', 'override', 'non_coherent', 'noncoherent'
    ]);

    /**
     * Escape a name when it uses WGSL reserved names.
     * 
     * @param pName - A name.
     *
     * @returns The escaped name.
     */
    public static escapeName(pName: string): string {
        // Append the reserved name part to names that WGSL already uses.
        if (WgslTranspiler.WgslReservedNames.has(pName)) {
            return `${pName}__CATCH__`;
        }

        return pName;
    }

    /**
     * Creates a new WGSL transpiler instance.
     * Initializes all transpilation processors specific to WGSL code generation.
     */
    public constructor() {
        super();

        // Define transpilation processors for all node types.
        this.addProcessor(DocumentAstTranspilerProcessor);

        // Declarations. Alias has no transpilation processor, it is only used during trace.
        this.addProcessor(VariableDeclarationAstTranspilerProcessor);
        this.addProcessor(FunctionDeclarationAstTranspilerProcessor);
        this.addProcessor(StructDeclarationAstTranspilerProcessor);
        this.addProcessor(StructPropertyDeclarationAstTranspilerProcessor);

        // General. Attributes have no transpilation processor, they are only used during trace.
        this.addProcessor(TypeDeclarationAstTranspilerProcessor);

        // Expressions - Operations
        this.addProcessor(ArithmeticExpressionAstTranspilerProcessor);
        this.addProcessor(BinaryExpressionAstTranspilerProcessor);
        this.addProcessor(ComparisonExpressionAstTranspilerProcessor);
        this.addProcessor(LogicalExpressionAstTranspilerProcessor);

        // Expressions - Single Values
        this.addProcessor(AddressOfExpressionAstTranspilerProcessor);
        this.addProcessor(FunctionCallExpressionAstTranspilerProcessor);
        this.addProcessor(LiteralValueExpressionAstTranspilerProcessor);
        this.addProcessor(NewCallExpressionAstTranspilerProcessor);
        this.addProcessor(ParenthesizedExpressionAstTranspilerProcessor);
        this.addProcessor(StringValueExpressionAstTranspilerProcessor);

        // Expressions - Storage
        this.addProcessor(IndexedValueExpressionAstTranspilerProcessor);
        this.addProcessor(PointerExpressionAstTranspilerProcessor);
        this.addProcessor(ValueDecompositionExpressionAstTranspilerProcessor);
        this.addProcessor(VariableNameExpressionAstTranspilerProcessor);

        // Expressions - Unary
        this.addProcessor(UnaryExpressionAstTranspilerProcessor);

        // Statements - Execution
        this.addProcessor(AssignmentStatementAstTranspilerProcessor);
        this.addProcessor(BlockStatementAstTranspilerProcessor);
        this.addProcessor(FunctionCallStatementAstTranspilerProcessor);
        this.addProcessor(IncrementDecrementStatementAstTranspilerProcessor);
        this.addProcessor(VariableDeclarationStatementAstTranspilerProcessor);

        // Statements - Branch
        this.addProcessor(DoWhileStatementAstTranspilerProcessor);
        this.addProcessor(ForStatementAstTranspilerProcessor);
        this.addProcessor(IfStatementAstTranspilerProcessor);
        this.addProcessor(SwitchStatementAstTranspilerProcessor);
        this.addProcessor(WhileStatementAstTranspilerProcessor);

        // Statements - Single
        this.addProcessor(BreakStatementAstTranspilerProcessor);
        this.addProcessor(ContinueStatementAstTranspilerProcessor);
        this.addProcessor(DiscardStatementAstTranspilerProcessor);
        this.addProcessor(ReturnStatementAstTranspilerProcessor);
    }
}