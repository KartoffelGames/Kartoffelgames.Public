/**
 * Object PGSL import defining per-object bindings.
 *
 * Provides:
 * - Transformation data buffer (world matrices for all components)
 * - Component indices buffer (maps instance index to transformation index)
 */
export const OBJECT_IMPORT: string = `
#IMPORT "Core";

// ===== Object Bindings (per-object data) =====
[GroupBinding("Object", "transformationData")]
[AccessMode(AccessMode.Read)]
storage transformationData: Array<Matrix44<float>>;

[GroupBinding("Object", "componentIndices")]
[AccessMode(AccessMode.Read)]
storage componentIndices: Array<uint>;
`;
