// Import original expect as renamed function.
import { expect as originalExpect } from '@std/expect';

// Import extensions.
import './extensions/to-be-deep-equal.ts';
import './extensions/to-have-ordered-items.ts';
import './extensions/to-be-component-structure.ts';

// Import merged interface.
import type { ExtendedExpected } from './extended-expected.interface.ts';

// Export new expect function.
// eslint-disable-next-line @typescript-eslint/naming-convention
export const expect: ((value: unknown, customMessage?: string) =>  ExtendedExpected) = originalExpect<ExtendedExpected>;