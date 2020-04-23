import { FileNode, LyricNode, TimeNode, Position, TextNode, TagNode } from "./declarations/LrcAstNode";
import { createNode } from "./utils/createNode";
import { UnexpectedTokenError } from "./declarations/ErrorType";
import { isDigit, isAlphabet, NotNewLineChar, escape, isSpace } from "./utils/ctypes";

/**@ignore */let i = 0;
/**@ignore */let row = 1;
/**@ignore */let col = 1;
/**@ignore */let lrcStr:string;

/**@ignore */
function increase(){
    i++;
    col++;
}


/**@ignore */
function parseTime(timeNode:TimeNode){
    let buf:string = '';
    for(;;){
        if(lrcStr[i]==':'){
            timeNode.children[0]=createNode('minute',{
                row,col:col-buf.length,index:i-buf.length,
            },parseInt(buf));
            buf='';
        }else if(lrcStr[i]=='.'){
            timeNode.children[1]=createNode('second',{
                row,col:col-buf.length,index:i-buf.length,
            },parseInt(buf));
            buf='';
        }else if(lrcStr[i]==']'){
            timeNode.children[2]=createNode('millisecond',{
                row,col:col-buf.length,index:i-buf.length,
            },parseFloat('0.'+buf));
            increase();
            return;
        }else if(isDigit(lrcStr[i])){
            buf+=lrcStr[i];
        }else{
            throw new UnexpectedTokenError({
                row,col,index: i,
            },`'${escape(lrcStr[i])}'`,`an integer`)
        }
        increase();
    }
}

/**@ignore */
function parseText(textNode:TextNode){
    textNode.position = {row,col,index:i};
    while(lrcStr[i]!='\n'&&lrcStr[i]!='\r'&&i<lrcStr.length){
        textNode.value+=lrcStr[i];
        increase();
    }
}

/**@ignore */
function parseTag(tagNode:TagNode){
    let buf = '';
    for(;;){
        if(lrcStr[i]==':'){
            tagNode.children[0]=createNode('tagKey',{
                row,col:col-buf.length,index:i-buf.length,
            },buf);
            buf='';
        }else if(lrcStr[i]==']'){
            tagNode.children[1]=createNode('tagValue',{
                row,col:col-buf.length,index:i-buf.length,
            },buf);
            increase();
            return;
        }else if(NotNewLineChar(lrcStr[i])){
            buf+=lrcStr[i];
        }else{
            throw new UnexpectedTokenError({
                row,col,index:i,
            },`${escape(lrcStr[i])}`,'a non-newline character');
        }
        increase();
    }
}

/**@ignore */
function parseLine(fileNode:FileNode){
    increase();
    if(isDigit(lrcStr[i])){
        let lyricNode = createNode('lyric',{
            row,col,index:i,
        });
        let timeNode = createNode('time',{
            row,col,index: i,
        });
        let textNode = createNode('text',{
            row,col,index:i,
        },'');
        lyricNode.children = [timeNode,textNode];
        fileNode.children.push(lyricNode);
        parseTime(timeNode);
        parseText(textNode);
    }else if(isAlphabet(lrcStr[i])){
        let tagNode = createNode('tag',{
            row,col,index:i,
        });
        fileNode.children.push(tagNode);
        parseTag(tagNode);
    }
}

/**
 * 
 * @param file lrc file to parse.
 * @returns AST root node.
 * @throws UnexpectedTokenError
 */
export function parser(file:string){
    lrcStr = file;
    let fileNode:FileNode = createNode('file',{
            row,col,index: i,
        },
    );
    while(i<lrcStr.length){
        if(lrcStr[i]=='\n'){
            row++;
            col=1;
            i++;
        }else if(lrcStr[i]=='['){
            parseLine(fileNode);
        }else if(isSpace(lrcStr[i])){
            increase();
        }else{
            throw new UnexpectedTokenError({
                row,col,index: i,
            },`'${escape(lrcStr[i])}'`,`'['`);
        }
    }
    return fileNode;
}