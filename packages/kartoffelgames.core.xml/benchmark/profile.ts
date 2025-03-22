import { XmlParser } from "../source/index.ts";

// Load xml files.
//const gFile: string = new TextDecoder("utf-8").decode(Deno.readFileSync(import.meta.dirname + "/basic-structure.xml"));
//const gFile: string = new TextDecoder("utf-8").decode(Deno.readFileSync(import.meta.dirname + "/complex-nested.xml"));
const gFile: string = new TextDecoder("utf-8").decode(Deno.readFileSync(import.meta.dirname + "/large-dataset.xml"));

const lXmlParser = new XmlParser();

let lCurrentPosition: number = 0;
let lCurrentLine: number = 0;
let lCurrentColumn: number = 0;
let lCurrentPercent: number = 0;
let lLastLine: number = 0;
let lLastTime: number = Date.now();

const lResult = lXmlParser.parse(gFile, (pPosition: number, pLine: number, pColumn: number, pPercent: number) => {
    lCurrentPosition = pPosition;
    lCurrentLine = pLine;
    lCurrentColumn = pColumn;
    lCurrentPercent = pPercent;

    if (Date.now() - lLastTime > 1000) {
        console.log(lCurrentPercent.toFixed(2).padStart(5, ' '), '%', 'P:' + lCurrentPosition, 'L:' + lCurrentLine, 'C:' + lCurrentColumn, 'L/s:', (lCurrentLine - lLastLine));
        lLastLine = lCurrentLine;
        lLastTime = Date.now();
    }
});

console.log(lResult);

console.log('READY');