import { InteractionDetectionConstructor, InteractionDetectionProxy } from './interaction-detection-proxy';

/**
 * AtScript. PWB attribute attribute module.
 * 
 * @param pSettings - Module settings.
 */
export function IgnoreInteractionDetection(pConstructor: InteractionDetectionConstructor): void {
    InteractionDetectionProxy.ignoreClass(pConstructor);
}

