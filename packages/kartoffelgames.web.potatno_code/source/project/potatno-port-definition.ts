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

	private readonly mLabel: string;
	private readonly mId: string;
	private readonly mPortType: PotatnoPortDefinitionType;
	private readonly mDataType: PotatnoProjectType<TProject> | null;
	private readonly mRegions: PotatnoPortDefinitionRegions;

	/**
	 * Display label for this port.
	 */
	public get label(): string {
		return this.mLabel;
	}

	/**
	 * Port identifier as registered on the node definition.
	 */
	public get id(): string {
		return this.mId;
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
	 * Regions this port adds to the graph when its output is traversed.
	 */
	public get regions(): PotatnoPortDefinitionRegions {
		return this.mRegions;
	}

	/**
	 * Constructor.
	 *
	 * @param pPortDefinition - Raw port definition data.
	 */
	protected constructor(pPortDefinition: PotatnoPortDefinitionConfiguration<TProject>) {
		this.mLabel = pPortDefinition.label;
		this.mId = pPortDefinition.id;
		this.mPortType = pPortDefinition.portType;

		// Only value ports have a data type, flow ports do not.
		if (pPortDefinition.portType === 'value') {
			this.mDataType = pPortDefinition.dataType;
		} else {
			this.mDataType = null;
		}

		this.mRegions = {
			add: pPortDefinition.regions?.add ?? new Array<string>(),
		};
	}
}

export type PotatnoPortDefinitionType = 'flow' | 'value';
export type PotatnoPortDefinitionDirection = 'input' | 'output';

/**
 * Regions an output port contributes to the graph when traversed.
 */
export type PotatnoPortDefinitionRegions = {
	/**
	 * Regions this port adds to the graph when its output is traversed.
	 */
	add: ReadonlyArray<string>;
};

/**
 * Definition of a port type used when registering node definitions.
 */

export type PotatnoPortDefinitionConfiguration<TProject extends PotatnoProject<any>> = {
	/**
	 * Display label for the port.
	 */
	label: string;

	/**
	 * Id of the port (used as the code-gen key, e.g. pContext.outputs["x"]).
	 */
	id: string;

	/**
	 * Regions this port adds to the graph when its output is traversed.
	 */
	regions?: Partial<PotatnoPortDefinitionRegions>;
} & ({
	/**
	 * Fixed type discriminator for flow ports.
	 */
	portType: 'flow';
} | {

	/**
	 * Fixed type discriminator for value ports.
	 */
	portType: 'value';

	/**
	 * Data type identifier for the port.
	 */
	dataType: PotatnoProjectType<TProject>;
});
