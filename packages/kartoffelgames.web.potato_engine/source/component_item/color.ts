import { Serializer } from '@kartoffelgames/core-serializer';
import { GameComponentItem } from '../core/component/game-component-item.ts';

/**
 * Component item that holds an RGBA color value.
 * Changes to any channel propagate to linked parent components.
 */
@Serializer.serializeableClass('c83e4f12-9a6b-4d10-b2f7-6e8a1c3d5f90')
export class Color extends GameComponentItem {
    private mA: number;
    private mB: number;
    private mG: number;
    private mR: number;

    /**
     * Alpha channel (0-1).
     */
    @Serializer.property()
    public get a(): number {
        return this.mA;
    } set a(pValue: number) {
        this.mA = pValue;
        this.update();
    }

    /**
     * Blue channel (0-1).
     */
    @Serializer.property()
    public get b(): number {
        return this.mB;
    } set b(pValue: number) {
        this.mB = pValue;
        this.update();
    }

    /**
     * Green channel (0-1).
     */
    @Serializer.property()
    public get g(): number {
        return this.mG;
    } set g(pValue: number) {
        this.mG = pValue;
        this.update();
    }

    /**
     * Red channel (0-1).
     */
    @Serializer.property()
    public get r(): number {
        return this.mR;
    } set r(pValue: number) {
        this.mR = pValue;
        this.update();
    }

    /**
     * Constructor. Defaults to opaque white (1, 1, 1, 1).
     */
    public constructor() {
        super('Color');

        this.mR = 1;
        this.mG = 1;
        this.mB = 1;
        this.mA = 1;
    }
}
