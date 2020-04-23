import parser from ".."
import { createObject } from "../createObject";

let lrc=`[00:00.00]
[00:01.15]aaaaa
[00:15.50]bbbbb
[03:35.13]ccccc
[03:40.00]`
console.log(JSON.stringify(parser(lrc),undefined,2));
console.log(JSON.stringify(createObject(parser(lrc)),undefined,2));
