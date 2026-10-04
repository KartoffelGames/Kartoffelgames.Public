// TODO: That can be moved into ast directly.
export enum PgslAssignment {
    Assignment = '=',
    AssignmentPlus = '+=',
    AssignmentMinus = '-=',
    AssignmentMultiply = '*=',
    AssignmentDivide = '/=',
    AssignmentModulo = '%=',
    AssignmentBinaryAnd = '&=',
    AssignmentBinaryOr = '|=',
    AssignmentBinaryXor = '^=',
    AssignmentShiftRight = '>>=',
    AssignmentShiftLeft = '<<='
}