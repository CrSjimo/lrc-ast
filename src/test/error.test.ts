import { parser } from "../parser"

let lrc=[
    '[ar',
    '[ar:b',
    '[ar:crs]\n[12.30:5]',
    '[12:03.35]aaa\n[.5]',
    '[15a',
]
for(let x of lrc){
    try{
        parser(x)
    }catch(e){
        console.log(e);
    }
}