import { FileNode } from "./declarations/LrcAstNode";
import { TimeLabel, LyricObject } from "./declarations/LyricObject";

/**
 * Options of creating lrc file.
 */
export interface CreateLrcOptions{

    /**
     * Width of millisecond digits. Additional zeros will be inserted at the end.
     * 
     * For example, if it equals `3`, `50` will be formatted as `500`.
     * @default 2
     */
    millisecondDigits?:number;

    /**
     * End-of-line sequence.
     * @default \n
     */
    eol?:string;
}

/**@ignore */
function isAstNode(ast:any):ast is FileNode{
    return ast.type == 'file';
}

/**@ignore */
function fillIntWidth(num:number,width:number){
    let str = num.toString();
    while(str.length<width){
        str='0'+str;
    }
    return str;
}

/**@ignore */
function fillMsWidth(num:number,width:number=2){
    num*=Math.pow(10,width);
    return fillIntWidth(Math.round(num),width);
}

/**@ignore */
function formatTime(time:[number,number,number],width:number=2){
    return `[\
${fillIntWidth(time[0],2)}:\
${fillIntWidth(time[1],2)}.\
${fillMsWidth(time[2],width)}\
]`;
}

/**
 * Create lrc file from AST or lyric object.
 * @param ast The AST (or lyric object).
 * @param options The options.
 * @returns The lrc file.
 */
export function createLrc(ast:FileNode|LyricObject,options?:CreateLrcOptions):string{
    let tags:string[] = [];
    let lyrics:string[] = [];
    if(isAstNode(ast)){
        for(let node of ast.children){
            if(node.type=='tag'){
                tags.push(`[${node.children[0].value}:${node.children[1].value}]`);
            }else if(node.type=='lyric'){
                lyrics.push(
                    formatTime((node.children[0].children.map(tNode=>tNode.value) as TimeLabel),options?.millisecondDigits)+
                    node.children[1].value
                );
            }
        }
    }else{
        for(let key in ast.tags){
            tags.push(`[${key}:${ast.tags[key]}]`);
        }
        for(let lines of ast.lyrics){
            lyrics.push(formatTime(lines.time)+lines.text);
        }
    }
    return [...tags,...lyrics].join(options?.eol?options.eol:'\n');
}