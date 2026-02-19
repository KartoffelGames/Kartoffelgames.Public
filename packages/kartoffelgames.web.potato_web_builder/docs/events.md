# Events

PWB provides three mechanisms for working with events: template event binding for handling DOM events in templates, `@PwbComponentEvent` for dispatching custom events from components, and `@PwbComponentEventListener` for listening to events on the component element.

## Template Event Binding

The `(eventName)="expression"` syntax attaches an event listener to an element in the template. When the event fires, the expression is evaluated.

### Syntax

```
(eventName)="expression"
```

The event object is available in the expression as `$event`.

### Handling Native DOM Events

```typescript
@PwbComponent({
    selector: 'click-handler',
    template: '<button (click)="this.handleClick($event)">Click me</button>'
})
class ClickHandler extends Processor {
    public handleClick(event: MouseEvent): void {
        console.log('Button clicked at:', event.clientX, event.clientY);
    }
}
```

### Inline Expressions

The expression does not have to call a method. Any valid JavaScript expression works:

```typescript
@PwbComponent({
    selector: 'inline-event',
    template: `
        <button (click)="this.count = this.count + 1">Increment</button>
        <div>{{this.count}}</div>
    `
})
class InlineEvent extends Processor {
    public count: number = 0;
}
```

### Multiple Event Bindings

Multiple events can be bound on the same element:

```typescript
@PwbComponent({
    selector: 'multi-event',
    template: `
        <div
            (mouseenter)="this.hovered = true"
            (mouseleave)="this.hovered = false"
            (click)="this.handleClick()">
            {{this.hovered ? 'Hovering' : 'Not hovering'}}
        </div>
    `
})
class MultiEvent extends Processor {
    public hovered: boolean = false;

    public handleClick(): void {
        console.log('Clicked while hovered:', this.hovered);
    }
}
```

### Events on Child Components

Event binding works on any element, including custom PWB components. The event listener is attached to the component's host element.

```typescript
@PwbComponent({
    selector: 'parent-listener',
    template: '<child-widget (custom-event)="this.onCustomEvent($event)"/>'
})
class ParentListener extends Processor {
    public onCustomEvent(event: any): void {
        console.log('Received custom event:', event);
    }
}
```

### Selector Pattern

The event attribute module is registered with the regex selector `/^\([[\w\-$]+\)$/`, matching `(eventName)` where the name can contain word characters, hyphens, and `$`.

### How Event Binding Works Internally

The `EventAttributeModule`:

1. Extracts the event name from the attribute name by removing the surrounding parentheses.
2. Creates a `LevelProcedure` from the attribute value expression, registering `$event` as an extended variable.
3. Adds a native `addEventListener` on the target DOM node.
4. When the event fires, sets `$event` to the event object and executes the procedure.
5. On deconstruction, removes the event listener.

## @PwbComponentEvent -- Custom Events

The `@PwbComponentEvent` decorator declares a custom event emitter on a component. It creates a `ComponentEventEmitter` that dispatches typed `ComponentEvent` instances from the component's host element.

### Declaring a Custom Event

```typescript
import {
    PwbComponent, Processor, PwbExport,
    PwbComponentEvent, ComponentEventEmitter
} from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'notification-source',
    template: '<button (click)="this.notify()">Notify</button>'
})
class NotificationSource extends Processor {
    @PwbComponentEvent('notification')
    private accessor mNotifyEvent!: ComponentEventEmitter<string>;

    public notify(): void {
        this.mNotifyEvent.dispatchEvent('Something happened');
    }
}
```

The `@PwbComponentEvent('notification')` decorator:
- Must be applied to a class accessor (using the `accessor` keyword)
- Takes the event name as a string argument
- Initializes the accessor with a `ComponentEventEmitter` bound to the component's host element

### Listening to Custom Events

From the outside, custom events are standard DOM events and can be listened to with `addEventListener`:

```typescript
const element = document.querySelector('notification-source');
element.addEventListener('notification', (event: ComponentEvent<string>) => {
    console.log('Notification received:', event.value);
});
```

Or from a parent component's template:

```typescript
@PwbComponent({
    selector: 'notification-receiver',
    template: '<notification-source (notification)="this.onNotify($event)"/>'
})
class NotificationReceiver extends Processor {
    public onNotify(event: ComponentEvent<string>): void {
        console.log('Got:', event.value);
    }
}
```

### ComponentEvent

`ComponentEvent<T>` extends the native `Event` class and adds a typed `value` property:

```typescript
import { ComponentEvent } from '@kartoffelgames/web-potato-web-builder';

// event.value is of type T
```

Properties:
- `value: T` -- The typed payload dispatched with the event

### ComponentEventEmitter

`ComponentEventEmitter<T>` wraps `HTMLElement.dispatchEvent` with type safety:

