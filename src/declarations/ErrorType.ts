import { Position } from "./LrcAstNode";

/**
 * Error thrown when parsing unexpected token.
 */
export class UnexpectedTokenError extends Error{

    /**
     * 
     * @param position position of unexpected token.
     * @param read token read.
     * @param expected token expected.
     */
    constructor(
        position:Position,
        read:string,
        expected?:string
    ){
        let readSentence = `Read ${read}`;
        let expectedSentence = expected?`, expected ${expected}`:'';
        let atSentence = `, at line ${position.row}, column ${position.col}.`;
        super(readSentence + expectedSentence + atSentence);
        this.position = position;
    }

    /**
     * Position of the unexpected token.
     */
    position:Position;
}