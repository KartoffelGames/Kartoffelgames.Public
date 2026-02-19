# Components

Components are the fundamental building blocks of a PWB application. Each component is a TypeScript class that becomes a native custom HTML element with its own Shadow DOM, template, styles, and reactive state.

## The Processor Base Class

All components, modules, and extensions must extend `Processor`. This base class enables proxy-based interaction tracking, which is the foundation of PWB's reactivity system.

```typescript
import { Processor } from '@kartoffelgames/web-potato-web-builder';

class MyComponent extends Processor {
    public title: string = 'Hello';
}
```

`Processor` does not require any constructor arguments. When a class extending `Processor` is instantiated inside a PWB context (as a component, module, or extension), the framework wraps it in a proxy that tracks property reads and writes. This tracking data is used to determine which parts of the DOM need updating.

## @PwbComponent Decorator

The `@PwbComponent` decorator registers a class as a custom HTML element. It accepts a configuration object with the following properties:

```typescript
@PwbComponent({
    selector: string;             // Required. The custom element tag name.
    template?: string;            // Optional. XML template string.
    style?: string;               // Optional. CSS styles scoped to the Shadow DOM.
    updateScope?: UpdateMode;     // Optional. Update propagation mode. Default: UpdateMode.Default
    expressionmodule?: class;     // Optional. Custom expression module class.
    modules?: Array<class>;       // Optional. Additional modules to import. (placeholder)
    components?: Array<class>;    // Optional. Additional components to import. (placeholder)
})
```

### Selector

The `selector` is the tag name used to instantiate the component in HTML or in other component templates. It must follow the custom element naming rules (must contain a hyphen).

```typescript
@PwbComponent({
    selector: 'user-profile'
})
class UserProfile extends Processor { }
```

```html
<user-profile></user-profile>
```

### Template

The `template` is an XML-compatible string that defines the component's DOM structure. It supports expressions, data binding, event binding, and instruction blocks. Templates are parsed at component registration time and compiled into an internal node tree.

```typescript
@PwbComponent({
    selector: 'greeting-card',
    template: `
        <div>
            <h1>{{this.title}}</h1>
            <p>{{this.message}}</p>
        </div>
    `
})
class GreetingCard extends Processor {
    public title: string = 'Welcome';
    public message: string = 'This is a greeting card.';
}
```

A component without a template renders nothing but still participates in the component lifecycle.

### Style

The `style` property injects CSS into a `<style>` element prepended to the Shadow DOM. Styles are fully encapsulated.

```typescript
@PwbComponent({
    selector: 'styled-button',
    template: '<button>{{this.label}}</button>',
    style: `
        button {
            padding: 8px 16px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #0052a3;
        }
    `
})
class StyledButton extends Processor {
    public label: string = 'Click me';
}
```

### Update Scope

The `updateScope` property controls how updates propagate. See [Update System](update-system.md) for full details.

```typescript
import { UpdateMode } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'isolated-widget',
    template: '<span>{{this.value}}</span>',
    updateScope: UpdateMode.Isolated
})
class IsolatedWidget extends Processor {
    public value: string = '';
}
```

### Custom Expression Module

By default, templates use the built-in mustache expression module (`{{expression}}`). You can replace it with a custom expression module class.

```typescript
@PwbComponent({
    selector: 'custom-expr',
    template: '<div>{{anything}}</div>',
    expressionmodule: MyCustomExpressionModule
})
class CustomExprComponent extends Processor { }
```

See [Custom Modules](custom-modules.md) for how to create expression modules.

## Lifecycle Hooks

PWB components support lifecycle hooks through TypeScript interfaces. Implement the interface and define the corresponding method.

### IComponentOnConnect

Called when the component element is attached to the DOM (via `connectedCallback`).

```typescript
import { PwbComponent, Processor } from '@kartoffelgames/web-potato-web-builder';
import type { IComponentOnConnect } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'connected-logger',
    template: '<div>Connected</div>'
})
class ConnectedLogger extends Processor implements IComponentOnConnect {
    public onConnect(): void {
        console.log('Component was attached to the DOM');
    }
}
```

### IComponentOnDisconnect

Called when the component element is removed from the DOM (via `disconnectedCallback`).

```typescript
import type { IComponentOnDisconnect } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'cleanup-component',
    template: '<div>Active</div>'
})
class CleanupComponent extends Processor implements IComponentOnDisconnect {
    public onDisconnect(): void {
        console.log('Component was removed from the DOM');
    }
}
```

### IComponentOnUpdate

Called after the component's template has been updated following a state change.

```typescript
import type { IComponentOnUpdate } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'update-tracker',
    template: '<div>{{this.value}}</div>'
})
class UpdateTracker extends Processor implements IComponentOnUpdate {
    public value: string = 'initial';

    public onUpdate(): void {
        console.log('Component updated');
    }
}
```

