import { Dictionary, Exception, List } from '@kartoffelgames/core.data';
import { IGenericEffect } from '../effect/effect_definition/i-generic-effect';
import { SetPitchEffect } from '../effect/effect_definition/pitch/set-pitch-effect';
import { ByteUtil } from './helper/byte-util';

export class BaseEffectParser {
    private readonly mHandler: List<EffectHandlerSetting>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mHandler = new List<EffectHandlerSetting>();
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
     * @param pBitPattern - Bit pattern of effect.
     * @param pHandler - Effect handler.
     */
    public addEffectHandler(pBitPattern: string, pHandler: EffectHandler) {
        const lBitList: Array<string> = [...pBitPattern];

        // Generate bitmask.
        const lBitmaskString: string = lBitList.reduce<string>((pCurrent: string, pNext: string) => {
            if (isNaN(<any>pCurrent)) {
                return pNext + '0';
            } else {
                return pNext + '1';
            }
        }, '');

        const lFixedBitString: string = lBitList.reduce<string>((pCurrent: string, pNext: string) => {
            if (isNaN(<any>pCurrent)) {
                return pNext + '0';
            } else {
                return pNext + pCurrent;
            }
        }, '');

        // Register effect handler.
        this.mHandler.push({
            allocation: {
                bitmask: parseInt(lBitmaskString, 2),
                pattern: pBitPattern,
                fixedBits: parseInt(lFixedBitString, 2)
            },
            handler: pHandler
        });
    }

    /**
     * Parse channel data with handler found with bit pattern.
     * @param pChannel - Channel data.
     */
    public parseChannel(pChannel: ChannelValue): Array<IGenericEffect> {
        // Try to find effect handler.
        const lHandler: EffectHandlerSetting | undefined = this.mHandler.find(pHandler => {
            // Extract effects fixed bits with patterns bitmask and compare with handlers fixed bits.
            const lFixedBits: number = pChannel.effect & pHandler.allocation.bitmask;
            return lFixedBits === pHandler.allocation.fixedBits;
        });

        // Handle no found handler.
        if (!lHandler) {
            throw new Exception('No handler for effect found.', this);
        }

        // Reverse data, lower bits must be first.
        const lReversedEffectBitList: Array<string> = [...pChannel.effect.toString(2)].reverse();
        const lReversedEffectPattern: Array<string> = [...lHandler.allocation.pattern].reverse();

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

        // Call handler.
        return lHandler.handler(lParameterX, lParameterY, pChannel.pitch, pChannel.sample);
    }
}

export type ChannelValue = {
    effect: number;
    pitch: number;
    sample: number;
};

export type EffectHandler = (pParameterX: number, pParameterY: number, pPitch: number, pSample: number) => Array<IGenericEffect>;

type EffectHandlerSetting = {
    allocation: {
        pattern: string;
        fixedBits: number;
        bitmask: number;
    };
    handler: EffectHandler;
};