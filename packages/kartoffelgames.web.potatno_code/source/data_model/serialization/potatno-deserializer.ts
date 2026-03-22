import type { PotatnoEditorConfiguration } from '../configuration/potatno-editor-configuration.ts';
import type { PotatnoNodeDefinition } from '../configuration/potatno-node-definition.ts';
import { NodeCategory } from '../enum/node-category.enum.ts';
import { PortDirection } from '../enum/port-direction.enum.ts';
import { PortKind } from '../enum/port-kind.enum.ts';
import { PotatnoConnection } from '../graph/potatno-connection.ts';
import { PotatnoFlowPort } from '../graph/potatno-flow-port.ts';
import { PotatnoNode } from '../graph/potatno-node.ts';
import { PotatnoPort } from '../graph/potatno-port.ts';
import { PotatnoFunction } from '../function/potatno-function.ts';
import { PotatnoProject } from '../function/potatno-project.ts';

/**
 * Marker data extracted from a code string.
 */
interface MarkerData {
    id: string;
    meta: Record<string, any>;
    innerCode: string;
    children: Array<MarkerData>;
}

/**
 * Parses a code string with __POTATNO_START / __POTATNO_END markers back into a PotatnoProject.
 */
export class PotatnoDeserializer {
    private readonly mConfig: PotatnoEditorConfiguration;

    public constructor(pConfig: PotatnoEditorConfiguration) {
        this.mConfig = pConfig;
    }

    /**
     * Deserialize a code string into a PotatnoProject.
     */
    public deserialize(pCode: string): PotatnoProject {
        const lProject: PotatnoProject = new PotatnoProject();

        // Copy configuration from the provided config.
        for (const [lName, lDef] of this.mConfig.nodeDefinitions) {
            lProject.configuration.addNodeDefinition(lDef);
        }
        for (const lMain of this.mConfig.mainFunctions) {
            lProject.configuration.addMainFunction(lMain);
        }
        for (const lGlobal of this.mConfig.globalValues) {
            lProject.configuration.addGlobalValue(lGlobal);
        }
        lProject.configuration.setCommentToken(this.mConfig.commentToken);
        if (this.mConfig.functionCodeGenerator) {
            lProject.configuration.setFunctionCodeGenerator(this.mConfig.functionCodeGenerator);
        }
        if (this.mConfig.previewCallback) {
            lProject.configuration.setPreviewCallback(this.mConfig.previewCallback);
        }

        // Parse markers.
        const lMarkers: Array<MarkerData> = this.parseMarkers(pCode);

        // Reconstruct functions from top-level markers.
        for (const lMarker of lMarkers) {
            if (lMarker.meta['type'] === 'function') {
                const lFunc: PotatnoFunction = this.reconstructFunction(lMarker);
                lProject.addFunction(lFunc.name, lFunc.label, lFunc.system);

                // Re-get the function by finding the latest added one.
                const lAddedFunc: PotatnoFunction | undefined = this.findFunctionByName(lProject, lFunc.name);
                if (lAddedFunc) {
                    lAddedFunc.setInputs(lFunc.inputs as Array<{ name: string; type: string }>);
                    lAddedFunc.setOutputs(lFunc.outputs as Array<{ name: string; type: string }>);
                    lAddedFunc.setImports(lFunc.imports as Array<string>);

                    // Reconstruct nodes from children.
                    this.reconstructNodes(lAddedFunc, lMarker.children);
                }
            }
        }

        // Set first function as active.
        const lFirstId: string | undefined = lProject.functions.keys().next().value;
        if (lFirstId) {
            lProject.setActiveFunction(lFirstId);
        }

        return lProject;
    }

