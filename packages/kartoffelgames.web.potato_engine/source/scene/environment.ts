import { Component } from "./component.ts";
import { EnvironmentStateChange } from "./environment-transmittion.ts";
import { GameObject } from "./game-object.ts";
import { Scene } from "./scene.ts";
import { System } from "./system.ts";

export class Environment {
    private readonly mSystems: Array<System> = new Array<System>();
    private readonly mStateChangeQueue: Array<EnvironmentStateChange> = new Array<EnvironmentStateChange>();

    public registerSystem(system: System): void {
        // TODO: Check dependencies of system.

        // TODO: Register system as a component initializer if it has set any.

        this.mSystems.push(system);
    }

    public loadScene(_scene: Scene): void {
        // TODO: Load all game objects/ their components with an index of the scene.
        // So a scene can be loaded and deloaded independently of another by maybe create independent buffers of each scene.
    }

    public unloadScene(_scene: Scene): void {
        // The same as loadScene, but in reverse.
    }
}

