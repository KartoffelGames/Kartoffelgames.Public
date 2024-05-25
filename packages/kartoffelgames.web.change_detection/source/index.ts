/* istanbul ignore file */

export { CompareHandler } from './comparison/compare-handler';

// Interaction zone.
export { InteractionZone } from './change_detection/interaction-zone';
export { InteractionReason } from './change_detection/interaction-reason';
export { InteractionResponseType } from './change_detection/enum/interaction-response-type.enum';

// Difference search
export { MyersDiff, HistoryItem, ChangeState } from './comparison/myers-diff';