/* eslint-disable @typescript-eslint/no-empty-interface */

// Extension processor base types..
export interface IPwbExtensionProcessor extends IPwbExtensionOnDeconstruct { }
export interface IPwbExtensionProcessorClass {
    new(): IPwbExtensionProcessor;
}

export interface IPwbExtensionOnDeconstruct {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onDeconstruct(): void;
}