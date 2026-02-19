# Global Resources

The `@PwbGlobalResource` decorator makes a static class available as a global variable inside template expressions across all components. This enables shared state and utility functions that any component can access without explicit imports or dependency injection.

## @PwbGlobalResource Decorator

```typescript
import { PwbGlobalResource } from '@kartoffelgames/web-potato-web-builder';

@PwbGlobalResource()
class AppConfig {
    private static mTheme: string = 'light';

    public static getTheme(): string {
        return this.mTheme;
    }

    public static setTheme(value: string): void {
        this.mTheme = value;
    }
}
```

After decoration, the class is available by name in any component's template expressions.

## Using Global Resources in Templates

The decorated class name becomes a global identifier accessible via `this` in expressions:

```typescript
@PwbGlobalResource()
class Counter {
    private static mCount: number = 0;

    public static getCount(): number {
        return this.mCount;
    }

    public static increment(): void {
        this.mCount++;
    }
}

@PwbComponent({
    selector: 'counter-display',
    template: '<div>Count: {{Counter.getCount()}}</div>'
})
class CounterDisplay extends Processor { }

@PwbComponent({
    selector: 'counter-button',
    template: '<button (click)="Counter.increment()">+1</button>'
})
class CounterButton extends Processor { }
```

Both `CounterDisplay` and `CounterButton` reference `Counter` directly in their templates without any import or binding. When `Counter.increment()` is called, all components that reference `Counter.getCount()` are updated because the global resource is proxy-tracked.

## Proxy-Based Reactivity

`@PwbGlobalResource` wraps the class in a `CoreEntityProcessorProxy`, which tracks all property reads and writes on the static class. This means:

- When a component template reads from a global resource (e.g., `Counter.getCount()`), the framework records that the component depends on that resource.
- When a global resource's static property changes, the framework knows which components need to re-render.
- Changes to global resources trigger updates in all dependent components across the application.

## Shared State Between Components

Global resources are the primary mechanism for sharing state between unrelated components:

```typescript
@PwbGlobalResource()
class UserSession {
    private static mUser: string | null = null;
    private static mLoggedIn: boolean = false;

    public static get user(): string | null {
        return this.mUser;
    }

    public static get isLoggedIn(): boolean {
        return this.mLoggedIn;
    }

    public static login(username: string): void {
        this.mUser = username;
        this.mLoggedIn = true;
    }

    public static logout(): void {
        this.mUser = null;
        this.mLoggedIn = false;
    }
}

@PwbComponent({
    selector: 'user-greeting',
    template: `
        $if(UserSession.isLoggedIn) {
            <p>Welcome, {{UserSession.user}}</p>
        }
        $if(!UserSession.isLoggedIn) {
            <p>Please log in</p>
        }
    `
})
class UserGreeting extends Processor { }

@PwbComponent({
    selector: 'login-form',
    template: `
        $if(!UserSession.isLoggedIn) {
            <button (click)="UserSession.login('Alice')">Log in as Alice</button>
        }
        $if(UserSession.isLoggedIn) {
            <button (click)="UserSession.logout()">Log out</button>
        }
    `
})
class LoginForm extends Processor { }
```

Clicking "Log in as Alice" in `LoginForm` updates `UserSession`, which triggers `UserGreeting` to re-render and show "Welcome, Alice".

## How It Works Internally

The `@PwbGlobalResource` decorator:

1. Creates a `CoreEntityProcessorProxy` around the class constructor. This wraps the class itself (not instances) in a proxy that tracks static property access and modification.
2. Assigns the proxied class to `globalThis[className]`, making it globally available.
3. Returns the proxied class so that any direct code references also use the tracked version.

Because the proxy is applied to the class itself (not instances), only static members are tracked and accessible in templates.

## Restrictions

- Global resources must use **static** members. Instance members are not accessible in templates because the class is never instantiated by the framework.
- The class name must be a valid JavaScript identifier since it is assigned to `globalThis`.
- Global resources are application-wide. There is no scoping to specific components or modules.

## Related

- [Template Syntax](template-syntax.md) -- Using global resources in expressions
- [Data Binding](data-binding.md) -- How expressions access global resources
- [Update System](update-system.md) -- How proxy tracking triggers updates
- [Components](components.md) -- Component-level state vs. global state