### IComponentOnAttributeChange

Called when an HTML attribute on the component element changes. Receives the attribute name and optionally the old and new values.

```typescript
import type { IComponentOnAttributeChange } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'attr-watcher'
})
class AttrWatcher extends Processor implements IComponentOnAttributeChange {
    @PwbExport
    public mode: string = 'default';

    public onAttributeChange(pAttributeName: string, pOldValue: string | null, pNewValue: string | null): void {
        console.log(`Attribute "${pAttributeName}" changed from "${pOldValue}" to "${pNewValue}"`);
    }
}
```

### IComponentOnDeconstruct

Called when the component is being destroyed. Use this for cleanup logic.

```typescript
import type { IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'resource-holder',
    template: '<div>Active</div>'
})
class ResourceHolder extends Processor implements IComponentOnDeconstruct {
    private mIntervalId: number = 0;

    public onConnect(): void {
        this.mIntervalId = setInterval(() => console.log('tick'), 1000);
    }

    public onDeconstruct(): void {
        clearInterval(this.mIntervalId);
    }
}
```

### Combining Lifecycle Hooks

A single component can implement multiple lifecycle interfaces:

```typescript
@PwbComponent({
    selector: 'full-lifecycle',
    template: '<div>{{this.status}}</div>'
})
class FullLifecycle extends Processor
    implements IComponentOnConnect, IComponentOnDisconnect, IComponentOnUpdate, IComponentOnDeconstruct {

    public status: string = 'initialized';

    public onConnect(): void {
        this.status = 'connected';
    }

    public onDisconnect(): void {
        this.status = 'disconnected';
    }

    public onUpdate(): void {
        // Runs after each template update
    }

    public onDeconstruct(): void {
        // Final cleanup
    }
}
```

## Dependency Injection in Components

Components can receive injected dependencies through constructor parameters using `Injection.use()` from the `@kartoffelgames/core-dependency-injection` package.

### Injecting the Component Manager

The `Component` class provides programmatic access to the component's internal state, including the ability to trigger manual updates.

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { PwbComponent, Processor, Component, PwbExport } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'manual-updater',
    template: '<div>{{this.value}}</div>',
    updateScope: UpdateMode.Manual
})
class ManualUpdater extends Processor {
    private readonly mComponent: Component;

    @PwbExport
    public value: string = 'initial';

    public constructor(pComponent = Injection.use(Component)) {
        super();
        this.mComponent = pComponent;
    }

    @PwbExport
    public refresh(): void {
        this.mComponent.update();
    }
}
```

### Injecting the Component Element

The `ComponentElement` class provides access to the underlying `HTMLElement` and `ShadowRoot`.

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { PwbComponent, Processor, ComponentElement } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'element-aware',
    template: '<div>Aware</div>'
})
class ElementAware extends Processor {
    private readonly mElement: ComponentElement;

    public constructor(pElement = Injection.use(ComponentElement)) {
        super();
        this.mElement = pElement;
    }

    public onConnect(): void {
        console.log('Tag name:', this.mElement.htmlElement.tagName);
        console.log('Shadow root:', this.mElement.shadowRoot);
    }
}
```

## Shadow DOM

Every PWB component creates an open Shadow DOM on construction. The template content and styles are rendered inside this shadow root. This provides:

- **Style encapsulation**: Component styles do not leak out, and document styles do not leak in.
- **DOM encapsulation**: The component's internal DOM structure is hidden from `document.querySelector` and similar APIs.
- **Slot support**: External content can be projected into the component using `$slot`.

## Multiple Elements in Templates

A template can contain multiple root-level elements. They are all appended to the Shadow DOM.

```typescript
@PwbComponent({
    selector: 'multi-root',
    template: '<h1>Title</h1><p>Paragraph</p><footer>Footer</footer>'
})
class MultiRoot extends Processor { }
```

## Nested Components

Components can use other components in their templates by referencing the child's selector. The child component must be defined (its decorator must have executed) before the parent renders.

```typescript
@PwbComponent({
    selector: 'nav-link',
    template: '<a>{{this.label}}</a>'
})
class NavLink extends Processor {
    @PwbExport
    public label: string = '';
}

@PwbComponent({
    selector: 'nav-bar',
    template: `
        <nav>
            <nav-link [label]="'Home'"/>
            <nav-link [label]="'About'"/>
            <nav-link [label]="'Contact'"/>
        </nav>
    `
})
class NavBar extends Processor { }
```

## Related

- [Template Syntax](template-syntax.md) -- Template language reference
- [Data Binding](data-binding.md) -- Binding data between components and the DOM
- [Update System](update-system.md) -- Controlling when and how components update
- [Exports and Children](exports-and-children.md) -- Exposing properties and referencing child elements
