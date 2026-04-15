# Template Syntax

PWB templates are HTML strings that support expressions, data binding, event binding, and structural instructions. Templates are defined in the `template` option of `@PwbComponent`.

## Mustache Expressions

Mustache expressions render dynamic values as text content or within attribute values. They use double curly braces: `{{expression}}`.

### Text Content

```typescript
@PwbComponent({
    selector: 'greeting-component',
    template: '<p>Hello, {{this.name}}!</p>'
})
class GreetingComponent {
    public name: string = 'World';
}
```

Renders: `<p>Hello, World!</p>`

### Attribute Values

Expressions can be used inside attribute values:

```typescript
@PwbComponent({
    selector: 'dynamic-class',
    template: '<div class="{{this.className}}">Content</div>'
})
class DynamicClass {
    public className: string = 'highlight';
}
```

### Inline Expressions

Expressions can contain arbitrary JavaScript that does not reference `this`:

```typescript
@PwbComponent({
    selector: 'inline-expr',
    template: `<div>{{ new Array(5).fill('x').join('-') }}</div>`
})
class InlineExpr { }
```

Renders: `<div>x-x-x-x-x</div>`

### Expression Context

All expressions are evaluated in the context of the component processor instance. Use `this` to reference component properties and methods. Expressions that return `undefined` render as an empty string.

## One-Way Data Binding

One-way binding pushes a component value to a DOM element property. The syntax uses square brackets around the property name: `[property]="expression"`.

```typescript
@PwbComponent({
    selector: 'input-demo',
    template: '<input [value]="this.inputText"/>'
})
class InputDemo {
    @ComponentState.state()
    public accessor inputText: string = 'Default text';
}
```

This sets the `value` property of the `<input>` element to the result of `this.inputText`. When `inputText` changes, the DOM property is updated automatically.

### Binding to Child Components

One-way binding works with child component exported properties:

```typescript
@PwbComponent({ selector: 'child-display' })
class ChildDisplay {
    @PwbExport
    public message!: string;
}

@PwbComponent({
    selector: 'parent-component',
    template: '<child-display [message]="this.parentMessage"/>'
})
class ParentComponent {
    public parentMessage: string = 'Hello from parent';
}
```

The child component receives the value through its `@PwbExport` decorated property. See [Component Decorators](./component-decorators.md) for details on `@PwbExport`.

## Two-Way Data Binding

Two-way binding synchronizes values between the component and a DOM element in both directions. The syntax combines square and round brackets: `[(property)]="expression"`.

```typescript
@PwbComponent({
    selector: 'form-input',
    template: '<input [(value)]="this.userInput"/>'
})
class FormInput {
    @ComponentState.state()
    public accessor userInput: string = '';
}
```

When the user types in the input, `this.userInput` is updated. When `this.userInput` is changed programmatically, the input value is updated.

Two-way binding listens for both `input` and `change` events on the target element to detect view changes.

## Event Binding

Event binding attaches event listeners to DOM elements. The syntax uses round brackets around the event name: `(event)="expression"`.

```typescript
@PwbComponent({
    selector: 'button-demo',
    template: '<button (click)="this.handleClick($event)">Click me</button>'
})
class ButtonDemo {
    public handleClick(pEvent: MouseEvent): void {
        console.log('Button clicked at:', pEvent.clientX, pEvent.clientY);
    }
}
```

### The $event Variable

Inside event binding expressions, the special `$event` variable holds the native DOM event object:

```typescript
@PwbComponent({
    selector: 'key-handler',
    template: '<input (keydown)="this.onKey($event)"/>'
})
class KeyHandler {
    public onKey(pEvent: KeyboardEvent): void {
        console.log('Key pressed:', pEvent.key);
    }
}
```

### Supported Events

Any native DOM event can be bound using this syntax: `click`, `input`, `change`, `keydown`, `mouseover`, `submit`, and so on.

### Cleanup

Event listeners are automatically removed when the component or the element they are attached to is deconstructed.

## Conditional Rendering ($if)

The `$if` instruction conditionally renders its content based on a truthy/falsy expression.

```typescript
@PwbComponent({
    selector: 'conditional-demo',
    template: `
        $if(this.showMessage) {
            <p>This message is visible</p>
        }
    `
})
class ConditionalDemo {
    @ComponentState.state()
    public accessor showMessage: boolean = true;
}
```

When `showMessage` is `true` (or any truthy value), the `<p>` element is rendered. When it is `false` (or any falsy value like `null`, `undefined`, `0`, `''`), the element is removed from the DOM.

### Dynamic Toggling

```typescript
@PwbComponent({
    selector: 'toggle-demo',
    template: `
        <button (click)="this.toggle()">Toggle</button>
        $if(this.visible) {
            <div>Now you see me</div>
        }
    `
})
class ToggleDemo {
    @ComponentState.state()
    public accessor visible: boolean = false;

    public toggle(): void {
        this.visible = !this.visible;
    }
}
```

## Loop Rendering ($for)

