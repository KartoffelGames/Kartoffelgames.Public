# PGSL test rewrite plan (temporary)

Tracks the split of `test/syntax_tree` into AST, transpilation and validation tests. Delete when the rewrite is done.

## Decisions

- Roots mirror `source/abstract_syntax_tree`. AST tests: `test/abstract_syntax_tree/<sub>/<name>-ast.test.ts`. Transpilation tests: `test/transpilation/<sub>/<name>-ast-transpiler-processor.test.ts`. Validation tests: `test/validation/<sub>/<name>-ast-validation-processor.test.ts`.
- Every file ends in `.test.ts`. `kg test` runs `deno test <directory>`, which only picks up `*.test.ts`.
- Root test names: `XxxAst - Parsing`, `XxxAst - Transpilation`, `XxxAst - Validation`. The `- Parser Result` roots of function and variable declaration read transpilation meta, so they move into the transpilation files as their own root.
- The old `- Error` and `- Error Cases` roots are removed from the AST files and used as a source for the validation tests. The parser throw tests (literal, string value, if, switch) stay in the AST files under the Parsing root.
- Alias and enum declarations have no transpiler processor; their transpilation tests still go into `alias-declaration-ast-transpiler-processor.test.ts` and `enum-declaration-ast-transpiler-processor.test.ts`, named after the AST.
- Build-in function tests move to `test/feature_set/core_set/function/pgsl-<x>-function-feature-set-processor.test.ts` with a `PgslXxxFunctionFeatureSetProcessor - Transpilation` root (one step per function) and a `- Validation` root for the build-in validators.
- Child traversal TODOs ("Validate the child ...") get no tests.
- Validations that PGSL code cannot reach get no tests (listed at the end).
- Parenthesized and string value expressions have no validation of their own, so they get no validation test file.
- Each validation is a step with an `Error` and a `Success` step. The error step checks `incidents.length > 0` and one incident with the full message (`===`).
- Predicted messages (marked *pred*) are used for rules without a message yet. Messages taken from the current AST code are marked *ast*.

## Phase 1: AST and transpilation move

| Old file (test/syntax_tree) | AST file (test/abstract_syntax_tree) | Transpilation file (test/transpilation) | Done |
|---|---|---|---|
| declaration/alias-declaration-ast | declaration/alias-declaration-ast | declaration/alias-declaration-ast-transpiler-processor | [x] |
| declaration/enum-declaration-ast | declaration/enum-declaration-ast | declaration/enum-declaration-ast-transpiler-processor | [x] |
| declaration/function-declaration-ast | declaration/function-declaration-ast | declaration/function-declaration-ast-transpiler-processor (+ Parser Result) | [x] |
| declaration/struct-declaration-ast | declaration/struct-declaration-ast | declaration/struct-declaration-ast-transpiler-processor | [x] |
| declaration/variable-declaration-ast | declaration/variable-declaration-ast | declaration/variable-declaration-ast-transpiler-processor (+ Parser Result) | [x] |
| expression/arithmetic-expression-ast | expression/operation/arithmetic-expression-ast | expression/operation/arithmetic-expression-ast-transpiler-processor | [x] |
| expression/binary-expression-ast | expression/operation/binary-expression-ast | expression/operation/binary-expression-ast-transpiler-processor | [x] |
| expression/comparison-expression-ast | expression/operation/comparison-expression-ast | expression/operation/comparison-expression-ast-transpiler-processor | [x] |
| expression/logical-expression-ast | expression/operation/logical-expression-ast | expression/operation/logical-expression-ast-transpiler-processor | [x] |
| expression/address-of-expression-ast | expression/single_value/address-of-expression-ast | expression/single_value/address-of-expression-ast-transpiler-processor | [x] |
| expression/function-call-expression-ast | expression/single_value/function-call-expression-ast | expression/single_value/function-call-expression-ast-transpiler-processor | [x] |
| expression/literal-value-expression-ast | expression/single_value/literal-value-expression-ast | expression/single_value/literal-value-expression-ast-transpiler-processor | [x] |
| expression/new-expression-ast | expression/single_value/new-expression-ast | expression/single_value/new-expression-ast-transpiler-processor | [x] |
| expression/parenthesized-expression-ast | expression/single_value/parenthesized-expression-ast | expression/single_value/parenthesized-expression-ast-transpiler-processor | [x] |
| expression/string-value-expression-ast | expression/single_value/string-value-expression-ast | expression/single_value/string-value-expression-ast-transpiler-processor | [x] |
| expression/indexed-value-expression-ast | expression/storage/indexed-value-expression-ast | expression/storage/indexed-value-expression-ast-transpiler-processor | [x] |
| expression/pointer-expression-ast | expression/storage/pointer-expression-ast | expression/storage/pointer-expression-ast-transpiler-processor | [x] |
| expression/value-decomposition-expression-ast | expression/storage/value-decomposition-expression-ast | expression/storage/value-decomposition-expression-ast-transpiler-processor | [x] |
| expression/variable-name-expression-ast | expression/storage/variable-name-expression-ast | expression/storage/variable-name-expression-ast-transpiler-processor | [x] |
| expression/unary-expression-ast | expression/unary/unary-expression-ast | expression/unary/unary-expression-ast-transpiler-processor | [x] |
| statement/do-while-statement-ast | statement/branch/do-while-statement-ast | statement/branch/do-while-statement-ast-transpiler-processor | [x] |
| statement/for-statement-ast | statement/branch/for-statement-ast | statement/branch/for-statement-ast-transpiler-processor | [x] |
| statement/if-statement-ast | statement/branch/if-statement-ast | statement/branch/if-statement-ast-transpiler-processor | [x] |
| statement/switch-statement-ast | statement/branch/switch-statement-ast | statement/branch/switch-statement-ast-transpiler-processor | [x] |
| statement/while-statement-ast | statement/branch/while-statement-ast | statement/branch/while-statement-ast-transpiler-processor | [x] |
| statement/assignment-statement-ast | statement/execution/assignment-statement-ast | statement/execution/assignment-statement-ast-transpiler-processor | [x] |
| statement/block-statement-ast | statement/execution/block-statement-ast | statement/execution/block-statement-ast-transpiler-processor | [x] |
| statement/function-call-statement-ast | statement/execution/function-call-statement-ast | statement/execution/function-call-statement-ast-transpiler-processor | [x] |
| statement/increment-decrement-statement-ast | statement/execution/increment-decrement-statement-ast | statement/execution/increment-decrement-statement-ast-transpiler-processor | [x] |
| statement/variable-declaration-statement-ast | statement/execution/variable-declaration-statement-ast | statement/execution/variable-declaration-statement-ast-transpiler-processor | [x] |
| statement/break-statement-ast | statement/single/break-statement-ast | statement/single/break-statement-ast-transpiler-processor | [x] |
| statement/continue-statement-ast | statement/single/continue-statement-ast | statement/single/continue-statement-ast-transpiler-processor | [x] |
| statement/discard-statement-ast | statement/single/discard-statement-ast | statement/single/discard-statement-ast-transpiler-processor | [x] |
| statement/return-statement-ast | statement/single/return-statement-ast | statement/single/return-statement-ast-transpiler-processor | [x] |

