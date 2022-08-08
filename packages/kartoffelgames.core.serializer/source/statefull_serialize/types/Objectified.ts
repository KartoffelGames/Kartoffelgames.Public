/* eslint-disable @typescript-eslint/naming-convention */

import { SerializeableGuid } from '../../type';

export type ObjectifedValue = ObjectifiedSimple | ObjectifiedBigInt | ObjectifiedObject;

export type ObjectifiedSimple = string | number | boolean | undefined | null;

export type ObjectifiedObject = ObjectifiedSymbol | ObjectifiedArray | ObjectifiedReference | ObjectifiedAnonymousObject | ObjectifiedClass;

export type ObjectifiedBigInt = {
    '&type': 'bigint',
    '&values': {
        'number': string;
    };
};

export type ObjectifiedSymbol = {
    '&type': 'symbol',
    '&objectId': SerializeableGuid,
    '&values': {
        'description': string | undefined;
    };
};

export type ObjectifiedArray = {
    '&type': 'array',
    '&objectId': SerializeableGuid,
    '&values': Array<ObjectifedValue>;
};

export type ObjectifiedReference = {
    '&type': 'reference',
    '&objectId': SerializeableGuid,
};

export type ObjectifiedAnonymousObject = {
    '&type': 'anonymous-object',
    '&objectId': SerializeableGuid,
    '&values': { [key: string]: ObjectifedValue; };
};

export type ObjectifiedClass = {
    '&type': 'class',
    '&constructor': SerializeableGuid,
    '&objectId': SerializeableGuid,
    '&parameter': Array<ObjectifedValue>,
    '&values': { [key: string]: ObjectifedValue; };
};