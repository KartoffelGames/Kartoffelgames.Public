# Exports and Children

PWB provides two decorators for bridging between the component's internal TypeScript class and the external HTML element: `@PwbExport` for exposing properties and methods, and `@PwbChild` for referencing child elements by ID.

## @PwbExport -- Exporting Properties and Methods

The `@PwbExport` decorator makes a component's property or method accessible from the outside as a DOM property on the custom element. Exported properties are also synchronized with HTML attributes.

### Exporting Properties

```typescript
import { PwbComponent, Processor, PwbExport } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'user-card',
    template: '<div>{{this.name}} ({{this.role}})</div>'
})
class UserCard extends Processor {
    @PwbExport
    public name: string = 'Anonymous';

    @PwbExport
    public role: string = 'Guest';
}
```

With `@PwbExport`, the properties become accessible on the HTML element:

```typescript
const card = document.querySelector('user-card');

// Read as DOM property
console.log(card.name); // 'Anonymous'

// Write as DOM property
card.name = 'Alice';

// Read via getAttribute
console.log(card.getAttribute('name')); // 'Alice'

// Write via setAttribute
card.setAttribute('role', 'Admin');
```

### HTML Attribute Binding

Exported properties are bidirectionally linked to HTML attributes of the same name:

- Setting an attribute via `setAttribute()` updates the internal property.
- Changing the internal property updates what `getAttribute()` returns.
- The component's `IComponentOnAttributeChange` hook fires when attributes change.

```typescript
@PwbComponent({
    selector: 'attr-sync',
    template: '<span>{{this.value}}</span>'
})
class AttrSync extends Processor implements IComponentOnAttributeChange {
    @PwbExport
    public value: string = 'initial';

    public onAttributeChange(name: string, oldValue: string | null, newValue: string | null): void {
        console.log(`${name}: ${oldValue} -> ${newValue}`);
    }
}
```

```html
<!-- Setting attribute in HTML -->
<attr-sync value="from-html"></attr-sync>
```

### Exporting Methods

Methods can also be exported, making them callable from external code:

```typescript
@PwbComponent({
    selector: 'api-component',
    template: '<div>{{this.status}}</div>',
    updateScope: UpdateMode.Manual
})
class ApiComponent extends Processor {
    private readonly mComponent: Component;

    @PwbExport
    public status: string = 'idle';

    public constructor(pComponent = Injection.use(Component)) {
        super();
        this.mComponent = pComponent;
    }

    @PwbExport
    public reset(): void {
        this.status = 'idle';
        this.mComponent.update();
    }

    @PwbExport
    public activate(): void {
        this.status = 'active';
        this.mComponent.update();
    }
}
```

```typescript
const api = document.querySelector('api-component');
api.activate(); // Calls the component's activate method
api.reset();    // Calls the component's reset method
```

### Multiple Exports

A component can export any number of properties and methods:

```typescript
@PwbComponent({
    selector: 'config-panel'
})
class ConfigPanel extends Processor {
    @PwbExport
    public width: number = 100;

    @PwbExport
    public height: number = 200;

    @PwbExport
    public theme: string = 'light';

    @PwbExport
    public apply(): void {
        // Apply configuration
    }
}
```

### Inheritance

Exported properties and methods are inherited from parent classes:

```typescript
class BaseWidget extends Processor {
    @PwbExport
    public visible: boolean = true;
}

@PwbComponent({
    selector: 'extended-widget',
    template: `
        $if(this.visible) {
            <div>{{this.label}}</div>
        }
    `
})
class ExtendedWidget extends BaseWidget {
    @PwbExport
    public label: string = 'Widget';
}
```

The `<extended-widget>` element exposes both `visible` (from `BaseWidget`) and `label` (from `ExtendedWidget`).

### How @PwbExport Works Internally

`@PwbExport` is a class member decorator that stores the property or method name in the class metadata under the key `'pwb:exported_properties'`. The `ExportExtension` (a `@PwbExtensionModule` targeting `Component`) reads this metadata when the component is constructed and:

1. Defines property descriptors on the HTML element that proxy reads/writes to the component processor.
2. Patches `setAttribute` and `getAttribute` on the HTML element to route through the exported properties.
3. Connects attribute changes to property updates and vice versa.

## @PwbChild -- Child Element References

The `@PwbChild` decorator provides a typed reference to a child element in the component's template, identified by a template ID marker.

### Template ID Syntax

In the template, an element is given an ID with the `#` prefix:

```xml
<div #MyContainer>Content</div>
```

The `#MyContainer` attribute marks the element as referenceable by the ID `MyContainer`.

### Referencing a Child

```typescript
import { PwbComponent, Processor, PwbChild, PwbExport } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'canvas-wrapper',
    template: '<canvas #DrawCanvas width="800" height="600"/>'
})
class CanvasWrapper extends Processor {
    @PwbExport
    @PwbChild('DrawCanvas')
    public accessor canvas!: HTMLCanvasElement;
}
```

After the component is constructed and the template is rendered, `this.canvas` holds a reference to the `<canvas>` element.

### Accessing the Child Element

The child reference is available after the component's template has been built:

```typescript
@PwbComponent({
    selector: 'input-focus',
    template: '<input #MainInput type="text"/>'
})
class InputFocus extends Processor implements IComponentOnConnect {
    @PwbChild('MainInput')
    public accessor input!: HTMLInputElement;

    public onConnect(): void {
        // Access the child element after connection
        this.input.focus();
    }
}
```

### With @PwbExport

Combining `@PwbChild` with `@PwbExport` allows external code to access the child element through the component's DOM property:

```typescript
@PwbComponent({
    selector: 'video-player',
    template: '<video #VideoElement controls/>'
})
class VideoPlayer extends Processor {
    @PwbExport
    @PwbChild('VideoElement')
    public accessor video!: HTMLVideoElement;
}
```

```typescript
const player = document.querySelector('video-player');
player.video.play();
```

### Inheritance

Child references are inherited from parent classes:

```typescript
class MediaBase extends Processor {
    @PwbExport
    @PwbChild('MediaElement')
    public accessor media!: HTMLElement;
}

@PwbComponent({
    selector: 'audio-player',
    template: '<audio #MediaElement controls/>'
})
class AudioPlayer extends MediaBase { }
```

### How @PwbChild Works Internally

`@PwbChild` is a class accessor decorator that stores metadata mapping property names to template IDs. The template ID attribute (`#Name`) is processed by the `PwbChildAttributeModule`, which is a built-in attribute module with the regex selector `/^#[[\w$]+$/`.

When the module encounters a `#Name` attribute on an element during template building, it writes a reference to that DOM element into the component's `ComponentDataLevel` as a temporary value. The accessor defined by `@PwbChild` reads from this data level to return the element reference.

## Related

- [Components](components.md) -- Component structure and lifecycle
- [Data Binding](data-binding.md) -- Binding exported properties from parent components
- [Events](events.md) -- Using exported methods with event emitters
- [Custom Modules](custom-modules.md) -- How the child attribute module is implemented
