# Custom Modules

PWB's template processing is powered by a module system. The framework ships with built-in modules for data binding, events, control flow, and other features, but the system is designed to be extended with custom modules. There are three module types: attribute modules, expression modules, and instruction modules.

All modules extend `Processor` and receive their dependencies through constructor injection.

## Module Types Overview

| Module Type | Purpose | Template Syntax | Examples |
|-------------|---------|-----------------|----------|
| Attribute Module | Processes attributes on XML elements | `[attr]`, `[(attr)]`, `(event)`, `#id` | One-way binding, two-way binding, events, child refs |
| Expression Module | Evaluates text expressions | `{{expr}}` | Mustache expressions |
| Instruction Module | Controls DOM structure | `$name(expr) { ... }` | `$if`, `$for`, `$slot`, `$dynamic-content` |

## Attribute Modules

Attribute modules process attributes on template elements. They are matched by a regex selector against the attribute name.

### @PwbAttributeModule Decorator

```typescript
import {
    PwbAttributeModule, Processor,
    AccessMode, UpdateTrigger
} from '@kartoffelgames/web-potato-web-builder';

@PwbAttributeModule({
    access: AccessMode,      // Read, ReadWrite, or Write
    selector: RegExp,        // Regex to match attribute names
    trigger: UpdateTrigger   // When to trigger updates
})
class MyModule extends Processor { }
```

#### Configuration Properties

- **access** (`AccessMode`): Determines how the module interacts with the target element.
  - `AccessMode.Read` -- The module reads from the component data and writes to the element.
  - `AccessMode.Write` -- The module writes to the component data based on element state.
  - `AccessMode.ReadWrite` -- Bidirectional interaction.

- **selector** (`RegExp`): A regular expression matched against attribute names. If the regex matches, this module is instantiated for that attribute.

- **trigger** (`UpdateTrigger`): A bitmask of conditions that trigger the module's `onUpdate` method. See [Update System](update-system.md).

### Injectable Dependencies

Inside an attribute module constructor, these dependencies are available:

| Injection | Type | Description |
|-----------|------|-------------|
| `ModuleTargetNode` | `Element` / `Node` | The DOM element the attribute belongs to |
| `ModuleDataLevel` | `ModuleDataLevel` | Data scope for creating expressions |
| `ModuleAttribute` | `ModuleAttribute` | The matched attribute's name and value |
| `AttributeModule` | `AttributeModule` | The module manager (for registering objects) |

### Lifecycle Interfaces

| Interface | Method | When Called |
|-----------|--------|------------|
| `IAttributeOnUpdate` | `onUpdate(): boolean` | On each update cycle (if trigger matches). Return `true` if the DOM was changed. |
| `IAttributeOnDeconstruct` | `onDeconstruct(): void` | When the module is being destroyed. |

### Example: Custom Tooltip Module

