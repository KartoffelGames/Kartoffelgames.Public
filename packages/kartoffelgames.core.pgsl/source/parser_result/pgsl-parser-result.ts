import { FunctionDeclarationAst, type FunctionDeclarationAstDataDeclaration, type FunctionDeclarationAstDataEntryPointWorkgroupSize } from '../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import { VariableDeclarationAst } from '../abstract_syntax_tree/declaration/variable-declaration-ast.ts';
import type { DocumentAst } from '../abstract_syntax_tree/document-ast.ts';
import { PgslDeclarationType } from '../enum/pgsl-declaration-type.enum.ts';
import type { TranspilationMeta } from '../transpilation/transpilation-meta.ts';
import { PgslParserResultComputeEntryPoint } from './entry_point/pgsl-parser-result-compute-entry-point.ts';
import { PgslParserResultFragmentEntryPoint } from './entry_point/pgsl-parser-result-fragment-entry-point.ts';
import { PgslParserResultVertexEntryPoint } from './entry_point/pgsl-parser-result-vertex-entry-point.ts';
import { PgslParserResultBinding } from './pgsl-parser-result-binding.ts';
import { PgslParserResultParameter } from './pgsl-parser-result-parameter.ts';
import { PgslParserResultIncident } from './pgsl-parser-result.incident.ts';

/**
 * Represents the result of parsing PGSL source code, including transpiled code,
 * source maps, metadata, and any incidents encountered during parsing.
 */
export class PgslParserResult {
    private readonly mIncidents: Array<PgslParserResultIncident>;
    private readonly mMeta: PgslParserResultMeta;
    private readonly mSource: string;
    private readonly mSourceMap: string | null;

    /**
     * Gets the list of bindings extracted from the PGSL source.
     * 
     * @returns A readonly array of PgslParserResultBinding instances.
     */
    public get bindings(): ReadonlyArray<PgslParserResultBinding> {
        return this.mMeta.bindings;
    }

    /**
     * Gets the entry points extracted from the PGSL source.
     * 
     * @returns A readonly map of entry points by their type and name.
     */
    public get entryPoints(): ReadonlyPgslParserResultMetaEntryPoints {
        return this.mMeta.entrypoints;
    }

    /**
     * Gets the list of trace incidents encountered during parsing.
     * 
     * @returns A readonly array of PgslTraceIncident instances.
     */
    public get incidents(): ReadonlyArray<PgslParserResultIncident> {
        return this.mIncidents;
    }

    public get metaValues(): ReadonlyMap<string, string> {
        return this.mMeta.values;
    }

    /**
     * Gets the list of shader parameters extracted from the PGSL source.
     * 
     * @returns A readonly array of PgslParserResultParameter instances.
     */
    public get parameters(): ReadonlyArray<PgslParserResultParameter> {
        return this.mMeta.parameters;
    }

    /**
     * Gets the transpiled source code.
     * 
     * @returns The transpiled PGSL source code as a string.
     */
    public get source(): string {
        return this.mSource;
    }

    /**
     * Gets the source map for the transpiled code, if available.
     * 
     * @returns The source map as a string or null if not available.
     */
    public get sourceMap(): string | null {
        return this.mSourceMap;
    }

    /**
     * Constructor.
     * 
     * @param pSource - The transpiled source code.
     * @param pSourceMap - The source map for the transpiled code, if available.
     * @param pDocument - The PGSL document representation.
     * @param pMeta - The transpilation metadata.
     */
    public constructor(pSource: string, pSourceMap: string | null, pDocument: DocumentAst, pMeta: TranspilationMeta) {
        this.mSource = pSource;
        this.mSourceMap = pSourceMap;
        this.mIncidents = this.convertIncidents(pDocument);

        // Skip metadata extraction if there are incidents.
        if (this.mIncidents.length > 0) {
            // Set empty metadata on incidents.
            this.mMeta = {
                bindings: [],
                parameters: [],
                entrypoints: {
                    vertex: new Map<string, PgslParserResultVertexEntryPoint>(),
                    fragment: new Map<string, PgslParserResultFragmentEntryPoint>(),
                    compute: new Map<string, PgslParserResultComputeEntryPoint>()
                },
                values: new Map<string, string>()
            };
        } else {
            this.mMeta = {
                bindings: this.convertBindings(pDocument, pMeta),
                parameters: this.convertShaderParameter(pDocument),
                entrypoints: this.convertEntryPoints(pDocument, pMeta),
                values: new Map<string, string>(pDocument.data.metaValues)
            };
        }
    }

    /**
     * Converts trace bindings to parser result bindings.
     * 
     * @param pDocument - Parsed document.
     * 
     * @returns Array of parser result bindings. 
     */
    private convertBindings(pDocument: DocumentAst, pMeta: TranspilationMeta): Array<PgslParserResultBinding> {
        const lBindings: Array<PgslParserResultBinding> = [];
        for (const lValue of pDocument.data.content) {
            // Skip none variable declarations.
            if (!(lValue instanceof VariableDeclarationAst)) {
                continue;
            }

            // Skip non-binding values.
            if (lValue.data.bindingInformation === null) {
                continue;
            }

            // Create a new parser result binding.
            lBindings.push(new PgslParserResultBinding(lValue, pDocument, pMeta));
        }
        return lBindings;
    }

