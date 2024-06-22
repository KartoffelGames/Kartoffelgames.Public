/* istanbul ignore file */
export { CompareHandler } from './comparison/compare-handler';

// Interaction zone.
export { InteractionZone } from './change_detection/interaction-zone';
export { InteractionReason } from './change_detection/interaction-reason';
export { InteractionResponseType } from './change_detection/enum/interaction-response-type.enum';
export { IgnoreInteractionDetection } from './change_detection/synchron_tracker/ignore-interaction-detection.decorator';

// Difference search
export { MyersDiff, HistoryItem, ChangeState } from './comparison/myers-diff';

import { Patcher } from './change_detection/asynchron_tracker/patcher/patcher';


// Patch for execution zone.
Patcher.patch(globalThis);