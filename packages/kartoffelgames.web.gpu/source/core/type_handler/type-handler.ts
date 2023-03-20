import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core.data';
import { WgslTypeInformation, TypeToWgsl } from './type-information';
import { WgslType } from './wgsl-type.enum';

export class TypeHandler {
    private static readonly mTypeStorage: Dictionary<WgslType, WgslTypeInformation> = TypeToWgsl;

    /**
     * Type by name.
     * @param pTypeName - Type name. Name must be specified without generic information. Regex: /^\w+$/
     */
    public static typeByName(pTypeName: string): WgslType {
        const lType: WgslType | undefined = EnumUtil.enumKeyByValue(WgslType, pTypeName);
        if (!lType) {
            return WgslType.Any;
        } else {
            return lType;
        }
    }

    /**
     * Get nested type definition from string.
     * Does validate allowed generic types of all depths.
     * @param pTypeString - Type string with optional nested generics.
     */
    public static typeInformationByString(pTypeString: string): WgslTypeDefinition {
        const lTypeRegex: RegExp = /^(?<typename>\w+)(?:<(?<generics>.+)>)?$/;
        const lGenericRegex: RegExp = /(?<generictype>(?:\w+(?:<.+>)?))[,\s]*/g;

        // Match type information.
        const lMatch: RegExpMatchArray | null = pTypeString.match(lTypeRegex);
        if (!lMatch) {
            throw new Exception(`Type "${pTypeString}" can't be parsed.`, TypeHandler);
        }

        const lType: WgslType = TypeHandler.typeByName(lMatch.groups!['typename']);
        const lTypeInformation: WgslTypeInformation = TypeHandler.mTypeStorage.get(lType)!;

        // Scrape generic information of the string.
        const lGenericList: Array<WgslTypeDefinition> = new Array<WgslTypeDefinition>();
        if (lMatch.groups!['generics']) {
            const lGenerics: string = lMatch.groups!['generics'];

            // Execute recursion for all found generic types.
            let lGenericIndex: number = 0;
            let lGenericMatch: RegExpMatchArray | null;
            while ((lGenericMatch = lGenericRegex.exec(lGenerics)) !== null) {
                const lGenericTypeInformation: WgslTypeDefinition = TypeHandler.typeInformationByString(lGenericMatch.groups!['generictype']);

                // Validate generic type.
                if (lType !== WgslType.Any) {
                    lTypeInformation.genericTypes[lGenericIndex].includes(lGenericTypeInformation.type);
                }

                lGenericList.push(lGenericTypeInformation);

                // Count generic index.
                lGenericIndex++;
            }
        }

        return {
            type: lType,
            generics: lGenericList
        };
    }
}

export type WgslTypeDefinition = {
    type: WgslType;
    generics: Array<WgslTypeDefinition>;
};