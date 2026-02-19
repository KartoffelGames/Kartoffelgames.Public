# Application

`PwbApplication` is the top-level container for a PWB application. It provides an isolated execution context, configuration, error handling, global styles, and a mount point for component trees.

## Creating an Application

```typescript
import { PwbApplication } from '@kartoffelgames/web-potato-web-builder';

PwbApplication.new('my-app', (app) => {
    app.addContent(RootComponent);
}, document.body);
```

### PwbApplication.new

```typescript
PwbApplication.new(
    name: string,
    callback: (app: PwbApplication) => void,
    target?: Element
): void
```

- **name**: A name for the application (used for identification and debugging).
- **callback**: A function that receives the `PwbApplication` instance. All setup (adding content, styles, error listeners, and configuration) is done inside this callback.
- **target** (optional): A DOM element to append the application to. If omitted, the application is created but not attached to the DOM. Use `app.appendTo(element)` later to attach it.

The callback runs inside the application's execution context. All components created within this context inherit the application's configuration.

## Adding Content

```typescript
PwbApplication.new('app', (app) => {
    app.addContent(HeaderComponent);
    app.addContent(MainContent);
    app.addContent(FooterComponent);
}, document.body);
```

`addContent(processorConstructor)` creates an instance of the given component and appends it to the application container. Multiple components can be added as siblings. Components are constructed asynchronously after the application is attached to the DOM via `appendTo`.

## Adding Global Styles

```typescript
PwbApplication.new('app', (app) => {
    app.addStyle(`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; }
    `);

    app.addContent(AppRoot);
}, document.body);
```

`addStyle(css)` injects a `<style>` element into the application container. These styles are **not** inside a Shadow DOM, so they apply globally to the document. However, they cannot penetrate component Shadow DOM barriers.

This is useful for:
- Document-level resets and base styles
- Splash screen styling
- Styles for the application container itself

## Error Handling

```typescript
PwbApplication.new('app', (app) => {
    app.addErrorListener((error) => {
        console.error('Uncaught application error:', error);
        // Return false to prevent default error behavior (e.g., console printing)
        return false;
    });

    app.addContent(AppRoot);
}, document.body);
```

`addErrorListener(listener)` registers a listener for uncaught errors within the application context.

- The listener receives the error object.
- Returning `false` (literally the value `false`, not just a falsy value) prevents the default error handling (such as printing to the console).
- Multiple error listeners can be registered. They are all called when an error occurs.

## Appending to DOM

If no target element is provided to `PwbApplication.new`, the application can be appended later:

```typescript
PwbApplication.new('deferred-app', (app) => {
    app.addContent(AppRoot);

    // Later...
    app.appendTo(document.getElementById('app-container')!);
});
```

## Configuration

The application configuration controls error handling, debug logging, splash screen, and update behavior.

### Accessing Configuration

```typescript
PwbApplication.new('app', (app) => {
    const config = app.configuration;
    // Modify configuration properties...
});
```

### Error Configuration

```typescript
app.configuration.error.ignore   // boolean - Ignore all errors (default: false)
app.configuration.error.print    // boolean - Print errors to console (default: true)
```

### Logging Configuration

```typescript
app.configuration.logging.filter             // PwbApplicationDebugLoggingType - Filter for debug log types
app.configuration.logging.updatePerformance  // boolean - Log update performance metrics
app.configuration.logging.updaterTrigger     // boolean - Log what triggered each update
app.configuration.logging.updateReshedule    // boolean - Log when updates are rescheduled
```

### Splash Screen Configuration

```typescript
app.configuration.splashscreen.background     // string - CSS background for splash screen
app.configuration.splashscreen.content        // string - HTML content for splash screen
app.configuration.splashscreen.manual         // boolean - Manual dismiss of splash screen
app.configuration.splashscreen.animationTime  // number - Fade-out animation duration in ms
```

### Updating Configuration

```typescript
app.configuration.updating.frameTime  // number - Minimum time between update frames (default: 100ms)
app.configuration.updating.stackCap   // number - Maximum update stack depth (default: 10)
```

- **frameTime**: The minimum interval in milliseconds between update cycles. Lower values make updates more responsive but consume more CPU. The default of 100ms means the framework checks for changes at most 10 times per second.
- **stackCap**: The maximum number of cascading updates allowed in a single cycle. If an update triggers another update which triggers another, this cap prevents infinite loops.

### Default Configuration

A static default configuration is available at `PwbApplicationConfiguration.DEFAULT`. Components created outside of an explicit `PwbApplication` context use this default configuration.

## Complete Example

```typescript
import { PwbApplication, PwbComponent, Processor, PwbExport } from '@kartoffelgames/web-potato-web-builder';

@PwbComponent({
    selector: 'app-header',
    template: '<header><h1>{{this.title}}</h1></header>',
    style: 'header { background: #333; color: white; padding: 16px; }'
})
class AppHeader extends Processor {
    @PwbExport
    public title: string = 'My Application';
}

@PwbComponent({
    selector: 'app-content',
    template: '<main><p>Application content goes here.</p></main>',
    style: 'main { padding: 16px; }'
})
class AppContent extends Processor { }

PwbApplication.new('my-application', (app) => {
    // Configure
    app.configuration.error.print = true;
    app.configuration.updating.frameTime = 50;

    // Global styles
    app.addStyle(`
        body { margin: 0; font-family: system-ui, sans-serif; }
    `);

    // Error handling
    app.addErrorListener((error) => {
        // Send to error reporting service
        console.error('[App Error]', error);
    });

    // Mount components
    app.addContent(AppHeader);
    app.addContent(AppContent);

}, document.body);
```

## When to Use PwbApplication

`PwbApplication` is optional. Components can be used standalone by simply defining them with `@PwbComponent` and placing them in HTML. `PwbApplication` becomes useful when:

- You need a structured entry point for the application
- You want application-wide error handling
- You need to configure update timing or debug logging
- You want to inject global styles outside of component Shadow DOMs
- You need a splash screen during initial load

## Related

- [Components](components.md) -- Component creation and lifecycle
- [Update System](update-system.md) -- Update timing configuration
- [Getting Started](getting-started.md) -- Application setup walkthrough
