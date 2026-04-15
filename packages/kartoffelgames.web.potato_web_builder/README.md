# Potato Web Builder

A decorator-based web component framework built on the Web Components standard. Potato Web Builder (PWB) provides a reactive component system with template syntax, data binding, state management, and a modular architecture for extending functionality.

## Features

- **Decorator-based components** using standard Web Components (Custom Elements, Shadow DOM)
- **Reactive state management** with automatic change detection and proxy-based deep observation
- **Template syntax** with mustache expressions, one-way and two-way data binding, event binding, and structural instructions
- **Dependency injection** for components and modules
- **Modular architecture** with built-in modules and support for custom attribute, expression, instruction, and extension modules

## Installation

```bash
# Using Deno
deno add @kartoffelgames/web-potato-web-builder
```

The package depends on these Kartoffelgames packages:

- `@kartoffelgames/core`
- `@kartoffelgames/core-dependency-injection`
- `@kartoffelgames/core-interaction-zone`

## Quick Start

```typescript
import {
    PwbComponent,
    PwbApplication,
    ComponentState,
    PwbExport
} from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'my-counter',
    template: `
        <div>
            <span>Count: {{this.count}}</span>
            <button (click)="this.increment()">Increment</button>
        </div>
    `,
    style: 'span { font-weight: bold; }'
})
class MyCounter {
    @ComponentState.state()
    public accessor count: number = 0;

    public increment(): void {
        this.count++;
    }
}

PwbApplication.new((pApp) => {
    pApp.addContent(MyCounter);
}, document.body);
```

## Documentation

Detailed documentation is available in the [docs](./docs) directory:

| Document | Description |
|---|---|
| [Getting Started](./docs/getting-started.md) | Installation, first component, and core concepts |
| [Components](./docs/components.md) | Component decorator, lifecycle hooks, templates, and styles |
| [State Management](./docs/state-management.md) | Reactive state, reactions, and proxy-based deep observation |
| [Template Syntax](./docs/template-syntax.md) | Expressions, data binding, event binding, and structural instructions |
| [Component Decorators](./docs/component-decorators.md) | Exporting properties, custom events, event listeners, and child references |
| [Custom Modules](./docs/custom-modules.md) | Creating custom attribute, expression, instruction, and extension modules |

## Architecture Overview

PWB is organized into three layers:

**Core Layer** -- The component system, template parser, module infrastructure, data levels, and reactive state management.

**Module Layer** -- Built-in modules that implement the default template syntax and component features:

- Expression module (mustache `{{...}}`)
- Attribute modules (one-way `[prop]`, two-way `[(prop)]`, event `(event)`, child ref `#id`)
- Instruction modules (conditional `$if`, loop `$for`, slot `$slot`, dynamic content `$dynamic-content`)
- Extension modules (property export, event listeners)

**Application Layer** -- The `PwbApplication` class that bundles components and provides a root container with its own shadow DOM.

## License

LGPL-3.0-only
