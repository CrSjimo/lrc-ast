import { createObject } from "../createObject"
import {parser} from ".."
import { createLrc } from "../createLrc";

let lyric = `
[00:00.00]
[00:01.15]aaaaa
[00:15.50]bbbbb
[03:35.125]ccccc
[03:40.00]
`
//console.log(JSON.stringify(createObject(parser(lyric)),undefined,2));
console.log(createLrc(parser(lyric)));