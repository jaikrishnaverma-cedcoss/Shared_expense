export function toTitleCase(str) {
    return str.replace(/\b\w/g, function (match) {
        return match.toUpperCase();
    });
}
export const noRef=(obj)=>JSON.parse(JSON.stringify(obj))
export const  regex = {
    nonNegativeIntFloat:/^\d+(\.\d*)?$/gm
};