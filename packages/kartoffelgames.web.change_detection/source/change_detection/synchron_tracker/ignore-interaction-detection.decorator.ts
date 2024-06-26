import { InteractionDetectionProxy } from './interaction-detection-proxy';

/**
 * AtScript. PWB attribute attribute module.
 * 
 * @param pSettings - Module settings.
 */
export function IgnoreInteractionDetection(pConstructor: any): void {
    InteractionDetectionProxy.ignoreClass(pConstructor);
}

