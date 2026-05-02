import { PotatnoProjectType } from "./potatno-project-types-definition.ts";
import { PotatnoProject } from "./potatno-project.ts";

/**
 * Definition of a port on a node, used for type checking and code generation.
 */
export class PotatnoPortDefinition<TProject extends PotatnoProject<any>> {
	/**
	 * Create a new PotatnoPortDefinition from the given port configuration.
	 *
	 * @param pPortDefinition - Raw port configuration object.
	 */
	public static new<TProject extends PotatnoProject<any>>(pPortDefinition: PotatnoPortDefinitionConfiguration<TProject>): PotatnoPortDefinition<TProject> {
		return new PotatnoPortDefinition(pPortDefinition);
	}

	private readonly mName: string;
	private readonly mPortType: PotatnoPortDefinitionType;
	private readonly mDataType: PotatnoProjectType<TProject> | null;

	/**
	 * Port name as registered on the node definition.
	 */
	public get name(): string {
		return this.mName;
	}

	/**
	 * Port kind discriminator.
	 */
	public get portType(): PotatnoPortDefinitionType {
		return this.mPortType;
	}

	/**
	 * Data type identifier when the port carries a typed value.
	 */
	public get dataType(): PotatnoProjectType<TProject> | null {
		return this.mDataType;
	}

	/**
	 * Constructor.
	 *
	 * @param pName - Registered port name.
	 * @param pDefinition - Raw port definition data.
	 */
	protected constructor(pPortDefinition: PotatnoPortDefinitionConfiguration<TProject>) {
		this.mName = pPortDefinition.name;
		this.mPortType = pPortDefinition.portType;

		// Only value ports have a data type, flow ports do not.
		if (pPortDefinition.portType === 'value') {
			this.mDataType = pPortDefinition.dataType;
		} else {
			this.mDataType = null;
		}
	}
}

export type PotatnoPortDefinitionType = 'flow' | 'value';
export type PotatnoPortDefinitionDirection = 'input' | 'output';

/**
 * Definition of a port type used when registering node definitions.
 */

export type PotatnoPortDefinitionConfiguration<TProject extends PotatnoProject<any>> = {
	/**
	 * Name of the port.
	 */
	name: string;

	/** 
	 * Fixed type discriminator for flow ports.
	 */
	portType: 'flow';
} | {
	/**
	 * Name of the port.
	 */
	name: string;

	/**
	 * Fixed type discriminator for value ports.
	 */
	portType: 'value';

	/** 
	 * Data type identifier for the port.
	 */
	dataType: PotatnoProjectType<TProject>;
};