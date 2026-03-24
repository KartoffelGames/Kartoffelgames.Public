/**
 * Category classification for node types in the visual code editor.
 */
export enum NodeCategory {
    /** Callable function node. */
    Function = 'function',
    /** Arithmetic or logical operator node. */
    Operator = 'operator',
    /** Constant or variable value node. */
    Value = 'value',
    /** Execution flow control node. */
    Flow = 'flow',
    /** Non-functional comment annotation node. */
    Comment = 'comment',
    /** Node that converts between data types. */
    TypeConversion = 'type-conversion',
    /** External input entry point node. */
    Input = 'input',
    /** External output exit point node. */
    Output = 'output',
    /** Event entry point node. */
    Event = 'event',
    /** Reroute passthrough node. */
    Reroute = 'reroute',
    /** Get local variable node. */
    GetLocal = 'getlocal',
    /** Set local variable node. */
    SetLocal = 'setlocal'
}

/**
 * Provides display metadata for node categories.
 */
export class NodeCategoryMeta {
    private static readonly META: Record<string, { icon: string; cssColor: string; label: string }> = {
        [NodeCategory.Function]: { icon: 'f', cssColor: 'var(--pn-accent-blue)', label: 'Function' },
        [NodeCategory.Operator]: { icon: '±', cssColor: 'var(--pn-accent-green)', label: 'Operator' },
        [NodeCategory.Value]: { icon: '#', cssColor: 'var(--pn-accent-peach)', label: 'Value' },
        [NodeCategory.Flow]: { icon: '⟳', cssColor: 'var(--pn-accent-mauve)', label: 'Flow' },
        [NodeCategory.Comment]: { icon: '💬', cssColor: 'var(--pn-accent-yellow)', label: 'Comment' },
        [NodeCategory.TypeConversion]: { icon: '⇄', cssColor: 'var(--pn-accent-teal)', label: 'Type Conversion' },
        [NodeCategory.Input]: { icon: '→', cssColor: 'var(--pn-accent-green)', label: 'Input' },
        [NodeCategory.Output]: { icon: '←', cssColor: 'var(--pn-accent-red)', label: 'Output' },
        [NodeCategory.Event]: { icon: '⚡', cssColor: 'var(--pn-accent-danger)', label: 'Event' },
        [NodeCategory.Reroute]: { icon: '◇', cssColor: 'var(--pn-text-muted)', label: 'Reroute' },
        [NodeCategory.GetLocal]: { icon: '↓', cssColor: 'var(--pn-accent-teal)', label: 'Get Local' },
        [NodeCategory.SetLocal]: { icon: '↑', cssColor: 'var(--pn-accent-teal)', label: 'Set Local' }
    };

    public static get(pCategory: string): { icon: string; cssColor: string; label: string } {
        return NodeCategoryMeta.META[pCategory] ?? { icon: '?', cssColor: 'var(--pn-text-muted)', label: 'Unknown' };
    }
}
