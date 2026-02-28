# Built-in Functions

PGSL includes all WGSL built-in functions. They are available without import and transpile directly to their WGSL equivalents.

## Numeric Functions

### Bit Reinterpretation

| Function | Signature | Description |
|----------|-----------|-------------|
| `bitcast` | `bitcast<T>(value: S): T` | Reinterprets the bits of a value as another type. |

```pgsl
function example(): void {
    let f: float = 1.0;
    let i: int = bitcast<int>(f);
    let u: uint = bitcast<uint>(f);
    let backToFloat: float = bitcast<float>(i);
}
```

`bitcast` uses explicit type template syntax: `bitcast<TargetType>(value)`.

### Logical Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `all`    | `all(v: Vector<bool>): bool` | Returns true if all components are true. |
| `any`    | `any(v: Vector<bool>): bool` | Returns true if any component is true. |
| `select` | `select(f: T, t: T, cond: bool): T` | Returns `t` if `cond` is true, else `f`. |

```pgsl
function example(): void {
    let v: Vector3<bool> = new Vector3(true, false, true);
    let allTrue: bool = all(v);
    let anyTrue: bool = any(v);
    let result: float = select(0.0, 1.0, true);
}
```

### Array Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `arrayLength` | `arrayLength(ptr: Pointer<Array<T>>): uint` | Returns the length of a runtime-sized array. |

```pgsl
function example(): void {
    const count: uint = arrayLength(&storageBuffer);
}
```

### Trigonometric Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `acos`   | `acos(x: T): T` | Arc cosine. |
| `acosh`  | `acosh(x: T): T` | Hyperbolic arc cosine. |
| `asin`   | `asin(x: T): T` | Arc sine. |
| `asinh`  | `asinh(x: T): T` | Hyperbolic arc sine. |
| `atan`   | `atan(x: T): T` | Arc tangent. |
| `atan2`  | `atan2(y: T, x: T): T` | Two-argument arc tangent. |
| `atanh`  | `atanh(x: T): T` | Hyperbolic arc tangent. |
| `cos`    | `cos(x: T): T` | Cosine. |
| `cosh`   | `cosh(x: T): T` | Hyperbolic cosine. |
| `sin`    | `sin(x: T): T` | Sine. |
| `sinh`   | `sinh(x: T): T` | Hyperbolic sine. |
| `tan`    | `tan(x: T): T` | Tangent. |
| `tanh`   | `tanh(x: T): T` | Hyperbolic tangent. |

`T` is a float scalar or float vector type.

### Math Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `abs`    | `abs(x: T): T` | Absolute value. |
| `ceil`   | `ceil(x: T): T` | Ceiling. |
| `clamp`  | `clamp(x: T, low: T, high: T): T` | Clamp between bounds. |
| `degrees` | `degrees(x: T): T` | Radians to degrees. |
| `exp`    | `exp(x: T): T` | Natural exponential (e^x). |
| `exp2`   | `exp2(x: T): T` | Base-2 exponential. |
| `floor`  | `floor(x: T): T` | Floor. |
| `fma`    | `fma(a: T, b: T, c: T): T` | Fused multiply-add (a*b+c). |
| `fract`  | `fract(x: T): T` | Fractional part. |
| `frexp`  | `frexp(x: T): FrexpResult` | Decompose into fraction and exponent. |
| `inverseSqrt` | `inverseSqrt(x: T): T` | Reciprocal square root. |
| `ldexp`  | `ldexp(x: T, exp: int): T` | Multiply by power of 2. |
| `log`    | `log(x: T): T` | Natural logarithm. |
| `log2`   | `log2(x: T): T` | Base-2 logarithm. |
| `max`    | `max(a: T, b: T): T` | Maximum. |
| `min`    | `min(a: T, b: T): T` | Minimum. |
| `mix`    | `mix(a: T, b: T, t: T): T` | Linear interpolation. |
| `modf`   | `modf(x: T): ModfResult` | Decompose into whole and fractional parts. |
| `pow`    | `pow(base: T, exp: T): T` | Power. |
| `quantizeToF16` | `quantizeToF16(x: float): float` | Quantize to f16 precision. |
| `radians` | `radians(x: T): T` | Degrees to radians. |
| `round`  | `round(x: T): T` | Round to nearest. |
| `saturate` | `saturate(x: T): T` | Clamp to [0, 1]. |
| `sign`   | `sign(x: T): T` | Sign (-1, 0, or 1). |
| `smoothstep` | `smoothstep(low: T, high: T, x: T): T` | Hermite interpolation. |
| `sqrt`   | `sqrt(x: T): T` | Square root. |
| `step`   | `step(edge: T, x: T): T` | Step function. |
| `trunc`  | `trunc(x: T): T` | Truncate to integer part. |

