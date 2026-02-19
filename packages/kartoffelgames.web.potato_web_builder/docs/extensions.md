# Extensions

Extensions are a mechanism for attaching cross-cutting behavior to components or modules. They hook into the lifecycle of their targets and execute logic when the target is constructed or updated. Built-in features like `@PwbExport`, `@PwbComponentEventListener`, and `@PwbChild` are implemented as extensions.

## @PwbExtensionModule Decorator

```typescript
import {
    PwbExtensionModule, Processor,
    AccessMode, UpdateTrigger
} from '@kartoffelgames/web-potato-web-builder';

@PwbExtensionModule({
    access: AccessMode,                        // Read, ReadWrite, or Write
    trigger: UpdateTrigger,                    // When to trigger updates
    targetRestrictions: Array<InjectionConstructor>  // Which targets this extension applies to
})
class MyExtension extends Processor { }
```

### Configuration Properties

- **access** (`AccessMode`): The access level for the extension.
  - `AccessMode.Read` -- The extension reads from the target but does not modify it.
  - `AccessMode.ReadWrite` -- The extension can both read from and write to the target.
  - `AccessMode.Write` -- The extension writes to the target.

- **trigger** (`UpdateTrigger`): A bitmask controlling when the extension's `onExecute` is called during the update cycle. See [Update System](update-system.md).

- **targetRestrictions** (`Array<InjectionConstructor>`): An array of classes that this extension applies to. The extension is instantiated once for each matching target instance. Common targets:
  - `Component` -- The extension runs for every component instance.
  - `AttributeModule` -- The extension runs for every attribute module instance.
  - A specific component class -- The extension only runs for instances of that component.

### Lifecycle Interfaces

| Interface | Method | When Called |
|-----------|--------|------------|
| `IExtensionOnExecute` | `onExecute(): void` | Once, during initial setup after the target is constructed |
| `IExtensionOnDeconstruct` | `onDeconstruct(): void` | When the target is being destroyed |

Extensions run their `onExecute` method once during setup, not on every update cycle. They are primarily used for initialization logic and cleanup.

## Injectable Dependencies

Extensions receive different injectable dependencies depending on their `targetRestrictions`:

### When targeting Component

| Injection | Type | Description |
|-----------|------|-------------|
| `Component` | `Component` | The component manager instance |
| `ComponentElement` | `ComponentElement` | Access to the HTML element and Shadow DOM |
| `ComponentDataLevel` | `ComponentDataLevel` | Component-scoped data access |

### When targeting AttributeModule

| Injection | Type | Description |
|-----------|------|-------------|
| `AttributeModule` | `AttributeModule` | The attribute module instance |
| `ModuleTargetNode` | `Node` / `Element` | The DOM element the attribute is on |
| `ModuleDataLevel` | `ModuleDataLevel` | Module-scoped data access |
| `ModuleAttribute` | `ModuleAttribute` | The attribute name and value |

## Example: Logging Extension

An extension that logs when specific components are constructed and destroyed:

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import {
    PwbExtensionModule, Processor, Component,
    AccessMode, UpdateTrigger
} from '@kartoffelgames/web-potato-web-builder';
import type { IExtensionOnExecute, IExtensionOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';

@PwbExtensionModule({
    access: AccessMode.Read,
    trigger: UpdateTrigger.Any,
    targetRestrictions: [Component]
})
class LoggingExtension extends Processor implements IExtensionOnExecute, IExtensionOnDeconstruct {
    private readonly mComponent: Component;

    public constructor(pComponent = Injection.use(Component)) {
        super();
        this.mComponent = pComponent;
    }

    public onExecute(): void {
        console.log('Component constructed:', this.mComponent.element.tagName);
    }

    public onDeconstruct(): void {
        console.log('Component deconstructed:', this.mComponent.element.tagName);
    }
}
```

This extension is instantiated for every component in the application because `targetRestrictions` includes `Component`.

## Example: Targeted Extension

An extension can be restricted to specific component classes:

```typescript
@PwbComponent({
    selector: 'special-widget',
    template: '<div>Special</div>'
})
class SpecialWidget extends Processor { }

@PwbExtensionModule({
    access: AccessMode.Read,
    trigger: UpdateTrigger.Any,
    targetRestrictions: [SpecialWidget]
})
class SpecialWidgetExtension extends Processor implements IExtensionOnExecute {
    public constructor() {
        super();
    }

    public onExecute(): void {
        console.log('SpecialWidget was created');
    }
}
```

This extension only runs when `SpecialWidget` instances are created, not for other components.

## Built-in Extensions

PWB ships with several extensions that implement core framework features:

### ExportExtension

- **Target**: `Component`
- **Access**: `ReadWrite`
- **Purpose**: Reads `@PwbExport` metadata and wires exported properties/methods to the HTML element. Patches `setAttribute`/`getAttribute` for exported attributes.

### ComponentEventListenerComponentExtension

- **Target**: `Component`
- **Access**: `Read`
- **Purpose**: Reads `@PwbComponentEventListener` metadata and attaches event listeners to the component's host element. Removes listeners on deconstruction.

### ComponentEventListenerModuleExtension

- **Target**: `AttributeModule`
- **Access**: `Read`
- **Purpose**: Similar to the component variant, but attaches event listeners to the module's target element instead of the component host.

These extensions demonstrate how the extension system separates concerns: decorators like `@PwbExport` and `@PwbComponentEventListener` only store metadata, while extensions read that metadata and perform the actual setup work.

## Extension Registration and Lifecycle

1. Extensions are registered globally when their `@PwbExtensionModule` decorator executes.
2. When a component or module is created, the framework checks all registered extensions for matching `targetRestrictions`.
3. For each match, an extension instance is created and its constructor runs with injected dependencies.
4. `onExecute()` is called once after construction.
5. When the target is destroyed, `onDeconstruct()` is called on the extension.

Extensions are not called on every update cycle. They run once and set up whatever behavior they need (such as event listeners, property descriptors, or other side effects).

## Practical Use Cases

Extensions are well suited for:

- **Cross-cutting concerns**: Logging, performance monitoring, analytics
- **Feature injection**: Adding behavior to components or modules without modifying their code
- **Decorator support infrastructure**: Implementing the runtime behavior behind metadata-only decorators
- **Plugin systems**: Allowing third-party code to hook into component lifecycles

## Related

- [Components](components.md) -- Component lifecycle that extensions hook into
- [Custom Modules](custom-modules.md) -- Modules that extensions can target
- [Exports and Children](exports-and-children.md) -- Features implemented as extensions
- [Events](events.md) -- Event listener extension details
- [Update System](update-system.md) -- UpdateTrigger and AccessMode enums
