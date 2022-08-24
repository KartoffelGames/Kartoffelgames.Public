import { Exception, List } from '@kartoffelgames/core.data';
import { IGenericEffect } from '../effect/effect_definition/i-generic-effect';
import { EffectParseEvent } from './effect-parse-event';
import { EffectParseHistory } from './effect-parse-history';

export class EffectParser {
    private readonly mEffectHandler: List<EffectHandlerSetting>;
    private mPitchHandler: EffectHandler | null;
    private mSampleHandler: EffectHandler | null;

    /**
     * Constructor.
     */
    public constructor() {
        this.mEffectHandler = new List<EffectHandlerSetting>();
        this.mPitchHandler = null;
        this.mSampleHandler = null;
    }

    /**
     * Add effect handler for effect bit pattern.
     * 
     * Example: 1001 0000 0101 => 
     * Effect | Param1 | Param2
     * 1001   | 0000   | 0101
     * So the effect pattern would be.
     * "1001xxxxyyyy"
     * 
     * Other character as 0, 1, x and y can be used as seperators.
     * 
     * @param pBitPattern - Bit pattern of effect.
     * @param pHandler - Effect handler.
     */
    public addEffectHandler(pBitPattern: string, pHandler: EffectHandler) {
        const lBitList: Array<string> = [...pBitPattern];

        // Generate bitmask.
        const lBitmaskString: string = lBitList.reduce<string>((pCurrent: string, pNext: string) => {
            // Ignore other characters than 1, 0, x or y
            if (pNext !== '1' && pNext !== '0' && pNext !== 'x' && pNext !== 'y') {
                return pCurrent;
            }

            if (isNaN(<any>pNext)) {
                return pCurrent + '0';
            } else {
                return pCurrent + '1';
            }
        }, '');

        // Get fixed bits of pattern other bits are zero by default.
        const lFixedBitString: string = lBitList.reduce<string>((pCurrent: string, pNext: string) => {
            // Ignore other characters than 1, 0, x or y
            if (pNext !== '1' && pNext !== '0' && pNext !== 'x' && pNext !== 'y') {
                return pCurrent;
            }

            if (isNaN(<any>pNext)) {
                return pCurrent + '0';
            } else {
                return pCurrent + pNext;
            }
        }, '');

        // Create cleared pattern.
        const lClearedPattern: string = lBitList.filter(pCharacter => pCharacter === '1' || pCharacter === '0' || pCharacter === 'x' || pCharacter === 'y').join('');

        // Register effect handler.
        this.mEffectHandler.push({
            allocation: {
                bitmask: parseInt(lBitmaskString, 2),
                pattern: lClearedPattern,
                fixedBits: parseInt(lFixedBitString, 2)
            },
            handler: pHandler
        });
    }

    /**
     * Add pitch handler.
     * Is ignored when the {@link EffectParseEvent.ignorePitch} is set.
     * @param pHandler - Handler.
     */
    public addPitchHandler(pHandler: EffectHandler) {
        this.mPitchHandler = pHandler;
    }

    /**
     * Add sample handler.
     * Is ignored when the {@link EffectParseEvent.ignoreSample} is set.
     * @param pHandler - Handler.
     */
    public addSampleHandler(pHandler: EffectHandler) {
        this.mSampleHandler = pHandler;
    }

    /**
     * Parse channel data with handler found with bit pattern.
     * @param pChannelIndex - Index of channel.
     * @param pChannel - Channel data.
     * @param pHistory - Effect parse history for current channel.
     */
    public parseChannel(pChannelIndex: number, pChannel: ChannelValue, pHistory: EffectParseHistory): Array<IGenericEffect> {
        // Try to find effect handler.
        const lEffectHandler: EffectHandlerSetting | undefined = this.mEffectHandler.find(pHandler => {
            // Extract effects fixed bits with patterns bitmask and compare with handlers fixed bits.
            const lFixedBits: number = pChannel.effect & pHandler.allocation.bitmask;
            return lFixedBits === pHandler.allocation.fixedBits;
        });

        // Create empty effect list and define effect process event.
        let lEvent: EffectParseEvent;
        const lParsedEffectList: Array<IGenericEffect> = new Array<IGenericEffect>();

        // Handle no found handler.
        if (!lEffectHandler) {
            lEvent = new EffectParseEvent(pChannelIndex, pHistory, 0, 0, pChannel.pitch, pChannel.sample);
        } else {
            // Reverse data, lower bits must be first.
            const lReversedEffectBitList: Array<string> = [...pChannel.effect.toString(2)].reverse();
            const lReversedEffectPattern: Array<string> = [...lEffectHandler.allocation.pattern].reverse();

            // Extract parameter X bits.
            let lParameterXBits: string = '';
            let lParameterYBits: string = '';
            for (let lBitIndex: number = 0; lBitIndex < lReversedEffectPattern.length; lBitIndex++) {
                const lPatternCharacter: string = lReversedEffectPattern[lBitIndex];

                // Add bit in, again revered order, to correct parameter bits.
                if (lPatternCharacter === 'x') {
                    lParameterXBits = (lReversedEffectBitList[lBitIndex] ?? 0) + lParameterXBits;
                } else if (lPatternCharacter === 'y') {
                    lParameterYBits = (lReversedEffectBitList[lBitIndex] ?? 0) + lParameterYBits;
                }
            }

            // Convert paraeter bits to number. 
            const lParameterX: number = parseInt(lParameterXBits, 2);
            const lParameterY: number = parseInt(lParameterYBits, 2);

            // Create process event.
            lEvent = new EffectParseEvent(pChannelIndex, pHistory, lParameterX, lParameterY, pChannel.pitch, pChannel.sample);

            // Call handler for effect, pitch and sample processing.
            lParsedEffectList.push(...lEffectHandler.handler(lEvent));
        }

        // Call pitch handler if it is not ignored and set.
        if (!lEvent.ignorePitch) {
            if (!this.mPitchHandler) {
                throw new Exception('No pitch handler is registered.', this);
            }

            lParsedEffectList.push(...this.mPitchHandler(lEvent));
        }

        // Call sample handler if it is not ignored and set.
        if (!lEvent.ignoreSample) {
            if (!this.mSampleHandler) {
                throw new Exception('No sample handler is registered.', this);
            }

            lParsedEffectList.push(...this.mSampleHandler(lEvent));
        }

        return lParsedEffectList;
    }
}

export type ChannelValue = {
    effect: number;
    pitch: number;
    sample: number;
};

export type EffectHandler = (pEvent: EffectParseEvent) => Array<IGenericEffect>;

type EffectHandlerSetting = {
    allocation: {
        pattern: string;
        fixedBits: number;
        bitmask: number;
    };
    handler: EffectHandler;
};
