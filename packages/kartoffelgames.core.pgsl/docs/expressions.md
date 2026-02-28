# Expressions

PGSL supports a range of expression types for arithmetic, comparison, logical, and data-access operations.

## Literal Values

Literal values represent constant scalar values in source code.

### Integer Literals

```pgsl
42
0
-7
```

Integer literals without a suffix are `AbstractInteger` and are implicitly castable into `int`, `uint`, `float`, `float16`.

### Float Literals

```pgsl
3.14
0.0
-1.5
```

Float literals without a suffix are `AbstractFloat` and are implicitly castable into `float` and `float16`.

### Suffixed Literals

```pgsl
3.14f    // Explicit float (float32)
3.14h    // Explicit float16
5u       // Explicit unsigned integer
5i       // Explicit signed integer
```

### Boolean Literals

```pgsl
true
false
```

### String Literals

String literals are used in attributes and enum values:

```pgsl
"hello"
```

## Arithmetic Expressions

Binary arithmetic operations on numeric, vector, and matrix types.

| Operator | Description    | Example         |
|----------|---------------|-----------------|
| `+`      | Addition      | `a + b`         |
| `-`      | Subtraction   | `a - b`         |
| `*`      | Multiplication| `a * b`         |
| `/`      | Division      | `a / b`         |
| `%`      | Modulo        | `a % b`         |

```pgsl
function example(): void {
    let a: float = 5.0 + 3.0;
    let b: int = 10 - 3;
    let c: float = 2.0 * 4.0;
    let d: float = 10.0 / 3.0;
    let e: int = 10 % 3;
}
```

Arithmetic works on vectors and matrices component-wise:

```pgsl
function vectorMath(): void {
    let a: Vector3<float> = new Vector3(1.0, 2.0, 3.0);
    let b: Vector3<float> = new Vector3(4.0, 5.0, 6.0);
    let sum: Vector3<float> = a + b;

    let m: Matrix44<float> = new Matrix44(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    let scaled: Matrix44<float> = m * 2.0;
}
```

## Comparison Expressions

Comparison operators return `bool` values.

| Operator | Description          | Example         |
|----------|---------------------|-----------------|
| `==`     | Equal               | `a == b`        |
| `!=`     | Not equal           | `a != b`        |
| `<`      | Less than           | `a < b`         |
| `>`      | Greater than        | `a > b`         |
| `<=`     | Less than or equal  | `a <= b`        |
| `>=`     | Greater than or equal| `a >= b`       |

```pgsl
function compare(): void {
    let result: bool = 5 > 3;
    let equal: bool = 1.0 == 1.0;
    let notEqual: bool = 2 != 3;
}
```

## Logical Expressions

Logical operators work on `bool` values.

| Operator | Description       | Example           |
|----------|------------------|-------------------|
| `&&`     | Short-circuit AND | `a && b`          |
| `\|\|`  | Short-circuit OR  | `a \|\| b`        |

```pgsl
function logic(): void {
    let a: bool = true && false;
    let b: bool = true || false;
}
```

## Binary Expressions

Bitwise operations on integer types.

| Operator | Description   | Example         |
|----------|--------------|-----------------|
| `&`      | Bitwise AND  | `a & b`         |
| `\|`     | Bitwise OR   | `a \| b`        |
| `^`      | Bitwise XOR  | `a ^ b`         |
| `<<`     | Shift left   | `a << b`        |
| `>>`     | Shift right  | `a >> b`        |

```pgsl
function bitwise(): void {
    let a: int = 0xFF & 0x0F;
    let b: int = 0xF0 | 0x0F;
    let c: int = 0xFF ^ 0x0F;
    let d: int = 1 << 4;
    let e: int = 16 >> 2;
}
```

## Unary Expressions

| Operator | Description       | Example  |
|----------|------------------|----------|
| `-`      | Negation         | `-a`     |
| `!`      | Logical NOT      | `!a`     |
| `~`      | Bitwise negate   | `~a`     |

```pgsl
function unary(): void {
    let negated: float = -5.0;
    let notTrue: bool = !true;
    let inverted: int = ~0xFF;
}
```

## Parenthesized Expressions

Parentheses control evaluation order:

```pgsl
function grouped(): void {
    let result: float = (2.0 + 3.0) * 4.0;
}
```

## Variable Name Expression

Referencing a variable by name:

```pgsl
function example(): void {
    let x: float = 5.0;
    let y: float = x;
}
```

## Function Call Expression

Calling a function that returns a value:

```pgsl
function example(): void {
    let len: float = length(new Vector3(1.0, 2.0, 3.0));
    let d: float = dot(normal, lightDirection);
    let clamped: float = clamp(value, 0.0, 1.0);
}
```

Built-in functions can be called with explicit type templates:

```pgsl
function example(): void {
    let reinterpreted: int = bitcast<int>(1.0);
}
```

## New Expression (Constructor)

The `new` keyword constructs composite types:

```pgsl
function example(): void {
    let v2: Vector2<float> = new Vector2(1.0, 2.0);
    let v3: Vector3<float> = new Vector3(1.0, 2.0, 3.0);
    let v4: Vector4<float> = new Vector4(1.0, 2.0, 3.0, 4.0);
    let m: Matrix22<float> = new Matrix22(1.0, 0.0, 0.0, 1.0);
    let arr: Array<float, 3> = new Array(1.0, 2.0, 3.0);
}
```

Struct construction:

```pgsl
function example(): void {
    let light: PointLight = new PointLight(new Vector4(0, 0, 0, 1), new Vector4(1, 1, 1, 1), 10.0);
}
```

## Indexed Value Expression

Accessing elements by index using `[]`:

```pgsl
function example(): void {
    let arr: Array<float, 3> = new Array(1.0, 2.0, 3.0);
    let first: float = arr[0];

    let v: Vector4<float> = new Vector4(1.0, 2.0, 3.0, 4.0);
    let x: float = v[0];
}
```

## Value Decomposition Expression (Member Access)

Accessing struct members and vector swizzle components using `.`:

```pgsl
function example(): void {
    let light: PointLight;
    let pos: Vector4<float> = light.position;

    let v: Vector4<float> = new Vector4(1.0, 2.0, 3.0, 4.0);
    let x: float = v.x;
    let xy: Vector2<float> = v.xy;
    let zw: Vector2<float> = v.zw;
}
```

Vector swizzle components: `x`, `y`, `z`, `w` (or `r`, `g`, `b`, `a`).

## Address-Of Expression

The `&` operator takes the address of a storage variable, creating a pointer:

```pgsl
function example(): void {
    let count: uint = arrayLength(&storageBuffer);
}
```

## Pointer Expression

The `*` operator dereferences a pointer:

```pgsl
function example(ptr: Pointer<float>): void {
    let value: float = *ptr;
}
```

## Type Casting

Explicit type casts use function-call syntax with the target type:

```pgsl
function example(): void {
    let f: float = 3.14;
    let i: int = int(f);
    let u: uint = uint(42);
}
```

All numeric types can be explicitly cast to any other numeric type.