### Vector Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `cross`  | `cross(a: Vector3<T>, b: Vector3<T>): Vector3<T>` | Cross product. |
| `distance` | `distance(a: T, b: T): float` | Distance between two points. |
| `dot`    | `dot(a: T, b: T): float` | Dot product. |
| `faceForward` | `faceForward(e1: T, e2: T, e3: T): T` | Flip e1 to face e3 relative to e2. |
| `length` | `length(v: T): float` | Vector length. |
| `normalize` | `normalize(v: T): T` | Unit vector. |
| `reflect` | `reflect(incident: T, normal: T): T` | Reflection vector. |
| `refract` | `refract(incident: T, normal: T, eta: float): T` | Refraction vector. |

### Matrix Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `determinant` | `determinant(m: Matrix<T>): T` | Matrix determinant. |
| `transpose` | `transpose(m: Matrix<T>): Matrix<T>` | Matrix transpose. |

### Bit Manipulation Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `countLeadingZeros` | `countLeadingZeros(x: T): T` | Count leading zero bits. |
| `countOneBits` | `countOneBits(x: T): T` | Count one bits (popcount). |
| `countTrailingZeros` | `countTrailingZeros(x: T): T` | Count trailing zero bits. |
| `extractBits` | `extractBits(x: T, offset: uint, count: uint): T` | Extract bit field. |
| `firstLeadingBit` | `firstLeadingBit(x: T): T` | Position of first leading bit. |
| `firstTrailingBit` | `firstTrailingBit(x: T): T` | Position of first trailing bit. |
| `insertBits` | `insertBits(x: T, bits: T, offset: uint, count: uint): T` | Insert bit field. |
| `reverseBits` | `reverseBits(x: T): T` | Reverse bit order. |

### Packed Dot Product Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `dot4I8Packed` | `dot4I8Packed(a: uint, b: uint): int` | 4x8-bit signed integer dot product. |
| `dot4U8Packed` | `dot4U8Packed(a: uint, b: uint): uint` | 4x8-bit unsigned integer dot product. |

### Derivative Functions (Fragment Shaders Only)

| Function | Signature | Description |
|----------|-----------|-------------|
| `dpdx`   | `dpdx(x: T): T` | Partial derivative with respect to screen x. |
| `dpdxCoarse` | `dpdxCoarse(x: T): T` | Coarse partial derivative in x. |
| `dpdxFine` | `dpdxFine(x: T): T` | Fine partial derivative in x. |
| `dpdy`   | `dpdy(x: T): T` | Partial derivative with respect to screen y. |
| `dpdyCoarse` | `dpdyCoarse(x: T): T` | Coarse partial derivative in y. |
| `dpdyFine` | `dpdyFine(x: T): T` | Fine partial derivative in y. |
| `fwidth` | `fwidth(x: T): T` | Sum of absolute derivatives. |
| `fwidthCoarse` | `fwidthCoarse(x: T): T` | Coarse fwidth. |
| `fwidthFine` | `fwidthFine(x: T): T` | Fine fwidth. |

## Texture Functions

