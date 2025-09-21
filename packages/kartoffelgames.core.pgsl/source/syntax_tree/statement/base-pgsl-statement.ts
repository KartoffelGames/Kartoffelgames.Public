import { BasePgslSyntaxTree } from '../base-pgsl-syntax-tree.ts';

/**
 * PGSL base statement.
 */
export abstract class BasePgslStatement<TValidationAttachment extends object | void = void> extends BasePgslSyntaxTree<TValidationAttachment>{
}