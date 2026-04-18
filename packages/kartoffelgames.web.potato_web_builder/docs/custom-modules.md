# Custom Modules

PWB is designed to be extensible through custom modules. There are four types of modules you can create: attribute modules, expression modules, instruction modules, and extension modules.

All module types use dependency injection to receive context about the template element or expression they are attached to.

## Attribute Modules

Attribute modules react to custom attributes on HTML elements in component templates. They can read values, write to the DOM, or both.

### Creating an Attribute Module

Use the `@PwbAttributeModule` decorator on a class:

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { PwbAttributeModule } from '@kartoffelgames/web-potato-web-builder';
import type { IAttributeOnUpdate, IAttributeOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import { AccessMode, ModuleTargetNode, ModuleDataLevel, ModuleAttribute } from '@kartoffelgames/web-potato-web-builder';

@PwbAttributeModule({
    access: AccessMode.Read,
    selector: /^tooltip$/
})
class TooltipModule implements IAttributeOnUpdate, IAttributeOnDeconstruct {
    private readonly mTarget: HTMLElement;
    private readonly mProcedure: any;

    public constructor(
        pTarget = Injection.use(ModuleTargetNode),
        pModuleData = Injection.use(ModuleDataLevel),
        pAttribute = Injection.use(ModuleAttribute)
    ) {
        this.mTarget = pTarget;
        this.mProcedure = pModuleData.createExpressionProcedure(pAttribute.value);
    }

    public onUpdate(): boolean {
        const lTooltipText = this.mProcedure.execute();
        this.mTarget.setAttribute('title', lTooltipText?.toString() ?? '');
        return true;
    }

    public onDeconstruct(): void {
        this.mTarget.removeAttribute('title');
    }
}
```

Usage in a template:

```html
<div tooltip="this.tooltipMessage">Hover me</div>
```

### Configuration

| Option | Type | Description |
|---|---|---|
| `access` | `AccessMode` | The access level: `Read`, `Write`, or `ReadWrite`. |
| `selector` | `RegExp` | A regular expression that matches the attribute name. |

### AccessMode

The `AccessMode` enum defines what the module does with the target:

```typescript
enum AccessMode {
    Read = 1,      // Module reads from the target (e.g., reads attribute values)
    ReadWrite = 2, // Module both reads and writes to the target
    Write = 3      // Module writes to the target (e.g., sets properties)
}
```

### Lifecycle Hooks

| Hook | Return Type | Description |
|---|---|---|
| `onUpdate()` | `boolean` | Called on each component update cycle. Return `true` if the module made changes, `false` otherwise. |
| `onDeconstruct()` | `void` | Called when the element is removed from the DOM. Use for cleanup. |

### Injectable References

| Reference | Description |
|---|---|
| `ModuleTargetNode` | The DOM element the attribute is on. |
| `ModuleDataLevel` | The data level providing access to `createExpressionProcedure()` for evaluating expressions. |
| `ModuleAttribute` | Provides the attribute `name` and `value` strings. |
| `ModuleTemplate` | The template node clone of the attribute. |
| `AttributeModule` | The attribute module manager instance. |

### Built-in Attribute Modules

PWB includes these attribute modules:

| Module | Selector Pattern | Description |
|---|---|---|
| One-Way Binding | `[property]` | Binds component expression to DOM property. |
| Two-Way Binding | `[(property)]` | Syncs value between component and DOM. |
| Event Binding | `(event)` | Attaches event listener to DOM element. |
| Child Reference | `#name` | Registers element reference in component data. |

### Example: Custom Attribute with Write Access

```typescript
@PwbAttributeModule({
    access: AccessMode.Write,
    selector: /^log$/
})
class LogEventModule implements IAttributeOnDeconstruct {
    private readonly mTarget: Node;
    private readonly mListener: () => void;

    public constructor(
        pTarget = Injection.use(ModuleTargetNode),
        pData = Injection.use(ModuleDataLevel),
        pAttribute = Injection.use(ModuleAttribute)
    ) {
        this.mTarget = pTarget;
        const lProcedure = pData.createExpressionProcedure(pAttribute.value, ['$event']);

        this.mListener = (pEvent: any): void => {
            lProcedure.setTemporaryValue('$event', pEvent);
            lProcedure.execute();
        };

        this.mTarget.addEventListener('click', this.mListener);
    }

    public onDeconstruct(): void {
        this.mTarget.removeEventListener('click', this.mListener);
    }
}
```

## Expression Modules

Expression modules define how mustache expressions (`{{...}}`) are evaluated. PWB includes a default mustache expression module, but you can replace it with a custom one.

### Creating an Expression Module

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { PwbExpressionModule } from '@kartoffelgames/web-potato-web-builder';
import type { IExpressionOnUpdate } from '@kartoffelgames/web-potato-web-builder';
import { ModuleDataLevel, ModuleExpression } from '@kartoffelgames/web-potato-web-builder';

@PwbExpressionModule()
class UpperCaseExpressionModule implements IExpressionOnUpdate {
    private readonly mProcedure: any;

    public constructor(
        pModuleData = Injection.use(ModuleDataLevel),
        pExpression = Injection.use(ModuleExpression)
    ) {
        this.mProcedure = pModuleData.createExpressionProcedure(pExpression.value);
    }

    public onUpdate(): string | null {
        const lResult = this.mProcedure.execute();
        if (typeof lResult === 'undefined') {
            return null;
        }
        return lResult?.toString().toUpperCase() ?? null;
    }
}
```

### Using a Custom Expression Module

Pass it as the `expressionmodule` option in `@PwbComponent`:

```typescript
@PwbComponent({
    selector: 'uppercase-component',
    template: '<div>{{this.text}}</div>',
    expressionmodule: UpperCaseExpressionModule
})
class UppercaseComponent {
    public text: string = 'hello world';
}
```

This renders: `<div>HELLO WORLD</div>`

### Lifecycle Hooks

| Hook | Return Type | Description |
|---|---|---|
| `onUpdate()` | `string \| null` | Called on each update. Returns the text to display, or `null` for empty. |
| `onDeconstruct()` | `void` | Called on cleanup. |

### Injectable References

| Reference | Description |
|---|---|
| `ModuleDataLevel` | Data level for creating expression procedures. |
| `ModuleExpression` | The raw expression string (the content between `{{` and `}}`). |
| `ModuleTargetNode` | The text node where the expression result is rendered. |
| `ExpressionModule` | The expression module manager instance. |

### The Default Expression Module

The built-in `MustacheExpressionModule` evaluates the expression as JavaScript in the component context and converts the result to a string. `undefined` results render as empty strings.

## Instruction Modules

Instruction modules control structural aspects of the template. They can add, remove, or replace DOM elements. Instructions use the syntax `$instructionType(expression) { template }` or `$instructionType` for the shorthand form.

### Creating an Instruction Module

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { PwbInstructionModule } from '@kartoffelgames/web-potato-web-builder';
import type { IInstructionOnUpdate } from '@kartoffelgames/web-potato-web-builder';
import {
    InstructionResult,
    ModuleDataLevel,
    ModuleExpression,
    ModuleTemplate,
    PwbTemplate,
    DataLevel
} from '@kartoffelgames/web-potato-web-builder';
import type { PwbTemplateInstructionNode } from '@kartoffelgames/web-potato-web-builder';

@PwbInstructionModule({
    instructionType: 'repeat'
})
class RepeatInstructionModule implements IInstructionOnUpdate {
    private readonly mModuleData: ModuleDataLevel;
    private readonly mProcedure: any;
    private readonly mTemplate: PwbTemplateInstructionNode;
    private mLastCount: number;

    public constructor(
        pTemplate = Injection.use(ModuleTemplate),
        pModuleData = Injection.use(ModuleDataLevel),
        pExpression = Injection.use(ModuleExpression)
    ) {
        this.mTemplate = pTemplate as PwbTemplateInstructionNode;
        this.mModuleData = pModuleData;
        this.mProcedure = pModuleData.createExpressionProcedure(pExpression.value);
        this.mLastCount = -1;
    }

    public onUpdate(): InstructionResult | null {
        const lCount: number = Number(this.mProcedure.execute());

        // Skip if count has not changed.
        if (lCount === this.mLastCount) {
            return null;
        }
        this.mLastCount = lCount;

        const lResult = new InstructionResult();

        for (let lIndex = 0; lIndex < lCount; lIndex++) {
            const lTemplate = new PwbTemplate();
            lTemplate.appendChild(...this.mTemplate.childList);

            const lDataLevel = new DataLevel(this.mModuleData.data);
            lDataLevel.setTemporaryValue('repeatIndex', lIndex);

            lResult.addElement(lTemplate, lDataLevel);
        }

        return lResult;
    }
}
```

Usage:

```html
$repeat(3) {
    <div>Repeated element</div>
}
```

Or with an expression:

```html
$repeat(this.count) {
    <div>Item {{this.repeatIndex}}</div>
}
```

### Configuration

| Option | Type | Description |
|---|---|---|
| `instructionType` | `string` | The instruction keyword used in templates (e.g., `repeat` for `$repeat(...)`). |

### The InstructionResult

`InstructionResult` is the return type of `onUpdate()`. It defines what templates should be rendered.

```typescript
const lResult = new InstructionResult();

// Add a template with its own data level.
const lTemplate = new PwbTemplate();
lTemplate.appendChild(...someNodes);
lResult.addElement(lTemplate, someDataLevel);

return lResult;
```

Returning `null` from `onUpdate()` means no structural change is needed.

### Lifecycle Hooks

| Hook | Return Type | Description |
|---|---|---|
| `onUpdate()` | `InstructionResult \| null` | Called on each update. Returns an `InstructionResult` to change structure, or `null` to skip. |
| `onDeconstruct()` | `void` | Called on cleanup. |

### Injectable References

| Reference | Description |
|---|---|
| `ModuleTemplate` | The instruction template node, including child nodes. Cast to `PwbTemplateInstructionNode` for access to `childList` and `instruction`. |
| `ModuleDataLevel` | Data level for creating expression procedures and accessing the data store. |
| `ModuleExpression` | The instruction expression string (the content in parentheses). |
| `InstructionModule` | The instruction module manager instance. |

### Built-in Instruction Modules

| Module | Instruction Type | Description |
|---|---|---|
| If | `$if(expr)` | Conditional rendering based on truthy/falsy expression. |
| For | `$for(item of expr)` | Loop rendering for iterables and objects. |
| Slot | `$slot` / `$slot(name)` | Content projection via native `<slot>` elements. |
| Dynamic Content | `$dynamic-content(expr)` | Renders a programmatically built `PwbTemplate`. |

## Extension Modules

Extension modules add cross-cutting functionality to components or other modules. They run once when the entity they are attached to is set up, and optionally clean up when it is deconstructed.

### Creating an Extension Module

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { PwbExtensionModule } from '@kartoffelgames/web-potato-web-builder';
import type { IExtensionOnExecute, IExtensionOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import { AccessMode, Component } from '@kartoffelgames/web-potato-web-builder';

@PwbExtensionModule({
    access: AccessMode.Read,
    targetRestrictions: [Component]
})
class LoggingExtension implements IExtensionOnExecute, IExtensionOnDeconstruct {
    private readonly mComponent: Component;

    public constructor(pComponent = Injection.use(Component)) {
        this.mComponent = pComponent;
    }

    public onExecute(): void {
        console.log('Component created:', this.mComponent.element.tagName);
    }

    public onDeconstruct(): void {
        console.log('Component destroyed:', this.mComponent.element.tagName);
    }
}
```

### Configuration

| Option | Type | Description |
|---|---|---|
| `access` | `AccessMode` | The access level of the extension. |
| `targetRestrictions` | `Array<InjectionConstructor>` | Which entity types this extension applies to. Use `[Component]` for component-level extensions. |

### Lifecycle Hooks

| Hook | Description |
|---|---|
| `onExecute()` | Called once when the target entity is set up. |
| `onDeconstruct()` | Called when the target entity is deconstructed. |

### Built-in Extensions

PWB includes these extension modules:

| Extension | Target | Description |
|---|---|---|
| Export Extension | `Component` | Implements `@PwbExport` by bridging component properties to the HTML element. |
| Component Event Listener (Component) | `Component` | Implements `@PwbComponentEventListener` for component-level event listeners. |
| Component Event Listener (Module) | Attribute/Expression modules | Implements `@PwbComponentEventListener` for module-level event listeners. |

### Example: Performance Monitoring Extension

```typescript
@PwbExtensionModule({
    access: AccessMode.Read,
    targetRestrictions: [Component]
})
class PerformanceExtension implements IExtensionOnExecute {
    public constructor(private mComponent = Injection.use(Component)) { }

    public onExecute(): void {
        const lElement = this.mComponent.element;
        const lStart = performance.now();

        // Log render time after initial update.
        requestAnimationFrame(() => {
            const lDuration = performance.now() - lStart;
            console.log(`${lElement.tagName} rendered in ${lDuration.toFixed(2)}ms`);
        });
    }
}
```

## Module Registration

All module types are registered globally when their decorated class is loaded. This means importing the module file is sufficient to make it available to all components:

```typescript
// In your application entry point:
import './modules/tooltip-module.ts';
import './modules/repeat-instruction.ts';
import './extensions/logging-extension.ts';
```

PWB does this internally for its built-in modules in the package `index.ts`.

## Injectable Context Summary

All module types receive context through dependency injection. Here is a summary of available injections by module type:

| Injection | Attribute | Expression | Instruction | Extension |
|---|---|---|---|---|
| `ModuleTargetNode` | Target element | Text node | -- | -- |
| `ModuleAttribute` | Attribute name/value | -- | -- | -- |
| `ModuleExpression` | -- | Expression string | Expression string | -- |
| `ModuleTemplate` | Template clone | Template clone | Template clone | -- |
| `ModuleDataLevel` | Data level | Data level | Data level | -- |
| `Component` | -- | -- | -- | Component instance |
| `ExtensionModule` | -- | -- | -- | Extension instance |
| `AttributeModule` | Module instance | -- | -- | -- |
| `ExpressionModule` | -- | Module instance | -- | -- |
| `InstructionModule` | -- | -- | Module instance | -- |

The `ModuleDataLevel` provides the `createExpressionProcedure(expression, extendedValues?)` method for evaluating expressions within the component data context. The returned `LevelProcedure` object has an `execute()` method that runs the expression and returns the result, and a `setTemporaryValue(name, value)` method for injecting temporary variables into the expression scope.
