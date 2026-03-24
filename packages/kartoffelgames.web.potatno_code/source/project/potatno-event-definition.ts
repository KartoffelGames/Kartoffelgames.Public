import type { PotatnoPortDefinition } from '../node/potatno-port-definition.ts';

/**
 * Definition of an event entry point within a main function.
 * Events have no inputs, an automatic exec flow output, and optional data outputs.
 */
export interface PotatnoEventDefinition {
    /** Display name of the event. */
    readonly name: string;
    /** Optional data output port definitions. */
    readonly outputs: Array<PotatnoPortDefinition>;
}
