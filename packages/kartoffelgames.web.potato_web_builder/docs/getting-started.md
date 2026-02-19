# Getting Started

This guide walks through setting up a project with `@kartoffelgames/web-potato-web-builder` and creating your first component.

## Installation

### Deno (JSR)

```bash
deno add jsr:@kartoffelgames/web-potato-web-builder
```

The package is distributed as TypeScript source through JSR. It requires:

- TypeScript with decorator support (stage 3 decorators)
- A browser environment or DOM-compatible runtime

### Dependencies

The following packages are automatically resolved:

- `@kartoffelgames/core` -- Core utilities
- `@kartoffelgames/core-dependency-injection` -- Dependency injection
- `@kartoffelgames/core-parser` -- Template parser engine
- `@kartoffelgames/web-interaction-zone` -- Execution context tracking

## Minimal Component

Every PWB component is a TypeScript class that:

1. Extends `Processor`
2. Is decorated with `@PwbComponent`

```typescript
import { PwbComponent, Processor } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'my-greeting',
    template: '<p>Hello from PWB!</p>'
})
class MyGreeting extends Processor { }
```

This registers a custom element `<my-greeting>` that renders a paragraph inside a Shadow DOM.

### Using It in HTML

```html
<my-greeting></my-greeting>
```

The component is automatically registered with the browser's custom element registry when the class definition is executed.

## Adding Reactive State

Component properties are proxy-tracked. Changes to properties used in the template trigger automatic re-renders.

```typescript
import { PwbComponent, Processor, PwbExport } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'click-counter',
    template: `
        <div>
            <p>Count: {{this.count}}</p>
            <button (click)="this.increment()">Increment</button>
        </div>
    `
})
class ClickCounter extends Processor {
    @PwbExport
    public count: number = 0;

    public increment(): void {
        this.count++;
    }
}
```

Key points:

- `{{this.count}}` is a mustache expression that renders the property value as text.
- `(click)="this.increment()"` binds the native `click` event to the `increment` method.
- `@PwbExport` makes `count` readable and writable from the outside as both an HTML attribute and a DOM property.
- When `this.count` changes, the framework detects the proxy interaction and re-renders the affected text node.

## Adding Styles

Styles are scoped to the component through Shadow DOM encapsulation.

```typescript
@PwbComponent({
    selector: 'styled-box',
    template: '<div class="box">Styled content</div>',
    style: `
        .box {
            padding: 16px;
            border: 2px solid #333;
            border-radius: 4px;
            font-family: monospace;
        }
    `
})
class StyledBox extends Processor { }
```

The `style` string is injected into a `<style>` element inside the Shadow DOM. These styles do not leak out to the rest of the document, and external styles do not affect the component internals.

## Composing Components

Components can be nested inside other components using their selector as a tag name.

```typescript
@PwbComponent({
    selector: 'child-label',
    template: '<span>I am a child</span>'
})
class ChildLabel extends Processor { }

@PwbComponent({
    selector: 'parent-container',
    template: `
        <div>
            <h2>Parent</h2>
            <child-label/>
        </div>
    `
})
class ParentContainer extends Processor { }
```

The parent's template references `<child-label/>` directly. As long as the child component class has been defined (imported) before the parent renders, the custom element is available.

## Using PwbApplication

For larger applications, `PwbApplication` provides a structured entry point with configuration, error handling, and a mount target.

```typescript
import { PwbApplication } from '@kartoffelgames/web-potato-web-builder';

PwbApplication.new('my-app', (app) => {
    // Configure the application
    app.configuration.error.print = true;
    app.configuration.updating.frameTime = 100;

    // Add global styles
    app.addStyle('body { margin: 0; font-family: sans-serif; }');

    // Add a root component
    app.addContent(AppRoot);

    // Listen for uncaught errors
    app.addErrorListener((error) => {
        console.error('Application error:', error);
    });
}, document.body);
```

`PwbApplication.new` creates an isolated application context and appends it to the provided DOM element. All components created inside the callback inherit the application's configuration.

## Next Steps

- [Components](components.md) -- Full details on `@PwbComponent`, `Processor`, and lifecycle hooks
- [Template Syntax](template-syntax.md) -- The XML template language
- [Data Binding](data-binding.md) -- One-way, two-way, and expression binding
- [Events](events.md) -- Event handling and custom events
