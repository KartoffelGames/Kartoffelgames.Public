export class PgslTranspilationTrace {
    private mNameResolutions: PgslTranspilationTraceNameResolutions;

    /**
     * Bindings tracking.
     */
    public constructor() {
        // Initialize name resolutions.
        this.mNameResolutions = {
            groupResolution: new Map<string, { index: number; locations: Map<string, number>;}>()
        };
    }

    /**
     * Resolves the binding for a given bind group and binding name.
     * 
     * @param pBindGroupName The name of the bind group.
     * @param pBindingName The name of the binding.
     * 
     * @returns The resolved binding information.
     */
    public resolveBinding(pBindGroupName: string, pBindingName: string): PgslTranspilationTraceBinding {
        let lBindGroupIndex: number = -1;

        // Check if bind group exists.
        if (!this.mNameResolutions.groupResolution.has(pBindGroupName)) {
            // Use the current size as new bind group index.
            lBindGroupIndex = this.mNameResolutions.groupResolution.size;

            // Create new entry for the bind group.
            this.mNameResolutions.groupResolution.set(pBindGroupName, {
                index: lBindGroupIndex,
                locations: new Map<string, number>(),
            });
        } else {
            // Read Bind group index of bind group name.
            lBindGroupIndex = this.mNameResolutions.groupResolution.get(pBindGroupName)!.index;
        }

        // Read the binding names map of the current bind group.
        const lBindGroupLocations: Map<string, number> = this.mNameResolutions.groupResolution.get(pBindGroupName)!.locations;

        // Check if bindgroup binding exists.
        if (!lBindGroupLocations.has(pBindingName)) {
            // Read the current bind group binding index of the current bind group and increment them by one.
            const lNextBindGroupBindingIndex: number = lBindGroupLocations.size;

            // Save the increment.
            lBindGroupLocations.set(pBindingName, lNextBindGroupBindingIndex);
        }

        // Return the binding location.
        return {
            bindGroup: lBindGroupIndex,
            binding: lBindGroupLocations.get(pBindingName)!,
        };
    }
}

export type PgslTranspilationTraceBinding = {
    bindGroup: number;
    binding: number;
};

/**
 * Keeps track of bind groups and bindings during transpilation.
 */
type PgslTranspilationTraceNameResolutions = {
    // Bind group.
    groupResolution: Map<string, {
        index: number;
        locations: Map<string, number>;
    }>;
};