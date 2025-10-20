import { Exception } from "@kartoffelgames/core";
import { PgslTrace } from "../../trace/pgsl-trace.ts";
import { PgslArrayType } from "../../type/pgsl-array-type.ts";
import { PgslBooleanType } from "../../type/pgsl-boolean-type.ts";
import { PgslBuildInType } from "../../type/pgsl-build-in-type.ts";
import { PgslInvalidType } from "../../type/pgsl-invalid-type.ts";
import { PgslMatrixType } from "../../type/pgsl-matrix-type.ts";
import { PgslNumericType } from "../../type/pgsl-numeric-type.ts";
import { PgslPointerType } from "../../type/pgsl-pointer-type.ts";
import { PgslSamplerType } from "../../type/pgsl-sampler-type.ts";
import { PgslStringType } from "../../type/pgsl-string-type.ts";
import { PgslStructType } from "../../type/pgsl-struct-type.ts";
import { PgslTextureType } from "../../type/pgsl-texture-type.ts";
import { PgslType } from "../../type/pgsl-type.ts";
import { PgslVectorType } from "../../type/pgsl-vector-type.ts";
import { PgslVoidType } from "../../type/pgsl-void-type.ts";
import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslExpression } from "../expression/pgsl-expression.ts";

/**
 * PGSL base type definition.
 */
export class PgslTypeDeclaration extends BasePgslSyntaxTree {
    private readonly mTypeName: string;
    private readonly mTemplate: Array<BasePgslSyntaxTree>;
    private readonly mIsPointer: boolean;
    private mResolvedType: PgslType | null;

    /**
     * Get type of definition.
     */
    public get type(): PgslType {
        if (this.mResolvedType === null) {
            throw new Exception(`Type definition not traced yet.`, this);
        }

        return this.mResolvedType;
    }

    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pTypeName: string, pTemplate: Array<BasePgslSyntaxTree>, pIsPointer: boolean, pMeta?: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Add templates as children.
        for (const lTemplate of pTemplate) {
            this.appendChild(lTemplate);
        }

