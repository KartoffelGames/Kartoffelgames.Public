export class ModuleFileBoundingState {

    name: {
        lengthByte: {
            start: 0;
            length: 1;
        };
        data: {
            start: 1;
            length: number;
        };
    };

    samples: {
        count: {
            start: number; // Dynamicly calculate.
            length: 1;
        };
    };

}