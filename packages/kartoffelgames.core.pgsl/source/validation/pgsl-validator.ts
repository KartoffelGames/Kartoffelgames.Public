import { Stack } from '@kartoffelgames/core';
import type { AbstractSyntaxTreeIncident } from '../abstract_syntax_tree/abstract-syntax-tree-context.ts';
import type { AbstractSyntaxTree, AbstractSyntaxTreeConstructor } from '../abstract_syntax_tree/abstract-syntax-tree.ts';
import { PgslTypeCache } from '../abstract_syntax_tree/type/pgsl-type-cache.ts';
import type { PgslValidatorProcessor, PgslValidatorProcessorConstructor, PgslValidatorProcessorValidate } from './pgsl-validator-processor.ts';
import { AliasDeclarationAstValidationProcessor } from './processor/declaration/alias-declaration-ast-validation-processor.ts';
import { EnumDeclarationAstValidationProcessor } from './processor/declaration/enum-declaration-ast-validation-processor.ts';
import { FunctionDeclarationAstValidationProcessor } from './processor/declaration/function-declaration-ast-validation-processor.ts';
import { FunctionOverloadDeclarationAstValidationProcessor } from './processor/declaration/function-overload-declaration-ast-validation-processor.ts';
import { StructDeclarationAstValidationProcessor } from './processor/declaration/struct-declaration-ast-validation-processor.ts';
import { StructPropertyDeclarationAstValidationProcessor } from './processor/declaration/struct-property-declaration-ast-validation-processor.ts';
import { VariableDeclarationAstValidationProcessor } from './processor/declaration/variable-declaration-ast-validation-processor.ts';
import { DocumentAstValidationProcessor } from './processor/document-ast-validation-processor.ts';
import { ArithmeticExpressionAstValidationProcessor } from './processor/expression/operation/arithmetic-expression-ast-validation-processor.ts';
import { BinaryExpressionAstValidationProcessor } from './processor/expression/operation/binary-expression-ast-validation-processor.ts';
import { ComparisonExpressionAstValidationProcessor } from './processor/expression/operation/comparison-expression-ast-validation-processor.ts';
import { LogicalExpressionAstValidationProcessor } from './processor/expression/operation/logical-expression-ast-validation-processor.ts';
import { AddressOfExpressionAstValidationProcessor } from './processor/expression/single_value/address-of-expression-ast-validation-processor.ts';
import { FunctionCallExpressionAstValidationProcessor } from './processor/expression/single_value/function-call-expression-ast-validation-processor.ts';
import { LiteralValueExpressionAstValidationProcessor } from './processor/expression/single_value/literal-value-expression-ast-validation-processor.ts';
import { NewExpressionAstValidationProcessor } from './processor/expression/single_value/new-expression-ast-validation-processor.ts';
import { ParenthesizedExpressionAstValidationProcessor } from './processor/expression/single_value/parenthesized-expression-ast-validation-processor.ts';
import { StringValueExpressionAstValidationProcessor } from './processor/expression/single_value/string-value-expression-ast-validation-processor.ts';
import { IndexedValueExpressionAstValidationProcessor } from './processor/expression/storage/indexed-value-expression-ast-validation-processor.ts';
import { PointerExpressionAstValidationProcessor } from './processor/expression/storage/pointer-expression-ast-validation-processor.ts';
import { ValueDecompositionExpressionAstValidationProcessor } from './processor/expression/storage/value-decomposition-expression-ast-validation-processor.ts';
import { VariableNameExpressionAstValidationProcessor } from './processor/expression/storage/variable-name-expression-ast-validation-processor.ts';
import { UnaryExpressionAstValidationProcessor } from './processor/expression/unary/unary-expression-ast-validation-processor.ts';
import { AttributeListAstValidationProcessor } from './processor/general/attribute-list-ast-validation-processor.ts';
import { TypeDeclarationAstValidationProcessor } from './processor/general/type-declaration-ast-validation-processor.ts';
import { DoWhileStatementAstValidationProcessor } from './processor/statement/branch/do-while-statement-ast-validation-processor.ts';
import { ForStatementAstValidationProcessor } from './processor/statement/branch/for-statement-ast-validation-processor.ts';
import { IfStatementAstValidationProcessor } from './processor/statement/branch/if-statement-ast-validation-processor.ts';
import { SwitchStatementAstValidationProcessor } from './processor/statement/branch/switch-statement-ast-validation-processor.ts';
import { WhileStatementAstValidationProcessor } from './processor/statement/branch/while-statement-ast-validation-processor.ts';
import { AssignmentStatementAstValidationProcessor } from './processor/statement/execution/assignment-statement-ast-validation-processor.ts';
import { BlockStatementAstValidationProcessor } from './processor/statement/execution/block-statement-ast-validation-processor.ts';
import { FunctionCallStatementAstValidationProcessor } from './processor/statement/execution/function-call-statement-ast-validation-processor.ts';
import { IncrementDecrementStatementAstValidationProcessor } from './processor/statement/execution/increment-decrement-statement-ast-validation-processor.ts';
import { VariableDeclarationStatementAstValidationProcessor } from './processor/statement/execution/variable-declaration-statement-ast-validation-processor.ts';
import { BreakStatementAstValidationProcessor } from './processor/statement/single/break-statement-ast-validation-processor.ts';
import { ContinueStatementAstValidationProcessor } from './processor/statement/single/continue-statement-ast-validation-processor.ts';
import { DiscardStatementAstValidationProcessor } from './processor/statement/single/discard-statement-ast-validation-processor.ts';
import { ReturnStatementAstValidationProcessor } from './processor/statement/single/return-statement-ast-validation-processor.ts';