```typescript
import { ComponentEventEmitter } from '@kartoffelgames/web-potato-web-builder';

// emitter.dispatchEvent(value: T) -- dispatches a ComponentEvent<T>
```

### Multiple Event Emitters

A component can declare multiple event emitters:

```typescript
@PwbComponent({
    selector: 'dual-events'
})
class DualEvents extends Processor {
    @PwbComponentEvent('save')
    private accessor mSaveEvent!: ComponentEventEmitter<object>;

    @PwbComponentEvent('cancel')
    private accessor mCancelEvent!: ComponentEventEmitter<void>;

    @PwbExport
    public save(data: object): void {
        this.mSaveEvent.dispatchEvent(data);
    }

    @PwbExport
    public cancel(): void {
        this.mCancelEvent.dispatchEvent(undefined as void);
    }
}
```

### Overriding Native Events

Custom events can use the same name as native DOM events to override them:

```typescript
@PwbComponent({
    selector: 'custom-click'
})
class CustomClick extends Processor {
    @PwbComponentEvent('click')
    private accessor mClickEvent!: ComponentEventEmitter<string>;

    @PwbExport
    public emitClick(): void {
        this.mClickEvent.dispatchEvent('custom click data');
    }
}
```

### Inherited Events

Event emitters defined in a parent class are inherited by child classes:

```typescript
class EventBase extends Processor {
    @PwbComponentEvent('base-event')
    private accessor mBaseEvent!: ComponentEventEmitter<string>;

    @PwbExport
    public triggerBase(): void {
        this.mBaseEvent.dispatchEvent('from base');
    }
}

@PwbComponent({
    selector: 'extended-component'
})
class ExtendedComponent extends EventBase {
    // Inherits 'base-event' emitter and triggerBase method
}
```

## @PwbComponentEventListener -- Event Listeners

The `@PwbComponentEventListener` decorator registers a method as an event listener on the component's own host element. This is useful for reacting to events dispatched on the component from the outside or from child content.

### Listening to Native Events

```typescript
import {
    PwbComponent, Processor,
    PwbComponentEventListener
} from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'click-logger'
})
class ClickLogger extends Processor {
    @PwbComponentEventListener('click')
    public onHostClick(event: MouseEvent): void {
        console.log('Host element was clicked:', event);
    }
}
```

The listener is attached to the component's own `HTMLElement`. When `<click-logger>` is clicked, `onHostClick` is called.

### Listening to Custom Events

Combined with `@PwbComponentEvent`, a component can both emit and listen to its own events:

```typescript
@PwbComponent({
    selector: 'self-listener'
})
class SelfListener extends Processor {
    @PwbComponentEvent('internal')
    private accessor mEvent!: ComponentEventEmitter<number>;

    @PwbExport
    public trigger(): void {
        this.mEvent.dispatchEvent(42);
    }

    @PwbComponentEventListener('internal')
    private onInternal(event: ComponentEvent<number>): void {
        console.log('Self-received:', event.value);
    }
}
```

### Multiple Listeners for the Same Event

Multiple methods can listen to the same event. All registered listeners are called when the event fires.

```typescript
@PwbComponent({
    selector: 'dual-listener'
})
class DualListener extends Processor {
    @PwbComponentEventListener('click')
    private logClick(event: MouseEvent): void {
        console.log('Log:', event);
    }

    @PwbComponentEventListener('click')
    private trackClick(event: MouseEvent): void {
        // Track analytics
    }
}
```

### Inherited Listeners

Event listeners defined in a parent class are inherited:

```typescript
class ListenerBase extends Processor {
    @PwbComponentEventListener('click')
    private onBaseClick(event: MouseEvent): void {
        console.log('Base click handler');
    }
}

@PwbComponent({
    selector: 'child-listener'
})
class ChildListener extends ListenerBase {
    // Inherits the click listener from ListenerBase
}
```

### Event Listeners on Modules

`@PwbComponentEventListener` also works on attribute modules, not just components. When applied to a module, the listener is attached to the module's target element rather than the component host. This is implemented through a separate extension that targets `AttributeModule` instances.

### How @PwbComponentEventListener Works Internally

`@PwbComponentEventListener` stores metadata on the class listing which methods should be registered as event listeners and for which event names. Two extension modules read this metadata:

1. `ComponentEventListenerComponentExtension` -- Targets `Component` instances. On construction, it reads the metadata from the component processor, adds `addEventListener` calls to the component's host element for each decorated method, and removes them on deconstruction.

2. `ComponentEventListenerModuleExtension` -- Targets `AttributeModule` instances. Works similarly but attaches listeners to the module's target element.

## Related

- [Template Syntax](template-syntax.md) -- Event binding syntax in templates
- [Components](components.md) -- Component lifecycle and structure
- [Exports and Children](exports-and-children.md) -- Exposing methods that trigger events
- [Extensions](extensions.md) -- How event listener extensions work
