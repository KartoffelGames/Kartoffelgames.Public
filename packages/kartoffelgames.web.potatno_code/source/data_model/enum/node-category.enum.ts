/**
 * Fixed node category enum. Each category has a color and icon character.
 */
export enum NodeCategory {
    Input = 'input',
    Output = 'output',
    Value = 'value',
    Function = 'function',
    Flow = 'flow',
    Comment = 'comment',
    Operator = 'operator',
    TypeConversion = 'type-conversion'
}

/**
 * Display metadata for each node category.
 */
export const NODE_CATEGORY_META: Record<NodeCategory, { icon: string; cssColor: string; label: string }> = {
    [NodeCategory.Input]: { icon: '\u25B6', cssColor: 'var(--pn-cat-input)', label: 'Input' },
    [NodeCategory.Output]: { icon: '\u25C0', cssColor: 'var(--pn-cat-output)', label: 'Output' },
    [NodeCategory.Value]: { icon: '\u2261', cssColor: 'var(--pn-cat-value)', label: 'Value' },
    [NodeCategory.Function]: { icon: '\u0192', cssColor: 'var(--pn-cat-function)', label: 'Function' },
    [NodeCategory.Flow]: { icon: '\u27F3', cssColor: 'var(--pn-cat-flow)', label: 'Flow' },
    [NodeCategory.Comment]: { icon: '\u270E', cssColor: 'var(--pn-cat-comment)', label: 'Comment' },
    [NodeCategory.Operator]: { icon: '\u2211', cssColor: 'var(--pn-cat-operator)', label: 'Operator' },
    [NodeCategory.TypeConversion]: { icon: '\u21C4', cssColor: 'var(--pn-cat-type-conversion)', label: 'Type Conversion' }
};