| Old build-in file (test/syntax_tree/buildin/function) | New file (test/feature_set/core_set/function) | Done |
|---|---|---|
| pgsl-numeric-build-in-function | pgsl-numeric-function-feature-set-processor | [x] |
| pgsl-pack-build-in-function | pgsl-pack-function-feature-set-processor | [x] |
| pgsl-synchronisation-build-in-function | pgsl-synchronisation-function-feature-set-processor | [x] |
| pgsl-texture-build-in-function | pgsl-texture-function-feature-set-processor | [x] |

## Phase 2: Validation tests

All validations below are implemented. Rules without an own validator yet fail their Error step today; that is expected.

### document-ast-validation-processor (`DocumentAst - Validation`)

- [x] Duplicate alias names: `Alias with name "TestAlias" already defined.` *ast*
- [x] Duplicate enum names: `Enum "TestEnum" is already defined.` *ast*
- [x] Enum name of a feature set enum: `Enum "AccessMode" is already defined.` *ast*
- [x] Duplicate function names: `Function "testFunction" is already defined.` *ast*
- [x] Function name of a build-in function: `Function "clamp" is already defined.` *ast*
- [x] Duplicate struct names: `Struct "TestStruct" is already defined.` *ast*
- [x] Struct name of a feature set struct: `Struct "__frexp_result_f32" is already defined.` *ast*
- [x] Duplicate module scope variable names: `Variable with name "testVariable" already defined.` *ast*
- [x] Name shared by different declaration kinds: `Name "testName" is already used by another module scope declaration.` *pred*
- [x] Duplicate binding name in a group: `Binding name "test_binding" in group "test_group" is already used.` *ast*
- [x] Discard reachable from a vertex or compute entry point: `Function "discardFunction" contains a discard statement and can not be called from a vertex or compute entry point.` *pred*
- [x] Workgroup variable reachable from a vertex or fragment entry point: `Workgroup variable "testWorkgroup" can only be used from compute entry points.` *pred*
- [x] Fragment only build-in reachable from a vertex or compute entry point: `Function "dpdx" can only be called from fragment entry points.` *pred*
- [x] Compute only build-in reachable from a vertex or fragment entry point: `Function "workgroupBarrier" can only be called from compute entry points.` *pred*
- [x] Writable storage reachable from a vertex entry point: `Storage variable "testStorage" with write access can not be used from vertex entry points.` *pred*
- [x] Uniform control flow of build-in calls: `Function "workgroupBarrier" must be called in uniform control flow.` *pred*
- [x] Uniform pointer of workgroupUniformLoad: `Pointer argument of workgroupUniformLoad must be a uniform value.` *pred*
- [x] Aliased pointer arguments: `Pointer arguments of function "writeFunction" must not reference the same root variable.` *pred*
- [x] Pointer argument aliasing a used module scope variable: `Pointer argument of function "writeFunction" must not reference the module scope variable "testPrivate" the function uses.` *pred*

