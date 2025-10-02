import { IAnyParameterConstructor } from "../../kartoffelgames.core/source/interface/i-constructor.ts";
import { BasePgslSyntaxTree, SyntaxTreeMeta } from "./syntax_tree/base-pgsl-syntax-tree.ts";
import { PgslAliasDeclaration } from "./syntax_tree/declaration/pgsl-alias-declaration.ts";
import { PgslEnumDeclaration } from "./syntax_tree/declaration/pgsl-enum-declaration.ts";
import { PgslFunctionDeclaration } from "./syntax_tree/declaration/pgsl-function-declaration.ts";
import { PgslStructDeclaration } from "./syntax_tree/declaration/pgsl-struct-declaration.ts";
import { PgslVariableDeclaration } from "./syntax_tree/declaration/pgsl-variable-declaration.ts";
import { PgslDocument } from "./syntax_tree/pgsl-document.ts";
import { PgslTrace } from "./trace/pgsl-trace.ts";

/**
 * Validates PGSL syntax trees to ensure they conform to language specifications.
 * This class provides validation services for all PGSL syntax tree nodes,
 * recursively validating the entire tree structure.
 */
export class PgslValidation {
    private readonly mValidatorProcessors: Map<PgslSyntaxTreeConstructor, PgslValidationProcessor<BasePgslSyntaxTree>>;

    /**
     * Creates a new PGSL syntax tree validator.
     * Initializes all validation processors for different syntax tree node types.
     */
    public constructor() {
        this.mValidatorProcessors = new Map<PgslSyntaxTreeConstructor, PgslValidationProcessor<BasePgslSyntaxTree>>();

        // Define validation processors for all node types.
        this.addProcessor(PgslDocument, this.validationPgslDocument);
    }

    /**
     * Validates a PGSL syntax tree instance recursively.
     * Validates the given instance and all its child nodes, collecting
     * validation incidents and determining overall validity.
     * 
     * @param pInstance - The PGSL syntax tree instance to validate.
     * @param pTrace - The syntax tree trace for error reporting context.
     * 
     * @returns The validation result containing validity status and any incidents found.
     */
    public validate(pInstance: BasePgslSyntaxTree, pTrace: PgslTrace): PgslValidatorResult {
        // Create empty incident list.
        const lValidationResult: PgslValidatorResult = {
            valid: true,
            incidents: new Array<PgslValidatorIncident>()
        };

        // Read processor for the instance.
        const lProcessor: PgslValidationProcessor<BasePgslSyntaxTree> | undefined = this.mValidatorProcessors.get(pInstance.constructor as PgslSyntaxTreeConstructor);
        if (!lProcessor) {
            return lValidationResult;
        }

        // Validate instance.
        lProcessor.apply(this, [pInstance, pTrace, (pMessage: string, pMeta: SyntaxTreeMeta, pNode: BasePgslSyntaxTree) => {
            lValidationResult.incidents.push(new PgslValidatorIncident(pMessage, pMeta, pNode));
        }] satisfies [BasePgslSyntaxTree, PgslTrace, PgslValidationProcessorSendError]);

        // Validate childs.
        for (const lInstanceChilds of pInstance.childNodes) {
            // Validate child.
            const lChildValidationResult: PgslValidatorResult = this.validate(lInstanceChilds, pTrace);

            // Merge child validation results with parent result.
            lValidationResult.incidents.push(...lChildValidationResult.incidents);
            lValidationResult.valid = lValidationResult.valid && lChildValidationResult.valid;
        }

        return lValidationResult;
    }

    /**
     * Adds a validation processor for a specific syntax tree constructor.
     * This method handles type casting to suppress TypeScript warnings while
     * maintaining type safety at runtime.
     * 
     * @param pConstructor - The constructor of the syntax tree type.
     * @param pProcessor - The validation processor function for the syntax tree type.
     * 
     * @template T - The specific syntax tree type that extends BasePgslSyntaxTree.
     */
    private addProcessor<T extends BasePgslSyntaxTree>(pConstructor: IAnyParameterConstructor<T>, pProcessor: PgslValidationProcessor<T>): void {
        this.mValidatorProcessors.set(pConstructor, pProcessor as PgslValidationProcessor<BasePgslSyntaxTree>);
    }

