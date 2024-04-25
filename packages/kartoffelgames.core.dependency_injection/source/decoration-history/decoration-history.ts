import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';

export class DecorationReplacementHistory {
    private static readonly mBackwardHistory: Dictionary<InjectionConstructor, InjectionConstructor> = new Dictionary<InjectionConstructor, InjectionConstructor>();

    /**
     * Add an decoration parent.
     * @param pFromConstructor - Previous constructor.
     * @param pToConstructor - Changed / next construtor.
     */
    public static add(pFromConstructor: InjectionConstructor, pToConstructor: InjectionConstructor): void {
        DecorationReplacementHistory.mBackwardHistory.add(pToConstructor, pFromConstructor);
    }

    /**
     * Get the original constructor from a decorator replaced constructor.
     * @param pConstructor - Constructor with decorations.
     */
    public static getOriginalOf(pConstructor: InjectionConstructor): InjectionConstructor {
        let lCurrentConstructor: InjectionConstructor = pConstructor;

        // Iterate over history as long as history can't go back.
        for (let lNextEntry: InjectionConstructor | undefined = lCurrentConstructor; lNextEntry; lNextEntry = DecorationReplacementHistory.mBackwardHistory.get(lNextEntry)) {
            lCurrentConstructor = lNextEntry;
        }

        return lCurrentConstructor;
    }
}