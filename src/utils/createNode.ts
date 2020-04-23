import { Position, NodeMap } from "../declarations/LrcAstNode";

export function createNode<T extends keyof NodeMap>(type:T,position:Position,value?:any):NodeMap[T];
export function createNode(type:string,position:Position,value?:any):any{
    return {
        type,
        children: [],
        position,
        value,
    }
}