    /**
     * Validates a PgslDocument instance.
     * Ensures that the document contains only valid top-level declarations
     * such as aliases, enums, functions, variables, and structs.
     * 
     * @param pInstance - The PgslDocument instance to validate.
     * @param _pTrace - The syntax tree trace (unused in this validation).
     * @param pSendError - The function to call when a validation error is found.
     */
    private validationPgslDocument(pInstance: PgslDocument, _pTrace: PgslTrace, pSendError: PgslValidationProcessorSendError): void {
        const lValidChilds = new Set<PgslSyntaxTreeConstructor>([
            PgslAliasDeclaration, PgslEnumDeclaration, PgslFunctionDeclaration, PgslVariableDeclaration, PgslStructDeclaration
        ]);

        // Validate all child structures are of allowed types.
        for (const lChild of pInstance.childNodes) {
            if (!lValidChilds.has(lChild.constructor as PgslSyntaxTreeConstructor)) {
                pSendError(`Invalid child structure in document. Expected declaration but found '${lChild.constructor.name}'.`, lChild.meta, lChild);
            }
        }
    }
}

/**
 * Represents a validation incident found during PGSL syntax tree validation.
 * Contains information about the error, its location, and the affected syntax tree node.
 */
export class PgslValidatorIncident {
    private readonly mMeta: SyntaxTreeMeta;
    private readonly mMessage: string;
    private readonly mTarget: BasePgslSyntaxTree;

    /**
     * Gets the human-readable message describing the validation incident.
     * 
     * @returns The incident message.
     */
    public get message(): string {
        return this.mMessage;
    }

    /**
     * Gets the meta information about the location of the incident.
     * This includes line numbers, column positions, and other source location data.
     * 
     * @returns The meta information of the incident.
     */
    public get meta(): SyntaxTreeMeta {
        return this.mMeta;
    }

    /**
     * Gets the syntax tree node that is the target of this validation incident.
     * This is the specific node that caused or contains the validation error.
     * 
     * @returns The target syntax tree node.
     */
    public get target(): BasePgslSyntaxTree {
        return this.mTarget;
    }

    /**
     * Creates a new validator incident.
     * 
     * @param pMessage - Human-readable message describing the incident.
     * @param pMeta - Meta information about the incident location.
     * @param pTarget - The syntax tree node that caused the incident.
     */
    public constructor(pMessage: string, pMeta: SyntaxTreeMeta, pTarget: BasePgslSyntaxTree) {
        this.mMeta = pMeta;
        this.mTarget = pTarget;
        this.mMessage = pMessage;
    }
}

/**
 * Result of a PGSL syntax tree validation operation.
 * Contains the overall validity status and a list of any incidents found.
 */
type PgslValidatorResult = {
    /** 
     * Whether the validation passed without any incidents. 
     */
    valid: boolean;
    
    /**
     * List of validation incidents found during validation.
     */
    incidents: Array<PgslValidatorIncident>;
};

/**
 * Type representing a constructor function for PGSL syntax tree nodes.
 * Used as a key in the validation processor map to associate constructors with their corresponding validation logic.
 */
type PgslSyntaxTreeConstructor = IAnyParameterConstructor<BasePgslSyntaxTree>;

/**
 * Function type for reporting validation errors during the validation process.
 * Called by validation processors when they encounter validation incidents.
 * 
 * @param pMessage - Human-readable error message.
 * @param pMeta - Meta information about the error location.
 * @param pNode - The syntax tree node associated with the error.
 */
type PgslValidationProcessorSendError = (pMessage: string, pMeta: SyntaxTreeMeta, pNode: BasePgslSyntaxTree) => void;

/**
 * Function type for validation processors that validate specific syntax tree node types.
 * Each processor is responsible for validating one type of syntax tree node.
 * 
 * @param pInstance - The syntax tree instance to validate.
 * @param pTrace - The syntax tree trace for context.
 * @param pSendError - Function to call when validation errors are found.
 * 
 *  @template T - The specific syntax tree node type being validated.
 */
type PgslValidationProcessor<T extends BasePgslSyntaxTree> = (pInstance: T, pTrace: PgslTrace, pSendError: PgslValidationProcessorSendError) => void;