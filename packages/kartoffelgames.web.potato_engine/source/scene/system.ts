export abstract class System {

    // TODO: Create a "System"-Class that can be registered in the environment. The system can have other system dependencies, so a call order can be created.

    // TODO: InitComponent() - Initializes components data somehow. Maybe with a init method of the component itself?

    // TODO: Hold a list of all components of the system, so that it can update them in the update loop. This list should be updated whenever a component is added or removed from a game object.

    // TODO: Load and deload scenes, it is possible to have multiple scenes loaded at the same time.

    // TODO: Add a action queue to add, remove, activate or deactive components and game objects. At a set time the system can process the queue, so that it can update its lists of components and game objects.
}