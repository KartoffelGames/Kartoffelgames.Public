/* istanbul ignore file */



/**
 * Library for data container and easier data access.
 *
 * @remarks 
 * This package consists mostly of helper classes and storage types, aimed at reducing code redundance and improving clarity.
 * 
 * @packageDocumentation
 */

// Container.
export { Dictionary } from './data_container/dictionary';
export { List } from './data_container/list';
export { Exception } from './exception/exception';
export { Stack } from './data_container/stack';

// Handler.
export { EnumUtil } from './util/enum-util';
export { TypeUtil } from './util/type-util';

// Interfaces.
export { IVoidParameterConstructor } from './interface/i-constructor';
export { ICloneable } from './interface/i-cloneable';
export { IDeconstructable } from './interface/i-deconstructable';

// Support types.
export { Writeable, Readonly, TypedArray, NoOptional } from './types';

// Algorythms
export { ChangeState, MyersDiff, HistoryItem } from './algorithm/myers-diff';