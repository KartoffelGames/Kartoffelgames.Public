/**
 * Direction of a port on a node, indicating whether it receives or sends data.
 */
export enum PortDirection {
    /** Port that receives data into the node. */
    Input = 'input',
    /** Port that sends data out of the node. */
    Output = 'output'
}
