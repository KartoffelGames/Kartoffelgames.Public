# Slots and Dynamic Content

PWB supports two instruction modules for injecting content into component templates: `$slot` for projecting external HTML content into a component, and `$dynamic-content` for rendering programmatically created templates.

## $slot -- Content Projection

The `$slot` instruction creates a native HTML `<slot>` element inside the component's Shadow DOM. This allows external content (placed inside the component's tags in the parent template) to be projected into specific locations within the component.

### Default Slot

A default (unnamed) slot captures all child content that is not assigned to a named slot:

```typescript
@PwbComponent({
    selector: 'card-container',
    template: `
        <div class="card">
            $slot
        </div>
    `,
    style: '.card { border: 1px solid #ccc; padding: 16px; border-radius: 8px; }'
})
class CardContainer extends Processor { }
```

Usage:

```html
<card-container>
    <h2>Card Title</h2>
    <p>This content is projected into the default slot.</p>
</card-container>
```

The `<h2>` and `<p>` elements are rendered where `$slot` appears inside the card's template.

### Named Slots

Named slots allow directing specific child content to specific locations:

```typescript
@PwbComponent({
    selector: 'page-layout',
    template: `
        <header>
            $slot(header)
        </header>
        <main>
            $slot
        </main>
        <footer>
            $slot(footer)
        </footer>
    `,
    style: `
        header { background: #f0f0f0; padding: 8px; }
        main { min-height: 200px; padding: 16px; }
        footer { background: #333; color: white; padding: 8px; }
    `
})
class PageLayout extends Processor { }
```

Usage:

```html
<page-layout>
    <div slot="header">Page Header</div>
    <p>Main content goes to the default slot.</p>
    <div slot="footer">Page Footer</div>
</page-layout>
```

- Content with `slot="header"` is projected into `$slot(header)`.
- Content with `slot="footer"` is projected into `$slot(footer)`.
- Content without a `slot` attribute goes into the default `$slot`.

### Slot Behavior

- `$slot` uses `UpdateTrigger.None`, meaning it only runs once during setup. Slot content is static after initial rendering.
- An empty `$slot` (without parentheses) creates `<slot>` (the default slot).
- `$slot(name)` creates `<slot name="name">`.
- The underlying mechanism uses the browser's native Shadow DOM slot distribution.

### Slots in Component Composition

```typescript
@PwbComponent({
    selector: 'modal-dialog',
    template: `
        <div class="overlay">
            <div class="dialog">
                <div class="dialog-header">
                    $slot(title)
                </div>
                <div class="dialog-body">
                    $slot
                </div>
                <div class="dialog-footer">
                    $slot(actions)
                </div>
            </div>
        </div>
    `
})
class ModalDialog extends Processor { }
```

Usage from a parent component:

```typescript
@PwbComponent({
    selector: 'app-page',
    template: `
        <modal-dialog>
            <h2 slot="title">Confirm Action</h2>
            <p>Are you sure you want to proceed?</p>
            <div slot="actions">
                <button (click)="this.confirm()">Yes</button>
                <button (click)="this.cancel()">No</button>
            </div>
        </modal-dialog>
    `
})
class AppPage extends Processor {
    public confirm(): void { /* ... */ }
    public cancel(): void { /* ... */ }
}
```

## $dynamic-content -- Programmatic Templates

The `$dynamic-content` instruction renders a `PwbTemplate` object returned by a method or expression. This allows building template structures programmatically at runtime.

### Syntax

```
$dynamic-content(expression)
```

The expression must evaluate to a `PwbTemplate` instance.

### Basic Usage

```typescript
import {
    PwbComponent, Processor,
    PwbTemplateXmlNode, PwbTemplateTextNode, PwbTemplateExpression
} from '@kartoffelgames/web-potato-web-builder';
// PwbTemplate is imported from the template nodes
import { PwbTemplate } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'dynamic-demo',
    template: '$dynamic-content(this.getContent())'
})
class DynamicDemo extends Processor {
    public getContent(): PwbTemplate {
        const template = new PwbTemplate();

        const div = new PwbTemplateXmlNode();
        div.tagName = 'div';

        const textNode = new PwbTemplateTextNode();
        textNode.addValue('Dynamic content rendered at runtime');
        div.appendChild(textNode);

        template.appendChild(div);
        return template;
    }
}
```

### Building Templates Programmatically

The template node classes provide a full API for constructing template trees:

```typescript
@PwbComponent({
    selector: 'dynamic-list',
    template: '$dynamic-content(this.buildList())'
})
class DynamicList extends Processor {
    public items: Array<string> = ['First', 'Second', 'Third'];

    public buildList(): PwbTemplate {
        const template = new PwbTemplate();

        const ul = new PwbTemplateXmlNode();
        ul.tagName = 'ul';

        for (const item of this.items) {
            const li = new PwbTemplateXmlNode();
            li.tagName = 'li';

            const text = new PwbTemplateTextNode();
            text.addValue(item);
            li.appendChild(text);

            ul.appendChild(li);
        }

        template.appendChild(ul);
        return template;
    }
}
```

### With Expressions in Dynamic Templates

Dynamic templates can include expressions that are evaluated in the component's data scope:

```typescript
public buildTemplate(): PwbTemplate {
    const template = new PwbTemplate();

    const div = new PwbTemplateXmlNode();
    div.tagName = 'div';

    // Add a text node with an expression
    const text = new PwbTemplateTextNode();
    const expr = new PwbTemplateExpression();
    expr.value = 'this.computedValue';
    text.addValue('Result: ');
    text.addValue(expr);
    div.appendChild(text);

    template.appendChild(div);
    return template;
}
```

### With Attributes

```typescript
public buildTemplate(): PwbTemplate {
    const template = new PwbTemplate();

    const input = new PwbTemplateXmlNode();
    input.tagName = 'input';
    input.setAttribute('type').addValue('text');
    input.setAttribute('placeholder').addValue('Enter value...');

    // Add a dynamic class attribute with an expression
    const classExpr = new PwbTemplateExpression();
    classExpr.value = 'this.inputClass';
    input.setAttribute('class').addValue(classExpr);

    template.appendChild(input);
    return template;
}
```

### Reactive Updates

The `$dynamic-content` instruction re-evaluates the expression on each update cycle. It compares the new `PwbTemplate` against the previously rendered one using structural equality (`equals()`). If the template has changed, the DOM is rebuilt. If it has not changed, no DOM update occurs.

This means:
- The method is called on each update cycle.
- Returning a structurally identical template avoids unnecessary DOM manipulation.
- Returning a structurally different template triggers a full rebuild of the dynamic content area.

### Error Handling

The expression must return a `PwbTemplate` instance. If it returns `null`, `undefined`, or a non-`PwbTemplate` value, an `Exception` is thrown with the message: `"Dynamic content method has a wrong result type."`.

### Combining with Other Instructions

`$dynamic-content` can be used alongside other instructions:

```typescript
@PwbComponent({
    selector: 'conditional-dynamic',
    template: `
        $if(this.useCustomTemplate) {
            $dynamic-content(this.getCustomTemplate())
        }
        $if(!this.useCustomTemplate) {
            <div>Default content</div>
        }
    `
})
class ConditionalDynamic extends Processor {
    @PwbExport
    public useCustomTemplate: boolean = false;

    public getCustomTemplate(): PwbTemplate {
        const template = new PwbTemplate();
        const p = new PwbTemplateXmlNode();
        p.tagName = 'p';

        const text = new PwbTemplateTextNode();
        text.addValue('Custom template content');
        p.appendChild(text);

        template.appendChild(p);
        return template;
    }
}
```

## When to Use Each

| Feature | Use When |
|---------|----------|
| `$slot` | You want to accept external HTML content from the component's consumer |
| `$dynamic-content` | You need to generate template structure programmatically at runtime |

`$slot` uses the browser's native slot mechanism and is the standard pattern for component composition. `$dynamic-content` is for advanced cases where template structure cannot be expressed statically and must be computed.

## Related

- [Template Syntax](template-syntax.md) -- Full template language reference
- [Control Flow](control-flow.md) -- `$if` and `$for` instructions
- [Components](components.md) -- Component composition patterns
- [Custom Modules](custom-modules.md) -- Building custom instruction modules