### declaration/alias-declaration-ast-validation-processor (`AliasDeclarationAst - Validation`)

- [x] Reserved name part: `Name "Test__GENERIC__Alias" must not contain the reserved name part "__GENERIC__".` *pred*

### declaration/enum-declaration-ast-validation-processor (`EnumDeclarationAst - Validation`)

- [x] Reserved name part in enum name: `Name "Test__GENERIC__Enum" must not contain the reserved name part "__GENERIC__".` *pred*
- [x] Reserved name part in value name: `Name "Value__GENERIC__One" must not contain the reserved name part "__GENERIC__".` *pred*
- [x] Enum without values: `Enum TestEnum has no values` *ast*
- [x] Duplicate value names: `Value "DuplicateValue" was already added to enum "TestEnum"` *ast*
- [x] Value type: `Enum "TestEnum" can only hold unsigned integer values.` *ast*
- [x] Mixed value types: `Enum "TestEnum" has mixed value types. Expected all values to be of the same type.` *ast*

### declaration/function-declaration-ast-validation-processor (`FunctionDeclarationAst - Validation`)

- [x] Reserved WGSL keyword name: `Name "fn" is a reserved WGSL keyword.` *pred*
- [x] Double underscore name prefix: `Name "__testFunction" must not start with two underscores.` *pred*
- [x] Predeclared WGSL name: `Name "vec3" shadows a predeclared WGSL name.` *pred*
- [x] Reserved name part: `Name "test__GENERIC__Function" must not contain the reserved name part "__GENERIC__".` *pred*

### declaration/function-overload-declaration-ast-validation-processor (`FunctionOverloadDeclarationAst - Validation`)

- [x] Duplicate parameter names: `Parameter "testParameter" is already defined.` *pred*
- [x] Reserved WGSL keyword parameter name: `Name "fn" is a reserved WGSL keyword.` *pred*
- [x] Double underscore parameter name prefix: `Name "__testParameter" must not start with two underscores.` *pred*
- [x] Predeclared WGSL parameter name: `Name "min" shadows a predeclared WGSL name.` *pred*
- [x] Parameter name of a function or struct declaration: `Name "TestStruct" shadows a function or struct declaration.` *pred*
- [x] Reserved name part in parameter name: `Name "test__GENERIC__Parameter" must not contain the reserved name part "__GENERIC__".` *pred*
- [x] Block variable named like a parameter: `Variable "testParameter" shares its name with a parameter.` *pred*
- [x] Parameter type: `Parameter type must be constructible, a pointer, a texture or a sampler.` *pred*
- [x] Return type: `Return type must be void or constructible.` *pred*
- [x] Return on every control flow path: `Every control flow path of a function with a return type must end in a return statement.` *pred*
- [x] Multiple entry point attributes: `Only one of the Vertex, Fragment and Compute attributes can be set.` *pred*
- [x] Vertex parameter count: `The vertex entry points must have exactly one parameter defining the vertex input structure.` *ast*
- [x] Fragment parameter count: `The fragment entry points must have exactly one parameter defining the fragment input structure.` *ast*
- [x] Vertex parameter type: `The vertex entry point parameter must be a struct type defining the vertex input structure.` *ast*
- [x] Fragment parameter type: `The fragment entry point parameter must be a struct type defining the fragment input structure.` *ast*
- [x] Vertex return type: `The vertex entry point return type must be a struct type defining the vertex output structure.` *ast*
- [x] Fragment return type: `The fragment entry point return type must be a struct type defining the fragment output structure.` *ast*
- [x] Entry point property without built-in type or location: `Property "position" of an entry point struct must have either a built-in type or a Location attribute.` *pred*
- [x] Entry point property with built-in type and location: `Property "clipPosition" of an entry point struct must have either a built-in type or a Location attribute.` *pred*
- [x] Built-in type stage and direction: `Built-in type "VertexIndex" can not be used in the fragment input struct.` *pred*
- [x] Duplicate built-in type: `Built-in type "Position" is used more than once in struct "VertexOut".` *pred*
- [x] Vertex output position: `The vertex entry point output struct needs a Position property.` *pred*
- [x] Flat interpolation of integer locations: `Location property "vertexId" with an integer type needs a flat Interpolate attribute.` *pred*
- [x] BlendSource outside of fragment output: `BlendSource properties can only be used in the output struct of a fragment entry point.` *pred*
- [x] Compute workgroup size greater than zero: `All compute attribute parameters need to be greater than zero.` *pred*
- [x] Compute parameters: `Compute entry points must not have parameters.` *ast*
- [x] Compute return type: `Compute entry points must not have a return type.` *ast*

### declaration/struct-declaration-ast-validation-processor (`StructDeclarationAst - Validation`)

