import { BasePgslType } from "./definition/base-pgsl-type.ts";

export class PgslTypeCache {
    private readonly mTypes: Map<string, BasePgslType> = new Map<string, BasePgslType>();
}