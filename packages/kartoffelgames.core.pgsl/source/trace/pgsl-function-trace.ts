import { PgslType } from "../type/pgsl-type.ts";

/**
 * Trace information for PGSL function declarations and calls.
 * Tracks return types, parameters, entry points, and function call contexts.
 */
export class PgslFunctionTrace {
    private readonly mName: string;
    private readonly mReturnType: PgslType;
    private readonly mParameters: Array<PgslFunctionTraceParameter>;
    private readonly mEntryPoint: PgslFunctionTraceEntryPoint | null;

    /**
     * Gets the name of the function.
     * 
     * @returns The function name as declared in source code.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Gets the return type of the function.
     * 
     * @returns The PGSL type that the function returns.
     */
    public get returnType(): PgslType {
        return this.mReturnType;
    }

    /**
     * Gets the parameters of the function in declaration order.
     * 
     * @returns A readonly array of function parameters.
     */
    public get parameters(): ReadonlyArray<PgslFunctionTraceParameter> {
        return this.mParameters;
    }

    /**
     * Gets the entry point information if this function is an entry point.
     * 
     * @returns The entry point information or null if not an entry point.
     */
    public get entryPoint(): Readonly<PgslFunctionTraceEntryPoint> | null {
        return this.mEntryPoint;
    }

    /**
     * Gets whether this function is an entry point.
     * 
     * @returns True if this function is an entry point, false otherwise.
     */
    public get isEntryPoint(): boolean {
        return this.mEntryPoint !== null;
    }

    /**
     * Creates a new function trace.
     * 
     * @param pConstructorData - The data needed to construct the function trace.
     */
    public constructor(pConstructorData: PgslFunctionTraceConstructorParameter) {
        this.mName = pConstructorData.name;
        this.mReturnType = pConstructorData.returnType;
        this.mParameters = [...pConstructorData.parameters];
        this.mEntryPoint = pConstructorData.entryPoint ? { ...pConstructorData.entryPoint } : null;
    }
}

/**
 * Constructor type for creating PgslFunctionTrace instances.
 * Contains all the data needed to initialize a function trace.
 */
export type PgslFunctionTraceConstructorParameter = {
    /**
     * The name of the function
     */
    name: string;

    /**
     * The return type of the function
     */
    returnType: PgslType;

    /**
     * The parameters of the function in declaration order
     */
    parameters: ReadonlyArray<PgslFunctionTraceParameter>;

    /**
     * Optional entry point information
     */
    entryPoint: PgslFunctionTraceEntryPoint | null;
};

/**
 * Information about a function parameter.
 * Contains the parameter name and type.
 */
export type PgslFunctionTraceParameter = {
    /**
     * The name of the parameter
     */
    name: string;

    /**
     * The type of the parameter
     */
    type: PgslType;
};

/**
 * Entry point information for shader functions.
 * Specifies the shader stage and related configuration.
 */
export type PgslFunctionTraceEntryPoint = {
    /**
     * The type of entry point
     */
    stage: PgslFunctionTraceEntryPointStage;

    /**
     * Workgroup size for compute shaders (x, y, z dimensions)
     * Only applicable for compute entry points
     */
    workgroupSize?: PgslFunctionTraceWorkgroupSize;
};

/**
 * Workgroup size specification for compute shaders.
 */
export type PgslFunctionTraceWorkgroupSize = {
    /**
     * X dimension of the workgroup
     */
    x: number;

    /**
     * Y dimension of the workgroup
     */
    y: number;

    /**
     * Z dimension of the workgroup
     */
    z: number;
};

/**
 * Supported shader entry point stages.
 */
export type PgslFunctionTraceEntryPointStage = 'vertex' | 'fragment' | 'compute';