- [x] Reserved WGSL keyword name: `Name "fn" is a reserved WGSL keyword.` *pred*
- [x] Double underscore name prefix: `Name "__TestStruct" must not start with two underscores.` *pred*
- [x] Predeclared WGSL name: `Name "vec3" shadows a predeclared WGSL name.` *pred*
- [x] Reserved name part: `Name "Test__GENERIC__Struct" must not contain the reserved name part "__GENERIC__".` *pred*
- [x] Struct without properties: `Struct must have at least one property.` *ast*
- [x] Duplicate property names: `Property name 'testProperty' is already used in struct 'TestStruct'.` *ast*
- [x] Runtime-sized property not last: `Only the last property of a struct can have a variable length.` *ast*
- [x] Duplicate location names: `Location name 'test_location' is already used in struct 'TestStruct'.` *ast*
- [x] BlendSource location count: `Struct "TestStruct" with a BlendSource property must have exactly two Location properties with BlendSource 0 and 1.` *pred*
- [x] BlendSource location types: `Both Location properties of struct "TestStruct" with a BlendSource property must have the same type.` *pred*

### declaration/struct-property-declaration-ast-validation-processor (`StructPropertyDeclarationAst - Validation`)

- [x] Reserved WGSL keyword name: `Name "fn" is a reserved WGSL keyword.` *pred*
- [x] Double underscore name prefix: `Name "__testProperty" must not start with two underscores.` *pred*
- [x] Reserved name part: `Name "test__GENERIC__Property" must not contain the reserved name part "__GENERIC__".` *pred*
- [x] Plain type: `Property type must be plain.` *ast*
- [x] Param-sized Array type: `Property type must not be an Array with a param-sized length.` *pred*
- [x] Struct without fixed footprint: `Property type must not be a struct without a fixed footprint.` *pred*
- [x] Location type: `Location attribute can only be applied to numeric scalar or numeric vector types.` *ast*
- [x] Size positive integer: `Size attribute parameter must be a positive integer.` *ast*
- [x] Size at least type size: `Size attribute parameter must be at least the byte size of the property type.` *pred*
- [x] Size on runtime-sized Array: `Size attribute can not be used on a runtime-sized Array.` *pred*
- [x] Align positive integer: `Align attribute parameter must be a positive integer.` *ast*
- [x] Align power of two: `Align attribute parameter must be a power of two.` *ast*
- [x] Align multiple of type alignment: `Align attribute parameter must be a multiple of the alignment of the property type.` *pred*
- [x] BlendSource without Location: `Blend source attribute is only valid when location attribute is set.` *ast*
- [x] BlendSource value: `Blend source attribute parameter must be either zero or one.` *ast*
- [x] Interpolate without Location: `Interpolate attribute is only valid when location attribute is set.` *ast*
- [x] Interpolate sampling of type: `Interpolate sampling "center" can not be used with interpolate type "flat".` *pred*

### declaration/variable-declaration-ast-validation-processor (`VariableDeclarationAst - Validation`)

- [x] Module scope declaration type: `Declaration type "let" can not be used for module scope variable declarations.` *ast*
- [x] Reserved WGSL keyword name: `Name "fn" is a reserved WGSL keyword.` *pred*
- [x] Double underscore name prefix: `Name "__testVariable" must not start with two underscores.` *pred*
- [x] Predeclared WGSL name: `Name "min" shadows a predeclared WGSL name.` *pred*
- [x] Reserved name part: `Name "test__GENERIC__Variable" must not contain the reserved name part "__GENERIC__".` *pred*
- [x] Missing GroupBinding: `Declaration type "storage" requires attribute "GroupBinding".` *ast*
- [x] Attribute not allowed by declaration type: `Declaration type "const" does not allow attribute "GroupBinding".` *ast*
- [x] Initializer type: `Initializing value has incompatible type.` *ast*
- [x] Constant initializer range: `Value -1 does not fit into 'uint'.` *pred*
- [x] Const constructible type: `The type of declaration type "const" must be constructible.` *ast*
- [x] Const initializer: `Declaration type "const" must have an initializer.` *ast*
- [x] Const constant initializer: `The expression of declaration type "const" must be a constant expression.` *ast*
- [x] Storage initializer: `Declaration type "storage" must not have an initializer.` *ast*
- [x] Storage texture type: `The type of declaration type "storage" must be a storage texture type.` *ast*
- [x] Storage host shareable type: `The type of declaration type "storage" must be host shareable.` *ast*
- [x] Storage write access mode: `Storage declarations with a type other than a texture can not use AccessMode "write".` *pred*
- [x] Storage param-sized Array: `The type of declaration type "storage" must not be an Array with a param-sized length.` *pred*
- [x] Uniform initializer: `Declaration type "uniform" must not have an initializer.` *ast*
- [x] Uniform storage texture: `Storage textures are not allowed in uniform declarations.` *ast*
- [x] Uniform constructible type: `The type of declaration type "uniform" must be constructible.` *ast*
- [x] Uniform host shareable type: `The type of declaration type "uniform" must be host shareable.` *ast*
- [x] Uniform address space layout: `The type of declaration type "uniform" does not satisfy the uniform address space layout.` *pred*
- [x] Workgroup fixed footprint: `The type of declaration type "workgroup" must have a fixed footprint.` *ast*
- [x] Workgroup plain type: `The type of declaration type "workgroup" must be a plain type.` *ast*
- [x] Workgroup initializer: `Declaration type "workgroup" must not have an initializer.` *pred*
- [x] Private constructible type: `The type of declaration type "private" must be constructible.` *ast*
- [x] Private initializer fixed state: `The expression of declaration type "private" must be a constant or param expression.` *pred*
- [x] Param constructible type: `The type of declaration type "param" must be constructible.` *ast*
- [x] Param scalar type: `The type of declaration type "param" must be a scalar type.` *ast*
- [x] Param initializer: `Declaration type "param" must have an initializer.` *ast*
- [x] Param initializer fixed state: `The expression of declaration type "param" must be a constant or param expression.` *pred*

