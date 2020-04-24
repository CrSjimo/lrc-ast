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
function nowPos():Position{
    return {row,col,index:i};
}

/**@ignore */
function checkOverFlow(expected?:string){
    if(i>=lrcStr.length){
        throw new UnexpectedTokenError(nowPos(),'unexpected end of file',expected);
    }
}


/**@ignore */
function parseTime(timeNode:TimeNode){
    let buf:string = '';
    let colonRead = false;
    let dotRead = false;
    for(;;){

        if(!colonRead){
            checkOverFlow(`a digit or ':'`);
        }else if(!dotRead){
            checkOverFlow(`a digit or '.'`);
        }else{
            checkOverFlow(`a digit or ']'`);
        }

        if(lrcStr[i]==':'){
            buf=(buf.length==0 ? '0' : buf);
            timeNode.children[0]=createNode('minute',{
                row,col:col-buf.length,index:i-buf.length,
            },parseInt(buf));
            buf='';
            colonRead = true;
        }else if(lrcStr[i]=='.'){
            if(!colonRead){
                throw new UnexpectedTokenError(nowPos(),`'.'`,`':'`);
            }
            buf=(buf.length==0 ? '0' : buf);
            timeNode.children[1]=createNode('second',{
                row,col:col-buf.length,index:i-buf.length,
            },parseInt(buf));
            buf='';
            dotRead = true;
        }else if(lrcStr[i]==']'){
            if(!colonRead){
                throw new UnexpectedTokenError(nowPos(),`']'`,`':'`);
            }
            if(!dotRead){
                throw new UnexpectedTokenError(nowPos(),`']'`,`'.'`);
            }
            buf=(buf.length==0 ? '0' : buf);
            timeNode.children[2]=createNode('millisecond',{
                row,col:col-buf.length,index:i-buf.length,
            },parseFloat('0.'+buf));
            increase();
            return;
        }else if(isDigit(lrcStr[i])){
            buf+=lrcStr[i];
        }else{
            throw new UnexpectedTokenError(nowPos(),`'${escape(lrcStr[i])}'`,`an integer`)
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
    let colonRead = false;
    for(;;){

        if(!colonRead){
            checkOverFlow(`a letter or ':'`);
        }else{
            checkOverFlow(`tag value or ']'`);
        }

        if(lrcStr[i]==':'){
            tagNode.children[0]=createNode('tagKey',{
                row,col:col-buf.length,index:i-buf.length,
            },buf);
            buf='';
            colonRead = true;
        }else if(lrcStr[i]==']'){
            if(!colonRead){
                throw new UnexpectedTokenError(nowPos(),`']'`,`':'`);
            }
            tagNode.children[1]=createNode('tagValue',{
                row,col:col-buf.length,index:i-buf.length,
            },buf);
            increase();
            return;
        }else if(NotNewLineChar(lrcStr[i])){
            if(!colonRead && !isAlphabet(lrcStr[i])){
                throw new UnexpectedTokenError(nowPos(),`'${lrcStr[i]}'`,'a letter');
            }
            buf+=lrcStr[i];
        }else{
            throw new UnexpectedTokenError(nowPos(),`${escape(lrcStr[i])}`,'a non-newline character');
        }
        increase();
    }
}

/**@ignore */
function parseLine(fileNode:FileNode){
    increase();
    checkOverFlow('a digit or a letter');
    if(isDigit(lrcStr[i])){
        let lyricNode = createNode('lyric',{
            row,col,index:i-1,
        });
        let timeNode = createNode('time',nowPos());
        let textNode = createNode('text',nowPos(),'');
        lyricNode.children = [timeNode,textNode];
        fileNode.children.push(lyricNode);
        parseTime(timeNode);
        parseText(textNode);
    }else if(isAlphabet(lrcStr[i])){
        let tagNode = createNode('tag',{
            row,col,index:i-1,
        });
        fileNode.children.push(tagNode);
        parseTag(tagNode);
    }else{

    }
}

/**
 * 
 * @param file lrc file to parse.
 * @returns AST root node.
 * @throws UnexpectedTokenError
 */
export function parser(file:string){
    i = 0;
    row = 1;
    col = 1;
    lrcStr = file;
    let fileNode:FileNode = createNode('file',nowPos(),
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
            throw new UnexpectedTokenError(nowPos(),`'${escape(lrcStr[i])}'`,`'['`);
        }
    }
    return fileNode;
}