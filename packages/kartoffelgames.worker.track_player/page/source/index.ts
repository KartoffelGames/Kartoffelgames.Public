import { StatefullSerializer } from "../../../kartoffelgames.core.serializer/source/index.ts";
import { GenericModule } from "../../source/generic_module/generic-module.ts";
import { ModParser } from "../../source/module_parser/mod_parser/mod-parser.ts";

(async () => {
    // Load file as binary.
    const lBinaryModFile: Uint8Array = await (async () => {
        const lResponse = await fetch('/sample.mod');
        const lBinaryBuffer = await lResponse.arrayBuffer();
        return new Uint8Array(lBinaryBuffer);
    })();

    // Parse mod file.
    const lModFile: GenericModule = new ModParser(lBinaryModFile).parse();

    // Create a audio context and load the audio processors.
    const lAudioContext = new AudioContext();
    await lAudioContext.audioWorklet.addModule('/bundle/Kartoffelgames.Worker.Track_Player.jsworker');

    // Create oscilatorNode for controlling play and pause.
    const lOscilatorNode = lAudioContext.createOscillator();

    // Create a track player audio node and load the mod file into it.
    const lTrackplayerAudioNode = new AudioWorkletNode(lAudioContext, 'Trackplayer');
    lTrackplayerAudioNode.port.postMessage({
        type: 'load',
        data: new StatefullSerializer().serialize(lModFile)
    });

    lOscilatorNode.connect(lTrackplayerAudioNode).connect(lAudioContext.destination);

    document.addEventListener('click', () => {
        // Play the mod file when the user clicks on the page.
        lOscilatorNode.start();
    });
})();