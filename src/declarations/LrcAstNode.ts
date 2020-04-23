/**
 * Represents a position in lrc file. 
 */
export interface Position{
    row: number;
    col: number;
    index: number;
}

/**
 * Super-interface of AST nodes.
 */
export interface AbstractNode{
    type: string;
    position: Position;
}

/**
 * Node of the key in tag label.
 * 
 * For example, `ar` in `[ar:crindzebra]` is the tag key.
 */
export interface TagKeyNode extends AbstractNode{
    type: 'tagKey';
    value: string;
}

/**
 * Node of the value in tag label.
 * 
 * For example, `crindzebra` in `[ar:crindzebra]` is the tag value.
 */
export interface TagValueNode extends AbstractNode{
    type: 'tagValue';
    value: string;
}

/**
 * Node of tag label.
 * 
 * For example, `[ar:crindzebra]` is a tag.
 */
export interface TagNode extends AbstractNode{
    type: 'tag';
    children: [TagKeyNode,TagValueNode];

}

/**
 * Node of the minute in time label.
 * 
 * For example, in time label `[01:25.50]`, the minute is `1`.
 */
export interface MinuteNode extends AbstractNode{
    type: 'minute';
    value: number;
}

/**
 * Node of the second in time label.
 * 
 * For example, in time label `[01:25.50]`, the second is `25`.
 */
export interface SecondNode extends AbstractNode{
    type: 'second';
    value: number;
}

/**
 * Node of the millisecond in time label.
 * 
 * For example, in time label `[01:25.50]`, the millisecond is `0.5`.
 */
export interface MillisecondNode extends AbstractNode{
    type: 'millisecond';
    value: number;
}

/**
 * Node of a time label.
 * 
 * For example, `[01:25.50]` is a time label.
 */
export interface TimeNode extends AbstractNode{
    type: 'time';
    children: [MinuteNode,SecondNode,MillisecondNode];
}

/**
 * Node of text.
 * 
 * For example, in lyric line `[01:25.50]This is a test`, `This is a test` is the text.
 */
export interface TextNode extends AbstractNode{
    type: 'text';
    value: string;
}

/**
 * Node of lyric line.
 * 
 * For example, `[01:25.50]This is a test` is a lyric line.
 */
export interface LyricNode extends AbstractNode{
    type: 'lyric';
    children: [TimeNode, TextNode];
}

/**
 * The root node of AST.
 */
export interface FileNode extends AbstractNode{
    type: 'file';
    children: (TagNode|LyricNode)[];
    filePath?: string;
}

/**
 * Mapping the `type` string to corresponding interface.
 */
export interface NodeMap{
    file: FileNode;
    lyric: LyricNode;
    text: TextNode;
    time: TimeNode;
    millisecond: MillisecondNode;
    second: SecondNode;
    minute: MinuteNode;
    tag: TagNode;
    tagKey: TagKeyNode;
    tagValue: TagValueNode;
}