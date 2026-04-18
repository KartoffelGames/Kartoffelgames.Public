# Component Decorators

PWB provides several decorators that add features to component classes: exporting properties to the HTML element, emitting and listening for custom events, and referencing child elements.

## @PwbExport

The `@PwbExport` decorator exposes a component class property or method directly on the HTML element. This bridges the gap between the component processor instance and the custom element in the DOM.

```typescript
import { PwbComponent, PwbExport } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'user-profile',
    template: '<div>{{this.name}}</div>'
})
class UserProfile {
    @PwbExport
    public name: string = 'Default';
}
```

With `@PwbExport`, the `name` property can be accessed directly on the HTML element:

```typescript
const lElement = document.querySelector('user-profile');
console.log(lElement.name);    // 'Default'
lElement.name = 'New Name';    // Updates the component
```

### Exporting Methods

Methods can also be exported:

```typescript
@PwbComponent({ selector: 'api-component' })
class ApiComponent {
    private data: string = '';

    @PwbExport
    public getData(): string {
        return this.data;
    }

    @PwbExport
    public setData(pValue: string): void {
        this.data = pValue;
    }
}
```

```typescript
const lElement = document.querySelector('api-component');
lElement.setData('Hello');
console.log(lElement.getData()); // 'Hello'
```

### HTML Attribute Integration

Exported properties are linked to HTML attributes. Setting an attribute on the element updates the exported property:

```html
<user-profile name="Alice"></user-profile>
```

The framework patches `getAttribute` on the element so that reading an exported attribute returns the current property value.

### Combining with State

Export and state decorators are commonly used together to create reactive, externally accessible properties:

```typescript
@PwbComponent({
    selector: 'reactive-export',
    template: '<div>{{this.value}}</div>'
})
class ReactiveExport {
    @PwbExport
    @ComponentState.state()
    public accessor value: string = 'initial';
}
```

```typescript
const lElement = document.querySelector('reactive-export');
lElement.value = 'updated'; // Triggers re-render automatically
```

### Inheritance

Exported properties from parent classes are inherited:

```typescript
class BaseComponent {
    @PwbExport
    public baseValue: string = 'inherited';
}

@PwbComponent({ selector: 'child-component' })
class ChildComponent extends BaseComponent { }
```

The `baseValue` property is accessible on the `<child-component>` element.

### Restrictions

- `@PwbExport` cannot be used on static properties. Attempting to do so throws: `"Event target is not for a static property."`

## @PwbComponentEvent

The `@PwbComponentEvent` decorator creates a custom event emitter on the component. It decorates an auto-accessor property that becomes a `ComponentEventEmitter<T>`.

```typescript
import {
    PwbComponent,
    PwbComponentEvent,
    ComponentEventEmitter,
    PwbExport
} from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({ selector: 'notifier-component' })
class NotifierComponent {
    @PwbComponentEvent('status-change')
    private accessor mStatusEvent!: ComponentEventEmitter<string>;

    @PwbExport
    public notify(pStatus: string): void {
        this.mStatusEvent.dispatchEvent(pStatus);
    }
}
```

### Listening to Component Events

Component events are dispatched as `ComponentEvent<T>` instances (extending the native `Event`). The event value is available on the `.value` property:

```typescript
const lElement = document.querySelector('notifier-component');
lElement.addEventListener('status-change', (pEvent) => {
    console.log('Status:', pEvent.value); // The dispatched string value
});
lElement.notify('ready');
```

### Using in Parent Templates

Parent components can listen to child component events using event binding syntax:

```typescript
@PwbComponent({
    selector: 'parent-listener',
    template: '<notifier-component (status-change)="this.onStatusChange($event)"/>'
})
class ParentListener {
    public onStatusChange(pEvent: ComponentEvent<string>): void {
        console.log('Child status:', pEvent.value);
    }
}
```

### Multiple Events

A component can define multiple event emitters:

```typescript
@PwbComponent({ selector: 'multi-event' })
class MultiEvent {
    @PwbComponentEvent('data-loaded')
    private accessor mLoadEvent!: ComponentEventEmitter<object>;

    @PwbComponentEvent('error-occurred')
    private accessor mErrorEvent!: ComponentEventEmitter<string>;
}
```