        this.mTypeName = pTypeName;
        this.mTemplate = pTemplate;
        this.mIsPointer = pIsPointer;
        this.mResolvedType = null;
    }

    /**
     * Resolve the type definition based on the current trace context.
     * 
     * @param pTrace - Trace to use for type resolution.
     * 
     * @returns Resolved type.
     */
    private resolveType(pTrace: PgslTrace): PgslType {
        // Type to pointer.
        if (this.mIsPointer) {
            return this.resolvePointer(pTrace, this.mTypeName, this.mTemplate);
        }

        let lType: PgslType | null = null;

        // Try to parse to void type.
        if ((lType = this.resolveVoid(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse to struct type.
        if ((lType = this.resolveStruct(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse alias type.
        if ((lType = this.resolveAlias(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse enum type.
        if ((lType = this.resolveEnum(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse build in type.
        if ((lType = this.resolveBuildIn(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse numeric type.
        if ((lType = this.resolveNumeric(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse boolean type.
        if ((lType = this.resolveBoolean(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse string type.
        if ((lType = this.resolveString(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse vector type.
        if ((lType = this.resolveVector(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse matrix type.
        if ((lType = this.resolveMatrix(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse sampler type.
        if ((lType = this.resolveSampler(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse array type.
        if ((lType = this.resolveArray(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse texture type.
        if ((lType = this.resolveTexture(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        throw new Exception(`Typename "${this.mTypeName}" not defined`, this);
    }

    /**
     * Trace this syntax tree node and its children.
     * Only traces the templates as they are the only children.
     * 
     * @param pTrace - Trace to use for tracing.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        for (const lTemplate of this.mTemplate) {
            lTemplate.trace(pTrace);
        }

        // Resolve type.
        this.mResolvedType = this.resolveType(pTrace);
    }

    /**
     * Try to resolve raw type as alias type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveAlias(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve alias
        const lAlias = pTrace.getAlias(pRawName);
        if (!lAlias) {
            return null;
        }

        // No templates allowed.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Alias can't have templates values.`, this);
        }

        return lAlias.underlyingType;
    }

    /**
     * Try to resolve raw type as array type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveArray(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve array type.
        if (pRawName !== PgslArrayType.typeName.array) {
            return null;
        }

        // Arrays need at least one type parameter.
        if (!pRawTemplate || pRawTemplate.length < 1) {
            pTrace.pushIncident(`Arrays need at least one template parameter`, this);
        }

        // But not more than two parameter.
        if (pRawTemplate.length > 2) {
            pTrace.pushIncident(`Arrays supports only two template parameter.`, this);
        }

        // First template needs to be a type.
        const lTypeTemplate: BasePgslSyntaxTree | undefined = pRawTemplate[0];
        if (!(lTypeTemplate instanceof PgslTypeDeclaration)) {
            pTrace.pushIncident(`First array template parameter must be a type.`, this);

            // Fallback to invalid type.
            return new PgslInvalidType(pTrace);
        }

        // Second length parameter.
        let lLengthParameter: PgslExpression | null = null;
        if (pRawTemplate.length > 1) {
            const lLengthTemplate: BasePgslSyntaxTree = pRawTemplate[1];
            if (!(lLengthTemplate instanceof PgslExpression)) {
                pTrace.pushIncident(`Array length template must be a expression.`, this);
            } else {
                // Set optional length expression.
                lLengthParameter = lLengthTemplate;
            }
        }

        // Build BuildInType definition.
        return new PgslArrayType(pTrace, lTypeTemplate.type, lLengthParameter);
    }

    /**
     * Try to resolve raw type as boolean type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBoolean(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve boolean type.
        if (pRawName !== PgslBooleanType.typeName.boolean) {
            return null;
        }

        // Boolean should not have any templates.
        if (pRawTemplate.length > 0) {
            pTrace.pushIncident(`Boolean can't have templates values.`, this);
        }

        return new PgslBooleanType(pTrace);
    }

    /**
     * Try to resolve raw type as build in value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBuildIn(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslBuildInType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Validate build in type with template.
        if (pRawTemplate.length > 1) {
            // Build in types support only a single expression parameter.
            const lTemplateExpression: BasePgslSyntaxTree = pRawTemplate[0];
            if (!(lTemplateExpression instanceof PgslExpression)) {
                pTrace.pushIncident(`Array length template must be a expression.`, this);
                return new PgslInvalidType(pTrace);
            }

            // Build BuildInType definition with template. 
            return new PgslBuildInType(pTrace, pRawName as any, lTemplateExpression);
        }

        // Build BuildInType definition without template.
        return new PgslBuildInType(pTrace, pRawName as any, null);
    }

    /**
     * Try to resolve raw type as enum type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveEnum(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve enum.
        const lEnum = pTrace.getEnum(pRawName);
        if (!lEnum) {
            return null;
        }

        // Enums should not have any templates.
        if (pRawTemplate.length > 0) {
            pTrace.pushIncident(`Enum can't have templates values.`, this);
        }

        return lEnum.underlyingType;
    }

    /**
     * Try to resolve raw type as matrix value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveMatrix(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslMatrixType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Validate matrix type.
        if (!pRawTemplate || pRawTemplate.length !== 1) {
            pTrace.pushIncident(`Matrix types need a single template type.`, this);
        }

        // Validate template parameter.
        const lInnerTypeDefinition: BasePgslSyntaxTree = pRawTemplate[0];
        if (!(lInnerTypeDefinition instanceof PgslTypeDeclaration)) {
            pTrace.pushIncident(`Matrix template parameter needs to be a type definition.`, this);
            return new PgslInvalidType(pTrace);
        }

        // Build matrix definition.
        return new PgslMatrixType(pTrace, pRawName as any, lInnerTypeDefinition.type);
    }

    /**
     * Try to resolve raw type as numeric value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveNumeric(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslNumericType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Numerics should not have any templates.
        if (pRawTemplate.length > 0) {
            pTrace.pushIncident(`Numeric can't have templates values.`, this);
        }

        // Build numeric definition.
        return new PgslNumericType(pTrace, pRawName as any);
    }

    /**
     * Try to resolve raw type as pointer value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolvePointer(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType {
        // Create a new type declaration without pointer.
        const lInnerTypeDeclaration: PgslTypeDeclaration = new PgslTypeDeclaration(pRawName, pRawTemplate, false);
        lInnerTypeDeclaration.trace(pTrace);

        // Resolve inner type.
        const lTypeDeclaration: PgslType = lInnerTypeDeclaration.type;

        // Build pointer type definition.
        return new PgslPointerType(pTrace, lTypeDeclaration);
    }

    /**
     * Try to resolve raw type as sampler value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveSampler(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (pRawName !== PgslSamplerType.typeName.sampler && pRawName !== PgslSamplerType.typeName.samplerComparison) {
            return null;
        }

        // Sampler should not have any templates.
        if (pRawTemplate.length > 0) {
            pTrace.pushIncident(`Sampler type can't have template parameters.`, this);
        }

        // Build numeric definition.
        return new PgslSamplerType(pTrace, pRawName === PgslSamplerType.typeName.samplerComparison);
    }

    /**
     * Try to resolve raw type as string type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveString(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve string type.
        if (pRawName !== PgslStringType.typeName.string) {
            return null;
        }

        // String should not have any templates.
        if (pRawTemplate.length > 0) {
            pTrace.pushIncident(`String type can't have template parameters.`, this);
        }

        // String should never be used directly.
        pTrace.pushIncident(`String type can't be explicit defined.`, this);

        return new PgslStringType(pTrace);
    }

    /**
     * Try to resolve raw type as struct type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveStruct(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve struct
        if (!pTrace.getStruct(pRawName)) {
            return null;
        }

        // Structs should not have any templates.
        if (pRawTemplate.length > 0) {
            pTrace.pushIncident(`Structs can't have templates values.`, this);
        }

        // Create new struct type definition.
        return new PgslStructType(pTrace, pRawName);
    }

    /**
     * Try to resolve raw type as texture value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveTexture(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslTextureType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Validate texture templates, that they are eighter a PgslExpression or PgslTypeDeclaration.
        for (const lTemplate of pRawTemplate) {
            if (!(lTemplate instanceof PgslExpression) && !(lTemplate instanceof PgslTypeDeclaration)) {
                pTrace.pushIncident(`Texture template parameters must be either a type definition or an expression.`, this);
            }
        }

        // Build texture type definition.
        return new PgslTextureType(pTrace, pRawName as any, pRawTemplate as Array<PgslTypeDeclaration | PgslExpression>);
    }

    /**
     * Try to resolve raw type as vector value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVector(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslVectorType.typeName).includes(pRawName as any)) {
            return null;
        }

        const lVectorDimension: number = (() => {
            switch (pRawName) {
                case PgslVectorType.typeName.vector2: return 2;
                case PgslVectorType.typeName.vector3: return 3;
                case PgslVectorType.typeName.vector4: return 4;
                default: return 2; // Should never happen.
            }
        })();

        let lInnerType: PgslType | null = (() => {
            // Vector needs a single template parameter.
            if (!pRawTemplate || pRawTemplate.length < 1) {
                pTrace.pushIncident(`Vector types need a single template type.`, this);
                return null;
            }

            // First template must to be a type definition.
            const lVectorInnerTypeTemplate: BasePgslSyntaxTree = pRawTemplate[0];
            if (!(lVectorInnerTypeTemplate instanceof PgslTypeDeclaration)) {
                pTrace.pushIncident(`Vector template parameter needs to be a type definition.`, this);
                return null;
            }

            return lVectorInnerTypeTemplate.resolveType(pTrace);
        })();

        // Fallback to invalid type.
        if (lInnerType === null) {
            lInnerType = new PgslInvalidType(pTrace);
        }

        // Build vector definition.
        return new PgslVectorType(pTrace, lVectorDimension, lInnerType);
    }

    /**
     * Try to resolve raw type as void type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVoid(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve void type.
        if (pRawName !== PgslVoidType.typeName.void) {
            return null;
        }

        // Void should not have any templates.
        if (pRawTemplate.length > 0) {
            pTrace.pushIncident(`Void type can't have template parameters.`, this);
        }

        return new PgslVoidType(pTrace);
    }

    // /**
    //  * Transpile current type definition into a string.
    //  * 
    //  * @param pTrace - Transpilation trace.
    //  * 
    //  * @returns Transpiled string.
    //  */
    // protected override onTranspile(pTrace: PgslFileMetaInformation): string {
    //     // Transpile pointer type. // TODO: This must be autoed or give the user a way to specify it (private, read_write, etc.).
    //     return `ptr<private, ${this.mReferencedType.transpile(pTrace)}, read_write>`;
    // }

}
