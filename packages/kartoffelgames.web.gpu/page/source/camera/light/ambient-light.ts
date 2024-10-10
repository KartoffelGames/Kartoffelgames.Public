import { Exception } from '@kartoffelgames/core';
import { Vector } from '../math/vector';

export class AmbientLight {
    private readonly mColor: Vector;

    /**
     * Ambient light Vector4 data.
     */
    public get data(): Array<number> {
        return this.mColor.data;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mColor = new Vector([1, 1, 1, 1]);
    }

    /**
     * Set ambient light color.
     * @param pRed - Red.
     * @param pGreen - Green.
     * @param pBlue - Blue.
     */
    public setColor(pRed: number, pGreen: number, pBlue: number): void {
        if(pRed > 1 || pRed < 0 || pGreen > 1 || pGreen < 0 || pBlue > 1 || pBlue < 0){
            throw new Exception(`Color values need to be in 0 to 1 range. (R:${pRed}, G:${pGreen}, B:${pBlue})`, this);
        }

        this.mColor.data[0] = pRed;
        this.mColor.data[1] = pGreen;
        this.mColor.data[2] = pBlue;
    }
}