/* eslint-disable @typescript-eslint/no-empty-interface */

// Extension processor base types..
export interface IPwbExtensionProcessor extends Partial<IPwbExtensionOnDeconstruct>, Partial<IPwbExtensionOnExecute>{ }
export interface IPwbExtensionProcessorClass {
    new(): IPwbExtensionProcessor;
}

export interface IPwbExtensionOnExecute {
    /**
     * Execute extension. Should be called right after construction.
     */
    onExecute(): void;
}

export interface IPwbExtensionOnDeconstruct {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onDeconstruct(): void;
}