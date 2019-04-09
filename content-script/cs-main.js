let runCsBtn = document.createElement('button'); //create the button on current page for run script content by push
let headParent = document.head.parentNode;

runCsBtn.innerText = 'Start search';
runCsBtn.id = 'runCsBtn';
headParent.insertBefore(runCsBtn, document.head);

runCsBtn.addEventListener('click', runScript);

chrome.runtime.onMessage.addListener( function(message) { //run after press button 'Save&run' on popup.html
        if (message.greeting === 'hello'){
            runScript();
        }
    }
);

function runScript(){  //remove style in old words
    let oldWords = document.querySelectorAll('.class-replaced--search-words');
    let n = 0;
    for (let word of oldWords) {
        word.removeAttribute('class');
    }
    return runReplace();
}

function runReplace(){
    chrome.storage.local.get (['searchText'], function (res) {
        if (typeof res.searchText[0] === 'string') {
            let node = document.body;
            let textArray = res.searchText;
            walkDom (node, textArray);
            highlight(textArray);
        } else document.location.reload();
    });
}

// Change unique code for HTML code in all of founded texts
function highlight(textArray){
    let node = document.body.innerHTML;

    // Loops for search and replace text
    for (let text of textArray) {
        text.toLowerCase();
        let removeSpanExp = '\<span\>' + text + '\</span\>';

        let searchTextExp = '145734314' + text;

        //let replaceResult = [];

        if (node.indexOf(removeSpanExp) !== -1){
            node = changeNode(node, removeSpanExp, 6, text.length);
        }
        node = changeNode(node, searchTextExp, 9, text.length);
        /*for (let i in resultSearch){
            let backStr = resultSearch[i].substr(9);
            let replaceResult = `\<span class=\'class-replaced--search-words\'\>${backStr}\</span\>`;
            node = node.replace(resultSearch[i], replaceResult);
        }*/
    }
    document.body.innerHTML = node;
}

function changeNode(node, searchText, index, length) {
    let regex = new RegExp(searchText, 'gi');
    let resultSearch = node.match(regex);
    for (let i in resultSearch){
        let backStr = resultSearch[i].substr(index, length);
        let replaceResult = `\<span class=\'class-replaced--search-words\'\>${backStr}\</span\>`;
        node = node.replace(resultSearch[i], replaceResult);
    }
    return node;
}

//Walk on each element into DOM
function walkDom(elem, textArray) {
    for (let n = 0; n < elem.childNodes.length; n++) {
        let node = elem.childNodes[n];
        if (node.nodeType === 3) {
            replaceText(node, textArray);
        } else if (node.nodeType === 1 && node.nodeName !== "SCRIPT" && node.tagName !== "STYLE") {
            walkDom(node, textArray);
        }
    }
}

// Add unique code for all of founded text in this text node
function replaceText(node, textArray) {
    // Loops for replace text
    for (let text of textArray) {
        let nodeElem = node.data;
        text.toLowerCase();

        if (nodeElem.toLowerCase().search(text)!== -1) {
            let nodeElemLow = nodeElem.toLowerCase();
            let replaceStr = ' 145734314' + nodeElem.substr(nodeElemLow.indexOf(text), text.length);
            node.data = nodeElem.replace(new RegExp(`(^|\\s)${text}(?=\\s|$[.,\/#!%\^&\*;:{}=\-_\`~()])`, 'ig'), replaceStr);
        }

    }
}