# Statements

PGSL supports a variety of statements for control flow, assignments, and execution within function bodies.

## Variable Declaration Statement

Declares a local variable within a function body. Follows the same rules as function-scope `let` and `const` declarations (see [Declarations](./declarations.md)).

```pgsl
function example(): void {
    let x: float = 5.0;
    const y: int = 10;
    let v: Vector4<float> = new Vector4(1.0, 2.0, 3.0, 4.0);
}
```

The type annotation is required. An initializer expression is optional for `let` but required for `const`.

## Assignment Statement

Assigns a value to an existing mutable variable (`let`).

### Simple Assignment

```pgsl
function example(): void {
    let x: float;
    x = 5.0;
}
```

### Compound Assignment

| Operator | Description         | Example         |
|----------|---------------------|-----------------|
| `=`      | Assignment          | `x = 5;`        |
| `+=`     | Add & assign        | `x += 3;`       |
| `-=`     | Subtract & assign   | `x -= 2;`       |
| `*=`     | Multiply & assign   | `x *= 4;`       |
| `/=`     | Divide & assign     | `x /= 2;`       |
| `%=`     | Modulo & assign     | `x %= 3;`       |
| `&=`     | Bitwise AND assign  | `x &= 0xFF;`    |
| `\|=`    | Bitwise OR assign   | `x \|= 0x01;`   |
| `^=`     | Bitwise XOR assign  | `x ^= 0xFF;`    |
| `<<=`    | Shift left assign   | `x <<= 2;`      |
| `>>=`    | Shift right assign  | `x >>= 1;`      |

```pgsl
function example(): void {
    let x: int = 10;
    x += 5;
    x -= 3;
    x *= 2;
    x /= 4;
    x %= 3;
}
```

## Increment and Decrement Statements

```pgsl
function example(): void {
    let x: int = 0;
    x++;
    x--;
}
```

Increment (`++`) and decrement (`--`) are statements, not expressions. They cannot be used inline within an expression.

## Block Statement

A block groups multiple statements:

```pgsl
function example(): void {
    {
        let x: float = 1.0;
        let y: float = 2.0;
    }
}
```

Variables declared inside a block are scoped to that block.

## If Statement

Conditional branching with optional `else if` and `else` clauses:

```pgsl
function example(x: int): int {
    if (x > 0) {
        return 1;
    } else if (x < 0) {
        return -1;
    } else {
        return 0;
    }
}
```

The condition must evaluate to `bool`.

## For Statement

C-style for loop:

```pgsl
function example(): void {
    for (let i: int = 0; i < 10; i++) {
        // loop body
    }
}
```

The initializer, condition, and update are all optional but the semicolons are required:

```pgsl
function example(): void {
    let i: int = 0;
    for (; i < 10; ) {
        i++;
    }
}
```

## While Statement

```pgsl
function example(): void {
    let i: int = 0;
    while (i < 10) {
        i++;
    }
}
```

## Do-While Statement

The body executes at least once before the condition is checked:

```pgsl
function example(): void {
    let i: int = 0;
    do {
        i++;
    } while (i < 10);
}
```

## Switch Statement

Switch on an integer or unsigned integer expression:

```pgsl
function example(value: int): int {
    switch (value) {
        case 0: {
            return 10;
        }
        case 1: {
            return 20;
        }
        default: {
            return 0;
        }
    }
}
```

Each case must have a block body. Fall-through is not supported. A `default` case is required.

## Return Statement

Returns a value from a function:

```pgsl
function add(a: float, b: float): float {
    return a + b;
}
```

Void functions can use `return` without a value:

```pgsl
function earlyExit(x: int): void {
    if (x < 0) {
        return;
    }
    // rest of function
}
```

## Break Statement

Exits the nearest enclosing loop or switch:

```pgsl
function example(): void {
    for (let i: int = 0; i < 100; i++) {
        if (i == 50) {
            break;
        }
    }
}
```

## Continue Statement

Skips to the next iteration of the nearest enclosing loop:

```pgsl
function example(): void {
    for (let i: int = 0; i < 100; i++) {
        if (i % 2 == 0) {
            continue;
        }
        // Process odd numbers only.
    }
}
```

## Discard Statement

Discards the current fragment. Only valid in fragment shaders:

```pgsl
[Fragment()]
function fragment_main(input: FragmentIn): FragmentOut {
    if (input.alpha < 0.1) {
        discard;
    }
    // ...
}
```

## Function Call Statement

Calling a function as a statement (ignoring or not having a return value):

```pgsl
function example(): void {
    doSomething();
    storageBarrier();
}
```
