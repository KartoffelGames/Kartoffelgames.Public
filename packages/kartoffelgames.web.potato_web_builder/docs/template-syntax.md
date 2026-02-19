# Template Syntax

PWB uses an XML-based template language for defining component DOM structures. Templates are parsed at component registration time into an internal node tree that the framework keeps in sync with the actual DOM.

## Overview

A template is a string passed to the `template` property of `@PwbComponent`. It supports:

- Standard XML/HTML elements
- Mustache expressions: `{{expression}}`
- Attribute binding: `[property]="expression"`, `[(property)]="expression"`
- Event binding: `(eventName)="expression"`
- Instruction blocks: `$if(...)`, `$for(...)`, `$slot`, `$dynamic-content(...)`
- ID references: `#ChildId`
- HTML comments (ignored during rendering)

## XML Elements

Templates use XML syntax. All elements must be properly closed, either with a closing tag or as self-closing.

```xml
<!-- Closing tag -->
<div>Content</div>

<!-- Self-closing -->
<br/>
<input/>

<!-- Nested elements -->
<div>
    <span>Text</span>
</div>
```

Multiple root-level elements are allowed:

```xml
<h1>Title</h1>
<p>First paragraph</p>
<p>Second paragraph</p>
```

## Mustache Expressions

Double curly braces `{{ }}` embed TypeScript expressions into text content or attribute values. Expressions are evaluated in the context of the component processor instance, where `this` refers to the processor.

### In Text Content

```typescript
@PwbComponent({
    selector: 'text-expr',
    template: '<div>Hello, {{this.name}}!</div>'
})
class TextExpr extends Processor {
    public name: string = 'World';
}
```

Renders: `Hello, World!`

### In Attribute Values

```typescript
@PwbComponent({
    selector: 'attr-expr',
    template: '<div class="{{this.cssClass}}">Styled</div>'
})
class AttrExpr extends Processor {
    public cssClass: string = 'highlight';
}
```

### Complex Expressions

Expressions can contain any valid JavaScript that can be evaluated as a return value:

```typescript
@PwbComponent({
    selector: 'complex-expr',
    template: `
        <div>{{this.items.length}}</div>
        <div>{{this.firstName + ' ' + this.lastName}}</div>
        <div>{{this.count > 0 ? 'Has items' : 'Empty'}}</div>
        <div>{{new Array(3).fill('x').join('-')}}</div>
    `
})
class ComplexExpr extends Processor {
    public items: Array<string> = ['a', 'b'];
    public firstName: string = 'John';
    public lastName: string = 'Doe';
    public count: number = 5;
}
```

### Expression Context

Inside expressions, `this` refers to the component processor's data scope. For instructions like `$for`, `this` also includes temporary variables defined by the instruction (such as the loop variable).

```typescript
@PwbComponent({
    selector: 'scope-demo',
    template: `
        $for(item of this.items) {
            <div>{{this.item}}</div>
        }
    `
})
class ScopeDemo extends Processor {
    public items: Array<string> = ['Alpha', 'Beta', 'Gamma'];
}
```

Inside the `$for` block, `this.item` resolves to the current iteration value. Property lookup traverses up through parent data levels until a match is found.

### Undefined Handling

If an expression evaluates to `undefined`, the result is treated as an empty string and nothing is rendered for that expression.

## Attributes

### Static Attributes

Plain string attributes work as in standard HTML:

```xml
<div class="container" id="main">Content</div>
```

### Boolean/Valueless Attributes

Attributes without a value are supported:

```xml
<input disabled/>
<div hidden/>
```

### Mixed Static and Expression Values

Attribute values can mix static text with expressions:

```xml
<div class="base-class {{this.extraClass}}">Content</div>
```

## Instruction Syntax

Instructions are template-level control structures prefixed with `$`. They are not HTML elements but control whether and how many times their child content is rendered.

The general syntax is:

```
$instructionName(expression) {
    <child content/>
}
```

Or without a body:

```
$instructionName(expression)
```

Or without an expression:

```
$instructionName
```

See [Control Flow](control-flow.md) for `$if` and `$for` details, and [Slots and Dynamic Content](slots-and-dynamic-content.md) for `$slot` and `$dynamic-content`.

## Comments

HTML comments are parsed and discarded. They do not appear in the rendered DOM.