The `$for` instruction renders its content once for each item in an iterable.

### Basic Syntax

```
$for(itemName of expression) {
    <template/>
}
```

```typescript
@PwbComponent({
    selector: 'list-demo',
    template: `
        $for(item of this.items) {
            <div>{{this.item}}</div>
        }
    `
})
class ListDemo {
    public items: Array<string> = ['Alpha', 'Beta', 'Gamma'];
}
```

The loop variable (`item`) is available as `this.item` inside the loop template.

### With Index

An optional index variable can be declared after a semicolon:

```
$for(itemName of expression; indexName = $index) {
    <template/>
}
```

```typescript
@PwbComponent({
    selector: 'indexed-list',
    template: `
        $for(item of this.items; index = $index) {
            <div>{{this.index}}: {{this.item}}</div>
        }
    `
})
class IndexedList {
    public items: Array<string> = ['First', 'Second', 'Third'];
}
```

Renders:
```
0: First
1: Second
2: Third
```

### Index Expressions

The index assignment supports expressions. The `$index` variable and the loop variable are available:

```typescript
@PwbComponent({
    selector: 'custom-index',
    template: `
        $for(item of this.items; position = $index + 1) {
            <div>Item #{{this.position}}: {{this.item}}</div>
        }
    `
})
class CustomIndex {
    public items: Array<string> = ['Apple', 'Banana'];
}
```

Renders:
```
Item #1: Apple
Item #2: Banana
```

### Iterating Objects

Objects are iterated by their entries. The loop variable receives the value, and `$index` receives the key:

```typescript
@PwbComponent({
    selector: 'object-iter',
    template: `
        $for(value of this.data; key = $index) {
            <div>{{this.key}}: {{this.value}}</div>
        }
    `
})
class ObjectIter {
    public data: Record<string, number> = { width: 100, height: 200 };
}
```

### Iterating Generators and Iterables

Any object implementing `Symbol.iterator` can be iterated:

```typescript
@PwbComponent({
    selector: 'generator-demo',
    template: `
        $for(value of this.generateItems()) {
            <div>{{this.value}}</div>
        }
    `
})
class GeneratorDemo {
    public *generateItems(): Generator<string> {
        yield 'Generated A';
        yield 'Generated B';
    }
}
```

### Reactive Lists with Proxy

To automatically detect mutations on arrays (like `push`, `splice`), use `@ComponentState.state({ proxy: true })`:

```typescript
@PwbComponent({
    selector: 'reactive-list',
    template: `
        <button (click)="this.addItem()">Add</button>
        $for(item of this.items) {
            <div>{{this.item}}</div>
        }
    `
})
class ReactiveList {
    @ComponentState.state({ proxy: true })
    public accessor items: Array<string> = ['Initial'];

    public addItem(): void {
        this.items.push('New item');
        // No reassignment needed; the proxy detects the push.
    }
}
```

## Slot Instruction ($slot)

The `$slot` instruction creates a `<slot>` element for content projection.

### Default Slot

```typescript
@PwbComponent({
    selector: 'card-component',
    template: `
        <div class="card">
            $slot
        </div>
    `
})
class CardComponent { }
```

Usage:
```html
<card-component>
    <p>This content goes into the default slot</p>
</card-component>
```

### Named Slots

```typescript
@PwbComponent({
    selector: 'layout-component',
    template: `
        <header>$slot(header)</header>
        <main>$slot</main>
        <footer>$slot(footer)</footer>
    `
})
class LayoutComponent { }
```

Usage:
```html
<layout-component>
    <h1 slot="header">Page Title</h1>
    <p>Main content goes to the default slot</p>
    <span slot="footer">Footer text</span>
</layout-component>
```

## Dynamic Content ($dynamic-content)

The `$dynamic-content` instruction renders a `PwbTemplate` returned by an expression. This allows fully programmatic template generation.

```typescript
import {
    PwbComponent,
    PwbTemplate,
    PwbTemplateXmlNode,
    PwbTemplateTextNode
} from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'dynamic-demo',
    template: '$dynamic-content(this.buildTemplate())'
})
class DynamicDemo {
    public buildTemplate(): PwbTemplate {
        const lTemplate = new PwbTemplate();

        const lDiv = new PwbTemplateXmlNode('div');
        const lText = new PwbTemplateTextNode();
        lText.addValue('Dynamic content');
        lDiv.appendChild(lText);
        lTemplate.appendChild(lDiv);

        return lTemplate;
    }
}
```

The expression must return a `PwbTemplate` instance. If the returned template is the same as the previous one (compared with `equals()`), no DOM update occurs.

## Child References (#id)

The `#name` syntax registers a DOM element reference by name, accessible through the `@PwbChild` decorator on the component class.

```typescript
@PwbComponent({
    selector: 'ref-demo',
    template: '<input #myInput/>'
})
class RefDemo {
    @PwbChild('myInput')
    public accessor myInput!: HTMLInputElement;
}
```

See [Component Decorators](./component-decorators.md) for details on `@PwbChild`.
