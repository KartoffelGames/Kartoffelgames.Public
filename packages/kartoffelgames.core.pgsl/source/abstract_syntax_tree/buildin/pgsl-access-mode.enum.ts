/**
 * Access mode enum.
 */
export const PgslAccessMode = {
    Read: 'read',
    Write: 'write',
    ReadWrite: 'read_write'
} as const;

export type PgslAccessMode = (typeof PgslAccessMode)[keyof typeof PgslAccessMode];