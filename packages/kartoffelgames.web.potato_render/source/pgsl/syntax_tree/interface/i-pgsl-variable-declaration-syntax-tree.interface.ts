import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';

export interface IPgslVariableDeclarationSyntaxTree {
    /**
     * Address space of declaration.
     */
    readonly addressSpace: PgslValueAddressSpace;

    /**
     * The variable can not be changed in any way.
     */
    readonly isConstant: boolean;

    /**
     * The variable can only be changed on creation time.
     */
    readonly isCreationFixed: boolean;

    /**
     * Variable name.
     */
    readonly name: string;

    /**
     * Variable type.
     */
    readonly type: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Type of declaration.
     */
    readonly declarationType: PgslDeclarationType;
}