### expression/operation/arithmetic-expression-ast-validation-processor (`ArithmeticExpressionAst - Validation`)

- [x] Unsupported operand types: `Arithmetic operation not supported for bool and int.` *pred* (TODO wording)
- [x] Constant abstract operand range: `Value -1 does not fit into 'uint'.` *pred*
- [x] Integer division by constant zero: `Integer division by zero.` *pred*
- [x] Lowest int divided by minus one: `Division of the lowest int value by -1 overflows.` *pred*
- [x] Constant AbstractInteger overflow: `Constant integer operation overflows.` *pred*
- [x] Constant float result not finite: `Constant float operation does not result in a finite value.` *pred*

### expression/operation/binary-expression-ast-validation-processor (`BinaryExpressionAst - Validation`)

- [x] Mixed operators without parentheses: `Mixing operator "&" with "|" requires parentheses.` *ast*
- [x] Unsupported operand types: `Bit operation not supported for float and int.` *pred* (TODO wording)
- [x] Constant abstract operand range: `Value -1 does not fit into 'uint'.` *pred*
- [x] Shift amount type: `Right expression of a shift operation must be an unsigned integer type.` *ast*
- [x] Shift amount vector dimension: `Left and right side of bit expression must be of the same vector size.` *ast*
- [x] Negative constant shift amount: `Shift amount must not be negative.` *pred*
- [x] Constant shift amount bit width: `Shift amount must be less than 32.` *pred*
- [x] Constant left shift overflow: `Left shift of a constant value overflows.` *pred*

### expression/operation/comparison-expression-ast-validation-processor (`ComparisonExpressionAst - Validation`)

- [x] Chained comparisons: `Chaining comparisons requires parentheses.` *ast*
- [x] Operand types: `Comparison can only be between values of the same type.` *ast*
- [x] Scalar operands: `Comparison can only be between scalar values.` *ast*
- [x] Boolean operator: `Boolean can only be compares with "NotEqual" or "Equal"` *ast*
- [x] Constant abstract operand range: `Value -1 does not fit into 'uint'.` *pred*

### expression/operation/logical-expression-ast-validation-processor (`LogicalExpressionAst - Validation`)

- [x] Mixed operators without parentheses: `Mixing operator "&&" with "||" requires parentheses.` *ast*
- [x] Left operand type: `Left side of logical expression needs to be a boolean` *ast*
- [x] Right operand type: `Right side of logical expression needs to be a boolean` *ast*

### expression/single_value/address-of-expression-ast-validation-processor (`AddressOfExpressionAst - Validation`)

- [x] Stored value target: `Target of address needs to a stored value`
- [x] Storable target: `Target of address needs to storable`
- [x] Texture or sampler target: `Target of address can not be a texture or sampler value`
- [x] Vector component target: `Target of address can not be a vector component.`

### expression/single_value/function-call-expression-ast-validation-processor (`FunctionCallExpressionAst - Validation`)

- [x] Undefined function: `Function 'undefinedFunction' is not defined.`
- [x] No matching overload: `No matching function overload found for function 'calledFunction' with parameter types (bool).`
- [x] Unresolved generic: `Generic 'TResult' of function 'bitcast' must be written explicitly.`
- [x] Entry point call: `Entry point function 'computeFunction' can not be called.`
- [x] Constant abstract argument range: `Value 5000000000 does not fit into 'int'.` *pred*

### expression/single_value/literal-value-expression-ast-validation-processor (`LiteralValueExpressionAst - Validation`)

- [x] Value range: `Literal "3000000000i" does not fit into 'int'.`
- [x] Hexadecimal exactness: `Hexadecimal literal "0x1.000001p0f" is not exactly representable in 'float'.`

### expression/single_value/new-expression-ast-validation-processor (`NewExpressionAst - Validation`)

- [x] Type constructible with new: `Type 'TestStruct' cannot be constructed with 'new'.`
- [x] Generic count: `Only one generic type is supported in 'new' expressions.`
- [x] Generic on a non generic type: `Type 'Array' can not be constructed with a generic type.`
- [x] Generic type: `Generic type is not valid for constructed type 'Matrix22'.`
- [x] Generic without parameters: `Type 'Vector3' needs a generic type when constructed without parameters.`
- [x] Constructible parameter: `New expression type must be constructible.`
- [x] Fixed length parameter: `New expression type must be length fixed.`
- [x] Matching constructor: `No matching constructor found for type 'Vector3' with 2 parameter(s).`
- [x] Parameter conversion: `Parameter of type 'bool' can not be converted into 'float'.`
- [x] Constant abstract parameter range: `Value 5000000000 does not fit into 'int'.`

