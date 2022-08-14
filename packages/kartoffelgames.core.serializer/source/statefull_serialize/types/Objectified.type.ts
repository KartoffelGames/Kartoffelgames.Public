/* eslint-disable @typescript-eslint/naming-convention */

import { SerializeableGuid } from '../../type';

export type ObjectifiedValue = ObjectifiedSimple | ObjectifiedObject;

export type ObjectifiedObject = ObjectifiedSymbol | ObjectifiedReference | ObjectifiedClass | ObjectifiedBigInt;

export type ObjectifiedSimple = string | number | boolean | undefined | null;

export type ObjectifiedBigInt = {
    '&type': 'bigint',
    '&number': string;
};

export type ObjectifiedSymbol = {
    '&type': 'symbol',
    '&objectId': SerializeableGuid,
    '&values': {
        description: string | undefined;
    };
};

export type ObjectifiedReference = {
    '&type': 'reference',
    '&objectId': SerializeableGuid,
};

export type ObjectifiedClass = {
    '&type': 'class',
    '&constructor': SerializeableGuid,
    '&objectId': SerializeableGuid,
    '&initialisation': {
        parameter: Array<ObjectifiedValue>,
        requiredValues: Array<{ propertyName: string; value: ObjectifiedValue; }>;
    };
    '&values': { [key: string]: ObjectifiedValue; };
};

export type ObjectifiedObjectType = 'class' | 'anonymous-object' | 'reference' | 'array' | 'symbol' | 'bigint';