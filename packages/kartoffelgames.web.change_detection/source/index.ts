/* istanbul ignore file */

export { CompareHandler } from './comparison/compare-handler';
export { ChangeDetection } from './change_detection/change-detection';
export { ChangeDetectionReason as ChangeReason } from './change_detection/change-detection-reason';

// Difference search
export { MyersDiff, HistoryItem, ChangeState } from './comparison/myers-diff';