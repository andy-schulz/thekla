import * as fs           from "fs";
import {ActivityLogNode} from "./ActivityLogEntry";

const formatToText = (logPrefix: string, repeat: number, logNode: ActivityLogNode) => {
    return `${logPrefix.repeat(repeat)}[${logNode.name}] - ${logNode.description}${(logNode.activityNodes.map((logEntry: ActivityLogNode): string => {

        return `\n` + formatToText(`${logPrefix}`, repeat + 1, logEntry)

    })).join(``)}`
};

/**
 * format the content of the node as html
 * it is the inner content of the ul/li html list
 * @param node - the node which will be converted to the html list
 */
const formatLogContentToHtml = (node: ActivityLogNode): string => {
    return `<span class="logMessage"><span class="activityName">[${node.name}]</span> - <span class="activityDescription">${node.description}</span></span>`
};

/**
 * format the given node to a static html representation
 * if the node contains sub node, they will be formatted recursively
 * @param logNode
 */
export const formatNodeToHtml = (logNode: ActivityLogNode): string => {
    if(logNode.logType === `Task`) {
        return `<li><span class="task ${logNode.status}">${formatLogContentToHtml(logNode)}</span><ul class="nested">${(logNode.activityNodes.map((logEntry: ActivityLogNode) => {
            return formatNodeToHtml(logEntry)
        })).join(``)}</ul></li>`
    } else if (logNode.logType === `Interaction`) {
        return `<li class="interaction ${logNode.status}">${formatLogContentToHtml(logNode)}</li>`
    } else {
        throw new Error(`Unknown Node Type ${logNode.logType}`)
    }
};

/**
 * enclose the given text with an html tag and add an inline style to the element
 * @param text - the text to be enclosed
 * @param tag - the tag enclosing the text
 * @param style - the inline style which will be added to the tag
 */
export const encloseInTag = (text: string, tag: string, style?: string) => {
    return `<${tag}${style ? ` style="${style}"` : ``}>${text}</${tag}>`
};

/**
 * create a static html representation of the Activity node.
 * The node will be a foldable list (ul)
 * @param logNode - the log node to create a html list from
 */
export const formatLogWithHtmlTags = (logNode: ActivityLogNode) => {
    return`<ul id="ActivityLog">${formatNodeToHtml(logNode)}</ul>`
};

/**
 * format the node to an html tree and add the style and JS function to the html representation
 * @param logNode - the log node to create a html list from
 */
export const formatLogAsHtmlTree = (logNode: ActivityLogNode) => {

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return `${htmlStyle} ${formatLogWithHtmlTags(logNode)} ${functionScript} `
};

export const formatLogWithPrefix = (logPrefix = ``): (repeat: number) => (logNode: ActivityLogNode) => string => {

    return (repeat: number): (logNode: ActivityLogNode) => string => {
        return (logNode: ActivityLogNode): string => {
            return formatToText(logPrefix, repeat, logNode)
        }
    }
};

export const encodeLog = (encoding = ``): (source: string) => string => {
    return (source: string): string => {
        if(!encoding)
            return source;

        return Buffer.from(source).toString(encoding)
    }
};

/**
 * the css which is read from a file and added to the HTML tree
 */
console.log(__dirname)
const activityLogStyle = fs.readFileSync(`${__dirname}/../../res/styles/ActivityLog.css`);

/**
 * The style which is added to the HTML tree
 * a css file is read from the file system
 */
const htmlStyle = `
<style>
${activityLogStyle.toString()}
</style>
`;

/**
 * the function script which is added to the HTML tree
 */
const functionScript = `
<script>
var toggler = document.getElementsByClassName("task");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("task-open");
  });
}
</script>

`;