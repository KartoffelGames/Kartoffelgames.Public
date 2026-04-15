# Components

Components are the fundamental building blocks of a PWB application. Each component is a class decorated with `@PwbComponent` that becomes a standard Custom Element with a shadow DOM.

## The @PwbComponent Decorator

The `@PwbComponent` decorator registers a class as a custom HTML element.

```typescript
import { PwbComponent } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'my-component',
    template: '<div>Hello</div>',
    style: 'div { color: red; }'
})
class MyComponent { }
```

### Configuration Options

| Option | Type | Required | Description |
|---|---|---|---|
| `selector` | `string` | Yes | The custom element tag name. Must contain a hyphen per the Custom Elements specification. |
| `template` | `string` | No | HTML template string rendered inside the component shadow root. |
| `style` | `string` | No | CSS styles scoped to the component shadow root. |
| `expressionmodule` | `constructor` | No | Custom expression module to replace the default mustache expression handler. |
| `modules` | `Array` | No | Placeholder for listing modules that should be imported alongside this component. |
| `components` | `Array` | No | Placeholder for listing child components that should be imported alongside this component. |

## Templates

Templates are HTML strings that define the component view. They are parsed once per component class and cached for reuse across instances.

```typescript
@PwbComponent({
    selector: 'user-card',
    template: `
        <div class="card">
            <h2>{{this.name}}</h2>
            <p>{{this.description}}</p>
        </div>
    `
})
class UserCard {
    public name: string = 'Default Name';
    public description: string = 'Default description';
}
```

Templates support all features described in [Template Syntax](./template-syntax.md): mustache expressions, data binding, event binding, and structural instructions.

A component without a template renders nothing inside its shadow root:

```typescript
@PwbComponent({
    selector: 'logic-only'
})
class LogicOnly {
    // No template, no rendered output.
}
```

## Shadow DOM

Each component creates its own shadow root in `open` mode. This provides:

- **Style encapsulation** -- styles defined in the component do not leak out, and external styles do not penetrate in.
- **DOM encapsulation** -- the component internal DOM is isolated from the document DOM.

## Scoped Styles

The `style` option adds a `<style>` element inside the shadow root. These styles are scoped to the component.

```typescript
@PwbComponent({
    selector: 'styled-button',
    template: '<button>Click</button>',
    style: `
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            cursor: pointer;
        }
        button:hover {
            background: #45a049;
        }
    `
})
class StyledButton { }
```

## Lifecycle Hooks

Components support lifecycle hooks through interface implementation. All hooks are optional.

### onConnect

Called when the component element is attached to the DOM.

```typescript
import { PwbComponent, type IComponentOnConnect } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({ selector: 'my-component' })
class MyComponent implements IComponentOnConnect {
    public onConnect(): void {
        console.log('Component connected to DOM');
    }
}
```

### onDisconnect

Called when the component element is detached from the DOM.

```typescript
import { PwbComponent, type IComponentOnDisconnect } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({ selector: 'my-component' })
class MyComponent implements IComponentOnDisconnect {
    public onDisconnect(): void {
        console.log('Component disconnected from DOM');
    }
}
```

### onUpdate

Called after the component template has been updated.

```typescript
import { PwbComponent, type IComponentOnUpdate } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'my-component',
    template: '<div>{{this.value}}</div>'
})
class MyComponent implements IComponentOnUpdate {
    public value: string = 'Hello';

    public onUpdate(): void {
        console.log('Component updated');
    }
}
```

### onDeconstruct

Called when the component is being destroyed.

```typescript
import { PwbComponent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({ selector: 'my-component' })
class MyComponent implements IComponentOnDeconstruct {
    public onDeconstruct(): void {
        console.log('Component deconstructed');
    }
}
```

### onAttributeChange

Called when an HTML attribute on the component element changes.

```typescript
import { PwbComponent, type IComponentOnAttributeChange } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({ selector: 'my-component' })
class MyComponent implements IComponentOnAttributeChange {
    public onAttributeChange(pAttributeName: string, pOldValue: string | null, pNewValue: string | null): void {
        console.log(`Attribute "${pAttributeName}" changed from "${pOldValue}" to "${pNewValue}"`);
    }
}
```

## Dependency Injection

Component constructors support dependency injection through the `Injection.use()` pattern. The framework provides several injectable references:

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { PwbComponent, Component, ComponentElement } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({ selector: 'my-component' })
class MyComponent {
    private readonly mComponent: Component;

    public constructor(pComponent = Injection.use(Component)) {
        this.mComponent = pComponent;
    }
}
```

Available injections for component processors:

| Injection | Description |
|---|---|
| `Component` | The component manager instance. Provides access to the HTML element, updater, and processor. |
| `ComponentDataLevel` | The root data level of the component, providing access to the component data store. |

## Nesting Components

Components can be composed by using one component selector inside another component template.

```typescript
@PwbComponent({
    selector: 'inner-widget',
    template: '<span>Widget content</span>'
})
class InnerWidget { }

@PwbComponent({
    selector: 'outer-container',
    template: `
        <div>
            <inner-widget/>
            <inner-widget/>
        </div>
    `
})
class OuterContainer { }
```

Each instance of `<inner-widget>` creates a separate component with its own shadow DOM and state.

## Manual Updates

By default, components update automatically when reactive state changes. You can also trigger updates manually through the `Component` injection:

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { PwbComponent, Component, PwbExport } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'manual-update',
    template: '<div>{{this.value}}</div>'
})
class ManualUpdate {
    public value: string = 'initial';
    private readonly mComponent: Component;

    public constructor(pComponent = Injection.use(Component)) {
        this.mComponent = pComponent;
    }

    @PwbExport
    public setValue(pValue: string): void {
        this.value = pValue;
        this.mComponent.updater.update();
    }
}
```

The `updater.update()` call triggers a synchronous update. Use `updater.updateAsync()` for an asynchronous update that batches changes.
