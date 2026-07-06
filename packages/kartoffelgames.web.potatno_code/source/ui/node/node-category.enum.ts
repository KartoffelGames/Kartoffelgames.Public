/**
 * System-reserved node category constants.
 * Users can define custom category strings for their node definitions.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NodeCategory {
    /** Callable function node. */
    export const Function: string = 'function';
    /** Non-functional comment annotation node. */
    export const Comment: string = 'comment';
    /** External input entry point node. */
    export const Input: string = 'input';
    /** External output exit point node. */
    export const Output: string = 'output';
    /** Reroute passthrough node. */
    export const Reroute: string = 'reroute';
}