### expression/storage/indexed-value-expression-ast-validation-processor (`IndexedValueExpressionAst - Validation`)

- [x] Indexable value: `Value of index expression needs to be a indexable composite value.`
- [x] Integer index: `Index needs to be a integer value.`
- [x] Negative constant index: `Index needs to be a non negative integer value.`
- [x] Constant index out of bounds: `Index out of bounds.`

### expression/storage/pointer-expression-ast-validation-processor (`PointerExpressionAst - Validation`)

- [x] Pointer value: `Pointer of expression needs to be a pointer type.`

### expression/storage/value-decomposition-expression-ast-validation-processor (`ValueDecompositionExpressionAst - Validation`)

- [x] Swizzle name: `Swizzle name "xq" can't be used to access vector.`
- [x] Swizzle a or w on small vectors: `Swizzle names with "a" or "w" can only be used for vectors of dimension 4 or higher.`
- [x] Swizzle b or z on small vectors: `Swizzle names with "b" or "z" can only be used for vectors of dimension 3 or higher.`
- [x] Struct property: `Struct has no defined property "undefinedProperty"`
- [x] Enum value: `Enum "TestEnum" does not contain a value for property "UndefinedValue".`
- [x] Compositeable value: `Value of a decomposition must be a compositeable type.`

### expression/storage/variable-name-expression-ast-validation-processor (`VariableNameExpressionAst - Validation`)

- [x] Undefined variable: `Variable "undefinedVariable" not defined.`
- [x] Enum used as value: `Enum "TestEnum" can only be used as value.`

### expression/unary/unary-expression-ast-validation-processor (`UnaryExpressionAst - Validation`)

- [x] Binary negation type: `Binary negation only valid for integer type.`
- [x] Negation type: `Negation only valid for signed numeric or vector type.`
- [x] Boolean negation type: `Boolean negation only valid for boolean type.`

### general/attribute-list-ast-validation-processor (`AttributeListAst - Validation`)

- [x] Unknown attribute: `Attribute "UnknownAttribute" is not a valid attribute.` *ast*
- [x] Attribute parent type: `Attribute "Location" is not attached to a valid parent type.` *ast*
- [x] Parameter count: `Attribute "GroupBinding" has invalid number of parameters.` *ast*
- [x] Parameters of attributes without parameters: `Attribute "Invariant" can not have parameters.` *pred*
- [x] Constant string parameter: `Attribute "GroupBinding" parameter 0 must be a constant expression.` *ast*
- [x] String parameter type: `Attribute "GroupBinding" parameter 0 must be a string.` *ast*
- [x] String parameter value list: `Attribute "AccessMode" parameter 0 has an invalid value.` *ast*
- [x] Numeric parameter: `Attribute "Align" parameter 0 must be a number.` *ast*
- [x] Numeric parameter type: `Attribute "Align" parameter 0 must be of type uint.` *ast*
- [x] Numeric parameter fixed state: `Attribute "Align" parameter 0 has the wrong fixed state.` *ast*
- [x] Duplicate attribute: `Attribute "Location" can only be used once.` *pred*

### general/type-declaration-ast-validation-processor (`TypeDeclarationAst - Validation`)

