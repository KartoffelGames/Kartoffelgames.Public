---
description: 'AI assistant for editing TypeScript code following Kartoffelgames conventions and standards'
tools: ['edit', 'search', 'new', 'problems', 'changes', 'testFailure', 'fetch', 'githubRepo', 'todos']
---

# Kartoffelgames Code Editor

This chatmode provides conventions and standards for an AI assistant to edit TypeScript code following Kartoffelgames project guidelines.

## Table of Contents
1. [General Instructions](#general-instructions)
2. [File Organization](#file-organization)
3. [Documentation Standards](#documentation-standards)
4. [Code Structure and Organization](#code-structure-and-organization)
5. [Naming Conventions](#naming-conventions)
6. [Member Ordering](#member-ordering)
7. [Code Quality Standards](#code-quality-standards)
8. [Examples](#examples)

## General Instructions

**Key behaviors:**
- Focus only on the requested changes unless explicitly asked to refactor existing code
- When adding missing documentation, follow TSDoc format consistently
- Ensure all code follows project coding standards and conventions
- **Ask the user for clarification** when requirements are unclear or multiple approaches are valid
- Maintain consistency with existing codebase patterns

## File Organization

### File Naming Conventions
- **Classes:** `my-class-name.ts` (kebab-case)
- **Enums:** `my-enum-name.enum.ts` (kebab-case with `.enum.ts` suffix)
- **Interfaces:** `i-my-interface.interface.ts` (kebab-case with `I` prefix and `.interface.ts` suffix when file contains only interface)
- **Directory names:** `snake_case` (no uppercase letters)

### File Naming Rules
- Interface files with `I` prefix only when the file's sole purpose is to hold that interface
- Use `I` prefix for interfaces intended to be implemented by classes
- Omit `I` prefix for interfaces used as simple types without implementation intent
- All file and directory names must be lowercase

### Import Organization
- Use inline type imports: `import { type MyType, myFunction } from './module'`
- Separate type imports from value imports where possible
- Organize imports automatically via project standards

## Documentation Standards

### TSDoc Format
All classes, methods, and properties must have TSDoc documentation:

```typescript
/**
 * Brief description of the class purpose.
 * Additional details if needed.
 */
export class MyClass {
    /**
     * Description of the property and its purpose.
     */
    public myProperty: string;

    /**
     * Description of what the method does.
     * Additional details if needed.
     *
     * @param pParameter - Description of the parameter.
     * @param pSecondParam - Description of another parameter.
     *
     * @returns Description of the return value.
     *
     * @throws {ErrorType} Description of when this error is thrown.
     * @throws {AnotherError} Description of another error condition.
     *
     * @example
     * ```typescript
     * const result = myClass.myMethod('input');
     * ```
     */
    public myMethod(pParameter: string, pSecondParam: number): boolean {
        // Implementation
    }

    /**
     * Generic method example showing type parameter documentation.
     *
     * @typeParam T - The type of items to process.
     * @typeParam U - The return type after processing.
     *
     * @param pItems - Array of items to process.
     * @param pProcessor - Function to process each item.
     *
     * @returns Array of processed items.
     */
    public processItems<T, U>(pItems: Array<T>, pProcessor: (item: T) => U): Array<U> {
        // Implementation
    }
}
```

### Documentation Requirements
- **Classes:** Purpose, key responsibilities, usage context
- **Methods:** What it does, parameters, return value, exceptions
- **Properties:** Purpose, expected values, constraints
- **Enums:** Purpose and usage context
- **Interfaces:** Purpose and intended usage

### Documentation Formatting Rules
Follow these strict formatting guidelines for all TSDoc documentation:

**Spacing Requirements:**
- Always include an empty line between the description text and the first tag
- Add empty lines between different types of tags (but not between same tag types)
- Group same tag types together without empty lines between them

**Tag Order (Strictly Enforced):**
1. Description text
2. `@typeParam` tags (for generic type parameters)
3. `@param` tags (for function/method parameters) 
4. `@returns` tag (for return value description)
5. `@throws` tags (for exception documentation)
6. `@example` tags (for usage examples)
7. Other tags (`@since`, `@deprecated`, etc.)

**Example of proper spacing:**
```typescript
/**
 * Method description goes here.
 * Additional description details.
 *
 * @typeParam T - First type parameter.
 * @typeParam U - Second type parameter.
 *
 * @param pFirstParam - First parameter description.
 * @param pSecondParam - Second parameter description.
 *
 * @returns Description of return value.
 *
 * @throws {Error} When first error condition occurs.
 * @throws {ValidationError} When validation fails.
 *
 * @example
 * ```typescript
 * const result = myMethod('input', 42);
 * ```
 */
```

## Code Structure and Organization

### Logical Code Grouping
Organize method code into logical groups with descriptive comments:

```typescript
public processData(pInput: string): ProcessedData {
    // Validate input parameters.
    if (!pInput || pInput.length === 0) {
        throw new Error('Input cannot be empty');
    }

    // Parse and transform data.
    const lParsedData: ParsedData = this.parseInput(pInput);
    const lTransformedData: TransformedData = this.transformData(lParsedData);

    // Generate and return result.
    const lResult: ProcessedData = this.generateResult(lTransformedData);
    return lResult;
}
```

### Comment Style for Code Groups
- Use descriptive comments above each logical group
- Format: `// [Action description].` (sentence case with period)
- Examples: `// Setup database connection.`, `// Validate user permissions.`, `// Calculate final result.`

## Naming Conventions

### Variable Prefixes (Strictly Enforced)
- **Local variables:** `l` prefix - `const lLocalVariable: string;`
- **Global variables:** `g` prefix - `const gGlobalVariable: string;`
- **Parameters:** `p` prefix - `(pParameter: string) => void`
- **Private members:** `m` prefix - `private mMemberVariable: string;`

### Naming Formats
- **Variables/Functions:** `StrictPascalCase` with appropriate prefix
- **Classes/Types/Enums:** `StrictPascalCase` (no prefix)
- **Public members:** `strictCamelCase` (no prefix)
- **Protected members:** `strictCamelCase` (no prefix)
- **Static readonly:** `UPPER_CASE`
- **Generic types:** `T` prefix - `TGenericType`
- **Interfaces:** `StrictPascalCase` with `I` prefix when intended for implementation

### Interface Naming Rules
- **Implementation interfaces:** `IMyInterface` (intended to be implemented by classes)
- **Type interfaces:** `MyInterface` (used as simple types without implementation intent)
- **File naming:** Only use `i-my-interface.interface.ts` when file contains solely that interface

## Member Ordering

### Class Member Order (Strictly Enforced)
Follow this exact order for all class members:

1. **Signatures and Call Signatures**
   - Index signatures
   - Call signatures

2. **Static Fields** (by visibility)
   - public static fields
   - protected static fields
   - private static fields
   - #private static fields

3. **Static Accessors** (getters and setters grouped together)
   - public static get/set
   - private static get/set
   - protected static get/set

4. **Static Methods** (by visibility)
   - public static methods
   - protected static methods
   - private static methods

5. **Instance Fields** (by decoration and visibility)
   - public decorated fields
   - protected decorated fields
   - private decorated fields
   - public instance fields
   - protected instance fields
   - private instance fields
   - public abstract fields
   - protected abstract fields

6. **Instance Accessors** (getters and setters grouped together)
   - public decorated get/set
   - protected decorated get/set
   - private decorated get/set
   - public instance get/set
   - protected instance get/set
   - private instance get/set
   - public abstract get/set
   - protected abstract get/set

7. **Constructors** (by visibility)
   - public constructors
   - protected constructors
   - private constructors

8. **Instance Methods** (by decoration and visibility)
   - public decorated methods
   - public instance methods
   - protected instance methods
   - protected decorated methods
   - private decorated methods
   - private instance methods

9. **Abstract Methods** (by visibility)
   - public abstract methods
   - protected abstract methods

### Alphabetical Ordering
- Members within each category must be ordered alphabetically
- This applies to all member types and ensures consistent code organization

## Code Quality Standards

### Type Annotations
- Use explicit return types for all public methods and functions
- Add type annotations where TypeScript cannot infer or for clarity
- Prefer explicit typing over `any` for better code safety

### Code Style Requirements
- **Semicolons:** Always required at end of statements
- **Quotes:** Single quotes with escape allowance for strings
- **Arrays:** Use generic syntax `Array<Type>` instead of `Type[]`
- **Equality:** Use strict equality `===` and `!==` operators
- **Variables:** Prefer `const` over `let`, never use `var`
- **Return statements:** Avoid unnecessary `return await`
- **Switch statements:** Use block statements for multi-line cases, inline for single-line returns

### Switch Statement Formatting
Use block statements `{}` for cases that contain multiple statements or don't return immediately:

```typescript
switch (pValue) {
    case 1: {
        // Multiple statements require block
        this.processValue(pValue);
        this.logAction('processed');
        break;
    }
    case 2: {
        // Single statement with break requires block
        this.handleSpecialCase();
        break;
    }
}
```

Use inline format for cases that immediately return a value:

```typescript
switch (pValue) {
    case 1: return 'first';
    case 2: return 'second';
    case 3: return this.calculateThird();
    default: return 'unknown';
}
```

### Import Standards
- Prefer type imports: `import { type MyType } from './module'`
- Use inline type imports when mixing types and values
- Avoid type annotation side effects
- Empty object types only allowed for interfaces with single extends

### Error Handling
- Use meaningful error messages with context
- Include relevant information in exceptions
- Follow consistent error patterns across the codebase

## Examples

### Complete Class Example
```typescript
/**
 * Manages text processing operations with validation and transformation capabilities.
 * Provides methods for parsing, validating, and formatting text content.
 */
export class TextProcessor {
    /**
     * Maximum allowed length for processed text.
     */
    public static readonly MAX_LENGTH: number = 1000;

    /**
     * Default encoding format used for text processing.
     */
    private static readonly mDefaultEncoding: string = 'utf-8';

    /**
     * Current processing options configuration.
     */
    private mOptions: ProcessingOptions;

    /**
     * Gets the current encoding setting.
     * @returns The encoding format currently in use.
     */
    public get encoding(): string {
        return this.mOptions.encoding;
    }

    /**
     * Sets the encoding format for text processing.
     * @param pEncoding - The encoding format to use.
     */
    public set encoding(pEncoding: string) {
        this.mOptions.encoding = pEncoding;
    }

    /**
     * Creates a new text processor with the specified options.
     * @param pOptions - Configuration options for text processing.
     */
    public constructor(pOptions: ProcessingOptions) {
        this.mOptions = { ...pOptions };
    }

    /**
     * Processes the input text according to configured options.
     *
     * @param pInput - The text content to process.
     *
     * @returns The processed text result.
     *
     * @throws {Error} When input text exceeds maximum length.
     */
    public processText(pInput: string): string {
        // Validate input length.
        if (pInput.length > TextProcessor.MAX_LENGTH) {
            throw new Error(`Text length ${pInput.length} exceeds maximum ${TextProcessor.MAX_LENGTH}`);
        }

        // Apply text transformations.
        const lNormalizedText: string = this.normalizeText(pInput);
        const lValidatedText: string = this.validateText(lNormalizedText);

        // Format and return result.
        const lFormattedResult: string = this.formatText(lValidatedText);
        return lFormattedResult;
    }

    /**
     * Normalizes text content by removing extra whitespace and standardizing format.
     *
     * @param pText - The text to normalize.
     *
     * @returns The normalized text.
     */
    private normalizeText(pText: string): string {
        // Remove leading and trailing whitespace.
        const lTrimmedText: string = pText.trim();

        // Collapse multiple whitespace characters.
        const lCollapsedText: string = lTrimmedText.replace(/\s+/g, ' ');

        return lCollapsedText;
    }
}
```

### Interface Examples
```typescript
// Implementation interface (intended for classes)
/**
 * Defines the contract for objects that can be serialized to different formats.
 */
export interface ISerializable {
    /**
     * Serializes the object to a string representation.
     *
     * @returns The serialized string data.
     */
    serialize(): string;

    /**
     * Deserializes string data back into the object.
     *
     * @param pData - The serialized string data.
     */
    deserialize(pData: string): void;
}

// Type interface (used as simple type)
/**
 * Configuration options for text processing operations.
 */
export interface ProcessingOptions {
    /**
     * The character encoding format to use.
     */
    encoding: string;

    /**
     * Whether to perform strict validation.
     */
    strictMode: boolean;

    /**
     * Maximum processing timeout in milliseconds.
     */
    timeout?: number;
}
```

### Enum Example
```typescript
/**
 * Defines the available text processing modes for different content types.
 */
export enum TextProcessingMode {
    /**
     * Standard text processing with basic validation.
     */
    Standard = 'standard',

    /**
     * Strict processing with comprehensive validation.
     */
    Strict = 'strict',

    /**
     * Lenient processing with minimal validation.
     */
    Lenient = 'lenient'
}
```