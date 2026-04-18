# State Management

PWB provides reactive state management through the `ComponentState` class. State properties automatically trigger component updates when their values change.

## ComponentState.state()

The `@ComponentState.state()` decorator transforms a class auto-accessor into a reactive property. When the property value changes, all interaction zones that have read the value are notified, triggering component updates.

```typescript
import { PwbComponent, ComponentState } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'counter-component',
    template: '<div>Count: {{this.count}}</div>'
})
class CounterComponent {
    @ComponentState.state()
    public accessor count: number = 0;

    public increment(): void {
        this.count++;
        // The component automatically re-renders because `count` is reactive.
    }
}
```

### How It Works

When a state property is read (via `get`), the current interaction zone is linked to that state. When the state is written (via `set`), all linked zones are notified with a `set` trigger, causing the component to update its template.

The state skips notifications when the new value is identical to the current value (compared by reference):

```typescript
@ComponentState.state()
public accessor name: string = 'Alice';

// This triggers an update:
this.name = 'Bob';

// This does NOT trigger an update (same reference):
this.name = 'Bob';
```

### Configuration Options

The `state()` decorator accepts an optional configuration object:

#### complexValue

When set to `true`, the state always dispatches change notifications on set, even if the new value is the same reference as the old value. This is useful for mutable objects where the reference stays the same but the contents change.

```typescript
@ComponentState.state({ complexValue: true })
public accessor data: object = { key: 'value' };

// This triggers an update even though the reference is the same:
this.data.key = 'new value';
this.data = this.data;
```

#### proxy

When set to `true`, the state value is wrapped in a deep proxy that automatically detects property changes at any nesting level. This eliminates the need to reassign the value after mutating it.

```typescript
@ComponentState.state({ proxy: true })
public accessor items: Array<string> = ['one', 'two'];

// Directly mutating the array triggers an update:
this.items.push('three');
this.items[0] = 'ONE';
this.items.splice(1, 1);
```

The proxy wraps nested objects and functions recursively, so changes at any depth are detected:

```typescript
@ComponentState.state({ proxy: true })
public accessor config: any = {
    level1: {
        level2: {
            value: 'deep'
        }
    }
};

// All of these trigger updates:
this.config.level1 = { level2: { value: 'new' } };
this.config.level1.level2.value = 'changed';
```

When proxy mode is enabled, the `set` method on the state throws an error. All mutations must be performed directly on the proxied value returned by `get`.

**Supported proxy operations:**

The proxy detects the following operations:

- Property assignments (`obj.prop = value`)
- Property deletions (`delete obj.prop`)
- Array methods: `push`, `pop`, `shift`, `unshift`, `splice`, `fill`, `reverse`, `sort`, `concat`
- Map methods: `set`, `delete`, `clear`
- Set methods: `add`, `delete`, `clear`

## ComponentState.reaction()

`ComponentState.reaction()` creates a reactive side effect that runs whenever any state it reads changes. The callback is executed once immediately to establish which states it depends on, and then re-executed each time any of those states change.

```typescript
import { ComponentState } from '@kartoffelgames/web-potato-web-builder';

const lState = new ComponentState<number>(0);

ComponentState.reaction(() => {
    const lValue = lState.get();
    console.log('Value changed to:', lValue);
});
// Output: "Value changed to: 0" (initial execution)

lState.set(42);
// Output: "Value changed to: 42" (triggered by set)
```

### Usage with Component State

Reactions are useful for creating derived computations or side effects based on component state:

```typescript
@PwbComponent({
    selector: 'price-calculator',
    template: '<div>Total: {{this.total}}</div>'
})
class PriceCalculator {
    @ComponentState.state()
    public accessor price: number = 10;

    @ComponentState.state()
    public accessor quantity: number = 1;

    @ComponentState.state()
    public accessor total: number = 0;

    public constructor() {
        ComponentState.reaction(() => {
            this.total = this.price * this.quantity;
        });
    }
}
```

### How Reactions Work

1. A new interaction zone is created for the reaction.
2. The callback is executed inside this zone, linking any `ComponentState.get()` calls to the zone.
3. An interaction listener is added to the zone that re-executes the callback when a `set` trigger is received.
4. When any linked state is set, the listener fires and re-runs the callback.

Reactions only respond to `set` triggers. Read operations (`get`) do not trigger the reaction callback.

## Using ComponentState Directly

While `@ComponentState.state()` is the primary way to use state in components, you can also create `ComponentState` instances directly for standalone reactive values:

```typescript
import { ComponentState } from '@kartoffelgames/web-potato-web-builder';

// Create a standalone reactive value.
const lCounter = new ComponentState<number>(0);

// Read the value (and link the current interaction zone).
const lValue = lCounter.get();

// Set a new value (notifies all linked zones).
lCounter.set(1);
```

This is useful in non-component contexts or when building custom reactive systems on top of the framework.

## Interaction with InteractionZone

`ComponentState` integrates with the `InteractionZone` system from `@kartoffelgames/core-interaction-zone`. When `get()` is called inside a zone execution context, that zone is linked to the state. When `set()` is called, all linked zones receive a `pushInteraction` call with `ComponentStateType.set`.

```typescript
import { InteractionZone } from '@kartoffelgames/core-interaction-zone';
import { ComponentState } from '@kartoffelgames/web-potato-web-builder';

const lState = new ComponentState<string>('initial');
const lZone = InteractionZone.create('MyZone');

// Add a listener to react to interactions.
lZone.addInteractionListener((pEvent) => {
    console.log('State changed!', pEvent.triggerType);
});

// Link the zone by reading the state inside it.
lZone.execute(() => {
    lState.get();
});

// This triggers the zone listener:
lState.set('updated');
```

This is the mechanism that drives automatic component updates: when a template reads state values during rendering, the component zone is linked. When those values change, the component zone triggers a re-render.
