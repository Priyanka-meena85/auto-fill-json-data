// ===============================
// DOUBLE CLICK — SELECT JSON OBJECT
// ===============================
let selectedJsonData = null;

document.addEventListener("dblclick", function (event) {
    const target = event.target;

    let text = "";
    let cursorPos = 0;
    let sourceElement = null;

    // ===============================
    // CASE 1 — TEXTAREA
    // ===============================
    if (target.tagName === "TEXTAREA") {
        text = target.value;
        cursorPos = target.selectionStart;
        sourceElement = target;
    }

    // ===============================
    // CASE 2 — CHATGPT / CODE BLOCK
    // ===============================
    else {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const node = range.startContainer;
        if (!node) return;

        let container = node.parentElement;
        while (container && container.tagName !== "CODE" && container.tagName !== "PRE") {
            container = container.parentElement;
        }

        if (!container) return;

        text = container.textContent;
        text = text.replace(/\r\n/g, "\n");

        sourceElement = container;
        cursorPos = getCursorOffset(container, range);
    }

    if (!text) return;

    // ===============================
    // FIND JSON OBJECT
    // ===============================
    const start = findNearestOpeningBrace(text, cursorPos);
    if (start === -1) return;

    const end = findMatchingClosingBrace(text, start);
    if (end === -1) return;

    const jsonString = text.substring(start, end + 1);

    try {
        selectedJsonData = JSON.parse(jsonString);

        chrome.storage.local.set({
            jsonData: selectedJsonData
        });

        navigator.clipboard.writeText(jsonString);

        highlightSelection(sourceElement, start, end);

        showToast("✅ JSON object selected & copied");
    } catch (err) {
        console.log("❌ Invalid JSON");
    }
});


// ===============================
// GET CURSOR OFFSET
// ===============================
function getCursorOffset(container, range) {
    let preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(container);
    preCaretRange.setEnd(range.startContainer, range.startOffset);

    return preCaretRange.cloneContents().textContent.length;
}


// ===============================
// HIGHLIGHT SELECTION (FINAL FIX)
// ===============================
function highlightSelection(container, start, end) {

    // TEXTAREA
    if (container.tagName === "TEXTAREA") {
        container.focus();
        container.setSelectionRange(start, end + 1);
        return;
    }

    const selection = window.getSelection();
    const range = document.createRange();

    let charIndex = 0;
    let startNode = null, startOffset = 0;
    let endNode = null, endOffset = 0;

    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let textLen = node.textContent.length;
            let nextIndex = charIndex + textLen;

            // START
            if (!startNode && start >= charIndex && start < nextIndex) {
                startNode = node;
                startOffset = start - charIndex;
            }

            // END (safe, no overshoot)
            if (!endNode && end >= charIndex && end < nextIndex) {
                endNode = node;
                endOffset = end - charIndex;

                // include only if it's actually }
                if (node.textContent[endOffset] === "}") {
                    endOffset += 1;
                }
            }

            charIndex = nextIndex;
        } else {
            for (let child of node.childNodes) {
                walk(child);
                if (startNode && endNode) return;
            }
        }
    }

    walk(container);

    // ===============================
    // HARD STOP at closing brace
    // ===============================
    if (endNode) {
        const txt = endNode.textContent;
        let safeEnd = endOffset;

        while (safeEnd > 0 && txt[safeEnd - 1] !== "}") {
            safeEnd--;
        }

        endOffset = safeEnd;
    }

    if (startNode && endNode && endOffset > startOffset) {
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);

        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.log("⚠️ Selection mapping failed");
    }
}


// ===============================
// FIND NEAREST OPENING BRACE
// ===============================
function findNearestOpeningBrace(text, pos) {
    let depth = 0;

    for (let i = pos; i >= 0; i--) {
        if (text[i] === "}") depth++;

        if (text[i] === "{") {
            if (depth === 0) return i;
            depth--;
        }
    }
    return -1;
}


// ===============================
// FIND MATCHING CLOSING BRACE
// ===============================
function findMatchingClosingBrace(text, startPos) {
    let depth = 0;

    for (let i = startPos; i < text.length; i++) {
        if (text[i] === "{") depth++;

        if (text[i] === "}") {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}


// ===============================
// TOAST MESSAGE
// ===============================
function showToast(message) {
    const toast = document.createElement("div");

    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.background = "#28a745";
    toast.style.color = "#fff";
    toast.style.padding = "10px 14px";
    toast.style.borderRadius = "6px";
    toast.style.zIndex = "9999";
    toast.style.fontSize = "14px";
    toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}