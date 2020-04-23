import { parser } from "../parser"
import * as fs from 'fs';

let lrc = fs.readFileSync('x.lrc').toString();
//console.log(lrc);
console.log(JSON.stringify(parser(lrc),undefined,2));
//console.log(parser(lrc).children[3].children[1].value);