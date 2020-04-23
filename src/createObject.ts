import { FileNode } from "./declarations/LrcAstNode";
import { Tags, LyricLine, TimeLabel, LyricObject } from "./declarations/LyricObject";

/**
 * Create a JS object of lyrics from AST.
 * @param ast The AST
 * @return JS object of lyric.
 */
export function createObject(ast:FileNode):LyricObject{
    let tags:Tags = {};
    let lyrics:LyricLine[] = [];
    for(let node of ast.children){
        if(node.type=='tag'){
            tags[node.children[0].value] = node.children[1].value;
        }else if(node.type=='lyric'){
            lyrics.push({
                time: node.children[0].children.map(tNode=>tNode.value) as TimeLabel,
                text: node.children[1].value,
            });
        }
    }
    return {tags,lyrics};
}