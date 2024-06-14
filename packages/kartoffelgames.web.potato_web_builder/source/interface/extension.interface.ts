/* eslint-disable @typescript-eslint/no-empty-interface */

// Extension processor base types..
export interface IPwbExtensionModuleProcessor extends Partial<IPwbExtensionModuleOnDeconstruct>, Partial<IPwbExtensionModuleOnExecute>{ }
export interface IPwbExtensionModuleProcessorConstructor {
    new(): IPwbExtensionModuleProcessor;
}

export interface IPwbExtensionModuleOnExecute {
    /**
     * Execute extension. Should be called right after construction.
     */
    onExecute(): void;
}

export interface IPwbExtensionModuleOnDeconstruct {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onDeconstruct(): void;
}