```xml
<!-- This comment is ignored -->
<div>Visible content</div>
```

## Template Parser

The `TemplateParser` class handles converting template strings into `PwbTemplate` node trees. It uses a lexer-based parser from `@kartoffelgames/core-parser` to tokenize and parse the XML-like syntax.

```typescript
import { TemplateParser } from '@kartoffelgames/web-potato-web-builder';

const parser = new TemplateParser();
const template = parser.parse('<div>{{this.value}}</div>');
```

The parser is typically not used directly -- it is called internally by the component system during registration.

## Template Node Types

The parsed template consists of these node types:

### PwbTemplateXmlNode

Represents an XML/HTML element with a tag name, attributes, and child nodes.

```typescript
import { PwbTemplateXmlNode } from '@kartoffelgames/web-potato-web-builder';

const node = new PwbTemplateXmlNode();
node.tagName = 'div';
node.setAttribute('class').addValue('container');
```

Properties:
- `tagName` -- The element's tag name
- `attributes` -- Array of `PwbTemplateAttribute` objects
- `childList` -- Array of child `BasePwbTemplateNode` objects
- `setAttribute(name)` -- Gets or creates an attribute, returns a `PwbTemplateTextNode` for setting values
- `removeAttribute(name)` -- Removes an attribute
- `appendChild(...nodes)` -- Adds child nodes
- `removeChild(node)` -- Removes a child node

### PwbTemplateTextNode

Represents a text node that can contain a mix of static strings and expressions.

```typescript
import { PwbTemplateTextNode, PwbTemplateExpression } from '@kartoffelgames/web-potato-web-builder';

const textNode = new PwbTemplateTextNode();
textNode.addValue('Hello, ');

const expr = new PwbTemplateExpression();
expr.value = 'this.name';
textNode.addValue(expr);

textNode.addValue('!');
```

Properties:
- `values` -- Array of `string | PwbTemplateExpression` values
- `containsExpression` -- Whether the text node contains any expressions
- `addValue(...values)` -- Adds string or expression values

### PwbTemplateInstructionNode

Represents an instruction block (`$if`, `$for`, `$slot`, etc.).

```typescript
import { PwbTemplateInstructionNode } from '@kartoffelgames/web-potato-web-builder';

const node = new PwbTemplateInstructionNode();
node.instructionType = 'if';
node.instruction = 'this.visible';
```

Properties:
- `instructionType` -- The instruction name (e.g., `"if"`, `"for"`, `"slot"`)
- `instruction` -- The expression string inside the parentheses
- `childList` -- Array of child nodes (the body content)
- `appendChild(...nodes)` -- Adds child nodes to the body

### PwbTemplateExpression

Represents a single expression value used within text nodes or attributes.

```typescript
import { PwbTemplateExpression } from '@kartoffelgames/web-potato-web-builder';

const expr = new PwbTemplateExpression();
expr.value = 'this.count * 2';
```

### PwbTemplateAttribute

Represents an attribute on an XML node. Contains a name and a `PwbTemplateTextNode` for the value (which can include expressions).

## Complete Template Example

```typescript
@PwbComponent({
    selector: 'todo-list',
    template: `
        <h2>{{this.title}}</h2>
        <ul>
            $for(item of this.items; index = $index) {
                $if(this.item.visible) {
                    <li class="todo-item {{this.item.done ? 'done' : ''}}">
                        <span>{{this.index + 1}}. {{this.item.text}}</span>
                        <button (click)="this.remove(this.index)">Remove</button>
                    </li>
                }
            }
        </ul>
        $if(this.items.length === 0) {
            <p>No items yet.</p>
        }
    `,
    style: '.done { text-decoration: line-through; }'
})
class TodoList extends Processor {
    public title: string = 'My Todos';
    public items: Array<{ text: string; done: boolean; visible: boolean }> = [];

    public remove(index: number): void {
        this.items.splice(index, 1);
    }
}
```

## Related

- [Data Binding](data-binding.md) -- `[prop]` and `[(prop)]` attribute binding
- [Control Flow](control-flow.md) -- `$if` and `$for` instruction blocks
- [Events](events.md) -- `(event)` binding syntax
- [Slots and Dynamic Content](slots-and-dynamic-content.md) -- `$slot` and `$dynamic-content`