- [x] Undefined type name: `Typename "UndefinedType" not defined.` *ast*
- [x] Void template arguments: `Void type can't have template parameters.` *ast*
- [x] Boolean template arguments: `Boolean can't have templates values.` *ast*
- [x] Numeric template arguments: `Numeric can't have templates values.` *ast*
- [x] Sampler template arguments: `Sampler type can't have template parameters.` *ast*
- [x] Struct template arguments: `Structs can't have templates values.` *ast*
- [x] Enum template arguments: `Enum can't have templates values.` *ast*
- [x] Alias template arguments: `Alias can't have templates values.` *pred*
- [x] Explicit string type: `String type can't be explicit defined.` *ast*
- [x] Array without template arguments: `Arrays need at least one template parameter` *ast*
- [x] Array with too many template arguments: `Arrays supports only two template parameter.` *ast*
- [x] Array element type is a type: `First array template parameter must be a type.` *ast*
- [x] Array element type: `Array element type must be a scalar, vector, matrix, constant length Array or fixed footprint struct.` *pred*
- [x] Array length is an expression: `Array length template must be a expression.` *ast*
- [x] Array length type: `Array length expression must be of unsigned integer type.` *ast*
- [x] Array length fixed state: `Array length expression must be a constant expression.` *ast*
- [x] Array length greater than zero: `Array length must be greater than zero.` *pred*
- [x] Vector template count: `Vector types need a single template type.` *ast*
- [x] Vector template is a type: `Vector template parameter needs to be a type definition.` *ast*
- [x] Vector component type: `Vector component type must be a scalar type.` *ast*
- [x] Matrix template count: `Matrix types need a single template type.` *ast*
- [x] Matrix template is a type: `Matrix template parameter needs to be a type definition.` *ast*
- [x] Matrix component type: `Matrix component type must be a floating point type.` *ast*
- [x] Pointer storable type: `Referenced types of pointers need to be storable` *ast*
- [x] Pointer to pointer, texture or sampler: `Referenced types of pointers can not be a pointer, texture or sampler.` *pred*
- [x] Build-in template count: `Build-in type supports only a single template value.` *ast*
- [x] Build-in template is an expression: `Build-in type template must be a expression.` *ast*
- [x] Build-in template on other build-in types: `Build-in type "Position" can't have template parameters.` *pred*
- [x] ClipDistances template value: `Clip distance built-in template value must have a value expression.` *ast*
- [x] ClipDistances constant template value: `Clip distance built-in template value must be a constant.` *ast*
- [x] ClipDistances template value type: `Clip distance built-in template value must be an unsigned integer.` *ast*
- [x] ClipDistances template value range: `Clip distance built-in template value must be between 1 and 8.` *pred*
- [x] Sampled texture template count: `Texture type "Texture2d" needs a single template type.` *ast*
- [x] Sampled texture template is a type: `Texture template parameter needs to be a type definition.` *ast*
- [x] Sampled texture type: `Texture sampled type must be a float, int or uint type.` *ast*
- [x] Storage texture template count: `Texture type "TextureStorage2d" needs a texel format and an access mode template.` *ast*
- [x] Storage texture constant string templates: `Texture template parameter 1 must be a string value expression.` *ast*
- [x] Storage texture texel format: `Unknown texel format: "unknown_format".` *ast*
- [x] Storage texture access mode: `Unknown access mode: "unknown_access".` *ast*
- [x] Depth and external texture template arguments: `Texture type "TextureDepth2d" can't have template parameters.` *ast*

### statement/branch/do-while-statement-ast-validation-processor (`DoWhileStatementAst - Validation`)

- [x] Boolean condition: `Expression of do-while loops must resolve into a boolean.` *ast*

### statement/branch/for-statement-ast-validation-processor (`ForStatementAst - Validation`)

- [x] Let init declaration: `Initial of for loops must be a let declaration.` *ast*
- [x] Boolean condition: `Expression of for loops must resolve into a boolean.` *ast*
- [x] Loop without condition needs an exit: `For loop without a condition must contain a break or return statement.` *pred*

### statement/branch/if-statement-ast-validation-processor (`IfStatementAst - Validation`)

- [x] Boolean condition: `Expression of if must resolve into a boolean.` *ast*

### statement/branch/switch-statement-ast-validation-processor (`SwitchStatementAst - Validation`)

- [x] Constant case value: `Case expression must be a constant.` *ast*
- [x] Duplicate case value: `Duplicate case value found.` *ast*
- [x] Switch expression type: `Switch expression must resolve into a unsigned integer.` *ast*
- [x] Case value type: `Case expression must be of a unsigned integer type.` *ast*
- [x] Common type: `Switch expression and case values must have one common type.` *pred*
- [x] Constant case value range: `Value -1 does not fit into 'uint'.` *pred*

### statement/branch/while-statement-ast-validation-processor (`WhileStatementAst - Validation`)

- [x] Boolean condition: `Expression of while loops must resolve into a boolean.` *ast*

### statement/execution/assignment-statement-ast-validation-processor (`AssignmentStatementAst - Validation`)

- [x] Storage expression target: `Assignment statement must be applied to a storage expression.` *ast*
- [x] Variable target: `Assignment statement must be applied to a variable.` *ast*
- [x] Writable target: `Assignment target must be writable memory.` *pred*
- [x] Constructible target type: `Assignment target type must be constructible.` *pred*
- [x] Compound arithmetic operand types: `Arithmetic operation not supported for int and bool.` *pred* (TODO wording)
- [x] Compound bit operand types: `Bit operation not supported for float and int.` *pred* (TODO wording)
- [x] Shift assignment amount type: `Right side of a shift assignment must be an unsigned integer type.` *pred*
- [x] Negative constant shift assignment amount: `Shift amount must not be negative.` *pred*
- [x] Constant shift assignment amount bit width: `Shift amount must be less than 32.` *pred*
- [x] Integer division assignment by constant zero: `Integer division by zero.` *pred*
- [x] Assigned type: `Can't assign a different type to a variable.` *ast*
- [x] Constant assigned value range: `Value -1 does not fit into 'uint'.` *pred*

### statement/execution/block-statement-ast-validation-processor (`BlockStatementAst - Validation`)

- [x] Duplicate variable names: `Variable with name "testVariable" already defined.` *ast*

### statement/execution/function-call-statement-ast-validation-processor (`FunctionCallStatementAst - Validation`)

- [x] Unused build-in return value: `Return value of build-in function "abs" must be used.` *pred*