/**
 * Validates PGSL syntax trees and collects their incidents.
 */
export class PgslValidator {
    private readonly mValidationProcessors: Map<AbstractSyntaxTreeConstructor, PgslValidatorProcessor<AbstractSyntaxTree>>;

    /**
     * Creates a new PGSL syntax tree validator.
     */
    public constructor() {
        this.mValidationProcessors = new Map<AbstractSyntaxTreeConstructor, PgslValidatorProcessor<AbstractSyntaxTree>>();

        // Define transpilation processors for all node types.
        this.addProcessor(DocumentAstValidationProcessor);

        // Declarations.
        this.addProcessor(AliasDeclarationAstValidationProcessor);
        this.addProcessor(EnumDeclarationAstValidationProcessor);
        this.addProcessor(FunctionDeclarationAstValidationProcessor);
        this.addProcessor(FunctionOverloadDeclarationAstValidationProcessor);
        this.addProcessor(StructDeclarationAstValidationProcessor);
        this.addProcessor(StructPropertyDeclarationAstValidationProcessor);
        this.addProcessor(VariableDeclarationAstValidationProcessor);

        // General.
        this.addProcessor(AttributeListAstValidationProcessor);
        this.addProcessor(TypeDeclarationAstValidationProcessor);

        // Expressions - Operations
        this.addProcessor(ArithmeticExpressionAstValidationProcessor);
        this.addProcessor(BinaryExpressionAstValidationProcessor);
        this.addProcessor(ComparisonExpressionAstValidationProcessor);
        this.addProcessor(LogicalExpressionAstValidationProcessor);

        // Expressions - Single Values
        this.addProcessor(AddressOfExpressionAstValidationProcessor);
        this.addProcessor(FunctionCallExpressionAstValidationProcessor);
        this.addProcessor(LiteralValueExpressionAstValidationProcessor);
        this.addProcessor(NewExpressionAstValidationProcessor);
        this.addProcessor(ParenthesizedExpressionAstValidationProcessor);
        this.addProcessor(StringValueExpressionAstValidationProcessor);

        // Expressions - Storage
        this.addProcessor(IndexedValueExpressionAstValidationProcessor);
        this.addProcessor(PointerExpressionAstValidationProcessor);
        this.addProcessor(ValueDecompositionExpressionAstValidationProcessor);
        this.addProcessor(VariableNameExpressionAstValidationProcessor);

        // Expressions - Unary
        this.addProcessor(UnaryExpressionAstValidationProcessor);

        // Statements - Execution
        this.addProcessor(AssignmentStatementAstValidationProcessor);
        this.addProcessor(BlockStatementAstValidationProcessor);
        this.addProcessor(FunctionCallStatementAstValidationProcessor);
        this.addProcessor(IncrementDecrementStatementAstValidationProcessor);
        this.addProcessor(VariableDeclarationStatementAstValidationProcessor);

        // Statements - Branch
        this.addProcessor(DoWhileStatementAstValidationProcessor);
        this.addProcessor(ForStatementAstValidationProcessor);
        this.addProcessor(IfStatementAstValidationProcessor);
        this.addProcessor(SwitchStatementAstValidationProcessor);
        this.addProcessor(WhileStatementAstValidationProcessor);

        // Statements - Single
        this.addProcessor(BreakStatementAstValidationProcessor);
        this.addProcessor(ContinueStatementAstValidationProcessor);
        this.addProcessor(DiscardStatementAstValidationProcessor);
        this.addProcessor(ReturnStatementAstValidationProcessor);
    }

