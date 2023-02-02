export function SaveMarkdown(data) {
    parent.postMessage(
        { pluginMessage: { type: "save-markdown", data: data } },
        "*"
    );
}
export function LoadMarkdown(data) {
    parent.postMessage({
        pluginMessage: { type: "load-markdown", data: data }
    }, "*")
}
export function BuildDefault() {
    parent.postMessage({
        pluginMessage: { type: "build-default" }
    }, "*")
}
export function setMarkdown(id, data) {
    parent.postMessage({
        pluginMessage: { type: "set-markdown", id: id, data: data }
    }, "*")
}
export function InitLoad() {
    parent.postMessage(
        { pluginMessage: { type: "init-load" } },
        "*"
    );
}

export function CreateNewDocument() {
    parent.postMessage({
        pluginMessage: { type: "create-new-document" }
    }, "*")
}
