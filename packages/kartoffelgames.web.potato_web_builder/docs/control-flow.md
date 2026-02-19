# Control Flow

PWB provides two built-in instruction modules for controlling DOM structure at the template level: `$if` for conditional rendering and `$for` for iteration.

## $if -- Conditional Rendering

The `$if` instruction conditionally includes or excludes its child content from the DOM based on a truthy/falsy expression.

### Syntax

```
$if(expression) {
    <child content/>
}
```

### Basic Usage

```typescript
@PwbComponent({
    selector: 'toggle-panel',
    template: `
        <button (click)="this.visible = !this.visible">Toggle</button>
        $if(this.visible) {
            <div>This content is conditionally rendered.</div>
        }
    `
})
class TogglePanel extends Processor {
    public visible: boolean = true;
}
```

When `this.visible` is `true`, the `<div>` is rendered. When `false`, it is removed from the DOM entirely.

### Truthy and Falsy Values

The expression result is coerced to a boolean using JavaScript's truthiness rules. Any truthy value renders the content; any falsy value removes it.

```typescript
@PwbComponent({
    selector: 'truthy-demo',
    template: `
        $if(this.data) {
            <p>Data is present</p>
        }
    `
})
class TruthyDemo extends Processor {
    @PwbExport
    public data: any = null;
}
```

Truthy values: non-empty strings, non-zero numbers, objects, arrays, `true`
Falsy values: `null`, `undefined`, `0`, `""`, `false`, `NaN`

### Reactive Updates

When the expression result changes between truthy and falsy, the `$if` instruction adds or removes the child content. When the value changes but remains truthy (or remains falsy), no DOM update occurs.

```typescript
@PwbComponent({
    selector: 'if-reactive',
    template: `
        $if(this.items.length > 0) {
            <ul>
                $for(item of this.items) {
                    <li>{{this.item}}</li>
                }
            </ul>
        }
        $if(this.items.length === 0) {
            <p>No items.</p>
        }
    `
})
class IfReactive extends Processor {
    @PwbExport
    public items: Array<string> = [];
}
```

### Nested Instructions

`$if` can be nested inside other instructions and can contain other instructions:

```typescript
@PwbComponent({
    selector: 'nested-if',
    template: `
        $for(section of this.sections) {
            $if(this.section.enabled) {
                <div>
                    <h3>{{this.section.title}}</h3>
                    $if(this.section.items.length > 0) {
                        <ul>
                            $for(item of this.section.items) {
                                <li>{{this.item}}</li>
                            }
                        </ul>
                    }
                </div>
            }
        }
    `
})
class NestedIf extends Processor {
    public sections = [
        { title: 'Active', enabled: true, items: ['Task 1', 'Task 2'] },
        { title: 'Hidden', enabled: false, items: ['Task 3'] }
    ];
}
```

### How $if Works Internally

The `IfInstructionModule` evaluates the expression on each update cycle. When the boolean result changes:

1. If the result becomes truthy, it creates a new `InstructionResult` containing a clone of the child template and a new `DataLevel` inheriting from the current scope.
2. If the result becomes falsy, it creates an empty `InstructionResult`, causing all child DOM nodes to be removed.
3. If the result does not change, it returns `null` to signal no DOM update is needed.

## $for -- Iteration

The `$for` instruction repeats its child content for each item in an iterable value (array, object, or generator).

### Syntax

```
$for(variableName of expression) {
    <child content/>
}
```

With an optional index variable:

```
$for(variableName of expression; indexName = $index) {
    <child content/>
}
```

### Array Iteration

```typescript
@PwbComponent({
    selector: 'color-list',
    template: `
        <ul>
            $for(color of this.colors) {
                <li>{{this.color}}</li>
            }
        </ul>
    `
})
class ColorList extends Processor {
    public colors: Array<string> = ['Red', 'Green', 'Blue'];
}
```

Renders:
```html
<ul>
    <li>Red</li>
    <li>Green</li>
    <li>Blue</li>
</ul>
```

The variable `this.color` is a temporary value available only within the `$for` block.

### With Index

The `$index` variable provides the current iteration key (array index as a string, or object key).

```typescript
@PwbComponent({
    selector: 'indexed-list',
    template: `
        <ol>
            $for(item of this.items; idx = $index) {
                <li>{{this.idx}}: {{this.item}}</li>
            }
        </ol>
    `
})
class IndexedList extends Processor {
    public items: Array<string> = ['Alpha', 'Beta', 'Gamma'];
}
```