    /**
     * Converts trace entry points to parser result entry points.
     * 
     * @param pDocument - Parsed document.
     * @param pMeta - Transpilation meta.
     * 
     * @returns Entry points mapped by their type and name. 
     */
    private convertEntryPoints(pDocument: DocumentAst, pMeta: TranspilationMeta): PgslParserResultMetaEntryPoints {
        const lEntryPoints: PgslParserResultMetaEntryPoints = {
            vertex: new Map<string, PgslParserResultVertexEntryPoint>(),
            fragment: new Map<string, PgslParserResultFragmentEntryPoint>(),
            compute: new Map<string, PgslParserResultComputeEntryPoint>()
        };

        for (const lValue of pDocument.data.content) {
            // Skip none function declarations.
            if (!(lValue instanceof FunctionDeclarationAst)) {
                continue;
            }

            // Skip all functions without declarations.
            if (lValue.data.declarations.length < 1) {
                continue;
            }

            // Read first function declaration and check for any entry point data.
            const lEntryPointTypeDeclaration: FunctionDeclarationAstDataDeclaration = lValue.data.declarations[0];
            if (!lEntryPointTypeDeclaration.entryPoint) {
                continue;
            }

            switch (lEntryPointTypeDeclaration.entryPoint.stage) {
                case 'vertex': {
                    const lVertexEntryPoint: PgslParserResultVertexEntryPoint = new PgslParserResultVertexEntryPoint(lValue.data.name, lEntryPointTypeDeclaration.entryPoint.parameter, pDocument, pMeta);
                    lEntryPoints.vertex.set(lValue.data.name, lVertexEntryPoint);
                    break;
                }
                case 'fragment': {
                    const lFragmentEntryPoint: PgslParserResultFragmentEntryPoint = new PgslParserResultFragmentEntryPoint(lValue.data.name, lEntryPointTypeDeclaration.entryPoint.returnType, pDocument, pMeta);
                    lEntryPoints.fragment.set(lValue.data.name, lFragmentEntryPoint);
                    break;
                }
                case 'compute': {
                    const lWorkgroupSize: FunctionDeclarationAstDataEntryPointWorkgroupSize = lEntryPointTypeDeclaration.entryPoint.workgroupSize!;
                    const lComputeEntryPoint: PgslParserResultComputeEntryPoint = new PgslParserResultComputeEntryPoint(lValue.data.name, lWorkgroupSize.x ?? 0, lWorkgroupSize.y ?? 0, lWorkgroupSize.z ?? 0);
                    lEntryPoints.compute.set(lValue.data.name, lComputeEntryPoint);
                    break;
                }
            }
        }

        return lEntryPoints;
    }

    /**
     * Converts trace incidents to parser result incidents.
     * 
     * @param pTrace - The trace containing incidents. 
     * 
     * @returns An array of parser result incidents.
     */
    private convertIncidents(pDocument: DocumentAst): Array<PgslParserResultIncident> {
        return pDocument.data.incidents.map(pIncident => new PgslParserResultIncident(
            pIncident.message,
            pIncident.syntaxTree?.meta[0] ?? 0,
            pIncident.syntaxTree?.meta[1] ?? 0
        ));
    }

    /**
     * Converts trace shader parameters to parser result parameters.
     * 
     * @param pDocument - Parsed document.
     * 
     * @returns Array of parser result parameters. 
     */
    private convertShaderParameter(pDocument: DocumentAst): Array<PgslParserResultParameter> {
        const lParameters: Array<PgslParserResultParameter> = [];
        for (const lValue of pDocument.data.content) {
            // Skip none variable declarations.
            if (!(lValue instanceof VariableDeclarationAst)) {
                continue;
            }

            // Skip non-parameter values.
            if (lValue.data.declarationType !== PgslDeclarationType.Param) {
                continue;
            }

            // Map parameter names to their types.
            lParameters.push(new PgslParserResultParameter(lValue));
        }
        return lParameters;
    }
}

type PgslParserResultMetaEntryPoints = {
    vertex: Map<string, PgslParserResultVertexEntryPoint>;
    fragment: Map<string, PgslParserResultFragmentEntryPoint>;
    compute: Map<string, PgslParserResultComputeEntryPoint>;
};

type PgslParserResultMeta = {
    values: Map<string, string>;
    bindings: Array<PgslParserResultBinding>;
    parameters: Array<PgslParserResultParameter>;
    entrypoints: PgslParserResultMetaEntryPoints;
};

export type ReadonlyPgslParserResultMetaEntryPoints = {
    readonly vertex: ReadonlyMap<string, PgslParserResultVertexEntryPoint>;
    readonly fragment: ReadonlyMap<string, PgslParserResultFragmentEntryPoint>;
    readonly compute: ReadonlyMap<string, PgslParserResultComputeEntryPoint>;
};

