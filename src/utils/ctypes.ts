export function isDigit(char:string){
    let charCode = char.charCodeAt(0);
    return charCode>=0x30 && charCode <=0x39;
}

export function isAlphabet(char: string){
    let charCode = char.charCodeAt(0);
    return (charCode>=0x41&&charCode<=0x5a)||(charCode>=0x61&&charCode<=0x7a);
}

export function NotNewLineChar(char: string){
    return char[0]!='\n'&&char[0]!='\r';
}

export function isSpace(char: string){
    return char[0]==' '||char[0]=='\t'||char[0]=='\r';
}

export function escape(char: string){
    let mapping = {
        '\u0000': '\\0',
        '\u0008': '\\b',
        '\u0009': '\\t',
        '\u000A': '\\n',
        '\u000C': '\\f',
        '\u000D': '\\r',
        '\u2028': '\\u2028',
        '\u2029': '\\u2029',
    };
    if(char[0] in mapping){
        return mapping[char[0] as keyof typeof mapping];
    }else{
        return char[0];
    }
}