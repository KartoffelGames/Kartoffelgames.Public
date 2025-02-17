// Import original expect as renamed function.
import { expect as originalExpect } from "@std/expect";


// Import extensions.
import './extensions/deep-equal.ts';

// Import merged interface.
import { type ExtendedExpected } from './extended-expected.interface.ts';

// Export new expect function.
export const expect = originalExpect<ExtendedExpected>;