### statement/execution/increment-decrement-statement-ast-validation-processor (`IncrementDecrementStatementAst - Validation`)

- [x] Storage expression target: `Increment or decrement expression must be applied to a storage expression` *ast*
- [x] Variable target: `Increment or decrement expression must be a variable` *ast*
- [x] Writable target: `Increment or decrement target must be writable memory.` *pred*
- [x] Integer target type: `Increment or decrement expression must be an int or uint.` *pred*

### statement/execution/variable-declaration-statement-ast-validation-processor (`VariableDeclarationStatementAst - Validation`)

- [x] Double underscore name prefix: `Name "__testVariable" must not start with two underscores.` *pred*
- [x] Reserved WGSL keyword name: `Name "fn" is a reserved WGSL keyword.` *pred*
- [x] Predeclared WGSL name: `Name "min" shadows a predeclared WGSL name.` *pred*
- [x] Name of a function or struct declaration: `Name "otherFunction" shadows a function or struct declaration.` *pred*
- [x] Reserved name part: `Name "test__GENERIC__Variable" must not contain the reserved name part "__GENERIC__".` *pred*
- [x] Const initializer: `Constants need a initializer value.` *ast*
- [x] Constructible type: `Type is not constructible type.` *ast*
- [x] Pointer declared with let: `Variables of pointer type must be declared with const.` *pred*
- [x] Initializer type: `Expression values type can't be converted to variables type.` *ast*
- [x] Constant initializer range: `Value -1 does not fit into 'uint'.` *pred*

### statement/single/break-statement-ast-validation-processor (`BreakStatementAst - Validation`)

- [x] Break outside of loop or switch: `Break statement can only be used within loops or switch statements.` *ast*

### statement/single/continue-statement-ast-validation-processor (`ContinueStatementAst - Validation`)

- [x] Continue outside of loop: `Continue statement can only be used within loops.` *ast*

### statement/single/discard-statement-ast-validation-processor (`DiscardStatementAst - Validation`)

- [x] Discard outside of fragment entry point: `Discard statement can only be used in fragment entry points.` *pred*

### statement/single/return-statement-ast-validation-processor (`ReturnStatementAst - Validation`)

- [x] Return without value in a non void function: `Return statement without a value can only be used in void functions.` *pred*
- [x] Return with value in a void function: `Return statement with a value can not be used in void functions.` *pred*
- [x] Return value type: `Return value type can't be converted to the function return type.` *pred*
- [x] Constant return value range: `Value -1 does not fit into 'uint'.` *pred*

### feature_set/core_set/function/pgsl-numeric-function-feature-set-processor (`PgslNumericFunctionFeatureSetProcessor - Validation`)

- [x] arrayLength runtime-sized Array: `References array must be runtime-sized.`
- [x] clamp low and high: `Low value of clamp must not be greater than its high value.`
- [x] extractBits offset and count: `Offset plus count of extractBits must not exceed 32 bits.`
- [x] insertBits offset and count: `Offset plus count of insertBits must not exceed 32 bits.`
- [x] ldexp exponent: `Exponent of ldexp must not be greater than 128.`
- [x] quantizeToF16 value range: `Value 100000 of quantizeToF16 does not fit into 'float16'.`
- [x] smoothstep edges: `Values of smoothstep must not be equal.`

### feature_set/core_set/function/pgsl-texture-function-feature-set-processor (`PgslTextureFunctionFeatureSetProcessor - Validation`)

- [x] Constant offset: `Offset of textureSample must be a constant.`
- [x] Constant textureGather component: `Component of textureGather must be a constant.`
- [x] textureGather component range: `Component of textureGather must be between 0 and 3.`

## Unreachable validations (no tests)

- FunctionDeclarationAst: attributes on functions with more than one overload. User functions always have exactly one overload.
- FunctionOverloadDeclarationAst: duplicate generic names, generic restriction order, generic name shadowing, undeclared generic as parameter type, entry point generics. User functions have no generics.
- Operator checks of arithmetic, binary, comparison, logical, unary, assignment and increment/decrement. The grammar only produces valid operators.
- VariableDeclarationStatementAst: unknown declaration keyword and keywords other than let and const. The statement grammar only accepts const and let.
- AttributeListAst: attribute list without a declaration. The grammar only places attribute lists on declarations.
- ForStatementAst: update statement kind. The update slot of the grammar only takes assignments, increments, decrements and function calls.
- LiteralValueExpressionAst: literal without a matching type. The lexer only produces valid literal tokens.
- ValueDecompositionExpressionAst: struct or enum type without a declaration. Struct and enum types are only created from their declaration.
- UnaryExpressionAst: unknown operator. The grammar only produces ~, - and !.

## Phase 3: Check

- [x] Every step of this plan exists in the test files.
- [x] Every test follows AGENTS.md test discipline (three labeled sections, generic names, full error message).

## Phase 4: Cleanup (Setup variables only when used by at least two parts, lCodeText excepted)

- [x] AST tests
- [x] Transpilation tests
- [x] Validation tests
