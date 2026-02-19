# Update System

PWB uses a proxy-based reactivity system to automatically detect state changes and update the DOM. The update system is controlled by two enumerations: `UpdateMode` (how updates propagate between components) and `UpdateTrigger` (what kinds of interactions trigger updates for modules and extensions).

## Reactivity Model

Every `Processor` instance (component, module, or extension) is wrapped in a proxy that intercepts property reads and writes. This proxy is managed by the `CoreEntityProcessorProxy` class.

When a property on the proxy is:
- **Read**: The framework records that the current evaluation context depends on that property.
- **Written**: The framework marks the owning entity as potentially needing an update.

On each update cycle, the framework checks which entities have been marked and re-evaluates their templates, modules, or extensions as needed.

## UpdateMode

`UpdateMode` controls how update signals propagate between parent and child components.

```typescript
import { UpdateMode } from '@kartoffelgames/web-potato-web-builder';
```

### UpdateMode.Default

The default behavior. When a property changes, the component updates its template, and the update signal can propagate to parent components if they depend on the same data.

```typescript
@PwbComponent({
    selector: 'default-update',
    template: '<div>{{this.value}}</div>',
    updateScope: UpdateMode.Default
})
class DefaultUpdate extends Processor {
    @PwbExport
    public value: string = 'Hello';
}
```

### UpdateMode.Isolated

The component updates independently. Changes inside the component do not trigger updates in parent components, even if the parent reads data that originates from this component.

```typescript
@PwbComponent({
    selector: 'isolated-counter',
    template: '<span>{{this.count}}</span>',
    updateScope: UpdateMode.Isolated
})
class IsolatedCounter extends Processor implements IComponentOnUpdate {
    @PwbExport
    public count: number = 0;

    public onUpdate(): void {
        // This update does not propagate to the parent
    }
}

@PwbComponent({
    selector: 'parent-container',
    template: `
        <div>
            <isolated-counter [count]="this.childCount"/>
            <p>Parent render count: {{this.renderCount}}</p>
        </div>
    `
})
class ParentContainer extends Processor implements IComponentOnUpdate {
    public childCount: number = 0;
    public renderCount: number = 0;

    public onUpdate(): void {
        // Parent is NOT triggered by isolated child's internal updates
    }
}
```

`Isolated` mode is useful for performance-sensitive components that update frequently (such as animations or timers) without causing cascading updates in the component tree.

### UpdateMode.Manual

The component only updates when explicitly triggered through the `Component.update()` method. The proxy still tracks changes, but no automatic update cycle is initiated.

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import {
    PwbComponent, Processor, Component, PwbExport, UpdateMode
} from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'manual-component',
    template: '<div>{{this.value}}</div>',
    updateScope: UpdateMode.Manual
})
class ManualComponent extends Processor {
    private readonly mComponent: Component;

    @PwbExport
    public value: string = 'Initial';

    public constructor(pComponent = Injection.use(Component)) {
        super();
        this.mComponent = pComponent;
    }