    /**
     * Parse __POTATNO_START / __POTATNO_END markers into a tree structure.
     */
    private parseMarkers(pCode: string): Array<MarkerData> {
        const lToken: string = this.mConfig.commentToken;
        const lStartPattern: string = `${this.escapeRegex(lToken)} __POTATNO_START: `;
        const lEndPattern: string = `${this.escapeRegex(lToken)} __POTATNO_END: `;
        const lLines: Array<string> = pCode.split('\n');
        const lStack: Array<{ marker: MarkerData; startLine: number }> = new Array();
        const lTopLevel: Array<MarkerData> = new Array<MarkerData>();

        for (let lI: number = 0; lI < lLines.length; lI++) {
            const lTrimmed: string = lLines[lI].trim();

            if (lTrimmed.startsWith(lStartPattern)) {
                const lAfterStart: string = lTrimmed.substring(lStartPattern.length);
                const lSpaceIdx: number = lAfterStart.indexOf(' ');
                const lId: string = lSpaceIdx >= 0 ? lAfterStart.substring(0, lSpaceIdx) : lAfterStart;
                const lJsonStr: string = lSpaceIdx >= 0 ? lAfterStart.substring(lSpaceIdx + 1) : '{}';

                let lMeta: Record<string, any>;
                try {
                    lMeta = JSON.parse(lJsonStr);
                } catch {
                    lMeta = {};
                }

                const lMarker: MarkerData = { id: lId, meta: lMeta, innerCode: '', children: new Array<MarkerData>() };
                lStack.push({ marker: lMarker, startLine: lI });
            } else if (lTrimmed.startsWith(lEndPattern)) {
                const lAfterEnd: string = lTrimmed.substring(lEndPattern.length).trim();
                const lEndId: string = lAfterEnd;

                // Find corresponding start.
                for (let lJ: number = lStack.length - 1; lJ >= 0; lJ--) {
                    if (lStack[lJ].marker.id === lEndId) {
                        const lEntry = lStack.splice(lJ, 1)[0];

                        // Collect inner code lines (between start and end, excluding children).
                        const lInnerLines: Array<string> = new Array<string>();
                        for (let lK: number = lEntry.startLine + 1; lK < lI; lK++) {
                            lInnerLines.push(lLines[lK]);
                        }
                        lEntry.marker.innerCode = lInnerLines.join('\n');

                        // Add to parent or top-level.
                        if (lStack.length > 0) {
                            lStack[lStack.length - 1].marker.children.push(lEntry.marker);
                        } else {
                            lTopLevel.push(lEntry.marker);
                        }

                        break;
                    }
                }
            }
        }

        return lTopLevel;
    }

    /**
     * Reconstruct a function from a marker.
     */
    private reconstructFunction(pMarker: MarkerData): PotatnoFunction {
        const lFunc: PotatnoFunction = new PotatnoFunction(
            pMarker.id,
            pMarker.meta['name'] ?? 'unnamed',
            pMarker.meta['label'] ?? pMarker.meta['name'] ?? 'Unnamed',
            pMarker.meta['system'] ?? false
        );

        if (Array.isArray(pMarker.meta['inputs'])) {
            lFunc.setInputs(pMarker.meta['inputs']);
        }
        if (Array.isArray(pMarker.meta['outputs'])) {
            lFunc.setOutputs(pMarker.meta['outputs']);
        }
        if (Array.isArray(pMarker.meta['imports'])) {
            lFunc.setImports(pMarker.meta['imports']);
        }

        return lFunc;
    }

    /**
     * Reconstruct nodes from child markers and add them to a function's graph.
     */
    private reconstructNodes(pFunction: PotatnoFunction, pChildren: Array<MarkerData>): void {
        for (const lChild of pChildren) {
            const lMeta = lChild.meta;
            const lCategory: NodeCategory = lMeta['category'] as NodeCategory;

            // Get the node definition.
            const lDefinition: PotatnoNodeDefinition | undefined = this.mConfig.nodeDefinitions.get(lMeta['type']);

            if (lDefinition) {
                // Reconstruct via definition.
                const lNode: PotatnoNode = new PotatnoNode(
                    lChild.id,
                    lDefinition,
                    lMeta['position'] ?? { x: 0, y: 0 },
                    lMeta['system'] ?? false
                );

                // Restore positions and sizes.
                if (lMeta['size']) {
                    lNode.resizeTo(lMeta['size'].w, lMeta['size'].h);
                }

                // Restore properties.
                if (lMeta['properties']) {
                    for (const [lKey, lValue] of Object.entries(lMeta['properties'])) {
                        lNode.properties.set(lKey, lValue as string);
                    }
                }

                // Restore port connections and value IDs from serialized data.
                this.restorePortData(lNode, lMeta);

                pFunction.graph.addExistingNode(lNode);
            } else if (lCategory === NodeCategory.Input || lCategory === NodeCategory.Output) {
                // Input/output nodes — create a minimal definition.
                const lInputs = (lMeta['inputs'] ?? []).map((p: any) => ({ name: p.name, type: p.type }));
                const lOutputs = (lMeta['outputs'] ?? []).map((p: any) => ({ name: p.name, type: p.type }));
                const lMinDef: PotatnoNodeDefinition = {
                    name: lMeta['type'],
                    category: lCategory,
                    inputs: lInputs,
                    outputs: lOutputs,
                    codeGenerator: () => ''
                };

                const lNode: PotatnoNode = new PotatnoNode(
                    lChild.id,
                    lMinDef,
                    lMeta['position'] ?? { x: 0, y: 0 },
                    lMeta['system'] ?? true
                );

                this.restorePortData(lNode, lMeta);
                pFunction.graph.addExistingNode(lNode);
            }

            // Recurse for nested children (flow node bodies).
            if (lChild.children.length > 0) {
                this.reconstructNodes(pFunction, lChild.children);
            }
        }

        // Reconstruct connections from port data.
        this.reconstructConnections(pFunction);
    }