This module reads a `tooltip` attribute and creates a tooltip on hover:

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import {
    PwbAttributeModule, Processor, ModuleTargetNode,
    ModuleDataLevel, ModuleAttribute,
    AccessMode, UpdateTrigger
} from '@kartoffelgames/web-potato-web-builder';
import type { IAttributeOnUpdate, IAttributeOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';

@PwbAttributeModule({
    access: AccessMode.Read,
    selector: /^tooltip$/,
    trigger: UpdateTrigger.Any
})
class TooltipModule extends Processor implements IAttributeOnUpdate, IAttributeOnDeconstruct {
    private readonly mElement: HTMLElement;
    private readonly mProcedure: LevelProcedure<string>;
    private mTooltipElement: HTMLDivElement | null = null;

    public constructor(
        pTarget = Injection.use(ModuleTargetNode),
        pData = Injection.use(ModuleDataLevel),
        pAttr = Injection.use(ModuleAttribute)
    ) {
        super();
        this.mElement = pTarget as HTMLElement;
        this.mProcedure = pData.createExpressionProcedure(pAttr.value);
    }

    public onUpdate(): boolean {
        const text = this.mProcedure.execute();
        this.mElement.title = text ?? '';
        return true;
    }

    public onDeconstruct(): void {
        this.mElement.title = '';
    }
}
```

Usage in a template:

```typescript
@PwbComponent({
    selector: 'tooltip-demo',
    template: '<button tooltip="this.helpText">Hover me</button>'
})
class TooltipDemo extends Processor {
    public helpText: string = 'Click to submit';
}
```

### Example: Built-in One-Way Binding

The built-in one-way binding module demonstrates the attribute module pattern:

```typescript
@PwbAttributeModule({
    access: AccessMode.Read,
    selector: /^\[[\w$]+\]$/,     // Matches [propertyName]
    trigger: UpdateTrigger.Any
})
class OneWayBindingAttributeModule extends Processor implements IAttributeOnUpdate {
    private mLastValue: any;
    private readonly mProcedure: LevelProcedure<any>;
    private readonly mTarget: Node;
    private readonly mTargetProperty: string;

    public constructor(
        pTargetNode = Injection.use(ModuleTargetNode),
        pModuleValues = Injection.use(ModuleDataLevel),
        pModuleAttribute = Injection.use(ModuleAttribute)
    ) {
        super();
        this.mTarget = pTargetNode;
        this.mProcedure = pModuleValues.createExpressionProcedure(pModuleAttribute.value);
        // Extract property name: [value] -> value
        this.mTargetProperty = pModuleAttribute.name.substring(1, pModuleAttribute.name.length - 1);
        this.mLastValue = Symbol('Uncomparable');
    }

    public onUpdate(): boolean {
        const result = this.mProcedure.execute();
        if (result === this.mLastValue) {
            return false;
        }
        this.mLastValue = result;
        Reflect.set(this.mTarget, this.mTargetProperty, result);
        return true;
    }
}
```

## Expression Modules

Expression modules control how `{{ }}` expressions inside text content are evaluated. The default is the mustache expression module, which evaluates the expression in the component's data scope.

### @PwbExpressionModule Decorator

```typescript
import {
    PwbExpressionModule, Processor, UpdateTrigger
} from '@kartoffelgames/web-potato-web-builder';

@PwbExpressionModule({
    trigger: UpdateTrigger   // When to trigger updates
})
class MyExpressionModule extends Processor { }
```

#### Configuration Properties

- **trigger** (`UpdateTrigger`): When the expression should be re-evaluated.

### Injectable Dependencies

| Injection | Type | Description |
|-----------|------|-------------|
| `ModuleDataLevel` | `ModuleDataLevel` | Data scope for creating expressions |
| `ModuleExpression` | `ModuleExpression` | The raw expression string inside `{{ }}` |

### Lifecycle Interfaces

| Interface | Method | When Called |
|-----------|--------|------------|
| `IExpressionOnUpdate` | `onUpdate(): string \| null` | On each update cycle. Return the new text value, or `null` if unchanged. |
| `IExpressionOnDeconstruct` | `onDeconstruct(): void` | When the module is being destroyed. |

### Example: Custom Expression Module

A custom expression module that always returns a static value regardless of the expression content:

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import {
    PwbExpressionModule, Processor, UpdateTrigger
} from '@kartoffelgames/web-potato-web-builder';
import type { IExpressionOnUpdate } from '@kartoffelgames/web-potato-web-builder';

@PwbExpressionModule({
    trigger: UpdateTrigger.Any
})
class StaticExpressionModule extends Processor implements IExpressionOnUpdate {
    public onUpdate(): string {
        return 'STATIC-VALUE';
    }
}
```

To use a custom expression module, assign it to a component's `expressionmodule` option:

```typescript
@PwbComponent({
    selector: 'custom-expr-demo',
    template: '<div>{{anything here is ignored}}</div>',
    expressionmodule: StaticExpressionModule
})
class CustomExprDemo extends Processor { }
```

All `{{ }}` expressions in this component will be handled by `StaticExpressionModule` instead of the default mustache module.

### Built-in Mustache Expression Module

The default module evaluates the expression string in the component's data scope:

```typescript
@PwbExpressionModule({
    trigger: UpdateTrigger.Any & ~UpdateTrigger.UntrackableFunctionCall
})
class MustacheExpressionModule extends Processor implements IExpressionOnUpdate {
    private readonly mProcedure: LevelProcedure<any>;

    public constructor(
        pModuleValues = Injection.use(ModuleDataLevel),
        pModuleExpression = Injection.use(ModuleExpression)
    ) {
        super();
        this.mProcedure = pModuleValues.createExpressionProcedure(pModuleExpression.value);
    }

    public onUpdate(): string | null {
        const result = this.mProcedure.execute();
        if (typeof result === 'undefined') {
            return null;
        }
        return result?.toString();
    }
}
```

## Instruction Modules

Instruction modules control DOM structure by conditionally creating, removing, or multiplying template fragments. They handle the `$instructionName(expression) { ... }` syntax.

### @PwbInstructionModule Decorator

```typescript
import {
    PwbInstructionModule, Processor, UpdateTrigger
} from '@kartoffelgames/web-potato-web-builder';

@PwbInstructionModule({
    instructionType: string,    // The instruction name (after $)
    trigger: UpdateTrigger      // When to trigger updates
})
class MyInstructionModule extends Processor { }
```

#### Configuration Properties

- **instructionType** (`string`): The instruction name that follows the `$` prefix. For example, `'if'` matches `$if(...)`.
- **trigger** (`UpdateTrigger`): When the instruction should be re-evaluated.

### Injectable Dependencies

| Injection | Type | Description |
|-----------|------|-------------|
| `ModuleTemplate` | `PwbTemplateInstructionNode` | The instruction's template node (including child content) |
| `ModuleDataLevel` | `ModuleDataLevel` | Data scope for creating expressions |
| `ModuleExpression` | `ModuleExpression` | The expression inside the parentheses |
| `ComponentDataLevel` | `ComponentDataLevel` | Component-level data access |

### Lifecycle Interfaces

| Interface | Method | When Called |
|-----------|--------|------------|
| `IInstructionOnUpdate` | `onUpdate(): InstructionResult \| null` | On each update cycle. Return an `InstructionResult` with elements to render, or `null` for no change. |
| `IInstructionOnDeconstruct` | `onDeconstruct(): void` | When the module is being destroyed. |

### InstructionResult

The `InstructionResult` class is the return type for instruction module updates. It holds a list of template/data-level pairs that determine what gets rendered.

```typescript
import { InstructionResult, DataLevel } from '@kartoffelgames/web-potato-web-builder';

const result = new InstructionResult();

// Add a template element with its associated data scope
result.addElement(template, dataLevel);

// Access the element list
const elements = result.elementList;
// Each element: { template: PwbTemplate, dataLevel: DataLevel }
```

- Returning an `InstructionResult` with no elements removes all child content from the DOM.
- Returning `null` signals that nothing has changed and no DOM update is needed.
- Adding multiple elements renders each template with its own data scope (used by `$for` for iteration).

### Example: Custom Repeat Instruction

A custom instruction that repeats its content a specified number of times:

```typescript
import { Injection } from '@kartoffelgames/core-dependency-injection';
import {
    PwbInstructionModule, Processor, UpdateTrigger,
    InstructionResult, DataLevel, ModuleDataLevel, ModuleExpression, ModuleTemplate
} from '@kartoffelgames/web-potato-web-builder';
import type { IInstructionOnUpdate, PwbTemplateInstructionNode } from '@kartoffelgames/web-potato-web-builder';

@PwbInstructionModule({
    instructionType: 'repeat',
    trigger: UpdateTrigger.Any
})
class RepeatInstruction extends Processor implements IInstructionOnUpdate {
    private readonly mModuleValues: ModuleDataLevel;
    private readonly mProcedure: LevelProcedure<number>;
    private readonly mTemplate: PwbTemplateInstructionNode;
    private mLastCount: number = -1;

    public constructor(
        pTemplate = Injection.use(ModuleTemplate),
        pModuleData = Injection.use(ModuleDataLevel),
        pExpression = Injection.use(ModuleExpression)
    ) {
        super();
        this.mTemplate = pTemplate as PwbTemplateInstructionNode;
        this.mModuleValues = pModuleData;
        this.mProcedure = pModuleData.createExpressionProcedure(pExpression.value);
    }

    public onUpdate(): InstructionResult | null {
        const count = this.mProcedure.execute();

        if (count === this.mLastCount) {
            return null; // No change
        }

        this.mLastCount = count;
        const result = new InstructionResult();

        for (let i = 0; i < count; i++) {
            const dataLevel = new DataLevel(this.mModuleValues.data);
            dataLevel.setTemporaryValue('$repeatIndex', i);

            const template = new PwbTemplate();
            template.appendChild(...this.mTemplate.childList);

            result.addElement(template, dataLevel);
        }

        return result;
    }
}
```

Usage:

```typescript
@PwbComponent({
    selector: 'repeat-demo',
    template: `
        $repeat(this.count) {
            <div>Repeated item {{this.$repeatIndex}}</div>
        }
    `
})
class RepeatDemo extends Processor {
    @PwbExport
    public count: number = 3;
}
```

### Built-in Instruction Modules

| Instruction | Module | Description |
|-------------|--------|-------------|
| `$if` | `IfInstructionModule` | Conditionally renders content based on truthiness |
| `$for` | `ForInstructionModule` | Iterates over arrays, objects, or generators |
| `$slot` | `SlotInstructionModule` | Creates a `<slot>` element for content projection |
| `$dynamic-content` | `DynamicContentInstructionModule` | Renders a programmatically created `PwbTemplate` |

## Creating Expression Procedures

The `ModuleDataLevel` class provides `createExpressionProcedure` for compiling expressions:

```typescript
const procedure = moduleDataLevel.createExpressionProcedure(
    'this.items.length * 2',     // Expression string
    ['$extraVar']                 // Optional: names of external variables
);

// Set external variable values
procedure.setTemporaryValue('$extraVar', someValue);

// Execute the expression
const result = procedure.execute();
```

The `LevelProcedure`:
- Is compiled once via `new Function()` and reused on each update.
- Executes with `this` bound to the data level's store proxy.
- Can define external variables that are available in addition to the data scope.
- Throws if you try to set a temporary value that was not declared in the extended values list.

## Module Registration

Modules are registered globally when their decorator executes. The framework's `CoreEntityRegister` maintains the registry. When a template is built, each attribute and expression is checked against registered module selectors.

- **Attribute modules** are matched by testing the attribute name against each module's `selector` regex.
- **Expression modules** are used per-component (specified in `@PwbComponent`'s `expressionmodule` option or the default mustache module).
- **Instruction modules** are matched by the instruction type string (the name after `$`).

## Related

- [Template Syntax](template-syntax.md) -- How modules integrate with template parsing
- [Extensions](extensions.md) -- Cross-cutting lifecycle hooks
- [Update System](update-system.md) -- UpdateTrigger and update cycles
- [Control Flow](control-flow.md) -- Built-in instruction modules in detail
