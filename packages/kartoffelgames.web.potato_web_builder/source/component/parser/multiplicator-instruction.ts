import { BaseXmlNode } from '@kartoffelgames/core.xml';

/**
 * Multiplicator node.
 * 
 * Implied syntax for templates are:
 * ``` PwbTemplate
 * @@Single(Instruction)
 * 
 * @Multi(Instruction) {
 *  <MoreContent />
 * }
 * ```
 */
export class MultiplicatorInstruction extends BaseXmlNode {
    private mInstruction: string;
    private mInstructionType: string;
    private mNodeType: MultiplicatorInstructionType; // TODO: Maybe better names. 

    /**
     * Get default namespace.
     */
    public get defaultNamespace(): string | null {
        // Get parent mapping.
        return this.parent?.defaultNamespace ?? null;
    }

    /**
     * Multiplicator nodes instruction.
     */
    public get instruction(): string {
        return this.mInstruction;
    } set instruction(pValue: string) {
        this.mInstruction = pValue;
    }

    /**
     * Instruction type.
     */
    public get instructionType(): string {
        return this.mInstructionType;
    } set instructionType(pValue: string) {
        this.mInstructionType = pValue;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mTypeName = '';
        this.mInstruction = '';
    }

    /**
     * Clone multiplicator node.
     * 
     * @returns new instance of current node with the same data.
     */
    override clone(): BaseXmlNode {
        const lClone: MultiplicatorInstruction = new MultiplicatorInstruction();
        lClone.instruction = this.instruction;
        lClone.typeName = this.typeName;

        return lClone;
    }

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     * 
     * @returns if the set node is equal to this node.
     */
    override equals(pBaseNode: BaseXmlNode): boolean {
        // Check type, tagname, namespace and namespace prefix.
        if (!(pBaseNode instanceof MultiplicatorInstruction)) {
            return false;
        }

        // Same base type.
        if (this.mTypeName !== pBaseNode.mTypeName) {
            return false;
        }

        // Same instruction set.
        if (this.mInstruction !== pBaseNode.mInstruction) {
            return false;
        }

        return true;
    }
}

type MultiplicatorInstructionType = 'single' | 'multi';