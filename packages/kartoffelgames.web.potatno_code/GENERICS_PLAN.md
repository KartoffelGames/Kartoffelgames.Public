# Generic Types — Design Plan

A short design note for adding generic type support to the Potatno type system.
Not a full implementation plan — just the shape of the data and a few examples.

## The core idea

- **Types** only describe their *shape*: a name, some tags, and how many generic slots
  they have. They say nothing about what is allowed in those slots.
- **Nodes** describe the *rules*: a node names placeholders (generics) and says what each
  placeholder is allowed to be. The rule lives on the node that uses the type, never on the
  type itself.

This split is what makes `Array` reusable: `Array` accepts anything, while a picky node like
`StringJoin` puts the "only plain types" rule on its own placeholder.

## Type definition

A type declares a name, tags, and its generic slot count. Bounds/rules are **not** here.

```ts
type PotatnoType = {
    name: string;
    tags: Array<string>;        // e.g. ['plain'], ['vector'] — used by node rules
    genericCount?: number;      // number of generic slots; absent = 0
};
```

Examples:

```ts
const typeNumber = {
    name: 'number',
    tags: ['number', 'plain']
};

const typeVector = {
    name: 'Vector',
    tags: ['vector'],
    genericCount: 2             // Vector<TType, TSize>
};
```

Notes:

- Tags come **only from the top of a type**. `Vector<number>` has `Vector`'s tags
  (`['vector']`), *not* `number`'s — the inside never leaks its tags outward. So
  `Vector<number>` is **not** `plain`.
- Anything a type needs to reference (another type name) is written as a **plain string**,
  looked up later. This avoids the "one big types file can't reference itself while it is
  still being built" problem, and keeps everything serializable.

## Node generics + port data types

A node lists its placeholders with the tags each must carry (`[]` = no rule, any type). Ports
then reference either a placeholder, a concrete type name, or a container tree.

A `dataType` is read like this:

1. **String** → is it a key in `generics`? Yes = placeholder. No = concrete type name.
2. **Object** `{ type, arguments }` → a container; `type` is a concrete type name, and each
   entry of `arguments` is itself a `dataType` (placeholder, concrete, or nested container).

```ts
generics: {
    T: [],                 // anything
    TPlain: ['plain']      // top of the connected type must carry the 'plain' tag
}

// ports:
dataType: 'T'                                   // placeholder
dataType: 'number'                              // concrete type name
dataType: { type: 'Vector', arguments: ['T'] }  // container: Vector<T>
```

Multiple tags on a placeholder mean **all of them must be present** (AND).
No `pTypes` / `getType` is needed anywhere — plain strings and small objects only.

## Resolving (remember-and-swap)

A value on a wire is always a concrete tree, e.g. `Vector<number>` is `Vector` with `number`
inside it.

To resolve a node:

1. For each output placeholder, look at the input ports that mention it.
2. Lay the input's **declared** tree next to the **actual** connected tree and walk them
   together. Wherever the declared side has a placeholder, bind it to whatever sits in that
   same spot on the actual side.
3. Swap the bound placeholders into the output's tree.

### Example — `Vector<T>` in, `T` out (unwrap)

Connect `Vector<number>` into `in`:

```
declared:  Vector        actual:  Vector
            └─ T                    └─ number    →   T = number
```

`out` is `T` → resolves to `number`.

### Example — `T` in, `Vector<T>` out (wrap)

Connect `number` into `in`:

```
declared:  T   vs  actual: number   →   T = number
```

`out` is `Vector<T>` → resolves to `Vector<number>`.

The only difference between the two nodes is *where* `T` sits in the declared tree; the same
tree-walk handles both.

## Validation checks

- **Tag rule** — the top of a bound placeholder's resolved type must carry every required tag.
  (`Vector<number>` fails a `plain` rule; `number` passes.)
- **Top mismatch** — feeding `number` where `Vector<...>` is declared is an invalid connection.
- **Conflicting bindings** — if a placeholder appears on several inputs, they must all resolve
  to the same tree; otherwise the placeholder can't be resolved.

## What this touches later (not part of this note)

- `resolveDataType` becomes the tree-walk above and returns a concrete tree instead of a flat
  name.
- Type-equality checks in validation become structural (compare trees, not strings).
- `default.string` / direct values key off the top type name only.
- Serialization: `dataType` changes from a string to string-or-tree, needs a migration path.
