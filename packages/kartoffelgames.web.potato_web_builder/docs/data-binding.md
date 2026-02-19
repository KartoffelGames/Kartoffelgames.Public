# Data Binding

PWB provides three forms of data binding for connecting component state to the DOM: mustache expressions for text interpolation, one-way binding for pushing values to element properties, and two-way binding for bidirectional synchronization.

## Mustache Expressions

Mustache expressions `{{expression}}` render the result of a JavaScript expression as text. They can appear inside text content and inside attribute values.

### Text Content

```typescript
@PwbComponent({
    selector: 'greeting-text',
    template: '<p>Hello, {{this.name}}!</p>'
})
class GreetingText extends Processor {
    public name: string = 'World';
}
```

When `this.name` changes, the text node is updated automatically.

### Attribute Values

```typescript
@PwbComponent({
    selector: 'dynamic-class',
    template: '<div class="base {{this.theme}}">Themed content</div>'
})
class DynamicClass extends Processor {
    public theme: string = 'dark';
}
```

Static text and expressions can be mixed freely within an attribute value.

### Multiple Expressions

A single text node or attribute value can contain multiple expressions:

```typescript
@PwbComponent({
    selector: 'multi-expr',
    template: '<p>{{this.firstName}} {{this.lastName}} ({{this.age}} years old)</p>'
})
class MultiExpr extends Processor {
    public firstName: string = 'Jane';
    public lastName: string = 'Doe';
    public age: number = 30;
}
```

### Expression Evaluation

Expressions are compiled into functions that execute with `this` bound to the component's data scope. Any valid JavaScript expression that can appear after `return` is supported:

```typescript
@PwbComponent({
    selector: 'expr-examples',
    template: `
        <div>{{this.items.length}}</div>
        <div>{{this.count > 0 ? 'Yes' : 'No'}}</div>
        <div>{{this.values.map(v => v * 2).join(', ')}}</div>
        <div>{{new Date().getFullYear()}}</div>
    `
})
class ExprExamples extends Processor {
    public items: Array<string> = ['a', 'b', 'c'];
    public count: number = 5;
    public values: Array<number> = [1, 2, 3];
}
```

When an expression evaluates to `undefined`, nothing is rendered for that expression.

## One-Way Binding

One-way binding `[property]="expression"` evaluates an expression and assigns the result to a property on the target DOM element. Data flows in one direction: from the component to the target element.

### Syntax

The attribute name is wrapped in square brackets. The attribute value is a JavaScript expression.

```
[targetProperty]="sourceExpression"
```

### Binding to Native Element Properties

```typescript
@PwbComponent({
    selector: 'input-demo',
    template: '<input [value]="this.inputValue"/>'
})
class InputDemo extends Processor {
    public inputValue: string = 'Hello';
}
```

This sets the `value` property of the `<input>` element to `this.inputValue`. When `this.inputValue` changes, the input's value is updated.

### Binding to Child Component Properties

When the target element is a PWB component with `@PwbExport` properties, one-way binding writes to those exported properties.

```typescript
@PwbComponent({
    selector: 'display-label',
    template: '<span>{{this.text}}</span>'
})
class DisplayLabel extends Processor {
    @PwbExport
    public text: string = '';
}

@PwbComponent({
    selector: 'label-parent',
    template: '<display-label [text]="this.message"/>'
})
class LabelParent extends Processor {
    public message: string = 'Passed from parent';
}
```

### Multiple Bindings on One Element

```typescript
@PwbComponent({
    selector: 'multi-bind',
    template: `<child-comp [propA]="this.valueA" [propB]="this.valueB"/>`
})
class MultiBind extends Processor {
    public valueA: string = 'A';
    public valueB: string = 'B';
}
```

### Selector Pattern

The one-way binding module is registered with the regex selector `/^\[[\w$]+\]$/`, matching any attribute name wrapped in square brackets containing word characters or `$`.

## Two-Way Binding

Two-way binding `[(property)]="expression"` creates a bidirectional link between a component property and a target element property. Changes on either side are synchronized to the other.

### Syntax

The attribute name is wrapped in `[( )]`. The attribute value must be an expression that can appear on both the left and right side of an assignment (an lvalue).

```
[(targetProperty)]="this.sourceProperty"
```

### With Native HTML Elements

```typescript
@PwbComponent({
    selector: 'input-sync',
    template: '<input [(value)]="this.userInput"/>'
})
class InputSync extends Processor {
    @PwbExport
    public userInput: string = 'Initial';
}
```

When `this.userInput` changes, the input's `value` property is updated. When the user types in the input field and triggers an update cycle (e.g., through `InputChange` trigger), `this.userInput` is updated to match the input's current value.

### With Child Components

```typescript
@PwbComponent({
    selector: 'child-sync',
    template: '<child-editor [(content)]="this.text"/>'
})
class ChildSync extends Processor {
    public text: string = 'Editable text';
}
```

### How Two-Way Binding Works Internally

On each update cycle:
1. The module reads the current value of the source expression.
2. If the source value has changed since the last check, it writes the new value to the target element property.
3. If the source value has not changed, it reads the target element property. If the target value differs, it writes the target value back to the source expression.

The write-back is performed by appending `= $DATA;` to the expression and executing it as an assignment. This means the expression must be a valid assignment target.

### Selector Pattern

The two-way binding module is registered with the regex selector `/^\[\([[\w$]+\)\]$/`, matching `[(propertyName)]` format.

## Data Level System

Data binding relies on the hierarchical data level system. Each component has a root `DataLevel` backed by the proxy-tracked processor instance. Instruction blocks like `$for` create child data levels that add temporary variables on top of the parent scope.

### Property Resolution

When an expression references `this.someProperty`:

1. The data level proxy checks if `someProperty` exists as a temporary value in the current level.
2. If not found, it delegates to the parent level.
3. This continues up the chain until reaching the component processor's root properties.

This allows loop variables to shadow component properties within their instruction scope, and component properties to remain accessible from any nested scope.

### Example: Nested Scopes

```typescript
@PwbComponent({
    selector: 'nested-scope',
    template: `
        <div>
            <h1>{{this.title}}</h1>
            $for(group of this.groups) {
                <h2>{{this.group.name}}</h2>
                $for(item of this.group.items) {
                    <p>{{this.title}} - {{this.group.name}} - {{this.item}}</p>
                }
            }
        </div>
    `
})
class NestedScope extends Processor {
    public title: string = 'Report';
    public groups = [
        { name: 'A', items: ['a1', 'a2'] },
        { name: 'B', items: ['b1', 'b2'] }
    ];
}
```

In the inner `$for` block:
- `this.item` resolves from the inner loop's data level
- `this.group` resolves from the outer loop's data level
- `this.title` resolves from the component's root data level

## Related

- [Template Syntax](template-syntax.md) -- Full template language reference
- [Control Flow](control-flow.md) -- `$for` and `$if` create child data levels
- [Custom Modules](custom-modules.md) -- Creating custom attribute and expression modules
- [Update System](update-system.md) -- When bindings are evaluated
