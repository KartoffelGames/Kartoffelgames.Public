/**
 * Library for data container and easier data access.
 *
 * @remarks 
 * This package consists mostly of helper classes and storage types, aimed at reducing code redundance and improving clarity.
 * 
 * @packageDocumentation
 */

// Container.
export { Dictionary } from './data_container/dictionary.ts';
export { List } from './data_container/list.ts';
export { Stack } from './data_container/stack.ts';
export { Exception } from './exception/exception.ts';
export { LinkedList } from './data_container/linked-list.ts';

// Handler.
export { EnumUtil } from './util/enum-util.ts';
export { TypeUtil } from './util/type-util.ts';

// Interfaces.
export { type ICloneable } from './interface/i-cloneable.ts';
export { type IVoidParameterConstructor } from './interface/i-constructor.ts';
export { type IDeconstructable } from './interface/i-deconstructable.ts';

// Support types.
export { type Readonly, type Writeable } from './types.ts';

// Algorythms
export { ChangeState, MyersDiff, type HistoryItem } from './algorithm/myers-diff.ts';
