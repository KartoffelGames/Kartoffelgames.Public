import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';

/**
 * Decoration history keeps track of any class that was replaces through a decorator.
 */
export class DecorationReplacementHistory {
    private static readonly mBackwardHistory: Dictionary<InjectionConstructor, InjectionConstructor> = new Dictionary<InjectionConstructor, InjectionConstructor>();

    /**
     * Add an decoration parent.
     * 
     * @param pFromConstructor - Previous constructor.
     * @param pToConstructor - Changed / next construtor.
     */
    public static add(pFromConstructor: InjectionConstructor, pToConstructor: InjectionConstructor): void {
        DecorationReplacementHistory.mBackwardHistory.add(pToConstructor, pFromConstructor);
    }

    /**
     * Get the original constructor from a decorator replaced constructor.
     * Iterates through decoration history until it cant find any parent. 
     * 
     * @param pConstructor - Constructor with decorations.
     */
    public static getOriginalOf(pConstructor: InjectionConstructor): InjectionConstructor {
        let lCurrentConstructor: InjectionConstructor;
        // Iterate over history as long as history can't go back.
        for (let lNextEntry: InjectionConstructor | undefined = pConstructor; lNextEntry; lNextEntry = DecorationReplacementHistory.mBackwardHistory.get(lNextEntry)) {
            lCurrentConstructor = lNextEntry;
        }

        return lCurrentConstructor!;
    }
}