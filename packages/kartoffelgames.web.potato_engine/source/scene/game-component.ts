import { IAnyParameterConstructor } from "../../../kartoffelgames.core/source/interface/i-constructor.ts";

export class GameComponent { 
    // TODO: Should contain a reference to the game object it is attached to
}

export type GameComponentConstructor = IAnyParameterConstructor<GameComponent>;