    @PwbExport
    public setValue(newValue: string): void {
        this.value = newValue;
        // Must manually trigger update
        this.mComponent.update();
    }
}
```

Without calling `this.mComponent.update()`, changing `this.value` does not update the DOM.

Child components within a manual component can still update independently if they use `UpdateMode.Default` or `UpdateMode.Isolated`.

### Summary

| Mode | Auto-update | Propagates to parent | Use case |
|------|------------|---------------------|----------|
| `Default` | Yes | Yes | Standard components |
| `Isolated` | Yes | No | Frequently updating components |
| `Manual` | No | No | Components with explicit update control |

## UpdateTrigger

`UpdateTrigger` is a bitmask enumeration that controls which types of interactions cause a module or extension to re-evaluate. It is used in the `trigger` property of `@PwbAttributeModule`, `@PwbExpressionModule`, `@PwbInstructionModule`, and `@PwbExtensionModule`.

```typescript
import { UpdateTrigger } from '@kartoffelgames/web-potato-web-builder';
```

### Trigger Values

| Value | Bit | Description |
|-------|-----|-------------|
| `None` | `0` | No triggers. The module's update is never called after initial setup. |
| `PropertySet` | `1 << 2` | A proxy-tracked property was assigned a new value. |
| `PropertyDelete` | `1 << 3` | A proxy-tracked property was deleted. |
| `UntrackableFunctionCall` | `1 << 4` | A function was called that may have side effects the proxy cannot track (e.g., `Array.push`). |
| `Manual` | `1 << 5` | `Component.update()` was called explicitly. |
| `InputChange` | `1 << 6` | An HTML `<input>` element's value changed (via `input` or `change` events). |
| `Any` | `(1 << 7) - 1` | All trigger types combined. Equivalent to `PropertySet \| PropertyDelete \| UntrackableFunctionCall \| Manual \| InputChange`. |

### Combining Triggers

Triggers can be combined with bitwise OR:

```typescript
// Trigger on property set or manual update only
trigger: UpdateTrigger.PropertySet | UpdateTrigger.Manual
```

Or exclude specific triggers with bitwise AND-NOT:

```typescript
// All triggers except untrackable function calls
trigger: UpdateTrigger.Any & ~UpdateTrigger.UntrackableFunctionCall
```

The built-in modules commonly use `UpdateTrigger.Any & ~UpdateTrigger.UntrackableFunctionCall` to avoid unnecessary updates from indirect function calls while still responding to all direct interactions.

### Usage in Modules

```typescript
@PwbAttributeModule({
    access: AccessMode.Read,
    selector: /^highlight$/,
    trigger: UpdateTrigger.PropertySet | UpdateTrigger.Manual
})
class HighlightModule extends Processor implements IAttributeOnUpdate {
    // onUpdate is only called when a property is set or a manual update is triggered
    public onUpdate(): boolean {
        // ...
        return true;
    }
}
```

### Usage in Extensions

```typescript
@PwbExtensionModule({
    access: AccessMode.Read,
    trigger: UpdateTrigger.Any,
    targetRestrictions: [Component]
})
class AlwaysTracking extends Processor implements IExtensionOnExecute {
    // Responds to any type of interaction
    public onExecute(): void {
        // Setup logic
    }
}
```

### UpdateTrigger.None

Setting `trigger` to `None` means the module's update method is never called after initial construction. This is used by the `$slot` instruction, which only needs to run once:

```typescript
@PwbInstructionModule({
    instructionType: 'slot',
    trigger: UpdateTrigger.None
})
class SlotModule extends Processor { /* ... */ }
```

## Update Cycle

The update cycle is managed by the `CoreEntityUpdater` class. Here is the general flow:

1. **Change Detection**: A proxy interaction (property set, delete, function call) or an input change is detected.
2. **Scheduling**: The update is scheduled using the configured `frameTime` interval (default: 100ms). Multiple changes within the same frame are batched.
3. **Execution**: When the frame time elapses, all pending entities are updated:
   - Component templates are re-evaluated.
   - Module `onUpdate` methods are called if their trigger conditions match.
   - Expression modules re-evaluate their expressions.
   - Instruction modules re-evaluate their results and update the DOM accordingly.
4. **Propagation**: If `UpdateMode.Default` is active, update signals propagate upward to parent components that depend on changed data.
5. **Cap Check**: If the update causes further changes (cascading updates), the cycle repeats up to `stackCap` times (default: 10) to prevent infinite loops.

### Frame Time

The `frameTime` configuration (default: 100ms) sets the minimum interval between update checks. This acts as a debounce: rapid successive changes are batched into a single DOM update.

```typescript
app.configuration.updating.frameTime = 50;  // Check every 50ms (faster updates)
app.configuration.updating.frameTime = 200; // Check every 200ms (less CPU usage)
```

### Stack Cap

The `stackCap` (default: 10) limits cascading updates. If an update modifies state that triggers another update, which triggers another, and so on, the framework stops after `stackCap` iterations to prevent infinite loops.

```typescript
app.configuration.updating.stackCap = 5; // Allow fewer cascading updates
```

## AccessMode

`AccessMode` is used in module and extension configuration to declare the intended interaction pattern.

```typescript
import { AccessMode } from '@kartoffelgames/web-potato-web-builder';
```

| Value | Numeric | Description |
|-------|---------|-------------|
| `Read` | `1` | The module/extension reads from the component data to update the target |
| `ReadWrite` | `2` | The module/extension both reads from and writes to the component data |
| `Write` | `3` | The module/extension writes to the component data based on external input |

### How AccessMode Affects Behavior

- **Read**: The module watches the component data for changes and pushes values to the DOM. Example: One-way binding (`[prop]`).
- **ReadWrite**: The module synchronizes data in both directions. Example: Two-way binding (`[(prop)]`).
- **Write**: The module listens for events or external input and writes values back to the component data. Example: Event binding (`(event)`).

## Related

- [Components](components.md) -- Component update modes
- [Custom Modules](custom-modules.md) -- Using UpdateTrigger and AccessMode in modules
- [Extensions](extensions.md) -- Using UpdateTrigger and AccessMode in extensions
- [Application](application.md) -- Configuring frameTime and stackCap
