import { Exception, type Stack } from '@kartoffelgames/core';
import type { IAnyParameterConstructor } from '../../../kartoffelgames.core/source/interface/i-constructor.ts';
import { AbstractSyntaxTreeIncident } from '../abstract_syntax_tree/abstract-syntax-tree-context.ts';
import type { AbstractSyntaxTree } from '../abstract_syntax_tree/abstract-syntax-tree.ts';
import type { PgslTypeCache } from '../abstract_syntax_tree/type/pgsl-type-cache.ts';

/**
 * Validates one syntax tree type and reports its incidents to the validator.
 *
 * @typeParam TTarget - The syntax tree type the processor validates.
 */
export abstract class PgslValidatorProcessor<TTarget extends AbstractSyntaxTree> {
    private mValidationContext: PgslValidatorProcessorContext<TTarget> | null;

    /**
     * The target abstract syntax tree constructor that this processor handles.
     */
    public abstract readonly target: IAnyParameterConstructor<TTarget>;

    /**
     * Type cache of the running validation.
     */
    protected get types(): PgslTypeCache {
        if (!this.mValidationContext) {
            throw new Exception('Invalid access of types', this);
        }

        return this.mValidationContext.types;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mValidationContext = null;
    }

    /**
     * Validate the current instance.
     * Should only be called by the core validator.
     * 
     * @param pValidationContext - The context of the running validation.
     *
     * @returns true on validation success.
     */
    public validate(pValidationContext: PgslValidatorProcessorContext<TTarget>): boolean {
        // Cache old values.
        const lParentValidationContext: PgslValidatorProcessorContext<TTarget> | null = this.mValidationContext;

        // Set references, valid for this call.
        this.mValidationContext = pValidationContext;

        // Save the current incident count.
        const lCurrentIncidentCount: number = this.mValidationContext.incidentList.length;

        try {
            // Then call validate.
            this.onValidate(this.mValidationContext.instance.data, this.mValidationContext.instance);

            // The result is negative if new incidents were added while validating.
            return this.mValidationContext.incidentList.length === lCurrentIncidentCount;
        } finally {
            // Reset process references to last state.
            this.mValidationContext = lParentValidationContext;
        }
    }


    /**
     * Add a validation incident.
     * 
     * @param pMessage - Incident message.
     * @param pDifferentAst - Changes the target of the incident to a different AST.
     */
    protected pushIncident(pMessage: string, pDifferentAst?: AbstractSyntaxTree): void {
        if (!this.mValidationContext) {
            throw new Exception('Invalid call of pushIncident', this);
        }

        this.mValidationContext.incidentList.push(new AbstractSyntaxTreeIncident(pMessage, pDifferentAst ?? this.mValidationContext.instance));
    }

    /**
     * Find the nearest parent of the validated instance that is the specified type.
     *
     * @param pParentTypes - The syntax tree types to search for. Abstract types match all of their subtypes.
     *
     * @returns The closest matching parent, or null when no parent matches.
     * 
     * @typeParam TParentType - The syntax tree type to search for.
     */
    protected stackContains<TParentType extends PgslValidatorProcessorParentType<AbstractSyntaxTree>>(pAstType: TParentType): InstanceType<TParentType> | null {
        if (!this.mValidationContext) {
            throw new Exception('Invalid call of stackContains', this);
        }

        // Search from the nearest to the farthest parent.
        for (const lAst of this.mValidationContext.validationStack.entries()) {
            // The validated instance is the top of the stack and no parent of itself.
            if (lAst === this.mValidationContext.instance) {
                continue;
            }

            if (lAst instanceof pAstType) {
                return lAst as InstanceType<TParentType>;
            }
        }

        return null;
    }

    /**
     * Validate sub ast.
     * 
     * @param pInstance - AST instance to validate.
     * 
     * @returns true when no validation incident was registered.
     */
    protected validateAst(pInstance: AbstractSyntaxTree): boolean {
        if (!this.mValidationContext) {
            throw new Exception('Invalid call of validateAst', this);
        }

        return this.mValidationContext.validationCallback(pInstance);
    }

    /**
     * Validate instance.
     * Processors that only need the data can omit the instance parameter.
     *
     * @param pData - Data of the AST instance.
     * @param pInstance - AST instance.
     */
    protected abstract onValidate(pData: TTarget['data'], pInstance: TTarget): void;
}

/**
 * Function for validating sub ASTs.
 */
export type PgslValidatorProcessorValidate = (pInstance: AbstractSyntaxTree) => boolean;

export type PgslValidatorProcessorContext<TTarget extends AbstractSyntaxTree> = {
    incidentList: Array<AbstractSyntaxTreeIncident>;
    instance: TTarget;
    types: PgslTypeCache;
    validationCallback: PgslValidatorProcessorValidate;
    validationStack: Stack<AbstractSyntaxTree>;
};

export type PgslValidatorProcessorConstructor<T extends AbstractSyntaxTree> = {
    new(): PgslValidatorProcessor<T>;
};

/**
 * Any syntax tree class, abstract or not, a parent can be searched for.
 */
export type PgslValidatorProcessorParentType<T extends AbstractSyntaxTree> = abstract new (...pArgs: Array<any>) => T;