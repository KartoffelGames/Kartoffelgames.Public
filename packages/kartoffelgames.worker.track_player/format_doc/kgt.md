## Headerlayout

| Offset     | Length                | Format           | Description                             |
| ---------- | --------------------- | ---------------- | --------------------------------------- |
| 0x0000     | 1                     | Byte             | Length of the song name in bytes        |
| 0x0001     | 2                     | Big end word     | Count of Pattern order                  |
| 0x0002     | 2                     | Big end word     | Count of Patterns                       |
| 0x0003     | 2                     | Big end word     | Count of Instruments                    |
| 0x0004     | 2                     | Big end word     | Count of Samples                        |
| 0x0005     | 2                     | Big end word     | Global colume 0 -> 255                  |
| 0x0006     | 2                     | Big end word     | Initial BPM                             |
| 0x0008     | 1                     | Byte             | Pattern channel count                   |
| 0x0009     | 5                     | Char             | File version "KGT01"                    |
| 0x000e     | 1 x Channel count     | Byte             | Initial value for each channel          |
| 0x000f ... | 1 x Count of orders   | Big end word     | Pattern order list                      |

Global Volume: 0 -> 255. This is the volume of the whole song. Any sample will be adjusted by it. 0 = no sound, 255 = full volume.

## Sample layout

| Offset     | Length                | Format           | Description                                                                 |
| ---------- | --------------------- | ---------------- | --------------------------------------------------------------------------- |
| 0x0000     | 1                     | Byte             | Sample volume                                                               |
| 0x0001     | 1                     | Bitmask          | Flags:<br> Bit 1. On = Use loop<br>                                         |
|            |                       |                  |            Bit 2. On = Use sustain loop<br>                                 |
|            |                       |                  |            Bit 3. On = Ping Pong loop, Off = Forwards loop<br>              |
|            |                       |                  |            Bit 4. On = Ping Pong Sustain loop, Off = Forwards Sustain loop  |
| 0x0002     | 4                     | Long             | Length of sample in bytes. Used the compressed length not the uncompressed. |
| 0x0006     | 4                     | Long             | Number of samples a second for a C-5 note                                   |
| 0x000a     | 4                     | Long             | Loop start position in number of samples in. Not bytes.                     |
| 0x000e     | 4                     | Long             | Length of loop, Number of samples. Not bytes.                               |
| 0x0012     | 4                     | Long             | Sustain loop start position in number of samples in. Not bytes.             |
| 0x0016     | 4                     | Long             | Length of sustain loop, Number of samples. Not bytes.                       |
| 0x001a     | 1.5                   | uint12           | Vibrato speed, Wavelength measured in miliseconds                           |
| 0x001b     | 0.5                   | Nibble           | Vibrato waveform                                                            |
| 0x001c     | 1                     | Byte             | Vibrato depth, Amplitude in Finetune                                        |
| 0x001d     | 1                     | Byte             | Vibrato rate. Percentage [integer] amplitude is applied each second.        |