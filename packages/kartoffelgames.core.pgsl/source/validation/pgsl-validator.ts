import { Stack } from '@kartoffelgames/core';
import type { AbstractSyntaxTreeIncident } from '../abstract_syntax_tree/abstract-syntax-tree-context.ts';
import type { AbstractSyntaxTree, AbstractSyntaxTreeConstructor } from '../abstract_syntax_tree/abstract-syntax-tree.ts';
import type { PgslValidatorProcessor, PgslValidatorProcessorConstructor, PgslValidatorProcessorValidate } from './pgsl-validator-processor.ts';

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
        const lIncidentList: Array<AbstractSyntaxTreeIncident> = new Array<AbstractSyntaxTreeIncident>();
        const lValidationStack: Stack<AbstractSyntaxTree> = new Stack<AbstractSyntaxTree>();

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