| Function | Description |
|----------|-------------|
| `textureDimensions(texture)` | Returns the dimensions of a texture. |
| `textureGather(component, texture, sampler, coords)` | Gathers texel components from a texture. |
| `textureGatherCompare(texture, sampler, coords, depthRef)` | Gathers comparison results from a depth texture. |
| `textureLoad(texture, coords, level)` | Loads a single texel without sampling. |
| `textureNumLayers(texture)` | Returns the number of layers in an array texture. |
| `textureNumLevels(texture)` | Returns the number of mip levels. |
| `textureNumSamples(texture)` | Returns the number of samples in a multisampled texture. |
| `textureSample(texture, sampler, coords)` | Samples a texture using a sampler. |
| `textureSampleBias(texture, sampler, coords, bias)` | Samples with a mip bias. |
| `textureSampleCompare(texture, sampler, coords, depthRef)` | Comparison sampling for depth textures. |
| `textureSampleCompareLevel(texture, sampler, coords, depthRef)` | Comparison sampling at a specific mip level. |
| `textureSampleGrad(texture, sampler, coords, ddx, ddy)` | Samples using explicit gradients. |
| `textureSampleLevel(texture, sampler, coords, level)` | Samples at a specific mip level. |
| `textureSampleBaseClampToEdge(texture, sampler, coords)` | Samples at base level, clamping coordinates to the edge. |
| `textureStore(texture, coords, value)` | Writes a value to a storage texture. |

```pgsl
function example(tex: Texture2d<float>, samp: Sampler, uv: Vector2<float>): Vector4<float> {
    return textureSample(tex, samp, uv);
}
```

## Packing Functions

### Pack Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `pack4x8snorm` | `pack4x8snorm(v: Vector4<float>): uint` | Pack four signed normalized values. |
| `pack4x8unorm` | `pack4x8unorm(v: Vector4<float>): uint` | Pack four unsigned normalized values. |
| `pack4xI8` | `pack4xI8(v: Vector4<int>): uint` | Pack four signed 8-bit integers. |
| `pack4xU8` | `pack4xU8(v: Vector4<uint>): uint` | Pack four unsigned 8-bit integers. |
| `pack4xI8Clamp` | `pack4xI8Clamp(v: Vector4<int>): uint` | Pack with clamping to signed 8-bit range. |
| `pack4xU8Clamp` | `pack4xU8Clamp(v: Vector4<uint>): uint` | Pack with clamping to unsigned 8-bit range. |
| `pack2x16snorm` | `pack2x16snorm(v: Vector2<float>): uint` | Pack two signed normalized 16-bit values. |
| `pack2x16unorm` | `pack2x16unorm(v: Vector2<float>): uint` | Pack two unsigned normalized 16-bit values. |
| `pack2x16float` | `pack2x16float(v: Vector2<float>): uint` | Pack two 16-bit floats. |

### Unpack Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `unpack4x8snorm` | `unpack4x8snorm(v: uint): Vector4<float>` | Unpack four signed normalized values. |
| `unpack4x8unorm` | `unpack4x8unorm(v: uint): Vector4<float>` | Unpack four unsigned normalized values. |
| `unpack4xI8` | `unpack4xI8(v: uint): Vector4<int>` | Unpack four signed 8-bit integers. |
| `unpack4xU8` | `unpack4xU8(v: uint): Vector4<uint>` | Unpack four unsigned 8-bit integers. |
| `unpack2x16snorm` | `unpack2x16snorm(v: uint): Vector2<float>` | Unpack two signed normalized 16-bit values. |
| `unpack2x16unorm` | `unpack2x16unorm(v: uint): Vector2<float>` | Unpack two unsigned normalized 16-bit values. |
| `unpack2x16float` | `unpack2x16float(v: uint): Vector2<float>` | Unpack two 16-bit floats. |

## Synchronisation Functions

These functions are only available in compute shaders.

| Function | Signature | Description |
|----------|-----------|-------------|
| `storageBarrier` | `storageBarrier(): void` | Ensures all storage accesses complete before continuing. |
| `textureBarrier` | `textureBarrier(): void` | Ensures all texture accesses complete before continuing. |
| `workgroupBarrier` | `workgroupBarrier(): void` | Synchronizes all invocations in the workgroup. |
| `workgroupUniformLoad` | `workgroupUniformLoad(ptr: Pointer<T>): T` | Loads a value uniformly across the workgroup. |

```pgsl
[Compute(64, 64, 64)]
function compute_main(): void {
    // Ensure all storage writes are visible.
    storageBarrier();

    // Synchronize workgroup.
    workgroupBarrier();
}
```
