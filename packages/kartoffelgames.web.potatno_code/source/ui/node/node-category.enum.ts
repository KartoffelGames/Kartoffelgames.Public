/**
 * System-reserved node category constants.
 * Users can define custom category strings for their node definitions.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NodeCategory {
    /** Callable function node. */
    export const Function: string = 'function';
    /** Non-functional comment annotation node. */
    export const Comment: string = 'comment';
    /** External input entry point node. */
    export const Input: string = 'input';
    /** External output exit point node. */
    export const Output: string = 'output';
    /** Reroute passthrough node. */
    export const Reroute: string = 'reroute';
}

/**
 * Provides display metadata for node categories.
 * System categories have predefined metadata; user-defined categories
 * get an auto-generated deterministic color based on the category string.
 */
export class NodeCategoryMeta {
    private static readonly META: Record<string, { icon: string; cssColor: string; label: string }> = {
        [NodeCategory.Function]: { icon: 'f', cssColor: 'var(--pn-accent-blue)', label: 'Function' },
        [NodeCategory.Comment]: { icon: '💬', cssColor: 'var(--pn-accent-yellow)', label: 'Comment' },
        [NodeCategory.Input]: { icon: '→', cssColor: 'var(--pn-accent-green)', label: 'Input' },
        [NodeCategory.Output]: { icon: '←', cssColor: 'var(--pn-accent-red)', label: 'Output' },
        [NodeCategory.Reroute]: { icon: '◇', cssColor: 'var(--pn-text-muted)', label: 'Reroute' }
    };

    /**
     * Get display metadata for a category. System categories return predefined values;
     * user-defined categories get an auto-generated deterministic HSL color.
     */
    public static get(pCategory: string): { icon: string; cssColor: string; label: string } {
        const lMeta = NodeCategoryMeta.META[pCategory];
        if (lMeta) {
            return lMeta;
        }

        // Generate a deterministic HSL color from the category string hash.
        const lHue: number = NodeCategoryMeta.hashStringToHue(pCategory);
        return {
            icon: '◆',
            cssColor: `hsl(${lHue}, 60%, 55%)`,
            label: pCategory.charAt(0).toUpperCase() + pCategory.slice(1)
        };
    }

    /**
     * Hash a string to a hue value (0-360) for deterministic color generation.
     */
    private static hashStringToHue(pStr: string): number {
        let lHash: number = 0;
        for (let lI: number = 0; lI < pStr.length; lI++) {
            lHash = ((lHash << 5) - lHash) + pStr.charCodeAt(lI);
            lHash = lHash & lHash; // Convert to 32-bit integer.
        }
        return Math.abs(lHash) % 360;
    }
}