### Restrictions

- `@PwbComponentEvent` cannot be used on static properties.
- The decorator must be applied to a class with `@PwbComponent`. Using it on a non-component class throws: `"PwbComponentEvent target class is not a component."`

## @PwbComponentEventListener

The `@PwbComponentEventListener` decorator binds a method to an event on the component element. It works for both native DOM events and custom component events.

### Native Event Listener

```typescript
import {
    PwbComponent,
    PwbComponentEventListener
} from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({ selector: 'click-listener' })
class ClickListener {
    @PwbComponentEventListener('click')
    public onElementClick(pEvent: MouseEvent): void {
        console.log('Element was clicked');
    }
}
```

The listener is attached to the component element and receives the native event object.

### Custom Event Listener

```typescript
@PwbComponent({ selector: 'self-listener' })
class SelfListener {
    @PwbComponentEvent('custom-event')
    private accessor mEvent!: ComponentEventEmitter<string>;

    @PwbComponentEventListener('custom-event')
    public onCustomEvent(pEvent: ComponentEvent<string>): void {
        console.log('Received:', pEvent.value);
    }

    @PwbExport
    public trigger(): void {
        this.mEvent.dispatchEvent('payload');
    }
}
```

### Multiple Listeners

Multiple methods can listen to the same event:

```typescript
@PwbComponent({ selector: 'multi-listener' })
class MultiListener {
    @PwbComponentEventListener('click')
    public handlerA(pEvent: MouseEvent): void {
        console.log('Handler A');
    }

    @PwbComponentEventListener('click')
    public handlerB(pEvent: MouseEvent): void {
        console.log('Handler B');
    }
}
```

Both handlers are called when the element is clicked.

### On Attribute Modules

`@PwbComponentEventListener` can also be used inside attribute modules. The listener is attached to the target element of the module:

```typescript
@PwbAttributeModule({
    access: AccessMode.Read,
    selector: /^myModuleAttr$/
})
class MyModule {
    @PwbComponentEventListener('click')
    private onTargetClick(pEvent: MouseEvent): void {
        console.log('Target element clicked');
    }
}
```

### Cleanup

Event listeners added by `@PwbComponentEventListener` are automatically removed when the component is deconstructed.

### Inheritance

Listeners defined on parent classes are inherited by child component classes.

### Restrictions

- Cannot be used on static methods.
- Does not work on instruction modules. See the source for details.

## @PwbChild

The `@PwbChild` decorator provides a reference to a child element in the component template, identified by the `#name` syntax.

### Defining a Child Reference

In the template, mark an element with `#name`:

```typescript
import { PwbComponent, PwbChild, PwbExport } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'form-component',
    template: `
        <input #emailInput type="email"/>
        <button (click)="this.focusEmail()">Focus Email</button>
    `
})
class FormComponent {
    @PwbChild('emailInput')
    public accessor emailInput!: HTMLInputElement;

    @PwbExport
    public focusEmail(): void {
        this.emailInput.focus();
    }
}
```

The `#emailInput` attribute registers the `<input>` element in the component data store. The `@PwbChild('emailInput')` decorator creates a getter that retrieves this reference.

### Multiple Child References

```typescript
@PwbComponent({
    selector: 'multi-ref',
    template: `
        <input #firstInput/>
        <input #secondInput/>
    `
})
class MultiRef {
    @PwbChild('firstInput')
    public accessor firstInput!: HTMLInputElement;

    @PwbChild('secondInput')
    public accessor secondInput!: HTMLInputElement;
}
```

### Error Handling

If the specified child name does not match any `#name` in the template, accessing the property throws:

```
Can't find child "wrongName".
```

Using `@PwbChild` outside of a component class throws:

```
PwbChild target class is not a component.
```

### Inheritance

`@PwbChild` properties defined on parent classes are inherited:

```typescript
class BaseForm {
    @PwbExport
    @PwbChild('submitBtn')
    public accessor submitBtn!: HTMLButtonElement;
}

@PwbComponent({
    selector: 'extended-form',
    template: '<button #submitBtn>Submit</button>'
})
class ExtendedForm extends BaseForm { }
```

### Restrictions

- Cannot be used on static properties.
- The referenced element must exist in the template when the property is accessed.
