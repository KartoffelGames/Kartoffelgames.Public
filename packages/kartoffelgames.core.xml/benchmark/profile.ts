import { XmlParser } from "../source/index.ts";

// Load xml files.
//const gFile: string = new TextDecoder("utf-8").decode(Deno.readFileSync(import.meta.dirname + "/basic-structure.xml"));
const gFile: string = new TextDecoder("utf-8").decode(Deno.readFileSync(import.meta.dirname + "/complex-nested.xml"));
//const gFile: string = new TextDecoder("utf-8").decode(Deno.readFileSync(import.meta.dirname + "/large-dataset.xml"));

const lXmlParser = new XmlParser();
const lResult = lXmlParser.parse(gFile);

console.log(lResult)

console.log('READY')