    /**
     * Adds a validation processor for its target syntax tree type.
     *
     * @typeParam T - The syntax tree type the processor validates.
     *
     * @param pProcessorConstructor - The processor constructor of the syntax tree type.
     */
    public addProcessor<T extends AbstractSyntaxTree>(pProcessorConstructor: PgslValidatorProcessorConstructor<T>): void {
        // Construct processor.
        const lProcessor: PgslValidatorProcessor<T> = new pProcessorConstructor();

        // Register for processor target.
        this.mValidationProcessors.set(lProcessor.target, lProcessor as PgslValidatorProcessor<AbstractSyntaxTree>);
    }

    /**
     * Validates a PGSL syntax tree instance and all of its children.
     *
     * @param pInstance - The PGSL syntax tree instance to validate.
     *
     * @returns The validation result.
     */
    public validate(pInstance: AbstractSyntaxTree): PgslValidatorResult {
        // Generate resources for this validation run.
        const lIncidentList: Array<AbstractSyntaxTreeIncident> = new Array<AbstractSyntaxTreeIncident>();
        const lValidationStack: Stack<AbstractSyntaxTree> = new Stack<AbstractSyntaxTree>();
        const lTypeCache: PgslTypeCache = new PgslTypeCache();

        // Create callbacks.
        const lValidate: PgslValidatorProcessorValidate = (pInstance: AbstractSyntaxTree): boolean => {
            // Read processor for the instance.
            const lProcessor: PgslValidatorProcessor<AbstractSyntaxTree> | undefined = this.mValidationProcessors.get(pInstance.constructor as AbstractSyntaxTreeConstructor);
            if (!lProcessor) {
                throw new Error(`No validation processor found for syntax tree of type '${pInstance.constructor.name}'.`);
            }

            // Push AST into validation stack.
            lValidationStack.push(pInstance);

            // Then call validate.
            const lValidationResult: boolean = lProcessor.validate({
                instance: pInstance,
                validationCallback: lValidate,
                incidentList: lIncidentList,
                types: lTypeCache,
                validationStack: lValidationStack
            });

            // Pop the current AST and return validation result.
            lValidationStack.pop();
            return lValidationResult;
        };

        // Create result.
        return {
            validationSuccess: lValidate(pInstance),
            incidents: lIncidentList,
        };
    }
}

export type PgslValidatorResult = {
    validationSuccess: boolean;
    incidents: Array<AbstractSyntaxTreeIncident>;
};