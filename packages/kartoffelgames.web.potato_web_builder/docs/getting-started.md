# Getting Started

This guide covers the basics of setting up a Potato Web Builder (PWB) project and creating your first component.

## Installation

Add the package to your Deno project:

```bash
deno add @kartoffelgames/web-potato-web-builder
```

PWB depends on the following packages, which are resolved automatically through the Deno workspace:

- `@kartoffelgames/core`
- `@kartoffelgames/core-dependency-injection`
- `@kartoffelgames/core-interaction-zone`

## TypeScript Configuration

PWB uses TypeScript decorators extensively. Ensure your configuration supports the standard decorator proposal. In your `deno.json` or `tsconfig.json`, the following compiler options are recommended:

```json
{
    "compilerOptions": {
        "experimentalDecorators": false
    }
}
```

PWB uses the TC39 standard decorators (not the legacy experimental decorators).

## Your First Component

A PWB component is a class decorated with `@PwbComponent`. The decorator registers the class as a Custom Element with the browser.

```typescript
import { PwbComponent } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'hello-world',
    template: '<p>Hello, World!</p>'
})
class HelloWorld { }
```

This creates a `<hello-world>` custom element that renders a paragraph inside its shadow DOM.

## Using the Application

`PwbApplication` provides a container for your components. It creates its own shadow root to scope global styles.

```typescript
import { PwbApplication, PwbComponent } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'app-root',
    template: '<h1>My Application</h1>'
})
class AppRoot { }

PwbApplication.new((pApp) => {
    pApp.addContent(AppRoot);
    pApp.addStyle('h1 { --text-color: blue; }');
}, document.body);
```

The `PwbApplication.new` method accepts a callback that receives the application instance and an optional target element to append to. The `addContent` method instantiates the component and appends it to the application. The `addStyle` method adds CSS that is scoped to the application container but does not penetrate component shadow roots.

## Adding Reactive State

Use `@ComponentState.state()` on auto-accessor properties to make them reactive. When a state value changes, the component automatically re-renders.

```typescript
import { PwbComponent, ComponentState, PwbExport } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'click-counter',
    template: `
        <div>
            <span>Clicks: {{this.count}}</span>
            <button (click)="this.onClick()">Click me</button>
        </div>
    `
})
class ClickCounter {
    @ComponentState.state()
    public accessor count: number = 0;

    public onClick(): void {
        this.count++;
    }
}
```

## Composing Components

Components can be nested by using their selector as an HTML tag in the parent template.

```typescript
@PwbComponent({
    selector: 'child-card',
    template: '<div class="card"><slot/></div>',
    style: '.card { border: 1px solid #ccc; padding: 8px; }'
})
class ChildCard { }

@PwbComponent({
    selector: 'parent-app',
    template: `
        <child-card>
            <p>Content inside the card</p>
        </child-card>
    `
})
class ParentApp { }
```

## Core Concepts

PWB is built around several core concepts:

**Components** are classes decorated with `@PwbComponent` that define custom HTML elements. Each component has its own shadow DOM, optional template, and optional scoped styles. See [Components](./components.md).

**State Management** uses `@ComponentState.state()` to create reactive properties and `ComponentState.reaction()` to observe changes. See [State Management](./state-management.md).

**Template Syntax** provides mustache expressions (`{{...}}`), data binding (`[prop]`, `[(prop)]`), event binding (`(event)`), and structural instructions (`$if`, `$for`, `$slot`, `$dynamic-content`). See [Template Syntax](./template-syntax.md).

**Component Decorators** (`@PwbExport`, `@PwbComponentEvent`, `@PwbComponentEventListener`, `@PwbChild`) add features to component classes. See [Component Decorators](./component-decorators.md).

**Custom Modules** let you extend the framework by creating your own attribute modules, expression modules, instruction modules, and extension modules. See [Custom Modules](./custom-modules.md).