Renders:
```html
<ol>
    <li>0: Alpha</li>
    <li>1: Beta</li>
    <li>2: Gamma</li>
</ol>
```

### Calculated Index

The index expression can include arithmetic or other transformations:

```typescript
@PwbComponent({
    selector: 'calc-index',
    template: `
        $for(item of this.items; position = $index * 2) {
            <div>Position {{this.position}}: {{this.item}}</div>
        }
    `
})
class CalcIndex extends Processor {
    public items: Array<number> = [10, 20, 30];
}
```

The index expression has access to both `$index` and the iteration variable.

### Object Iteration

When iterating over an object, `$for` iterates over its entries. Each value is the property value, and `$index` provides the property key.

```typescript
@PwbComponent({
    selector: 'object-iter',
    template: `
        $for(value of this.config; key = $index) {
            <div>{{this.key}}: {{this.value}}</div>
        }
    `
})
class ObjectIter extends Processor {
    public config: { [key: string]: number } = {
        width: 100,
        height: 200,
        depth: 50
    };
}
```

### Generator Functions

Any iterable or generator function can be used as the iteration source:

```typescript
@PwbComponent({
    selector: 'generator-iter',
    template: `
        $for(num of this.range(1, 5)) {
            <span>{{this.num}} </span>
        }
    `
})
class GeneratorIter extends Processor {
    public *range(start: number, end: number): Generator<number> {
        for (let i = start; i < end; i++) {
            yield i;
        }
    }
}
```

### Inline Expressions

The iteration source can be an inline expression:

```typescript
@PwbComponent({
    selector: 'inline-iter',
    template: `
        $for(item of [1, 2, 3]) {
            <div>{{this.item}}</div>
        }
    `
})
class InlineIter extends Processor { }
```

```typescript
@PwbComponent({
    selector: 'inline-fill',
    template: `
        $for(item of new Array(3).fill('x')) {
            <span>{{this.item}}</span>
        }
    `
})
class InlineFill extends Processor { }
```

### Nested $for Loops

```typescript
@PwbComponent({
    selector: 'grid-render',
    template: `
        <table>
            $for(row of this.grid; rowIdx = $index) {
                <tr>
                    $for(cell of this.row; colIdx = $index) {
                        <td>{{this.rowIdx}},{{this.colIdx}}: {{this.cell}}</td>
                    }
                </tr>
            }
        </table>
    `
})
class GridRender extends Processor {
    public grid: Array<Array<string>> = [
        ['A', 'B', 'C'],
        ['D', 'E', 'F']
    ];
}
```

In nested loops, each level creates its own `DataLevel`. Inner loops can access outer loop variables and component properties through the data level hierarchy.

### Reactive List Updates

When the iteration source changes (items added, removed, or replaced), the `$for` instruction compares the new entries against the previous ones. If differences are found, the entire instruction result is recalculated and the DOM is updated. Identical entries by value and key are not re-rendered.

```typescript
@PwbComponent({
    selector: 'dynamic-list',
    template: `
        <button (click)="this.addItem()">Add</button>
        $for(item of this.items) {
            <div>{{this.item}}</div>
        }
    `
})
class DynamicList extends Processor {
    public items: Array<string> = ['First'];

    public addItem(): void {
        this.items = [...this.items, `Item ${this.items.length + 1}`];
    }
}
```

### $for Expression Format

The `$for` expression is parsed with the following regex pattern:

```
[variableName] of [expression] (; [indexName] = [indexExpression])?
```

- `variableName`: A valid JavaScript identifier for the item variable
- `expression`: Any JavaScript expression that evaluates to an iterable or object
- `indexName` (optional): A valid JavaScript identifier for the index variable
- `indexExpression` (optional): An expression using `$index` and/or the item variable

### How $for Works Internally

The `ForInstructionModule`:

1. Evaluates the iteration source expression.
2. Converts the result to entries using `Object.entries()` (for objects) or spread + `Object.entries()` (for iterables).
3. Compares the new entries against the previous entries by key and value.
4. If the entries have not changed, returns `null` (no update).
5. If changed, creates an `InstructionResult` with one entry per item. Each entry gets a dedicated `DataLevel` with the item variable (and optional index variable) set as temporary values.

## Related

- [Template Syntax](template-syntax.md) -- Full template language reference
- [Data Binding](data-binding.md) -- Binding inside control flow blocks
- [Custom Modules](custom-modules.md) -- Creating custom instruction modules
