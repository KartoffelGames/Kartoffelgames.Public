# KGT-File format
 * Data Layouts
    * [Header layout](#header-layout)
    * [Sample layout](#sample-layout)
    * [Instrument layout](#instrument-layout)
    * [Envelope layout](#envelope-layout)
    * [Pattern layout](#pattern-layout)

## Header layout

| Offset     | Length                | Format           | Description                             |
| ---------- | --------------------- | ---------------- | --------------------------------------- |
| 0x0000     | 1                     | Byte             | Length of the song name in bytes        |
| 0x0001     | 2                     | Big end word     | Count of Pattern order                  |
| 0x0003     | 2                     | Big end word     | Count of Patterns                       |
| 0x0005     | 1                     | Byte             | Count of Instruments. Max: 250          |
| 0x0006     | 1                     | Byte             | Count of Samples. Max: 250              |
| 0x0007     | 2                     | Big end word     | Global volume 0 -> 255                  |
| 0x0009     | 2                     | Big end word     | Initial BPM                             |
| 0x000b     | 1                     | Byte             | Pattern channel count                   |
| 0x000c     | 1                     | Byte             | Pattern row count                   |
| 0x000d     | 5                     | Char             | File version "KGT01"                    |
| 0x0011     | 1 x Channel count     | Byte             | Initial volume for each channel         |
| 0x0012 ... | 1 x Count of orders   | Big end word     | Pattern order list                      |

**Volume**: 0 -> 255. This is the volume of the whole song. Any instrument will be adjusted by it. 0 = no sound, 255 = full volume.\

**Pattern oder list**: List of pattern indices. The order the patterns are played in the song. Pattern can be present multiple times in the list.\

## Sample layout

| Offset     | Length                | Format           | Description                                                                 |
| ---------- | --------------------- | ---------------- | --------------------------------------------------------------------------- |
| 0x0000     | 1                     | Byte             | Sample volume                                                               |
| 0x0001     | 1                     | Bitmask          | Flags:     Bit 1. On = Use loop                                             |
|            |                       |                  |            Bit 2. On = Use sustain loop                                     |
|            |                       |                  |            Bit 3. On = Ping Pong loop, Off = Forwards loop                  |
|            |                       |                  |            Bit 4. On = Ping Pong Sustain loop, Off = Forwards Sustain loop  |
| 0x0002     | 4                     | Long             | Length of sample in bytes. Used the compressed length not the uncompressed. |
| 0x0006     | 4                     | Long             | Number of samples a second for a C-5 note                                   |
| 0x000a     | 4                     | Long             | Loop start position in number of samples in. Not bytes.                     |
| 0x000e     | 4                     | Long             | Length of loop, Number of samples. Not bytes.                               |
| 0x0012     | 4                     | Long             | Sustain loop start position in number of samples in. Not bytes.             |
| 0x0016     | 4                     | Long             | Length of sustain loop, Number of samples. Not bytes.                       |
| 0x001a     | 1.5                   | uint12           | Vibrato speed, Wavelength measured in miliseconds                           |
| 0x001b     | 0.5                   | Nibble           | Vibrato waveform                                                            |
| 0x001c     | 1                     | Byte             | Vibrato depth, Amplitude in Cents. One semitone => 100 Cents                |
| 0x001d     | 1                     | Byte             | Vibrato rate. Percentage *integer* amplitude is applied each second.        |

**Substain loop**: They are always considered before normal loops, so if the sustain loop is placed beyond the normal loop, the normal loop is ignored at first. As soon as the sustain loop is exited by a off NNA, playback is resumed in the normal loop. 

## Instrument layout

| Offset     | Length                | Format           | Description                                                                 |
| ---------- | --------------------- | ---------------- | --------------------------------------------------------------------------- |
| 0x0000     | 25                    | Char             | Instrument name. 25 bytes long.                                             |
| 0x0019     | 1                     | Bitmask          | Play flag in two bits groups:                                               |
|            |                       |                  |       xx-- ---- New Note Action                                             |
|            |                       |                  |           0 = Cut                                                           |
|            |                       |                  |           1 = Continue                                                      |
|            |                       |                  |           2 = Note off                                                      |
|            |                       |                  |           3 = Note fade                                                     |
|            |                       |                  |                                                                             |
|            |                       |                  |       --xx ---- Duplicate Check Type                                        |
|            |                       |                  |           0 = Off (Use New note action)                                     |
|            |                       |                  |           1 = Note                                                          |
|            |                       |                  |           2 = Sample                                                        |
|            |                       |                  |           3 = Instrument                                                    |
|            |                       |                  |                                                                             |
|            |                       |                  |       ---- xx-- Duplicate Check Action                                      |
|            |                       |                  |           0 = Cut                                                           |
|            |                       |                  |           1 = Continue                                                      |
|            |                       |                  |           2 = Note off                                                      |
|            |                       |                  |           3 = Note fade                                                     |
|            |                       |                  |                                                                             |
| 0x001a     | 1                     | Byte             | Volume of the instrument.                                                   |
| 0x001b     | 1                     | Byte             | Volume fadeout rate. Percentage *integer* starting volume is decreased.     |
| 0x001c     | 240                   | Byte-Pair        | Note-Sample/Keyboard Table as note-sample byte pairs (Note, SampleNumber).  |
|            |                       |                  | Notes range from C-0 to B-9 (120 semitones)                                 |
|            |                       |                  | Samples are specified by number not index. 0 = No sample                    |
| 0x010c     | 3 x Variable          | -                | [Instrument envelope layouts](#envelope-layout) x 3                         |
|            |                       |                  | First volume, second for panning, third for pitch.                          |

**New note action (NNA)**: This is the action that will be taken when a new note is played while the current still played.
The default is to cut the old note.
   * **Note Cut**: The old note is instantly cut off and replaced by the new note.
   * **Continue**: The old note continues to play. This is mostly useful with short one-shot samples such as percussion instruments.
                   When using this option together with looped samples, they will loop indefinitely.
   * **Note Off**: Sustain loops of the old note are released. Normal loops are not released and continue to play.
   * **Note Fade**: The old note is faded out.

**Duplicate check type**: This is the type of duplicate check that will be used. The default is to use the NNA when the same note is played again.\

**Duplicate check action**: This is the action that will be taken when a duplicate played. The default is to use the specified NNA.
As an example, take a piano instrument. The dublicate check type is set to note. 
In a normal piano the old note is not cut off when playing a different note. But when the same note is played again, the note will cut of the old same note and play it again from the start./

**Volume**: 0 -> 255. This is the volume of the whole instrument. Any sample will be adjusted by it. 0 = no sound, 255 = full volume.\

**Volume fadeout rate**: When set to 0, has the same effect as the continue NNA. \
Fade applied when:\
    *1*. Note fade NNA is selected and triggered by playing a new note.\
    *2*. Note off NNA is selected with no volume envelope loop.\
    *3*. Volume envelope end is reached\

## Envelope layout

| Offset     | Length                | Format           | Description                                                                 |
| ---------- | --------------------- | ---------------- | --------------------------------------------------------------------------- |
| 0x0000     | 1                     | Bitmask          | Flags:     Bit 0. On = Use envelope                                         |
|            |                       |                  |            Bit 1. On = Use loop                                             |
|            |                       |                  |            Bit 2. On = Use sustain loop                                     |
| 0x0001     | 1                     | Byte             | Number of node points.                                                      |
| 0x0002     | 1                     | Byte             | Loop start node.                                                            |
| 0x0003     | 1                     | Byte             | Loop length in nodes.                                                       |
| 0x0004     | 1                     | Byte             | Sustain loop start node.                                                    |
| 0x0005     | 1                     | Byte             | Sustain loop length in nodes.                                               |
| 0x0006     | 3 x number of nodes.  | Byte, Long       | Nodes paires as value-position-tubles First byte is the value.              |
|            |                       |                  | Second long the position in milisecond.                                     |
|            |                       |                  | Values by type:                                                             |
|            |                       |                  |     * Volume envelopes - 0 = no sound, 255 = full volume.                   |
|            |                       |                  |     * Panning envelopes - -128 to +127 where 0 = center.                    |
|            |                       |                  |     * Pitch envelopes - -128 to +127 where each represents a half semitone  |

## Pattern layout

| Offset     | Length                | Format           | Description                                                                 |
| ---------- | --------------------- | ---------------- | --------------------------------------------------------------------------- |
| 0x0000     | Yes                   | Byte             | Raw pattern data                                                            |

The pattern data is read column by column and not row by row. Data can either be a definition byte, a note byte or a effect byte.\
The data block starts with a definition byte indicating the next comming data.

**Definition bytes** the following variations are possible:
 * 0xxx xxxx - Where the tailing 7 bits are the number of cells that are left blank.
 * 100x yyyy - Signals a occupied cell. The tailing 4 bits (y) are the number of effects of this cell.
		       The x bit specifies if the next block contains any Instrument and pitch or just effects.
 
**Effects** are specified as two Bytes. A effect type byte and a effect parameter byte.

**Notes** are also specified as two bytes. The first byte is the instrument index and the second byte is the note itself starting from 0 => A-1.

As an example, the following 16 row pattern data with a single channel:
```
1001 0001 : 0x91 => Definition byte, Next: 1 effect with instrument and pitch.
0000 0001 : 0x01 => Instrument Index 1.
0000 0005 : 0x05 => Pitch F-1.
0000 1010 : 0x0A => Effect 10.
0101 1111 : 0x5F => Effect parameter 95.
0000 0101 : 0x05 => Definition byte, Next: 5 cells are empty.
1000 0002 : 0x91 => Definition byte, Next: 2 effects without instrument and pitch.
0000 1011 : 0x0A => Effect 11.
0101 1111 : 0x5F => Effect parameter 95.
0000 0011 : 0x03 => Effect 3.
0100 1000 : 0x48 => Effect parameter 72.
1001 0000 : 0x50 => Definition byte, Next: 0 effects with instrument and pitch.
0000 1001 : 0x09 => Instrument Index 9.
0000 1001 : 0x09 => Pitch G#-1.
0000 1000 : 0x08 => Definition byte, Next: 8 cells are empty.
```

Results in pattern data:

| Position | Instrument Index | Note | Effects   |
| -------- | ---------------- | ---- | --------- |
| 0x00     | 1                | F-1  | 1 Effect  |
| 0x01     | (Empty)          | -    | -         |
| 0x02     | (Empty)          | -    | -         |
| 0x03     | (Empty)          | -    | -         |
| 0x04     | (Empty)          | -    | -         |
| 0x05     | (Empty)          | -    | -         |
| 0x06     | -                | -    | 2 Effect  |
| 0x07     | 9                | G#-1 | -         |
| 0x08     | (Empty)          | -    | -         |
| 0x09     | (Empty)          | -    | -         |
| 0x0A     | (Empty)          | -    | -         |
| 0x0B     | (Empty)          | -    | -         |
| 0x0C     | (Empty)          | -    | -         |
| 0x0D     | (Empty)          | -    | -         |
| 0x0E     | (Empty)          | -    | -         |
| 0x0F     | (Empty)          | -    | -         |