export class PgslTranspilationTrace {
    private mBindings: PgslTranspilationTraceBindings;

    /**
     * Bindings tracking.
     */
    public constructor() {
        // Initialize bindings tracking.
        this.mBindings = {
            bindGroupCounter: 0,
            bindGroupNames: new Map<number, string>(),
            bindGroupBindingsCounter: new Map<number, number>(),
            bindGroupBindingNames: new Map<string, string>(),
        };
    }

    public resolveBinding(pBindGroupName: string, pBindingName: string): PgslTranspilationTraceBinding {
        
    }
}

export type PgslTranspilationTraceBinding = {
    bindGroup: number;
    binding: number;
}

/**
 * Keeps track of bind groups and bindings during transpilation.
 */
type PgslTranspilationTraceBindings = {
    bindGroupCounter: number;
    bindGroupNames: Map<number, string>;
    bindGroupBindingsCounter: Map<number, number>;
    bindGroupBindingNames: Map<string, string>;
}