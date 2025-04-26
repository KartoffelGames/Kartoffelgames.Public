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