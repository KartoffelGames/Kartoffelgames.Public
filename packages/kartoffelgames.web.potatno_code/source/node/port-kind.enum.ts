/**
 * Kind of port distinguishing data connections from execution flow connections.
 */
export enum PortKind {
    /** Port that carries a data value. */
    Data = 'data',
    /** Port that carries execution flow control. */
    Flow = 'flow'
}
