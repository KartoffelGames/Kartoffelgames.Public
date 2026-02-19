# @kartoffelgames/web-potato-web-builder

A reactive, decorator-driven web component framework built on the Web Components standard. Potato Web Builder (PWB) provides a declarative approach to building encapsulated UI components with automatic change detection, template-based rendering, and a modular extension system.

## Overview

PWB turns TypeScript classes into fully reactive custom HTML elements. Components are defined using decorators and rendered through an XML-based template language with built-in support for data binding, control flow, events, and slots. The framework uses proxy-based reactivity to automatically detect property changes and trigger efficient DOM updates.

### Core Concepts

- **Components** are TypeScript classes decorated with `@PwbComponent` that extend `Processor`. Each component becomes a native custom HTML element with an isolated Shadow DOM.
- **Templates** use an XML-based syntax with expressions (`{{value}}`), one-way binding (`[prop]`), two-way binding (`[(prop)]`), event binding (`(event)`), and instruction blocks (`$if`, `$for`, `$slot`).
- **Modules** are the extension points of the template system. Three built-in module types handle attribute processing, expression evaluation, and instruction-based DOM manipulation. Custom modules can be registered to extend the template syntax.
- **Extensions** hook into component and module lifecycles to provide cross-cutting functionality such as property export, event listeners, and child element references.
- **Reactivity** is powered by proxy-based interaction tracking. When a component property changes, the framework detects the change and schedules a DOM update automatically.

### Architecture

```
PwbApplication
  |
  +-- Component (@PwbComponent)
        |
        +-- Processor (base class, proxy-tracked)
        +-- Shadow DOM
        +-- Template (parsed from string)
        |     |
        |     +-- XML Nodes
        |     +-- Text Nodes (with expressions)
        |     +-- Instruction Nodes ($if, $for, $slot, $dynamic-content)
        |
        +-- Modules (template processing)
        |     +-- Attribute Modules   ([prop], [(prop)], (event), #child)
        |     +-- Expression Modules  ({{expression}})
        |     +-- Instruction Modules ($if, $for, $slot, $dynamic-content)
        |
        +-- Extensions (lifecycle hooks)
              +-- Export Extension     (@PwbExport)
              +-- Event Extensions    (@PwbComponentEvent, @PwbComponentEventListener)
              +-- Child Extension     (@PwbChild)
```

## Quick Example

```typescript
import { PwbComponent, Processor, PwbExport } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'hello-world',
    template: '<h1>Hello, {{this.name}}!</h1>',
    style: 'h1 { color: steelblue; }'
})
class HelloWorld extends Processor {
    @PwbExport
    public name: string = 'World';
}
```

```html
<hello-world name="Developer"></hello-world>
```

The component renders `<h1>Hello, Developer!</h1>` inside a Shadow DOM. Changing the `name` attribute or property on the element automatically re-renders the content.

## Installation

```bash
# Deno (JSR)
deno add jsr:@kartoffelgames/web-potato-web-builder
```

## Dependencies

| Package | Purpose |
|---------|---------|
| `@kartoffelgames/core` | Core utilities (Dictionary, Exception, List) |
| `@kartoffelgames/core-dependency-injection` | Dependency injection and IoC container |
| `@kartoffelgames/core-parser` | Lexer and parser for template compilation |
| `@kartoffelgames/web-interaction-zone` | Async-aware execution context tracking |

## Documentation

Detailed documentation for each feature is available in the `docs/` directory:

| Document | Description |
|----------|-------------|
| [Getting Started](docs/getting-started.md) | Installation, first component, and project setup |
| [Components](docs/components.md) | `@PwbComponent` decorator, `Processor` base class, and lifecycle hooks |
| [Template Syntax](docs/template-syntax.md) | XML templates, expressions, and the template parser |
| [Data Binding](docs/data-binding.md) | One-way `[prop]`, two-way `[(prop)]`, and mustache expressions `{{expr}}` |
| [Control Flow](docs/control-flow.md) | `$if` conditionals and `$for` iteration |
| [Events](docs/events.md) | Template event binding, `@PwbComponentEvent`, and `@PwbComponentEventListener` |
| [Exports and Children](docs/exports-and-children.md) | `@PwbExport` for public properties and `@PwbChild` for element references |
| [Custom Modules](docs/custom-modules.md) | Creating attribute, expression, and instruction modules |
| [Extensions](docs/extensions.md) | `@PwbExtensionModule` for cross-cutting concerns |
| [Global Resources](docs/global-resources.md) | `@PwbGlobalResource` for shared static state |
| [Application](docs/application.md) | `PwbApplication` setup, configuration, and error handling |
| [Slots and Dynamic Content](docs/slots-and-dynamic-content.md) | `$slot` for content projection and `$dynamic-content` for programmatic templates |
| [Update System](docs/update-system.md) | `UpdateMode`, `UpdateTrigger`, and manual update control |

## API Summary

### Decorators

| Decorator | Target | Purpose |
|-----------|--------|---------|
| `@PwbComponent(options)` | Class | Registers a class as a custom HTML element |
| `@PwbExport` | Property / Method | Exposes a property or method on the HTML element |
| `@PwbComponentEvent(name)` | Accessor | Declares a custom event emitter |
| `@PwbComponentEventListener(name)` | Method | Listens for events on the component element |
| `@PwbChild(id)` | Accessor | References a child element by template ID |
| `@PwbGlobalResource()` | Class | Makes a static class globally available in templates |
| `@PwbAttributeModule(settings)` | Class | Registers a custom attribute module |
| `@PwbExpressionModule(settings)` | Class | Registers a custom expression module |
| `@PwbInstructionModule(settings)` | Class | Registers a custom instruction module |
| `@PwbExtensionModule(settings)` | Class | Registers a lifecycle extension |

### Enumerations

| Enum | Values | Purpose |
|------|--------|---------|
| `AccessMode` | `Read`, `ReadWrite`, `Write` | Module and extension access level |
| `UpdateMode` | `Default`, `Isolated`, `Manual` | Component update propagation strategy |
| `UpdateTrigger` | `None`, `PropertySet`, `PropertyDelete`, `UntrackableFunctionCall`, `Manual`, `InputChange`, `Any` | Conditions that trigger module updates |

### Key Classes

| Class | Purpose |
|-------|---------|
| `Processor` | Base class for all components, modules, and extensions |
| `Component` | Internal component manager (injectable) |
| `ComponentElement` | Shadow DOM wrapper (injectable) |
| `PwbApplication` | Application container and entry point |
| `ComponentEventEmitter<T>` | Typed event dispatcher for custom events |
| `ComponentEvent<T>` | Typed event object carrying a value |
| `InstructionResult` | Return type for instruction module updates |
| `DataLevel` | Hierarchical data scope for template expressions |
| `ModuleDataLevel` | Module-scoped data access and expression creation |
| `ComponentDataLevel` | Component-scoped data access and expression creation |
| `LevelProcedure<T>` | Compiled expression bound to a data scope |
| `TemplateParser` | Parses template strings into template node trees |

## License

LGPL-3.0-only