    /**
     * Restore port connection data from serialized metadata.
     */
    private restorePortData(pNode: PotatnoNode, pMeta: Record<string, any>): void {
        // Restore input port connections.
        if (Array.isArray(pMeta['inputs'])) {
            for (const lInputData of pMeta['inputs']) {
                const lPort: PotatnoPort | undefined = pNode.inputs.get(lInputData.name);
                if (lPort && lInputData.connectedTo) {
                    lPort.connectedTo = lInputData.connectedTo;
                }
            }
        }

        // Restore flow port connections.
        if (Array.isArray(pMeta['flowInputs'])) {
            for (const lFlowData of pMeta['flowInputs']) {
                const lPort = pNode.flowInputs.get(lFlowData.name);
                if (lPort && lFlowData.connectedTo) {
                    lPort.connectedTo = lFlowData.connectedTo;
                }
            }
        }

        if (Array.isArray(pMeta['flowOutputs'])) {
            for (const lFlowData of pMeta['flowOutputs']) {
                const lPort = pNode.flowOutputs.get(lFlowData.name);
                if (lPort && lFlowData.connectedTo) {
                    lPort.connectedTo = lFlowData.connectedTo;
                }
            }
        }
    }

    /**
     * Reconstruct connections by scanning port connectedTo fields.
     */
    private reconstructConnections(pFunction: PotatnoFunction): void {
        const lGraph = pFunction.graph;

        // Build a lookup: valueId -> { nodeId, portId }.
        const lValueIdLookup: Map<string, { nodeId: string; portId: string }> = new Map();
        for (const lNode of lGraph.nodes.values()) {
            for (const lPort of lNode.outputs.values()) {
                lValueIdLookup.set(lPort.valueId, { nodeId: lNode.id, portId: lPort.id });
            }
        }

        // Build data connections from input port connectedTo references.
        for (const lNode of lGraph.nodes.values()) {
            for (const lPort of lNode.inputs.values()) {
                if (lPort.connectedTo) {
                    const lSource = lValueIdLookup.get(lPort.connectedTo);
                    if (lSource) {
                        const lConnection: PotatnoConnection = new PotatnoConnection(
                            crypto.randomUUID(),
                            lSource.nodeId,
                            lSource.portId,
                            lNode.id,
                            lPort.id,
                            PortKind.Data
                        );

                        // Validate type match.
                        const lSourceNode = lGraph.getNode(lSource.nodeId);
                        if (lSourceNode) {
                            let lSourcePort: PotatnoPort | undefined;
                            for (const lP of lSourceNode.outputs.values()) {
                                if (lP.id === lSource.portId) {
                                    lSourcePort = lP;
                                    break;
                                }
                            }
                            if (lSourcePort) {
                                lConnection.valid = lSourcePort.type === lPort.type;
                            }
                        }

                        lGraph.addExistingConnection(lConnection);
                    }
                }
            }
        }

        // Build flow connections from flow port connectedTo references.
        const lFlowPortLookup: Map<string, { nodeId: string; portId: string }> = new Map();
        for (const lNode of lGraph.nodes.values()) {
            for (const lPort of lNode.flowInputs.values()) {
                lFlowPortLookup.set(lPort.id, { nodeId: lNode.id, portId: lPort.id });
            }
            for (const lPort of lNode.flowOutputs.values()) {
                lFlowPortLookup.set(lPort.id, { nodeId: lNode.id, portId: lPort.id });
            }
        }

        for (const lNode of lGraph.nodes.values()) {
            for (const lPort of lNode.flowOutputs.values()) {
                if (lPort.connectedTo) {
                    const lTarget = lFlowPortLookup.get(lPort.connectedTo);
                    if (lTarget) {
                        const lConnection: PotatnoConnection = new PotatnoConnection(
                            crypto.randomUUID(),
                            lNode.id,
                            lPort.id,
                            lTarget.nodeId,
                            lTarget.portId,
                            PortKind.Flow
                        );
                        lGraph.addExistingConnection(lConnection);
                    }
                }
            }
        }
    }

    /**
     * Find a function by name in the project.
     */
    private findFunctionByName(pProject: PotatnoProject, pName: string): PotatnoFunction | undefined {
        for (const lFunc of pProject.functions.values()) {
            if (lFunc.name === pName) {
                return lFunc;
            }
        }
        return undefined;
    }

    /**
     * Escape special regex characters in a string.
     */
    private escapeRegex(pStr: string): string {
        return pStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
