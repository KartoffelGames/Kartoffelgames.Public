import { PwbConfiguration } from "../../source/core/configuration/pwb-configuration.ts";

// @deno-types="npm:@types/jsdom"
import { JSDOM, DOMWindow } from 'npm:jsdom';

// Setup global scope.
export const MOCK_WINDOW: DOMWindow = (() => {
    const lMockDom: JSDOM = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', { pretendToBeVisual: true });

    // Define scope.
    PwbConfiguration.configuration.scope.window = lMockDom.window as unknown as typeof globalThis;
    PwbConfiguration.configuration.scope.document = lMockDom.window.document;

    // Define update metrics.
    PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
    PwbConfiguration.configuration.error.print = false;

    return lMockDom.window;
})();