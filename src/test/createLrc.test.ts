import {expect} from 'chai';
import { createLrc } from '../createLrc';
import {parser} from '..';
import { createObject } from '../createObject';
let lyric = `
[00:00.00]
[00:01.15]aaaaa
[00:15.50]bbbbb
[03:35.13]ccccc
[03:40.00]
`.trim();
describe('createLrc',()=>{
    it('#1',()=>{
        console.log(createLrc(parser(lyric)));
        expect(createLrc(parser(lyric))).to.equal(lyric);
        expect(createLrc(createObject(parser(lyric)))).to.equal(lyric);
    });
})